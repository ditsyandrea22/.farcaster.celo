/**
 * Hook untuk membaca Farcaster User dari Mini App Context
 * Ini adalah source of truth untuk user identity dalam mini app
 * 
 * Data flow:
 * Farcaster Mini App Context → hook → component
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { sdk } from '@farcaster/frame-sdk'

export interface FarcasterUserContext {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
}

/**
 * Hook untuk membaca dan validasi Farcaster user dari frame context
 * Returns null jika belum ready atau tidak dalam mini app context
 */
export function useFarcasterUser() {
  const [user, setUser] = useState<FarcasterUserContext | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fungsi untuk extract user dari context
  const extractUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Tunggu frame SDK siap
      if (!sdk.context) {
        console.warn('[FarcasterUser] Frame SDK context tidak tersedia')
        setUser(null)
        return
      }

      const context = await sdk.context
      
      if (!context?.user) {
        console.warn('[FarcasterUser] User context tidak ditemukan')
        setUser(null)
        return
      }

      const { fid, username, displayName, pfpUrl } = context.user

      // Validasi required fields
      if (!fid || !username) {
        throw new Error('Invalid user context: missing fid or username')
      }

      // Validasi username format
      const cleanUsername = validateAndCleanUsername(username)
      
      const userData: FarcasterUserContext = {
        fid,
        username: cleanUsername,
        displayName: displayName || username,
        pfpUrl: pfpUrl || '',
      }

      console.log('[FarcasterUser] User loaded:', {
        fid: userData.fid,
        username: userData.username,
      })

      setUser(userData)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      console.error('[FarcasterUser] Error extracting user:', error)
      setError(error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Extract user saat component mount
  useEffect(() => {
    extractUser()
  }, [extractUser])

  return {
    user,
    loading,
    error,
    isReady: user !== null && !loading,
  }
}

/**
 * Validasi dan clean username dari Farcaster
 * 
 * Rules:
 * - Hanya lowercase
 * - Hanya a-z0-9_ (no special chars, no emoji)
 * - Min 1 karakter
 * 
 * @param username - username dari Farcaster
 * @returns cleaned username
 */
export function validateAndCleanUsername(username: string): string {
  // Lowercase
  const cleaned = username.toLowerCase()
  
  // Remove invalid characters (keep hanya a-z0-9_)
  const validUsername = cleaned.replace(/[^a-z0-9_]/g, '')
  
  if (validUsername.length === 0) {
    throw new Error('Invalid username: contains no valid characters')
  }
  
  return validUsername
}

/**
 * Generate domain name dari username
 * Format: {username}.farcaster.celo
 * 
 * @param username - validated username
 * @returns full domain name
 */
export function generateFarcasterDomain(username: string): string {
  const cleaned = validateAndCleanUsername(username)
  return `${cleaned}.farcaster.celo`
}

/**
 * Validasi domain name untuk Farcaster
 * 
 * @param domain - full domain (e.g., "vina.farcaster.celo")
 * @returns true if valid
 */
export function isFarcasterDomainValid(domain: string): boolean {
  const farcasterDomainRegex = /^[a-z0-9_]+\.farcaster\.celo$/
  return farcasterDomainRegex.test(domain)
}

/**
 * Extract label (username) dari full domain
 * 
 * @param domain - full domain (e.g., "vina.farcaster.celo")
 * @returns label (username)
 */
export function getDomainLabel(domain: string): string {
  const match = domain.match(/^([a-z0-9_]+)\.farcaster\.celo$/)
  if (!match) {
    throw new Error('Invalid domain format')
  }
  return match[1]
}

/**
 * Hook untuk validasi user siap untuk mint
 */
export function useFarcasterUserReadyForMint() {
  const { user, loading, error, isReady } = useFarcasterUser()

  const isReadyForMint = isReady && user !== null && !loading && !error

  return {
    user,
    loading,
    error,
    isReady: isReadyForMint,
    domainLabel: user ? user.username : null,
    fullDomain: user ? generateFarcasterDomain(user.username) : null,
  }
}
