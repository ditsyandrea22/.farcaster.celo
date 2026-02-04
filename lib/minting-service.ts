/**
 * Domain Minting Service untuk Celo
 * Handle ERC20 approval + mint transaction flow
 * Production-ready dengan proper validation dan error handling
 */

import { ethers } from 'ethers'
import type { TransactionResult, RegistrationRequest } from '@/lib/types'

// Chain & Contract Configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CELO_CONTRACT_ADDRESS || ''
const FEE_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_FEE_TOKEN_ADDRESS || ''
const CELO_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CELO_CHAIN_ID || '42220')
const CELO_RPC_URL = process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo.org'

// Domain Configuration
const DOMAIN_TLD = 'farcaster.celo'
// Default: 0.01 CELO (10000000000000000 wei) - leaves plenty for gas
// Override via NEXT_PUBLIC_MINT_PRICE_WEI env var
const MINT_PRICE_WEI = process.env.NEXT_PUBLIC_MINT_PRICE_WEI || '10000000000000000'

export interface MintingParams {
  label: string // username (e.g., "vina")
  owner: string // wallet address
  bio?: string
  socialLinks?: string
}

export interface ApprovalParams {
  tokenAddress: string
  spender: string // domain contract address
  amount: string // amount in wei
}

/**
 * ERC20 Approval ABI (minimal)
 */
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function balanceOf(address owner) public view returns (uint256)',
]

/**
 * Domain Contract ABI - matches new proxy contract implementation
 */
const DOMAIN_CONTRACT_ABI = [
  'function register(string name) external payable',
  'function renew(string name) external payable',
  'function pricePerYear() external view returns (uint256)',
  'function renewalPricePerYear() external view returns (uint256)',
  'function getReverse(address user) external view returns (string)',
  'function setReverse(string name) external',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function balanceOf(address owner) external view returns (uint256)',
]

/**
 * Step 1: Check user balance untuk memastikan mereka punya token untuk approval
 */
export async function checkUserBalance(
  walletAddress: string,
  tokenAddress: string = FEE_TOKEN_ADDRESS
): Promise<{
  balance: string // in wei
  balanceDecimal: string // readable format
  sufficient: boolean
}> {
  try {
    if (!tokenAddress) {
      // For native CELO payment, check native balance with gas buffer
      console.log('[Minting] Checking native CELO balance...')
      const provider = new ethers.JsonRpcProvider(CELO_RPC_URL, {
        chainId: CELO_CHAIN_ID,
        name: 'celo-mainnet',
      })
      
      const balance = await provider.getBalance(walletAddress)
      const balanceDecimal = ethers.formatEther(balance)
      
      // Need: mint price + gas (estimate ~50k gas * gasPrice)
      // With typical 1 gwei gas price on Celo, that's ~0.05 CELO
      // So we need mint price + 0.1 CELO buffer
      const GAS_BUFFER = ethers.parseEther('0.1')
      const TOTAL_NEEDED = BigInt(MINT_PRICE_WEI) + GAS_BUFFER
      const sufficient = balance >= TOTAL_NEEDED
      
      console.log('[Minting] Native balance:', balanceDecimal, 'CELO')
      console.log('[Minting] Required (price + gas buffer):', ethers.formatEther(TOTAL_NEEDED), 'CELO')
      console.log('[Minting] Sufficient:', sufficient)
      
      return {
        balance: balance.toString(),
        balanceDecimal,
        sufficient,
      }
    }

    const provider = new ethers.JsonRpcProvider(CELO_RPC_URL, {
      chainId: CELO_CHAIN_ID,
      name: 'celo-mainnet',
    })

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
    const balance = await contract.balanceOf(walletAddress)
    const balanceDecimal = ethers.formatEther(balance)

    const sufficient = BigInt(balance) >= BigInt(MINT_PRICE_WEI)

    return {
      balance: balance.toString(),
      balanceDecimal,
      sufficient,
    }
  } catch (error) {
    console.error('[Minting] Error checking balance:', error)
    throw new Error('Failed to check token balance')
  }
}

/**
 * Step 2: Request approval untuk domain contract
 * User harus approve token first sebelum mint
 */
