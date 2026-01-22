'use client'

import { useState } from "react"

import React from "react"
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ShareMint } from './ShareMint'
import { Wallet } from 'lucide-react' // Declared the Wallet variable

import type { GasEstimate } from '@/lib/types'

interface RegistrationFormProps {
  domain: string
  onSubmit?: (data: RegistrationData) => Promise<void>
  gasEstimate?: GasEstimate | null | {
    totalCostCELO: string
    totalCostUSD: string
  }
}

export interface RegistrationData {
  domain: string
  bio: string
  socialLinks: string
  farcasterUsername: string
  farcasterFid: number
}

export function RegistrationForm({
  domain,
  onSubmit,
  gasEstimate,
}: RegistrationFormProps) {
  const [bio, setBio] = useState('')
  const [socialLinks, setSocialLinks] = useState('')
  const [farcasterUsername, setFarcasterUsername] = useState('')
  const [farcasterFid, setFarcasterFid] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!farcasterUsername.trim()) {
      setError('Farcaster username is required')
      return
    }

    if (!farcasterFid || farcasterFid <= 0) {
      setError('Valid Farcaster ID is required')
      return
    }

    if (!bio.trim()) {
      setError('Bio is required')
      return
    }

    setLoading(true)
    try {
      if (onSubmit) {
        await onSubmit({
          domain,
          bio,
          socialLinks,
          farcasterUsername,
          farcasterFid,
        })
      }
      setSuccess(true)
      setBio('')
      setSocialLinks('')
      setFarcasterUsername('')
      setFarcasterFid(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <ShareMint 
        domain={domain} 
        txHash={txHash || undefined}
        openSeaUrl={`https://opensea.io/collection/farcasternames`}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up">
      <div className="space-y-2">
        <Label htmlFor="domain" className="text-sm font-medium">
          Domain Name
        </Label>
        <div className="px-4 py-3 rounded-lg bg-muted border border-border">
          <p className="font-semibold">
            {domain}.farcaster.celo
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="farcasterUsername" className="text-sm font-medium">
            Farcaster Username
          </Label>
          <Input
            id="farcasterUsername"
            placeholder="Your username"
            value={farcasterUsername}
            onChange={(e) => setFarcasterUsername(e.target.value)}
            disabled={loading}
            className="text-base"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="farcasterFid" className="text-sm font-medium">
            Farcaster FID
          </Label>
          <Input
            id="farcasterFid"
            type="number"
            placeholder="Your FID"
            value={farcasterFid || ''}
            onChange={(e) => setFarcasterFid(e.target.value ? parseInt(e.target.value) : null)}
            disabled={loading}
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">
            Find your FID at warpcast.com
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium">
          Bio (for NFT metadata)
        </Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={loading}
          rows={3}
          className="resize-none text-base"
        />
        <p className="text-xs text-muted-foreground">
          {bio.length}/500 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="socialLinks" className="text-sm font-medium">
          Social Links (optional)
        </Label>
        <Input
          id="socialLinks"
          placeholder="Twitter, Discord, etc."
          value={socialLinks}
          onChange={(e) => setSocialLinks(e.target.value)}
          disabled={loading}
          className="text-base"
        />
      </div>

      {gasEstimate && (
        <Card className="p-4 bg-card border-border space-y-2 animate-fade-in-down">
          <p className="text-sm font-medium">Estimated Cost</p>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Gas + Fee:</span>
            <span className="font-semibold">
              {gasEstimate.totalCostCELO} CELO (~${gasEstimate.totalCostUSD})
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Powered by Celo mainnet
          </p>
        </Card>
      )}

      {error && (
        <Card className="p-3 border-destructive/50 bg-destructive/10 animate-fade-in-down">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      <Button
        type="submit"
        disabled={loading || !farcasterFid}
        className="w-full gap-2"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Claiming Your Identity
          </>
        ) : (
          <>
            Claim & Mint NFT
          </>
        )}
      </Button>
    </form>
  )
}
