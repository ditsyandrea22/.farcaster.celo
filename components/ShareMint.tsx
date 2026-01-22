'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Copy, Check } from 'lucide-react'

interface ShareMintProps {
  domain: string
  txHash?: string
  openSeaUrl?: string
}

export function ShareMint({ domain, txHash, openSeaUrl }: ShareMintProps) {
  const [copied, setCopied] = useState(false)
  const [copiedShare, setCopiedShare] = useState(false)

  const shareText = `I just claimed my Farcaster identity on Celo. My domain is ${domain}.farcaster.celo and I've minted it as an NFT for only $0.25. No middleman, no restrictions, just pure web3 ownership. Join the revolution and claim yours today at farcaster-names.example.com`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopiedShare(true)
      setTimeout(() => setCopiedShare(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShareWarpcast = () => {
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`
    window.open(warpcastUrl, '_blank')
  }

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(twitterUrl, '_blank')
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <Card className="p-8 dashboard-card border-primary/40 bg-gradient-to-br from-primary/15 via-card to-secondary/10 animate-glow">
        <div className="space-y-5">
          <div className="text-center space-y-3">
            <div className="inline-block p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
              <div className="text-3xl">✓</div>
            </div>
            <h3 className="text-2xl font-bold gradient-text">You've Claimed Your Identity</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Your verified Farcaster domain <span className="font-semibold text-foreground">{domain}.farcaster.celo</span> is now permanently yours on the blockchain. This is your stake in web3 — tradeable, transferable, and undeniably authentic.
            </p>
          </div>

          {txHash && (
            <div className="p-4 rounded-lg bg-muted/40 border border-primary/20 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Transaction Confirmed</p>
              <p className="text-xs font-mono truncate text-primary">{txHash}</p>
            </div>
          )}

          {openSeaUrl && (
            <Button
              className="w-full gap-2 text-base h-12"
              onClick={() => window.open(openSeaUrl, '_blank')}
            >
              View Your NFT on OpenSea
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-6 dashboard-card border-secondary/40 bg-gradient-to-br from-secondary/10 to-accent/5">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-2">Spread the Word</h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              You've just taken control of your digital identity. Unlike traditional domains, your Farcaster name is truly yours — no company can take it away, no middleman can revoke it. Share this moment with your community and inspire them to claim theirs. At just $0.25 with zero hidden fees, it's the most transparent identity solution in web3.
            </p>
            <p className="text-xs text-accent font-medium italic">
              "Every person you invite joins a growing ecosystem of verified identities. Together, we're building internet ownership that actually belongs to the people."
            </p>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full h-11 font-semibold"
              onClick={handleShareWarpcast}
            >
              Share Your Domain on Warpcast
            </Button>
            
            <Button
              variant="secondary"
              className="w-full h-11 font-semibold"
              onClick={handleShareTwitter}
            >
              Tell Twitter You Own Your Identity
            </Button>

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1 gap-2 bg-transparent hover:bg-muted/50"
                onClick={handleCopyShare}
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Message
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="flex-1 gap-2 bg-transparent hover:bg-muted/50"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50 space-y-3">
            <p className="text-sm font-semibold text-foreground">What Makes Farcaster Names Different</p>
            <div className="grid gap-2">
              <div className="flex gap-2 text-xs">
                <span className="text-accent font-bold">→</span>
                <span className="text-muted-foreground"><span className="text-foreground font-medium">Verified Ownership</span> Your FID is cryptographically tied to your domain</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-accent font-bold">→</span>
                <span className="text-muted-foreground"><span className="text-foreground font-medium">Transparent Pricing</span> Only $0.25/year with actual gas costs shown</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-accent font-bold">→</span>
                <span className="text-muted-foreground"><span className="text-foreground font-medium">Complete Control</span> Trade, transfer, or hold — it's 100% yours</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-accent font-bold">→</span>
                <span className="text-muted-foreground"><span className="text-foreground font-medium">No Censorship</span> Permanently yours on Celo mainnet</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-accent font-bold">→</span>
                <span className="text-muted-foreground"><span className="text-foreground font-medium">OpenSea Ready</span> Instantly tradeable as a collectible NFT</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-r from-accent/10 via-primary/5 to-secondary/10 border-accent/30 dashboard-card">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Your Next Moves</p>
          <div className="space-y-2">
            <div className="flex gap-3 text-xs">
              <span className="font-bold text-primary">1</span>
              <span className="text-muted-foreground">Update your Farcaster profile to feature your new domain name</span>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="font-bold text-primary">2</span>
              <span className="text-muted-foreground">Invite friends and build your network of verified identities</span>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="font-bold text-primary">3</span>
              <span className="text-muted-foreground">Watch your domain's value grow as the community expands</span>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="font-bold text-primary">4</span>
              <span className="text-muted-foreground">Trade or hodl your NFT on OpenSea as demand increases</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
