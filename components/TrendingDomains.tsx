'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, ExternalLink, Loader2 } from 'lucide-react'
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

export function TrendingDomains() {
  const [trending, setTrending] = useState<TrendingDomain[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTrendingDomains = async () => {
      try {
        setLoading(true)
        
        // Fetch trending domains from API or blockchain
        // For now, return empty list as we need contract data
        // This would be populated from smart contract queries for popular/newly registered domains
        const response = await fetch('/api/trending')
        if (response.ok) {
          const data = await response.json()
          setTrending(data.domains || [])
        } else {
          setTrending([])
        }
      } catch (error) {
        console.error('Error loading trending domains:', error)
        setTrending([])
      } finally {
        setLoading(false)
      }
    }

    loadTrendingDomains()
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

  if (trending.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <div className="text-center space-y-2">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">
            No trending domains yet. Check back soon!
          </p>
        </div>
      </Card>
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
