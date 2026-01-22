'use client'

import { useState } from 'react'
import { Edit2, Trash2, RefreshCw, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DomainManagerProps {
  domain: string
  currentBio?: string
  currentLinks?: string
  onUpdate?: (bio: string, links: string) => Promise<void>
  onRenew?: () => Promise<void>
}

export function DomainManager({
  domain,
  currentBio = '',
  currentLinks = '',
  onUpdate,
  onRenew,
}: DomainManagerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState(currentBio)
  const [links, setLinks] = useState(currentLinks)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      if (onUpdate) {
        await onUpdate(bio, links)
      }
      setSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  const handleRenew = async () => {
    setLoading(true)
    setError(null)
    try {
      if (onRenew) {
        await onRenew()
      }
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to renew')
    } finally {
      setLoading(false)
    }
  }

  if (isEditing) {
    return (
      <Card className="p-6 space-y-4 animate-scale-in">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="font-semibold">Edit {domain}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(false)}
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Update your bio"
              rows={3}
              disabled={loading}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">{bio.length}/500</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="links">Social Links</Label>
            <Input
              id="links"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              placeholder="Twitter, Discord, etc."
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/50">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setBio(currentBio)
                setLinks(currentLinks)
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{domain}</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRenew}
            disabled={loading}
            className="gap-2 bg-transparent"
          >
            <RefreshCw className="w-4 h-4" />
            Renew
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {bio && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Bio</p>
            <p className="text-sm">{bio}</p>
          </div>
        )}

        {links && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Social Links</p>
            <p className="text-sm break-all">{links}</p>
          </div>
        )}
      </div>

      {success && (
        <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/50">
          <p className="text-sm text-secondary">Updated successfully!</p>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/50">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </Card>
  )
}
