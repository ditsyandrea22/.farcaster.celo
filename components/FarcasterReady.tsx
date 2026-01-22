'use client'

import { useEffect } from 'react'
import { sdk } from '@farcaster/frame-sdk'

/**
 * FarcasterReady Component
 * 
 * Signals to the Farcaster client that the mini app has finished initializing.
 * This removes the splash screen and makes the app interactive.
 * 
 * MUST be mounted in your root layout or earliest client component.
 * MUST use 'use client' directive.
 * MUST be called exactly once on initial mount.
 */
export function FarcasterReady() {
  useEffect(() => {
    // Call sdk.actions.ready() to signal app initialization complete
    // This is a critical step - without it, the Farcaster splash screen persists
    
    async function signalReady() {
      try {
        // Safely check if sdk.actions.ready exists
        if (sdk?.actions?.ready) {
          console.log('[FarcasterReady] Calling sdk.actions.ready()')
          await sdk.actions.ready()
          console.log('[FarcasterReady] App is ready for interaction')
        } else {
          // SDK might not be available outside Farcaster context
          console.info('[FarcasterReady] SDK not available - app may be running outside Farcaster')
        }
      } catch (error) {
        console.error('[FarcasterReady] Error signaling ready:', error)
      }
    }

    signalReady()
  }, []) // Empty dependency array ensures this runs exactly once

  // This component doesn't render anything
  return null
}
