'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DomainSearch } from '@/components/DomainSearch'
import { NFTGallery } from '@/components/NFTGallery'
import { WalletStatus } from '@/components/WalletStatus'
import { ArrowLeft, Network, Zap, Sparkles } from 'lucide-react'
import type { GasEstimate } from '@/lib/types'

interface MintPageProps {
  onBack?: () => void
}

export function MintPage({ onBack }: MintPageProps) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [farcasterData, setFarcasterData] = useState<any>(null)
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null)
  const [activeTab, setActiveTab] = useState('search')

  useEffect(() => {
    const fetchGasEstimate = async () => {
      try {
        const response = await fetch('/api/gas-estimate')
        if (response.ok) {
          const data = await response.json()
          setGasEstimate(data)
        }
      } catch (error) {
        console.error('Error fetching gas estimate:', error)
      }
    }

    fetchGasEstimate()
    const interval = setInterval(fetchGasEstimate, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleAccountChange = (account: any) => {
    if (account?.isConnected) {
      setWalletConnected(true)
      setWalletAddress(account.address)
      if (account.farcasterData) {
        setFarcasterData(account.farcasterData)
      }
    } else {
      setWalletConnected(false)
      setWalletAddress(null)
      setFarcasterData(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Farcaster Names</h1>
                <p className="text-xs text-gray-400">Mint your .farcaster.celo domain</p>
              </div>
            </div>
          </div>
          <WalletStatus
            onAccountChange={handleAccountChange}
            autoFetchFarcasterData={true}
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Network className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400">Network</span>
                </div>
                <p className="text-sm font-semibold text-white">Celo Mainnet</p>
              </Card>
              {gasEstimate && (
                <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-400">Gas Fee</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {gasEstimate.totalCostCELO || '~5'} CELO
                  </p>
                </Card>
              )}
            </div>

            {/* Tabs Section */}
            <Card className="p-6 border-white/10 bg-background/50 backdrop-blur-sm">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-lg">
                  <TabsTrigger

                    value="search"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                  >
                    Search
                  </TabsTrigger>
                  <TabsTrigger
                    value="gallery"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                  >
                    Gallery
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="search" className="space-y-4">
                    <DomainSearch
                      onDomainSelect={setSelectedDomain}
                    />
                  </TabsContent>

                  <TabsContent value="gallery" className="space-y-4">
                    <NFTGallery />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar - Info Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Info Card */}
            <Card className="p-6 border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
              <h3 className="text-lg font-bold text-white mb-4">How it works</h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold flex-shrink-0">
                    1
                  </span>
                  <span className="text-sm text-gray-300">Connect your Farcaster wallet</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold flex-shrink-0">
                    2
                  </span>
                  <span className="text-sm text-gray-300">Choose your domain name</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold flex-shrink-0">
                    3
                  </span>
                  <span className="text-sm text-gray-300">Claim your domain and mint as NFT</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold flex-shrink-0">
                    4
                  </span>
                  <span className="text-sm text-gray-300">Start using your identity</span>
                </li>
              </ol>
            </Card>

            {/* Requirements Card */}
            <Card className="p-6 border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <h3 className="text-lg font-bold text-white mb-4">Requirements</h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  Farcaster account
                </li>
                <li className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  Web3 wallet on Celo
                </li>
                <li className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  Enough CELO for gas fees
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
