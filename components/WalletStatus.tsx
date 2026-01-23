'use client'

import { useState, useEffect, useRef } from 'react'
import { Wallet, AlertCircle, Zap, Activity, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { formatAddress } from '@/lib/blockchain'
import { isInMiniApp } from '@/lib/farcaster-sdk'
import { getAuthenticatedUserInfo } from '@/lib/neynar-service'
import { ConnectionMonitor, formatWalletError } from '@/lib/wallet-connect-utils'

interface WalletStatusProps {
  address?: string
  onConnect?: () => Promise<void>
  gasPrice?: string
  onAccountChange?: (account: { address: string; chainId: number; isConnected: boolean; farcasterData?: any } | null) => void
  autoFetchFarcasterData?: boolean
}

export function WalletStatus({ 
  address: initialAddress, 
  onConnect, 
  gasPrice, 
  onAccountChange: onAccountChangeProp,
  autoFetchFarcasterData = true
}: WalletStatusProps) {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balanceData } = useBalance({
    address: address as `0x${string}`,
  })

  const [error, setError] = useState<string | null>(null)
  const [inMiniApp, setInMiniApp] = useState(false)
  const [walletAvailable, setWalletAvailable] = useState(false)
  const [farcasterData, setFarcasterData] = useState<any>(null)
  const [fetchingFarcasterData, setFetchingFarcasterData] = useState(false)
  const [lastConnectorAttempt, setLastConnectorAttempt] = useState<string | null>(null)
  const connectionMonitorRef = useRef(new ConnectionMonitor())

  // Initialize mini app status
  useEffect(() => {
    const miniAppStatus = isInMiniApp()
    setInMiniApp(miniAppStatus)
    console.log('[WalletStatus] Mini app status:', miniAppStatus)
    if (miniAppStatus) {
      setWalletAvailable(!!window.ethereum)
    }
  }, [])

  // Retry connection if it fails
  useEffect(() => {
    const maxRetries = 3
    let retryCount = 0
    const retryTimer = setInterval(() => {
      // If we're not connected and no error is preventing connection, try again
      if (!isConnected && error && retryCount < maxRetries) {
        console.log(`[WalletStatus] Retrying connection (attempt ${retryCount + 1}/${maxRetries})`)
        retryCount++
        setError(null)
      } else {
        clearInterval(retryTimer)
      }
    }, 5000) // Retry every 5 seconds
    
    return () => clearInterval(retryTimer)
  }, [isConnected, error])

  // Auto-fetch Farcaster data saat wallet terkoneksi
  useEffect(() => {
    if (isConnected && autoFetchFarcasterData && !farcasterData) {
      const fetchData = async () => {
        try {
          setFetchingFarcasterData(true)
          
          // Try to get FID dari SDK context
          let fid = null
          if ((window as any).farcaster?.context?.user?.fid) {
            fid = (window as any).farcaster.context.user.fid
          }

          if (fid) {
            console.log('[WalletStatus] Fetching Farcaster data for FID:', fid)
            const userData = await getAuthenticatedUserInfo(fid)
            if (userData) {
              setFarcasterData(userData)
              connectionMonitorRef.current.recordSuccess()
              console.log('[WalletStatus] Farcaster data fetched:', userData)
            }
          }
        } catch (err) {
          console.warn('[WalletStatus] Error fetching Farcaster data:', err)
        } finally {
          setFetchingFarcasterData(false)
        }
      }

      fetchData()
    }
  }, [isConnected, autoFetchFarcasterData, farcasterData])

  // Notify parent of account changes
  useEffect(() => {
    if (isConnected && address && chainId) {
      const account = {
        address,
        chainId,
        isConnected: true,
        farcasterData,
      }
      onAccountChangeProp?.(account)
    } else {
      onAccountChangeProp?.(null)
    }
  }, [address, isConnected, chainId, farcasterData, onAccountChangeProp])

  const handleConnect = async () => {
    try {
      setError(null)
      
      // Check if we're in Farcaster Mini App
      const isMiniApp = (window as any).farcaster?.context !== undefined
      
      if (connectors.length > 0) {
        // Prioritize injected connector dalam mini app context
        let selectedConnector = connectors[0]
        
        if (isMiniApp && connectors.length > 1) {
          // Find injected connector first (usually available in mini app)
          const injectedConnector = connectors.find(c => c.name === 'MetaMask' || c.name === 'Injected')
          if (injectedConnector) {
            selectedConnector = injectedConnector
          }
        }
        
        console.log('[WalletStatus] Attempting connection with:', selectedConnector.name)
        console.log('[WalletStatus] Mini App context detected:', isMiniApp)
        console.log('[WalletStatus] Available connectors:', connectors.map(c => c.name).join(', '))
        
        setLastConnectorAttempt(selectedConnector.name)
        connectionMonitorRef.current.recordFailure()
        
        connect({ connector: selectedConnector })
        
        // Give connection time to establish
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        if (onConnect) {
          await onConnect()
        }
      } else {
        setError('No wallet connectors available. Make sure you have a wallet installed.')
      }
    } catch (err) {
      console.error('[WalletStatus] Failed to connect wallet:', err)
      const errorMsg = formatWalletError(err)
      setError(errorMsg)
      connectionMonitorRef.current.recordFailure()
    }
  }

  const handleDisconnect = async () => {
    try {
      disconnect()
      setFarcasterData(null)
    } catch (err) {
      console.error('Failed to disconnect wallet:', err)
      setError('Failed to disconnect wallet')
    }
  }


  if (isConnected && address) {
    const balance = balanceData ? parseFloat((Number(balanceData.value) / Math.pow(10, balanceData.decimals)).toString()).toFixed(4) : '0.00'

    return (
      <Card className="p-5 dashboard-card border-primary/40 animate-fade-in-down space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Wallet Connected</p>
              <p className="text-xs text-muted-foreground truncate font-mono">{formatAddress(address)}</p>
            </div>
            <Badge className="text-xs bg-primary/20 text-primary hover:bg-primary/30">
              Ready
            </Badge>
          </div>

          <div className="text-right space-y-1">
            <p className="text-sm font-semibold">{balance} {balanceData?.symbol || 'ETH'}</p>
            {gasPrice && (
              <div className="flex items-center justify-end gap-1 text-xs text-accent font-medium">
                <Zap className="w-3 h-3" />
                {gasPrice}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            Disconnect
          </Button>
        </div>

        {fetchingFarcasterData && (
          <div className="px-4 py-2 rounded-lg bg-secondary/10 text-center">
            <p className="text-xs text-secondary font-medium">Fetching your Farcaster data...</p>
          </div>
        )}

        {farcasterData && (
          <div className="px-4 py-3 rounded-lg bg-success/10 border border-success/30 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              <p className="text-sm font-semibold text-success">Farcaster Data Loaded</p>
            </div>
            <div className="text-xs space-y-1">
              <p><span className="text-muted-foreground">Username:</span> <span className="font-mono">@{farcasterData.username}</span></p>
              <p><span className="text-muted-foreground">FID:</span> <span className="font-mono">{farcasterData.fid}</span></p>
            </div>
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      {error && (
        <Card className="p-4 border-destructive/50 bg-destructive/10 animate-fade-in-down">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-destructive font-medium">Connection Error</p>
              <p className="text-xs text-destructive/80 mt-1">{error}</p>
              {lastConnectorAttempt && (
                <p className="text-xs text-destructive/60 mt-2">
                  Attempted with: <span className="font-mono">{lastConnectorAttempt}</span>
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {inMiniApp && (
        <Card className="p-4 border-green-500/30 bg-green-500/10">
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">Farcaster Mini App Detected</p>
              <p className="text-xs text-green-800/80 mt-1">
                {walletAvailable
                  ? 'Wallet is available in mini app context'
                  : 'Wallet not yet available - please wait'}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <Card className="p-6 dashboard-card border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-medium">
              {inMiniApp ? 'Connect Your Wallet' : 'Ready to claim your identity?'}
            </p>
            <Button
              onClick={handleConnect}
              disabled={isPending}
              className="w-full h-12 gap-2 font-semibold text-base"
              size="lg"
            >
              {isPending ? 'Connecting...' : 'Connect Wallet'}
            </Button>
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              {inMiniApp
                ? 'Pilih wallet (MetaMask, Coinbase, Trust) untuk melanjutkan. Wallet akan terdeteksi secara otomatis di Farcaster Mini App.'
                : 'Your Farcaster frame wallet gives you direct access to Celo mainnet. Sign in to claim your permanent identity.'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
