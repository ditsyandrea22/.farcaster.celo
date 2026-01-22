'use client'

import { useState, useEffect } from 'react'
import { Loader2, Check, X, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { TransactionResult } from '@/lib/types'

interface Transaction {
  id: string
  hash: string
  domain: string
  type: 'register' | 'renew' | 'update'
  status: 'pending' | 'success' | 'failed'
  timestamp: Date
  result?: TransactionResult
}

interface TransactionTrackerProps {
  transactions?: Transaction[]
  onRefresh?: () => Promise<void>
}

export function TransactionTracker({
  transactions = [],
  onRefresh,
}: TransactionTrackerProps) {
  const [txList, setTxList] = useState<Transaction[]>(transactions)
  const [loading, setLoading] = useState(false)

  const handleRefresh = async () => {
    setLoading(true)
    try {
      if (onRefresh) {
        await onRefresh()
      }
    } catch (error) {
      console.error('Error refreshing transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-secondary/10 text-secondary'
      case 'failed':
        return 'bg-destructive/10 text-destructive'
      case 'pending':
        return 'bg-primary/10 text-primary'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Check className="w-4 h-4" />
      case 'failed':
        return <X className="w-4 h-4" />
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin" />
      default:
        return null
    }
  }

  const getCeloScanUrl = (hash: string) => {
    return `https://celoscan.io/tx/${hash}`
  }

  if (txList.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed animate-fade-in-up">
        <div className="space-y-3">
          <div className="text-4xl">📋</div>
          <h3 className="font-semibold">No Transactions Yet</h3>
          <p className="text-muted-foreground text-sm">
            Your transactions will appear here
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="font-semibold">Recent Transactions</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={loading}
          className="gap-2 bg-transparent"
        >
          <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {txList.map((tx) => (
          <Card key={tx.id} className="p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`p-2 rounded-lg ${getStatusColor(tx.status)}`}>
                  {getStatusIcon(tx.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm truncate">
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} {tx.domain}
                    </p>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {tx.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {tx.hash}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tx.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                asChild
                className="flex-shrink-0"
              >
                <a
                  href={getCeloScanUrl(tx.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>

            {tx.result && (
              <div className="mt-3 pt-3 border-t border-border/30 grid gap-2 md:grid-cols-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Gas Used</p>
                  <p className="font-mono">{tx.result.gasUsed}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Block Number</p>
                  <p className="font-mono">{tx.result.blockNumber}</p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
