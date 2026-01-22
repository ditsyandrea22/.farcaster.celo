import type { FrameMessage } from './types'

const FARCASTER_HUB_URL = process.env.FARCASTER_HUB_URL || 'https://hub-api.neynar.com'

export interface FrameRequest {
  trustedData?: {
    messageBytes: string
  }
  untrustedData?: {
    fid: number
    url: string
    messageHash: string
    timestamp: number
    network: number
    buttonIndex: number
    castId: {
      fid: number
      hash: string
    }
    inputText?: string
    state?: string
  }
}

export interface FrameResponse {
  version: 'vNext'
  image: string
  buttons?: FrameButton[]
  input?: FrameInput
  state?: string
  postUrl?: string
}

export interface FrameButton {
  label: string
  action?: 'post' | 'link' | 'post_redirect' | 'mint'
  target?: string
}

export interface FrameInput {
  text: string
}

export async function verifyFrameMessage(
  messageBytes: string
): Promise<FrameMessage | null> {
  try {
    const response = await fetch(`${FARCASTER_HUB_URL}/validateMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageBytes,
      }),
    })

    if (!response.ok) {
      console.error('Frame message verification failed:', response.statusText)
      return null
    }

    const data = await response.json()
    return {
      isValid: data.valid,
      fid: data.message?.data?.fid,
      messageHash: data.hash,
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error('Error verifying frame message:', error)
    return null
  }
}

export function createFrameResponse(options: {
  image: string
  buttons?: FrameButton[]
  input?: FrameInput
  state?: string | Record<string, string | number | boolean>
  postUrl?: string
}): FrameResponse {
  const stateValue = typeof options.state === 'string' ? options.state : (options.state ? JSON.stringify(options.state) : undefined)
  return {
    version: 'vNext',
    image: options.image,
    buttons: options.buttons,
    input: options.input,
    state: stateValue,
    postUrl: options.postUrl,
  }
}

export function buildFrameMetadata(frameUrl: string) {
  return {
    'fc:frame': 'vNext',
    'fc:frame:image': `${frameUrl}/frame`,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:post_url': `${frameUrl}/api/frame`,
    'fc:frame:button:1': 'View App',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': frameUrl,
    'fc:frame:button:2': 'Register Domain',
    'fc:frame:button:2:action': 'post',
    'fc:frame:button:3': 'My Domains',
    'fc:frame:button:3:action': 'post',
  }
}

export function generateFrameImage(title: string, subtitle: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          margin: 0; 
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #8A63D2 0%, #35C759 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          color: white;
        }
        .container {
          text-align: center;
          animation: fadeIn 0.5s ease-out;
        }
        h1 {
          font-size: 4rem;
          margin: 0 0 1rem 0;
          font-weight: 800;
          text-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        p {
          font-size: 1.5rem;
          margin: 0;
          opacity: 0.9;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
    </body>
    </html>
  `
}

export function createWarpcastShareUrl(
  text: string,
  embeds?: string[]
): string {
  const params = new URLSearchParams()
  params.append('text', text)

  if (embeds) {
    embeds.forEach((embed) => {
      params.append('embeds[]', embed)
    })
  }

  return `https://warpcast.com/~/compose?${params.toString()}`
}

export function generateShareText(
  domain: string,
  username: string
): string {
  return `I just registered ${domain}.farcaster.celo on Celo mainnet! 🌍 

Join me in the Farcaster Name Registry and claim your unique .celo domain NFT. Trade it on OpenSea and flex your on-chain identity! 

#FarcasterNames #Celo #Web3 #NFT`
}

export interface FrameState {
  page: 'home' | 'search' | 'register' | 'gallery'
  selectedDomain?: string
  userFid?: number
  userAddress?: string
  walletConnected: boolean
}

export function parseFrameState(stateJson?: string): FrameState {
  if (!stateJson) {
    return {
      page: 'home',
      walletConnected: false,
    }
  }

  try {
    return JSON.parse(Buffer.from(stateJson, 'base64').toString('utf-8'))
  } catch {
    return {
      page: 'home',
      walletConnected: false,
    }
  }
}

export function encodeFrameState(state: FrameState): string {
  return Buffer.from(JSON.stringify(state)).toString('base64')
}

export function getFrameImageUrl(baseUrl: string, page: string): string {
  return `${baseUrl}/api/frame?page=${page}`
}

export interface FrameButtonConfig {
  label: string
  target: string
  action: 'post' | 'link' | 'post_redirect' | 'mint'
}

export function buildFrameButtons(
  buttons: FrameButtonConfig[]
): Record<string, string> {
  const frameButtons: Record<string, string> = {}

  buttons.forEach((button, index) => {
    const buttonNum = index + 1
    frameButtons[`fc:frame:button:${buttonNum}`] = button.label
    frameButtons[`fc:frame:button:${buttonNum}:action`] = button.action
    frameButtons[`fc:frame:button:${buttonNum}:target`] = button.target
  })

  return frameButtons
}
