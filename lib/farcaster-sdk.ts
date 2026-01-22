/**
 * Farcaster SDK Initialization
 * Based on: https://miniapps.farcaster.xyz/docs/sdk
 * Handles SDK setup and lifecycle for mini apps
 */

import { sdk } from "@farcaster/frame-sdk";

let sdkInitialized = false;
let isInMiniAppContext = false;

/**
 * Check if the app is running in a Farcaster mini app context
 */
export function isInMiniApp(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    // The SDK from @farcaster/frame-sdk checks this automatically
    return sdk.context !== undefined;
  } catch (error) {
    console.warn('Error checking mini app context:', error);
    return false;
  }
}

/**
 * Signal to Farcaster that the app is ready
 * This removes the splash screen
 * See: https://miniapps.farcaster.xyz/docs/sdk/actions/ready
 */
export async function notifyAppReady(): Promise<void> {
  try {
    // Call sdk.actions.ready() to signal app initialization complete
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
 * Call this as early as possible in your app lifecycle
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
  } catch (error) {
    console.error('[SDK] Error initializing Farcaster SDK:', error);
    sdkInitialized = true;
  }
}

/**
 * Check if a capability is supported
 * See: https://miniapps.farcaster.xyz/docs/sdk/detecting-capabilities
 */
export async function isCapabilitySupported(capability: string): Promise<boolean> {
  try {
    // getCapabilities is not available in the SDK
    console.warn(`Capability detection not available for "${capability}"`);
    return false;
  } catch (error) {
    console.warn(`Error checking capability "${capability}":`, error);
    return false;
  }
}

/**
 * Get all supported capabilities
 */
export async function getSupportedCapabilities(): Promise<string[]> {
  try {
    // getCapabilities is not available in the SDK
    return [];
  } catch (error) {
    console.warn('Error getting capabilities:', error);
    return [];
  }
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

/**
 * Sign a manifest for authentication
 * Note: signManifest is not available in the current SDK version
 * Consider using alternative authentication methods
 */
export async function signManifest(manifest: {
  domain: string;
  timestamp: number;
  signature?: string;
}): Promise<string | null> {
  try {
    console.warn('[SDK] signManifest is not available in the current SDK version');
    return null;
  } catch (error) {
    console.error('[SDK] Error signing manifest:', error);
    return null;
  }
}

export { isInMiniAppContext };
