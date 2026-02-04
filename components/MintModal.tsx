'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ShareMint } from './ShareMint'

// Minting service
import { 
  completeMinutingFlow,
  estimateMintingGas,
  checkUserBalance,
} from '@/lib/minting-service'

// Wallet utilities
import { switchToCeloMainnet, getFarcasterWalletProvider } from '@/lib/farcaster-wallet'

// Wagmi untuk wallet connection
import { useAccount, useWalletClient } from 'wagmi'
import { ethers } from 'ethers'

interface MintModalProps {
  isOpen: boolean
  onClose: () => void
  domain: string
  onSuccess?: (txHash: string) => void
}

export function MintModal({ isOpen, onClose, domain, onSuccess }: MintModalProps) {
  const { address: walletAddress, isConnected: walletConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  const [fid, setFid] = useState<string>('')
  const [fidInputFocused, setFidInputFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [gasEstimate, setGasEstimate] = useState<any>(null)
  const [balanceCheckLoading, setBalanceCheckLoading] = useState(false)
  const [balanceSufficient, setBalanceSufficient] = useState(false)
  const [currentStep, setCurrentStep] = useState<'prepare' | 'approval' | 'mint' | 'success'>('prepare')

  // Check wallet balance
  useEffect(() => {
    const checkBalance = async () => {
      if (!walletAddress || !walletConnected) return

      try {
        setBalanceCheckLoading(true)
        const result = await checkUserBalance(walletAddress)
        setBalanceSufficient(result.sufficient)
        
        if (!result.sufficient) {
          setError(`Insufficient balance. You need at least ${result.balanceDecimal} tokens`)
        }
      } catch (err) {
        console.warn('Balance check failed:', err)
        setBalanceSufficient(true)
      } finally {
        setBalanceCheckLoading(false)
      }
    }

    checkBalance()
  }, [walletAddress, walletConnected])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!fid.trim()) {
      setError('Farcaster ID is required')
      return
    }

    const fidNumber = parseInt(fid, 10)
    if (isNaN(fidNumber) || fidNumber <= 0) {
      setError('Please enter a valid Farcaster ID (positive number)')
      return
    }

    if (!walletConnected || !walletAddress) {
      setError('Wallet not connected')
      return
    }

    if (!walletClient) {
      setError('Wallet client not available')
      return
    }

    if (!balanceSufficient) {
      setError('Insufficient balance for minting')
      return
    }

    setLoading(true)
    try {
      // Extract just the domain name without .farcaster.celo suffix
      const label = domain.includes('.') ? domain.split('.')[0] : domain

      const mintParams = {
        label,
        fid: fidNumber,
        owner: walletAddress,
        bio: '', // Empty bio - simpler mint process
        socialLinks: '',
      }

      console.log('[MintModal] Starting mint flow...')
      console.log('[MintModal] Domain:', domain)
      console.log('[MintModal] Label:', label)

      // Ensure wallet is on Celo Mainnet
      setCurrentStep('approval')
      try {
        await switchToCeloMainnet()
        console.log('[MintModal] Successfully on Celo Mainnet')
      } catch (chainError) {
        console.error('[MintModal] Failed to switch to Celo Mainnet:', chainError)
        setError('Failed to switch to Celo Mainnet')
        setCurrentStep('prepare')
        return
      }

      await new Promise(resolve => setTimeout(resolve, 500))

      // Get signer
      setCurrentStep('mint')
      const provider = await getFarcasterWalletProvider()
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()

      console.log('[MintModal] Signer obtained, calling mint flow...')

      // Call complete minting flow
      const result = await completeMinutingFlow(signer, mintParams, {
        useNativePayment: true,
      })

      if (!result.success) {
        setError(`Minting failed: ${result.error}`)
        setCurrentStep('prepare')
        return
      }

      // Success
      setTxHash(result.mintHash || '')
      setSuccess(true)
      setCurrentStep('success')

      console.log('[MintModal] Mint successful!')
      console.log('[MintModal] TX:', result.mintHash)

      if (onSuccess) {
        onSuccess(result.mintHash || '')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Mint transaction failed'
      console.error('[MintModal] Error:', errorMsg)
      
      // Provide user-friendly error messages
      let userMessage = errorMsg
      
      if (errorMsg.includes('FidAlreadyRegistered') || errorMsg.includes('already registered')) {
        userMessage = `FID ${fid} is already registered. This FID can only be minted once. Please try a different FID.`
      } else if (errorMsg.includes('DomainNotAvailable') || errorMsg.includes('not available')) {
        userMessage = `The domain "${domain}" is not available. It may already be claimed.`
      } else if (errorMsg.includes('InsufficientFunds') || errorMsg.includes('insufficient')) {
        userMessage = 'Insufficient CELO balance. Please ensure you have enough CELO for the mint price and gas fees.'
      } else if (errorMsg.includes('InvalidFarcasterFid')) {
        userMessage = 'Invalid Farcaster ID. Please check your Farcaster account.'
      } else if (errorMsg.includes('revert') || errorMsg.includes('CALL_EXCEPTION')) {
        userMessage = 'Transaction failed. This could be due to contract issues or invalid parameters. Please try again.'
      }
      
      setError(userMessage)
      setCurrentStep('prepare')
    } finally {
      setLoading(false)
    }
  }

  if (success && domain) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <ShareMint 
            domain={domain} 
            txHash={txHash || undefined}
            openSeaUrl={`https://opensea.io/search?q=farcaster.celo`}
          />
          <Button onClick={onClose} className="w-full mt-4">Close</Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Mint Your Domain</DialogTitle>
          <DialogDescription>
            Claim {domain} and mint it as an NFT
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Loading state */}
          {userLoading && (
            <Card className="p-4 bg-secondary/10 border-secondary/30 space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                <p className="text-sm font-medium text-secondary">Loading your Farcaster identity...</p>
              </div>
            </Card>
          )}

          {/* Error state */}
          {error && (
            <Card className="p-3 border-destructive/50 bg-destructive/10">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </Card>
          )}

          {/* FID Input */}
          <div className="space-y-2">
            <Label htmlFor="fid" className="text-sm font-medium">
              Farcaster ID (FID) *
            </Label>
            <Input
              id="fid"
              type="number"
              placeholder="Enter your Farcaster ID (e.g., 258250)"
              value={fid}
              onChange={(e) => setFid(e.target.value)}
              disabled={loading}
              className="text-base"
              min="1"
            />
            <p className="text-xs text-muted-foreground">
              Enter your unique Farcaster identifier
            </p>
          </div>

          {/* Domain display */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Domain Name</Label>
            <div className="px-4 py-3 rounded-lg bg-muted border border-border">
              <p className="font-semibold text-lg">{domain}</p>
            </div>
          </div>

          {/* Wallet status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Wallet (Celo)</Label>
            <div className="px-4 py-3 rounded-lg bg-muted border border-border">
              {walletConnected && walletAddress ? (
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm truncate">{walletAddress}</p>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Connect wallet to proceed</p>
              )}
            </div>
          </div>

          {/* Current step indicator */}
          {loading && (
            <Card className="p-3 bg-accent/20 border-accent/40">
              <p className="text-sm font-medium">
                {currentStep === 'approval' && 'Waiting for wallet approval...'}
                {currentStep === 'mint' && 'Minting your domain...'}
              </p>
            </Card>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={
              loading || 
              !fid.trim() ||
              !walletConnected || 
              balanceCheckLoading ||
              !balanceSufficient
            }
            className="w-full gap-2"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {currentStep === 'approval' ? 'Approving...' : 'Minting...'}
              </>
            ) : !fid.trim() ? (
              'Enter Farcaster ID'
            ) : !walletConnected ? (
              'Connect Wallet to Mint'
            ) : balanceCheckLoading ? (
              'Checking Balance...'
            ) : !balanceSufficient ? (
              'Insufficient Balance'
            ) : (
              'Claim Now'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
