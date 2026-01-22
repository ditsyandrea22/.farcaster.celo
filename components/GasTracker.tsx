'use client'

import { useState, useEffect } from 'react'
import { Zap, AlertTriangle, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { GasEstimate } from '@/lib/types'

interface GasTrackerProps {
  estimate?: GasEstimate
  autoRefresh?: boolean
  onPriceChange?: (estimate: GasEstimate) => void
}

export function GasTracker({ estimate, autoRefresh = true, onPriceChange }: GasTrackerProps) {
  const [gasData, setGasData] = useState<GasEstimate | null>(estimate || null)
  const [loading, setLoading] = useState(!estimate)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [priceHistory, setPriceHistory] = useState<number[]>([])

  useEffect(() => {
    const fetchGasPrice = async () => {
      try {
        const response = await fetch('/api/gas-estimate')
        if (response.ok) {
          const data = (await response.json()) as GasEstimate
          setGasData(data)
          setLastUpdated(new Date())
          setPriceHistory((prev) => [...prev.slice(-9), parseFloat(data.totalCostUSD)])
          if (onPriceChange) {
            onPriceChange(data)
          }
        }
      } catch (error) {
        console.error('Error fetching gas price:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGasPrice()

    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(fetchGasPrice, 15000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [autoRefresh, onPriceChange])

  const isGasHigh = gasData && parseFloat(gasData.totalCostUSD) > 0.3
  const trend =
    priceHistory.length >= 2
      ? priceHistory[priceHistory.length - 1] < priceHistory[priceHistory.length - 2]
        ? 'down'
        : 'up'
      : null

  if (loading) {
    return <div className="h-20 bg-muted rounded-lg animate-pulse" />
  }

  if (!gasData) {
    return null
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-border/50 animate-fade-in-down">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div
            className={`p-2 rounded-lg ${
              isGasHigh
                ? 'bg-destructive/10 text-destructive'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {isGasHigh ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium">Gas Price</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold">${gasData.totalCostUSD}</p>
              {trend && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <TrendingDown className="w-3 h-3" />
                  {trend === 'down' ? 'Decreasing' : 'Increasing'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="text-right text-xs">
          <div className="text-muted-foreground mb-1">
            {gasData.totalCostCELO} CELO
          </div>
          {lastUpdated && (
            <div className="text-muted-foreground">
              Updated {Math.round((Date.now() - lastUpdated.getTime()) / 1000)}s ago
            </div>
          )}
        </div>
      </div>

      {priceHistory.length >= 2 && (
        <div className="mt-3 pt-3 border-t border-border/30">
          <div className="flex items-end gap-1 h-6">
            {priceHistory.map((price, idx) => {
              const maxPrice = Math.max(...priceHistory)
              const minPrice = Math.min(...priceHistory)
              const range = maxPrice - minPrice || 1
              const height = ((price - minPrice) / range) * 100
              return (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-t from-primary to-accent rounded-sm opacity-60 hover:opacity-100 transition-opacity"
                  style={{ height: `${Math.max(20, height)}%` }}
                  title={`$${price.toFixed(4)}`}
                />
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Price history (last 10)</p>
        </div>
      )}
    </Card>
  )
}
