// Farcaster Miniapp Wallet Integration
// Based on: https://miniapps.farcaster.xyz/docs/guides/wallets

interface FarcasterWindow extends Window {
  farcasterConnect?: {
    provider?: any
    ready?: boolean
    connect?: () => Promise<any>
  }
}

declare let window: FarcasterWindow

export interface WalletAccount {
  address: string
  chainId: number
  isConnected: boolean
}

export async function getFarcasterWalletProvider() {
  if (typeof window === 'undefined') {
    throw new Error('Farcaster wallet is only available in browser')
  }

  // Check if Farcaster wallet provider is available
  if (window.farcasterConnect?.provider) {
    return window.farcasterConnect.provider
  }

  throw new Error('Farcaster wallet provider not available')
}

export async function connectFarcasterWallet(): Promise<WalletAccount> {
  try {
    const provider = await getFarcasterWalletProvider()

    // Request accounts from the wallet
    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    })

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found')
    }

    // Get chain ID
    const chainIdHex = await provider.request({
      method: 'eth_chainId',
    })

    const chainId = parseInt(chainIdHex, 16)

    return {
      address: accounts[0],
      chainId,
      isConnected: true,
    }
  } catch (error) {
    console.error('Error connecting Farcaster wallet:', error)
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
    const provider = window.farcasterConnect?.provider
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
    // Wait for Farcaster SDK to be available
    const maxRetries = 10
    let retries = 0

    while (retries < maxRetries && !window.farcasterConnect?.provider) {
      await new Promise(resolve => setTimeout(resolve, 100))
      retries++
    }

    if (window.farcasterConnect?.provider) {
      console.log('Farcaster wallet provider initialized')
      return true
    }

    console.warn('Farcaster wallet provider not found after retries')
    return false
  } catch (error) {
    console.error('Error initializing Farcaster wallet:', error)
    return false
  }
}
