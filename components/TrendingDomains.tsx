'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface TrendingDomain {
  name: string
  registrations: number
  owner: string
  expiresAt: number
  trendingScore: number
}

const MOCK_TRENDING: TrendingDomain[] = [
  {
    name: 'vitalik',
    registrations: 1200,
    owner: '0x1234567890123456789012345678901234567890',
    expiresAt: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
    trendingScore: 98,
  },
  {
    name: 'ethereum',
    registrations: 950,
    owner: '0x0987654321098765432109876543210987654321',
    expiresAt: Math.floor(Date.now() / 1000) + 180 * 24 * 60 * 60,
    trendingScore: 87,
  },
  {
    name: 'builder',
    registrations: 756,
    owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    expiresAt: Math.floor(Date.now() / 1000) + 250 * 24 * 60 * 60,
    trendingScore: 76,
  },
  {
    name: 'nft-artist',
    registrations: 543,
    owner: '0xfedcbafedcbafedcbafedcbafedcbafedcbafed',
    expiresAt: Math.floor(Date.now() / 1000) + 300 * 24 * 60 * 60,
    trendingScore: 64,
  },
]

export function TrendingDomains() {
  const [trending, setTrending] = useState<TrendingDomain[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTrending(MOCK_TRENDING)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h3 className="font-semibold">Trending This Week</h3>
      </div>

      {trending.map((domain, index) => (
        <Card
          key={domain.name}
          className="p-4 hover:border-primary/50 transition-colors group cursor-pointer animate-scale-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {domain.name}.farcaster.celo
                </p>
                <p className="text-xs text-muted-foreground">
                  {domain.registrations} registrations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Badge
                variant={domain.trendingScore >= 80 ? 'default' : 'secondary'}
                className="text-xs"
              >
                {domain.trendingScore}% hot
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
