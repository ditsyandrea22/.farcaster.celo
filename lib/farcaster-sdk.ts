/**
 * Farcaster SDK Initialization
 * Based on: https://miniapps.farcaster.xyz/docs/sdk
 * Handles SDK setup and lifecycle for mini apps
 */

import { sdk } from "@farcaster/frame-sdk";

let sdkInitialized = false;

/**
 * Check if the app is running in a Farcaster mini app context
 * More robust dengan multiple fallback checks
 */
export function isInMiniApp(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    // Check 1: Farcaster SDK available
    if (sdk !== undefined) {
      console.log('[SDK] Mini app detected via sdk');
      return true;
    }
    
    // Check 2: window.farcaster context available (indirect indicator)
    if ((window as any).farcaster?.context) {
      console.log('[SDK] Mini app detected via window.farcaster.context');
      return true;
    }
    
    // Check 3: Specific user agent patterns dari Farcaster clients
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('warpcast') || userAgent.includes('farcaster')) {
      console.log('[SDK] Mini app detected via user agent');
      return true;
    }
    
    return false;
  } catch (error) {
    console.warn('[SDK] Error checking mini app context:', error);
    return false;
  }
}

/**
 * Get current Farcaster context
 * Contains user data, but may be undefined if not in mini app
 */
export async function getFarcasterContext() {
  try {
    if (!sdk) {
      return null;
    }
    return sdk.context;
  } catch (error) {
    console.error('Error getting context:', error);
    return null;
  }
}

/**
 * Signal to Farcaster that the app is ready
 * This removes the splash screen
 * See: https://miniapps.farcaster.xyz/docs/sdk/actions/ready
 */
export async function notifyAppReady(): Promise<void> {
  try {
    if (sdk?.actions?.ready) {
      console.log('[SDK] Calling sdk.actions.ready()');
      await sdk.actions.ready();
      sdkInitialized = true;
      console.log('[SDK] App ready signal sent');
    } else {
      console.warn('[SDK] sdk.actions.ready is not available');
    }
  } catch (error) {
    console.error('[SDK] Error calling sdk.actions.ready():', error);
  }
}

/**
 * Initialize the Farcaster SDK
 * Call this as early as possible in your app lifecycle (e.g., in layout.tsx)
 */
export async function initializeFarcasterSDK(): Promise<void> {
  if (sdkInitialized) {
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Initialize SDK and call ready immediately
    await notifyAppReady();
    sdkInitialized = true;
    console.log('[SDK] Farcaster SDK initialized');
  } catch (error) {
    console.error('[SDK] Error initializing Farcaster SDK:', error);
    sdkInitialized = true;
  }
}

/**
 * Safe wrapper untuk get context dengan error handling
 */
export async function getSafeContext() {
  try {
    const context = await getFarcasterContext();
    return context;
  } catch (error) {
    console.error('[SDK] Error getting safe context:', error);
    return null;
  }
}

/**
 * Monitor untuk SDK context availability
 * Penting karena SDK context mungkin belum ready saat app load
 */
export function monitorSDKContext(callback: (context: any) => void): () => void {
  let checkCount = 0;
  const maxChecks = 60; // 30 seconds dengan interval 500ms
  
  const interval = setInterval(async () => {
    checkCount++;
    
    try {
      const context = await getFarcasterContext();
      if (context) {
        console.log('[SDK] Context available:', context);
        callback(context);
        clearInterval(interval);
        return;
      }
    } catch (err) {
      // Continue monitoring
    }
    
    if (checkCount >= maxChecks) {
      console.log('[SDK] Stopped monitoring context after 30s');
      clearInterval(interval);
    }
  }, 500);
  
  return () => clearInterval(interval);
}

/**
 * Compose a cast using the Farcaster UI
 * See: https://miniapps.farcaster.xyz/docs/sdk/actions/compose-cast
 */
export async function composeCast(options?: {
  text?: string;
  embeds?: (string | string[])[];
}): Promise<void> {
  try {
    if (sdk?.actions?.composeCast) {
      const castOptions = {
        text: options?.text,
        embeds: (options?.embeds || []) as [] | [string] | [string, string],
      };
      await sdk.actions.composeCast(castOptions);
    } else {
      console.warn('[SDK] composeCast is not available');
    }
  } catch (error) {
    console.error('[SDK] Error composing cast:', error);
  }
}

/**
 * Close the mini app
 * See: https://miniapps.farcaster.xyz/docs/sdk/actions/close
 */
export async function closeMiniApp(): Promise<void> {
  try {
    if (sdk?.actions?.close) {
      await sdk.actions.close();
    } else {
      console.warn('[SDK] close action is not available');
    }
  } catch (error) {
    console.error('[SDK] Error closing mini app:', error);
  }
}