export async function requestERC20Approval(
  signer: ethers.Signer,
  params: ApprovalParams
): Promise<{
  success: boolean
  transactionHash?: string
  error?: string
}> {
  try {
    if (!params.tokenAddress) {
      console.warn('[Minting] Token address not set, skipping ERC20 approval')
      return {
        success: true, // native payment, no approval needed
      }
    }

    console.log('[Minting] Requesting ERC20 approval...')
    console.log('[Minting] Token:', params.tokenAddress)
    console.log('[Minting] Spender:', params.spender)
    console.log('[Minting] Amount:', params.amount)

    const contract = new ethers.Contract(params.tokenAddress, ERC20_ABI, signer)

    // Call approve
    const tx = await contract.approve(params.spender, params.amount)
    console.log('[Minting] Approval tx sent:', tx.hash)

    // Wait for confirmation
    const receipt = await tx.wait()

    if (receipt && receipt.status === 1) {
      console.log('[Minting] Approval successful!')
      return {
        success: true,
        transactionHash: tx.hash,
      }
    } else {
      throw new Error('Approval transaction failed')
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Minting] Approval error:', errorMsg)
    return {
      success: false,
      error: errorMsg,
    }
  }
}

/**
 * Step 3: Mint domain setelah approval
 * Langsung call smart contract mint function
 */
