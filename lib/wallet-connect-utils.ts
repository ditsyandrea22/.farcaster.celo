/**
 * Utility untuk menangani koneksi wallet di Farcaster Mini App
 * Membantu mendiagnosa dan memperbaiki masalah koneksi WalletConnect
 */

export interface WalletConnectionStatus {
  isConnected: boolean
  connectorName?: string
  address?: string
  chainId?: number
  error?: string
  isMiniApp: boolean
  hasInjectedProvider: boolean
}

/**
 * Deteksi environment dan provider availability
 */
export function diagnoseWalletEnvironment(): WalletConnectionStatus {
  const isMiniApp = (window as any).farcaster?.context !== undefined
  const hasInjectedProvider = !!(window as any).ethereum
  
  const status: WalletConnectionStatus = {
    isConnected: false,
    isMiniApp,
    hasInjectedProvider,
  }
  
  console.log('[WalletUtils] Diagnosis:')
  console.log('  - Mini App:', isMiniApp)
  console.log('  - Injected Provider:', hasInjectedProvider)
  console.log('  - Farcaster Context:', (window as any).farcaster?.context)
  
  return status
}

/**
 * Reset WalletConnect state (untuk debugging)
 */
export function resetWalletConnectState() {
  if (typeof window !== 'undefined') {
    try {
      // Clear localStorage WalletConnect data
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('@wc') || key.includes('walletconnect'))) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
        console.log(`[WalletUtils] Cleared: ${key}`)
      })
      
      // Reload to apply changes
      window.location.reload()
    } catch (err) {
      console.error('[WalletUtils] Error resetting WalletConnect:', err)
    }
  }
}

/**
 * Diagnose WalletConnect relay issues
 */
export function diagnoseRelayConnection() {
  const diagnosis = {
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ? 'SET' : 'MISSING',
    rpcUrl: process.env.NEXT_PUBLIC_CELO_RPC_URL ? 'SET' : 'USING DEFAULT',
    environment: typeof window !== 'undefined' ? 'BROWSER' : 'SERVER',
    localStorage: typeof localStorage !== 'undefined',
  }
  
  console.log('[WalletUtils] Relay Diagnosis:')
  console.log(diagnosis)
  
  if (!process.env.NEXT_PUBLIC_WC_PROJECT_ID) {
    console.warn('[WalletUtils] ⚠️ NEXT_PUBLIC_WC_PROJECT_ID is not set! WalletConnect will not work properly.')
  }
  
  return diagnosis
}

/**
 * Get connector recommendations berdasarkan environment
 */
export function getConnectorRecommendation(isMiniApp: boolean, hasInjected: boolean): string {
  if (isMiniApp) {
    if (hasInjected) {
      return 'Use Injected connector - wallet is available in Farcaster Mini App'
    } else {
      return 'Try refreshing the page or reopening the mini app to detect wallet'
    }
  } else {
    return 'Running outside mini app - use WalletConnect QR code or Injected providers'
  }
}

/**
 * Monitor connection stability
 */
export class ConnectionMonitor {
  private failureCount = 0
  private maxFailures = 3
  private lastFailureTime = 0
  
  recordFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()
    console.log(`[ConnectionMonitor] Failure #${this.failureCount}/${this.maxFailures}`)
  }
  
  recordSuccess() {
    this.failureCount = 0
    this.lastFailureTime = 0
    console.log('[ConnectionMonitor] Connection successful - resetting failure count')
  }
  
  isExhausted(): boolean {
    return this.failureCount > this.maxFailures
  }
  
  shouldRetry(): boolean {
    if (this.isExhausted()) {
      console.log('[ConnectionMonitor] Max retries exceeded - no more attempts')
      return false
    }
    const timeSinceLastFailure = Date.now() - this.lastFailureTime
    return timeSinceLastFailure >= 2000 // Enforce 2s min between retries
  }
  
  getFailureCount(): number {
    return this.failureCount
  }
  
  reset() {
    this.failureCount = 0
    this.lastFailureTime = 0
  }
}

/**
 * Format error message untuk user-friendly display
 */
export function formatWalletError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    
    if (msg.includes('relay') || msg.includes('socket')) {
      return 'Connection relay issue - trying fallback connector'
    }
    if (msg.includes('timeout')) {
      return 'Connection timeout - please check your internet connection'
    }
    if (msg.includes('closed')) {
      return 'Connection was closed unexpectedly'
    }
    if (msg.includes('user rejected')) {
      return 'You rejected the connection request'
    }
    
    return error.message
  }
  
  return 'Unknown connection error'
}
