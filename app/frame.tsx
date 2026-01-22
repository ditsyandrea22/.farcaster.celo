import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundColor: '#0a0a0a',
            backgroundImage: 'linear-gradient(135deg, #8A63D2 0%, #35C759 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              Farcaster Names
            </div>
            <div
              style={{
                fontSize: '36px',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              .celo Domain Registry
            </div>
            <div
              style={{
                fontSize: '24px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Register & Mint NFT Domains on Celo Mainnet
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Frame image error:', error)
    return new Response('Error generating image', { status: 500 })
  }
}
