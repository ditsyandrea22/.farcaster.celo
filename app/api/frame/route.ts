import { NextRequest, NextResponse } from 'next/server'
import {
  createFrameResponse,
  generateFrameImage,
  parseFrameState,
  encodeFrameState,
  type FrameState,
  type FrameRequest,
} from '@/lib/frame-utils'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FrameRequest

    const fid = body.untrustedData?.fid
    const buttonIndex = body.untrustedData?.buttonIndex
    const inputText = body.untrustedData?.inputText

    const currentState = parseFrameState(body.untrustedData?.state)

    let nextState: FrameState = {
      ...currentState,
      userFid: fid,
      walletConnected: true,
    }

    let image: string
    let buttons: Array<{ label: string; action: string; target?: string }> = []
    let postUrl: string

    switch (buttonIndex) {
      case 1:
        nextState.page = 'search'
        image = generateFrameImage(
          'Find Your Domain',
          'Search for available .farcaster.celo domains'
        )
        buttons = [
          { label: 'Back', action: 'post' },
          { label: 'Continue', action: 'post' },
        ]
        break

      case 2:
        if (inputText) {
          nextState.page = 'register'
          nextState.selectedDomain = inputText
          image = generateFrameImage(
            `Register ${inputText}.farcaster.celo`,
            'Complete your domain registration'
          )
          buttons = [
            { label: 'Back', action: 'post' },
            { label: 'Register Now', action: 'post' },
          ]
        } else {
          image = generateFrameImage(
            'Enter Domain Name',
            'Type your desired domain name'
          )
          buttons = [
            { label: 'Back', action: 'post' },
            { label: 'Check Availability', action: 'post' },
          ]
        }
        break

      case 3:
        nextState.page = 'gallery'
        image = generateFrameImage(
          'Your Domains',
          'View and manage your .farcaster.celo domains'
        )
        buttons = [
          { label: 'Back', action: 'post' },
          {
            label: 'View on OpenSea',
            action: 'link',
            target: 'https://opensea.io/collection/farcaster-names',
          },
        ]
        break

      default:
        nextState.page = 'home'
        image = generateFrameImage(
          'Farcaster Names',
          'Register .farcaster.celo domains with NFT functionality on Celo mainnet'
        )
        buttons = [
          { label: 'Register Domain', action: 'post' },
          { label: 'My Domains', action: 'post' },
          {
            label: 'Visit App',
            action: 'link',
            target: process.env.NEXT_PUBLIC_FARCASTER_FRAME_URL,
          },
        ]
    }

    postUrl = `${process.env.NEXT_PUBLIC_FARCASTER_FRAME_URL}/api/frame`
    const state = encodeFrameState(nextState)

    const response = createFrameResponse({
      image,
      buttons: buttons.map((btn) => ({
        label: btn.label,
        action: (btn.action as 'post' | 'link' | 'post_redirect' | 'mint') || 'post',
        target: btn.target,
      })),
      postUrl,
      state,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error processing frame request:', error)

    const fallbackResponse = createFrameResponse({
      image: generateFrameImage(
        'Farcaster Names',
        'Register .farcaster.celo domains on Celo mainnet'
      ),
      buttons: [
        { label: 'Try Again', action: 'post' },
        {
          label: 'Visit App',
          action: 'link',
          target: process.env.NEXT_PUBLIC_FARCASTER_FRAME_URL,
        },
      ],
      postUrl: `${process.env.NEXT_PUBLIC_FARCASTER_FRAME_URL}/api/frame`,
    })

    return NextResponse.json(fallbackResponse)
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || 'home'

  const images: Record<string, string> = {
    home: generateFrameImage(
      'Farcaster Names',
      'Register .farcaster.celo domains with NFT functionality on Celo mainnet'
    ),
    search: generateFrameImage(
      'Find Your Domain',
      'Search for available .farcaster.celo domains'
    ),
    register: generateFrameImage(
      'Register Domain',
      'Complete your domain registration and mint NFT'
    ),
    gallery: generateFrameImage(
      'Your Domains',
      'View and manage your .farcaster.celo domain NFTs'
    ),
  }

  const image = images[page] || images.home

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${image}" />
      <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_FARCASTER_FRAME_URL}/api/frame" />
      <meta property="fc:frame:button:1" content="Get Started" />
      <meta property="fc:frame:button:1:action" content="post" />
      <title>Farcaster Names</title>
      <style>
        body { margin: 0; padding: 20px; font-family: system-ui; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #8A63D2; }
        p { color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Farcaster Names</h1>
        <p>Register .farcaster.celo domain names with NFT functionality on Celo mainnet</p>
        <p>Open this link in Warpcast to interact with the frame!</p>
      </div>
    </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