export async function mintDomain(
  signer: ethers.Signer,
  params: MintingParams,
  options?: {
    useNativePayment?: boolean // use CELO instead of ERC20
  }
): Promise<{
  success: boolean
  transactionHash?: string
  domainLabel?: string
  fullDomain?: string
  error?: string
}> {
  try {
    if (!CONTRACT_ADDRESS) {
      throw new Error('Domain contract address not configured')
    }

    console.log('[Minting] Starting domain mint...')
    console.log('[Minting] Label:', params.label)
    console.log('[Minting] Owner:', params.owner)

    // Validate params
    const { isValid, errors } = validateMintParams(params)
    if (!isValid) {
      throw new Error(`Invalid params: ${errors.join(', ')}`)
    }

    // Get contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DOMAIN_CONTRACT_ABI, signer)

    // Prepare transaction
    const txOptions: any = {}

    // If using native CELO payment
    if (options?.useNativePayment) {
      // IMPORTANT: Use MINT_PRICE_WEI directly (already in wei), not parseEther
      txOptions.value = BigInt(MINT_PRICE_WEI)
      console.log('[Minting] Native CELO payment value:', ethers.formatEther(txOptions.value), 'CELO')
    }

    // Call registerDomain function on the deployed registry contract
    const fullDomain = `${params.label}.${DOMAIN_TLD}`
    console.log('[Minting] Full domain to register:', fullDomain)
    console.log('[Minting] Contract address:', CONTRACT_ADDRESS)
    
    try {
      // Make the actual transaction
      console.log('[Minting] Sending actual transaction with value:', txOptions.value ? ethers.formatEther(txOptions.value) : 'none', 'CELO')
      console.log('[Minting] Parameters:', { domain: fullDomain })
      let tx
      try {
        // Call register function with full domain
        tx = await (contract as any).register(fullDomain, txOptions)
      } catch (txErr) {
        const txMsg = txErr instanceof Error ? txErr.message : String(txErr)
        console.error('[Minting] Transaction call failed:', txMsg)
        
        // Provide better error messages
        if (txMsg.includes('revert') || txMsg.includes('CALL_EXCEPTION')) {
          console.error('[Minting] Contract reverted - the domain may already be registered or other validation failed')
        }
        throw new Error(`Failed to send transaction: ${txMsg}`)
      }

      console.log('[Minting] Register tx sent:', tx.hash)

      // Wait untuk confirmation
      let receipt
      try {
        receipt = await tx.wait()
      } catch (waitErr) {
        const waitMsg = waitErr instanceof Error ? waitErr.message : String(waitErr)
        console.error('[Minting] Transaction confirmation failed:', waitMsg)
        throw new Error(`Transaction confirmation failed: ${waitMsg}`)
      }

      if (receipt && receipt.status === 1) {
        console.log('[Minting] Register successful!')
        const fullDomain = `${params.label}.${DOMAIN_TLD}`
        console.log('[Minting] Domain:', fullDomain)
        console.log('[Minting] Block:', receipt.blockNumber)

        return {
          success: true,
          transactionHash: tx.hash,
          domainLabel: params.label,
          fullDomain,
        }
      } else {
        throw new Error('Register transaction failed or was reverted')
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      const fullDomain = `${params.label}.${DOMAIN_TLD}`
      console.error('[Minting] Mint error:', errorMsg)
      
      // Decode custom error signatures (for new contract)
      // The new contract uses ERC721 and standard errors
      const errorSignatures: { [key: string]: string } = {}
      
      // Check if error contains a custom error signature
      let decodedError = ''
      for (const [sig, name] of Object.entries(errorSignatures)) {
        if (errorMsg.includes(sig)) {
          decodedError = name
          break
        }
      }
      
      // Parse and improve error messages
      let userFriendlyError = errorMsg
      
      if (decodedError === 'DomainNotAvailable') {
        userFriendlyError = `The domain "${fullDomain}" is not available. It may already be registered or reserved. Please try a different username.`
      } else if (decodedError === 'InvalidDomainLength') {
        userFriendlyError = 'The domain length is invalid. It must be between 3 and 63 characters.'
      } else if (decodedError === 'InsufficientFunds') {
        userFriendlyError = `Insufficient funds. You need ${ethers.formatEther(BigInt(MINT_PRICE_WEI))} CELO plus gas fees.`
      } else if (errorMsg.includes('insufficient funds')) {
        userFriendlyError = `Insufficient funds. You need ${ethers.formatEther(BigInt(MINT_PRICE_WEI))} CELO plus gas fees. Please check your wallet balance.`
      } else if (errorMsg.includes('insufficient balance')) {
        userFriendlyError = `Insufficient balance for transaction. Need more CELO in your wallet.`
      } else if (errorMsg.includes('already registered')) {
        userFriendlyError = 'This domain is already registered. Please choose a different username.'
      } else if (errorMsg.includes('revert') || errorMsg.includes('CALL_EXCEPTION')) {
        userFriendlyError = 'Transaction reverted. Please check your parameters and try again.'
      } else if (errorMsg.includes('Failed to send transaction')) {
        userFriendlyError = `Could not send transaction: ${errorMsg.split('Failed to send transaction: ')[1] || 'Unknown reason'}`
      }
      
      return {
        success: false,
        error: userFriendlyError,
      }
    }
  } catch (outerError) {
    const errorMsg = outerError instanceof Error ? outerError.message : 'Unknown error'
    console.error('[Minting] Outer mint error:', errorMsg)
    return {
      success: false,
      error: errorMsg,
    }
  }
}

/**
 * Complete flow: Approval + Mint dalam satu transaction sequence
 * PENTING: Pastikan signer sudah on Celo chain sebelum call function ini
 */
export async function completeMinutingFlow(
  signer: ethers.Signer,
  params: MintingParams,
  options?: {
    useNativePayment?: boolean
  }
): Promise<{
  success: boolean
  approvalHash?: string
  mintHash?: string
  fullDomain?: string
  error?: string
  step?: 'approval' | 'mint' | 'chain-check'
}> {
  try {
    // Validate signer is on correct chain
    let signerAddress = 'unknown'
    try {
      if (typeof (signer as any).getAddress === 'function') {
        signerAddress = await (signer as any).getAddress()
      }
      console.log('[Minting] Signer address:', signerAddress)
    } catch (signerError) {
      console.warn('[Minting] Could not get signer address, proceeding anyway:', signerError)
      // Don't fail, proceed with mint anyway
    }

    const useNative = options?.useNativePayment || !FEE_TOKEN_ADDRESS

    // Step 1: Approval (jika menggunakan ERC20)
    if (!useNative) {
      console.log('[Minting] Step 1: Requesting ERC20 approval...')
      const approvalResult = await requestERC20Approval(signer, {
        tokenAddress: FEE_TOKEN_ADDRESS,
        spender: CONTRACT_ADDRESS,
        amount: MINT_PRICE_WEI,
      })

      if (!approvalResult.success) {
        return {
          success: false,
          error: approvalResult.error || 'Approval failed',
          step: 'approval',
        }
      }

      console.log('[Minting] Approval successful, proceeding to mint...')
    } else {
      console.log('[Minting] Using native CELO payment, skipping ERC20 approval')
    }

    // Step 2: Mint
    console.log('[Minting] Step 2: Minting domain...')
    const mintResult = await mintDomain(signer, params, { useNativePayment: useNative })

    if (!mintResult.success) {
      return {
        success: false,
        error: mintResult.error || 'Mint failed',
        step: 'mint',
      }
    }

    return {
      success: true,
      mintHash: mintResult.transactionHash,
      fullDomain: mintResult.fullDomain,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Minting] Complete flow error:', errorMsg)
    
    // Parse viem chain mismatch error
    if (errorMsg.includes('does not match the target chain') || 
        errorMsg.includes('chain') ||
        errorMsg.includes('8453') ||
        errorMsg.includes('42220')) {
      return {
        success: false,
        error: 'Wallet is not on Celo Mainnet. Please switch your wallet to Celo and try again.',
        step: 'chain-check',
      }
    }
    
    return {
      success: false,
      error: errorMsg,
    }
  }
}

/**
 * Estimate gas cost untuk minting
 */
export async function estimateMintingGas(): Promise<{
  estimatedGas: string // in wei
  estimatedCostCELO: string
  estimatedCostUSD: string
}> {
  try {
    const provider = new ethers.JsonRpcProvider(CELO_RPC_URL, {
      chainId: CELO_CHAIN_ID,
      name: 'celo-mainnet',
    })

    // Get current gas price
    const feeData = await provider.getFeeData()
    const gasPrice = feeData.gasPrice || ethers.parseUnits('1', 'gwei')

    // Estimate: ~150,000 gas untuk mint + metadata
    const estimatedGasUnits = BigInt(150000)
    const estimatedGasWei = gasPrice * estimatedGasUnits

    const estimatedCostCELO = ethers.formatEther(estimatedGasWei)
    const estimatedCostUSD = (parseFloat(estimatedCostCELO) * 2.0).toFixed(4) // ~2 USD per CELO

    return {
      estimatedGas: estimatedGasWei.toString(),
      estimatedCostCELO,
      estimatedCostUSD,
    }
  } catch (error) {
    console.error('[Minting] Gas estimation error:', error)
    // Return safe default estimate
    return {
      estimatedGas: '150000000000000000',
      estimatedCostCELO: '0.00015',
      estimatedCostUSD: '0.30',
    }
  }
}

/**
 * Validate minting parameters
 */
export function validateMintParams(params: MintingParams): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Validate label (username)
  if (!params.label || params.label.length === 0) {
    errors.push('Label cannot be empty')
  } else if (!/^[a-z0-9_]+$/.test(params.label)) {
    errors.push('Label must only contain lowercase letters, numbers, and underscores')
  } else if (params.label.length < 1) {
    errors.push('Label must be at least 1 character')
  } else if (params.label.length > 63) {
    errors.push('Label must be max 63 characters')
  }

  // Validate owner address
  if (!params.owner || !ethers.isAddress(params.owner)) {
    errors.push('Valid owner address is required')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Check apakah domain sudah di-mint
 */
export async function isDomainAvailable(label: string): Promise<boolean> {
  try {
    const provider = new ethers.JsonRpcProvider(CELO_RPC_URL, {
      chainId: CELO_CHAIN_ID,
      name: 'celo-mainnet',
    })

    const contract = new ethers.Contract(CONTRACT_ADDRESS, DOMAIN_CONTRACT_ABI, provider)

    // Try to get domain info (use full domain string)
    const fullDomain = `${label}.${DOMAIN_TLD}`
    const info = await contract.getDomainInfo(fullDomain)
    // Jika owner adalah zero address, maka domain available
    return info.owner === ethers.ZeroAddress
  } catch (error) {
    // Jika error (contract tidak punya function), assume available
    console.warn('[Minting] Could not check domain availability:', error)
    return true
  }
}

/**
 * Debug function to check contract state and FID registration
 */
export async function checkContractState(
  fid: number,
  domain: string
): Promise<{
  fidRegistered: boolean
  domainAvailable: boolean
  domainInfo?: any
  error?: string
}> {
  try {
    const provider = new ethers.JsonRpcProvider(CELO_RPC_URL, {
      chainId: CELO_CHAIN_ID,
      name: 'celo-mainnet',
    })

    const contract = new ethers.Contract(CONTRACT_ADDRESS, DOMAIN_CONTRACT_ABI, provider)

    console.log('[Debug] Checking FID', fid, 'on contract', CONTRACT_ADDRESS)

    // Check if FID is registered
    let fidRegistered = false
    try {
      fidRegistered = await (contract as any).isFidRegistered(fid)
      console.log('[Debug] FID registered:', fidRegistered)
    } catch (err) {
      console.error('[Debug] Error checking FID registration:', err)
    }

    // Check if domain is available
    let domainAvailable = true
    let domainInfo = null
    try {
      domainAvailable = await (contract as any).isAvailable(domain)
      console.log('[Debug] Domain available:', domainAvailable)
      
      // Get domain info
      domainInfo = await (contract as any).getDomainInfo(domain)
      console.log('[Debug] Domain info:', domainInfo)
    } catch (err) {
      console.error('[Debug] Error checking domain:', err)
    }

    return {
      fidRegistered,
      domainAvailable,
      domainInfo,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[Debug] Error checking contract state:', errorMsg)
    return {
      fidRegistered: false,
      domainAvailable: false,
      error: errorMsg,
    }
  }
}

