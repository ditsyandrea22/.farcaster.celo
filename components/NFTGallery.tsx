'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getRegisteredDomainsByOwner } from '@/lib/blockchain'
import type { NFTCard } from '@/lib/types'

interface NFTGalleryProps {
  owner?: string
}

export function NFTGallery({ owner }: NFTGalleryProps) {
  const [nfts, setNfts] = useState<NFTCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadNFTs = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!owner) {
          setNfts([])
          setLoading(false)
          return
        }

        // Fetch real domains from blockchain
        const domains = await getRegisteredDomainsByOwner(owner)
        
        if (domains.length === 0) {
          setNfts([])
          setLoading(false)
          return
        }

        // Convert domains to NFT cards
        const nftCards: NFTCard[] = domains.map((domain, index) => ({
          id: `${index + 1}`,
          name: domain,
          description: `Farcaster domain on Celo mainnet`,
          image: `/api/domain-image?domain=${domain}`, // Generate domain image
          owner: owner,
          expiresAt: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
          opensea_url: `https://opensea.io/collection/farcaster-celo-domains`,
          traits: {
            farcaster_username: domain.split('.')[0],
            bio: `Registered domain on Celo`,
            social_links: '',
          },
        }))

        setNfts(nftCards)
      } catch (err) {
        console.error('Error loading NFTs:', err)
        setError('Failed to load domains')
        setNfts([])
      } finally {
        setLoading(false)
      }
    }

    loadNFTs()
  }, [owner])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading NFTs...</p>
        </div>
      </div>
    )
  }

  if (nfts.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed animate-fade-in-up">
        <div className="space-y-3">
          <div className="text-4xl">🎯</div>
          <h3 className="font-semibold text-lg">No NFTs Yet</h3>
          <p className="text-muted-foreground">
            {owner ? 'This address has no Farcaster domain NFTs' : 'Start by registering a domain!'}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {nfts.map((nft) => (
          <Card
            key={nft.id}
            className="overflow-hidden hover:border-primary/50 transition-colors group cursor-pointer animate-scale-in"
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={nft.image || "/placeholder.svg"}
                alt={nft.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <Link href={nft.opensea_url} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View on OpenSea
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-sm line-clamp-1 text-primary">{nft.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {nft.description}
                </p>
              </div>

              <div className="space-y-2 border-t border-border pt-3">
                {nft.traits.farcaster_username && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Username:</span>
                    <Badge variant="secondary" className="text-xs">
                      @{nft.traits.farcaster_username}
                    </Badge>
                  </div>
                )}

                {nft.traits.bio && (
                  <div className="text-xs">
                    <p className="text-muted-foreground mb-1">Bio</p>
                    <p className="line-clamp-2">{nft.traits.bio}</p>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs pt-2 border-t border-border">
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-medium">
                    {new Date(nft.expiresAt * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
