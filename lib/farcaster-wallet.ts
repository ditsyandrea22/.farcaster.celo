// Farcaster Miniapp Wallet Integration
// Based on: https://miniapps.farcaster.xyz/docs/guides/wallets
// See: https://miniapps.farcaster.xyz/docs/sdk/detecting-capabilities

import { isInMiniApp } from './farcaster-sdk'

interface FarcasterWalletProvider {
  request?: (args: any) => Promise<any>
  on?: (event: string, callback: (...args: any[]) => void) => void
  off?: (event: string, callback: (...args: any[]) => void) => void
  disconnect?: () => Promise<void>
}

// Extend window type for ethereum provider
declare global {
  interface Window {
    ethereum?: FarcasterWalletProvider
  }
}

export interface WalletAccount {
  address: string
  chainId: number
  isConnected: boolean
}

/**
 * Wait for wallet provider to be available
 */
function waitForProvider(): Promise<any> {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds with 100ms intervals

    const checkProvider = () => {
      const provider = (window as any).ethereum;
      
      if (provider || attempts >= maxAttempts) {
        resolve(provider);
      } else {
        attempts++;
        setTimeout(checkProvider, 100);
      }
    };

    checkProvider();
  });
}

/**
 * Check if wallet is available in mini app context
 */
export function isWalletAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  // Check for Farcaster SDK wallet provider
  if ((window as any).farcaster?.wallet?.provider) {
    console.log('[Wallet] Found farcaster.wallet.provider')
    return true
  }

  // Check for standard window.ethereum (EIP-1193)
  if ((window as any).ethereum) {
    console.log('[Wallet] Found window.ethereum')
    return true
  }

  console.log('[Wallet] No wallet provider detected')
  return false
}

export async function getFarcasterWalletProvider() {
  if (typeof window === 'undefined') {
    throw new Error('Farcaster wallet is only available in browser')
  }

  // Check for Farcaster SDK wallet provider first (recommended)
  if ((window as any).farcaster?.wallet?.provider) {
    console.log('[Wallet] Using farcaster.wallet.provider')
    return (window as any).farcaster.wallet.provider
  }

  // Check if we're in mini app context and have ethereum provider
  if (isInMiniApp()) {
    // Wait for provider to be available
    let provider = (window as any).ethereum;
    
    if (!provider) {
      console.log('[Wallet] Waiting for provider to be injected...')
      provider = await waitForProvider();
    }

    if (provider) {
      console.log('[Wallet] Using window.ethereum provider in mini app context')
      return provider
    }
  }

  // Fallback: Use window.ethereum if available
  if ((window as any).ethereum) {
    console.log('[Wallet] Using window.ethereum provider (fallback)')
    return (window as any).ethereum
  }

  throw new Error('Farcaster wallet provider not available')
}

/**
 * Switch wallet to Celo Mainnet
 */
export async function switchToCeloMainnet(): Promise<number> {
  try {
    const provider = await getFarcasterWalletProvider()
    const CELO_MAINNET_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CELO_CHAIN_ID || '42220')
    const CELO_MAINNET_CHAIN_ID_HEX = '0x' + CELO_MAINNET_CHAIN_ID.toString(16)

    console.log('[Wallet] Attempting to switch to Celo Mainnet (chainId: ' + CELO_MAINNET_CHAIN_ID + ')...')

    try {
      // Try to switch chain (most wallets support this)
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CELO_MAINNET_CHAIN_ID_HEX }],
      })
      console.log('[Wallet] Successfully switched to Celo Mainnet')
      return CELO_MAINNET_CHAIN_ID
    } catch (switchError: any) {
      // If chain doesn't exist, try to add it
      if (switchError.code === 4902 || switchError.message?.includes('Unrecognized chain ID')) {
        console.log('[Wallet] Chain not recognized, attempting to add it...')
        
        const CELO_RPC_URL = process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo.org'
        
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: CELO_MAINNET_CHAIN_ID_HEX,
                chainName: 'Celo Mainnet',
                rpcUrls: [CELO_RPC_URL],
                nativeCurrency: {
                  name: 'Celo',
                  symbol: 'CELO',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://explorer.celo.org'],
              },
            ],
          })
          console.log('[Wallet] Successfully added and switched to Celo Mainnet')
          return CELO_MAINNET_CHAIN_ID
        } catch (addError) {
          console.error('[Wallet] Error adding Celo Mainnet:', addError)
          throw addError
        }
      } else {
        console.error('[Wallet] Error switching chain:', switchError)
        throw switchError
      }
    }
  } catch (error) {
    console.error('[Wallet] Error switching to Celo Mainnet:', error)
    throw error
  }
}

