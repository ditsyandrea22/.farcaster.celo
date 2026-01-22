'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, ExternalLink, Share2, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatAddress } from '@/lib/blockchain'
import type { NFTCard } from '@/lib/types'

interface NFTDetailsProps {
  nft: NFTCard
  onClose?: () => void
}

export function NFTDetails({ nft, onClose }: NFTDetailsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(nft.owner)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const timeUntilExpiry = nft.expiresAt * 1000 - Date.now()
  const daysLeft = Math.floor(timeUntilExpiry / (1000 * 60 * 60 * 24))
  const isExpiringSoon = daysLeft < 30

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-primary mb-2">{nft.name}</h2>
          <p className="text-muted-foreground">{nft.description}</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        )}
      </div>

      <Card className="overflow-hidden border-border/50">
        <div className="aspect-square bg-muted relative group">
          <img
            src={nft.image || "/placeholder.svg"}
            alt={nft.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <Link href={nft.opensea_url} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2" variant="secondary">
                View on OpenSea
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4 space-y-3 border-border/50">
          <p className="text-xs font-medium uppercase text-muted-foreground">Owner</p>
          <div className="flex items-center justify-between gap-2">
            <code className="text-sm font-mono bg-muted px-3 py-2 rounded flex-1 truncate">
              {formatAddress(nft.owner)}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyAddress}
              className="text-muted-foreground hover:text-foreground"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          {copied && <p className="text-xs text-accent">Copied!</p>}
        </Card>

        <Card className="p-4 space-y-3 border-border/50">
          <p className="text-xs font-medium uppercase text-muted-foreground">Expiration</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">
                {new Date(nft.expiresAt * 1000).toLocaleDateString()}
              </p>
              {isExpiringSoon && (
                <Badge variant="destructive" className="mt-1 text-xs">
                  {daysLeft} days left
                </Badge>
              )}
              {daysLeft > 30 && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {daysLeft} days left
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 space-y-4 border-border/50">
        <p className="text-xs font-medium uppercase text-muted-foreground">Metadata</p>

        <div className="space-y-3 border-t border-border pt-4">
          {nft.traits.farcaster_username && (
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Farcaster Username</p>
                <p className="text-sm font-semibold">@{nft.traits.farcaster_username}</p>
              </div>
            </div>
          )}

          {nft.traits.bio && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Bio</p>
              <p className="text-sm p-3 bg-muted rounded">{nft.traits.bio}</p>
            </div>
          )}

          {nft.traits.social_links && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Social Links</p>
              <p className="text-sm p-3 bg-muted rounded break-all">
                {nft.traits.social_links}
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-3">
        <Link href={nft.opensea_url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button className="w-full gap-2" variant="default">
            <ExternalLink className="w-4 h-4" />
            View on OpenSea
          </Button>
        </Link>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>
    </div>
  )
}
