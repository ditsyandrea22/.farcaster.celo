'use client'

import { useState, useEffect } from 'react'
import { Search, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { validateDomainName, checkDomainAvailability } from '@/lib/blockchain'

interface DomainSearchProps {
  onDomainSelect?: (domain: string) => void
}

export function DomainSearch({ onDomainSelect }: DomainSearchProps) {
  const [domain, setDomain] = useState('')
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!domain) {
        setAvailable(null)
        setError(null)
        return
      }

      const validation = validateDomainName(domain)
      if (!validation.isValid) {
        setError(validation.error || 'Invalid domain')
        setAvailable(null)
        return
      }

      setChecking(true)
      setError(null)
      try {
        const isAvailable = await checkDomainAvailability(domain)
        setAvailable(isAvailable)
      } catch (err) {
        setError('Failed to check availability')
        setAvailable(null)
      } finally {
        setChecking(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [domain])

  const handleSearch = () => {
    if (available && onDomainSelect) {
      onDomainSelect(domain)
    }
  }

  return (
    <div className="w-full space-y-4 animate-fade-in-up">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Find an available name that represents your identity</p>
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="alice, bob, developer, creator..."
                value={domain}
                onChange={(e) => setDomain(e.target.value.toLowerCase())}
                className="pl-12 pr-12 text-base h-12 border-secondary/30 bg-input focus:border-primary/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && available) {
                    handleSearch()
                  }
                }}
              />
              {checking && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
              )}
              {available === true && (
                <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              )}
              {available === false && (
                <X className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
              )}
            </div>
            <Button
              onClick={handleSearch}
              disabled={!available || checking}
              className="px-8 h-12 font-semibold"
              size="lg"
            >
              Claim Now
            </Button>
          </div>
          {domain && <p className="text-xs text-muted-foreground mt-2">→ will become <span className="font-semibold text-foreground">{domain}.farcaster.celo</span></p>}
        </div>
      </div>

      {error && (
        <Card className="p-3 border-destructive/50 bg-destructive/10 animate-fade-in-down">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {available !== null && (
        <Card
          className={`p-5 animate-scale-in dashboard-card transition-all duration-300 ${
            available
              ? 'border-secondary/50 bg-gradient-to-r from-secondary/15 to-accent/10'
              : 'border-destructive/50 bg-destructive/10'
          }`}
        >
          <div className="flex items-start gap-3">
            {available ? (
              <>
                <div className="p-2 rounded-lg bg-secondary/20 mt-0.5">
                  <Check className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-secondary">This Identity is Yours to Claim</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    <span className="font-semibold text-foreground">{domain}.farcaster.celo</span> is ready. Lock it in for just $0.25 and own your digital identity permanently on the blockchain. No middleman. No revocation. Just you.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 rounded-lg bg-destructive/20 mt-0.5">
                  <X className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-destructive">Already Claimed</p>
                  <p className="text-sm text-muted-foreground">
                    Someone else has already secured {domain}.farcaster.celo. Try another name or watch this domain on OpenSea.
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