export async function connectFarcasterWallet(): Promise<WalletAccount> {
  try {
    if (!isWalletAvailable()) {
      throw new Error('Wallet not available - app may not be in Farcaster Mini App context')
    }

    const provider = await getFarcasterWalletProvider()
    console.log('[Wallet] Attempting to connect wallet...')

    // Request accounts from the wallet
    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    })

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found')
    }

    console.log('[Wallet] Connected account:', accounts[0])

    // Get chain ID
    const chainIdHex = await provider.request({
      method: 'eth_chainId',
    })

    const chainId = parseInt(chainIdHex, 16)
    console.log('[Wallet] Chain ID:', chainId)

    // Auto-switch to Celo Mainnet if not already on it
    const CELO_MAINNET_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CELO_CHAIN_ID || '42220')
    if (chainId !== CELO_MAINNET_CHAIN_ID) {
      console.log('[Wallet] Current chain is not Celo Mainnet, switching...')
      try {
        await switchToCeloMainnet()
      } catch (switchError) {
        console.warn('[Wallet] Failed to auto-switch to Celo Mainnet:', switchError)
        // Continue anyway, the user may need to switch manually
      }
    } else {
      console.log('[Wallet] Already on Celo Mainnet')
    }

    return {
      address: accounts[0],
      chainId: CELO_MAINNET_CHAIN_ID,
      isConnected: true,
    }
  } catch (error) {
    console.error('[Wallet] Error connecting Farcaster wallet:', error)
    throw error
  }
}

export async function disconnectFarcasterWallet() {
  try {
    const provider = await getFarcasterWalletProvider()

    // Some wallets support disconnect
    if (provider.disconnect) {
      await provider.disconnect()
    }

    return true
  } catch (error) {
    console.warn('Error disconnecting wallet:', error)
    return false
  }
}

export async function getFarcasterWalletBalance(address: string): Promise<string> {
  try {
    const provider = await getFarcasterWalletProvider()

    const balance = await provider.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    })

    return balance
  } catch (error) {
    console.error('Error getting balance:', error)
    throw error
  }
}

export async function sendTransaction(tx: {
  to: string
  value?: string
  data?: string
  from?: string
}): Promise<string> {
  try {
    const provider = await getFarcasterWalletProvider()

    const txHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [tx],
    })

    return txHash
  } catch (error) {
    console.error('Error sending transaction:', error)
    throw error
  }
}

// Watch for account changes
export function onAccountChange(callback: (account: WalletAccount | null) => void) {
  if (typeof window === 'undefined') return

  try {
    const provider = (window as any).farcaster?.wallet?.provider || (window as any).ethereum
    if (!provider) return

    const handleAccountChange = async () => {
      try {
        const accounts = await provider.request({
          method: 'eth_accounts',
        })

        if (accounts.length > 0) {
          const chainIdHex = await provider.request({
            method: 'eth_chainId',
          })

          callback({
            address: accounts[0],
            chainId: parseInt(chainIdHex, 16),
            isConnected: true,
          })
        } else {
          callback(null)
        }
      } catch (error) {
        console.error('Error handling account change:', error)
      }
    }

    // Listen for account changes
    if (provider.on) {
      provider.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          handleAccountChange()
        } else {
          callback(null)
        }
      })
    }

    // Listen for chain changes
    if (provider.on) {
      provider.on('chainChanged', () => {
        handleAccountChange()
      })
    }

    return () => {
      // Cleanup listeners
      if (provider.off) {
        provider.off('accountsChanged', handleAccountChange)
        provider.off('chainChanged', handleAccountChange)
      }
    }
  } catch (error) {
    console.error('Error setting up account change listener:', error)
  }
}

// Initialize Farcaster wallet in frame context
export async function initFarcasterWallet() {
  if (typeof window === 'undefined') return false

  try {
    // Check if provider is already available
    if (isWalletAvailable()) {
      console.log('[Wallet] Wallet provider is available')
      return true
    }

    // Wait for Farcaster SDK wallet provider to be available
    const maxRetries = 50 // 5 seconds with 100ms intervals
    let retries = 0

    while (retries < maxRetries) {
      if (isWalletAvailable()) {
        console.log('[Wallet] Wallet provider detected')
        return true
      }
      await new Promise(resolve => setTimeout(resolve, 100))
      retries++
    }

    console.warn('[Wallet] Wallet provider not found after retries')
    return false
  } catch (error) {
    console.error('[Wallet] Error initializing Farcaster wallet:', error)
    return false
  }
}
