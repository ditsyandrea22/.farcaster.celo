import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const celoRpcUrl = process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo.org'
    const neynarApiKey = process.env.NEYNAR_API_KEY ? '***' : 'missing'

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        blockchain: {
          status: 'connected',
          network: 'Celo Mainnet',
          rpc: celoRpcUrl,
        },
        farcaster: {
          status: neynarApiKey === 'missing' ? 'unconfigured' : 'connected',
          provider: 'Neynar API',
          apiKey: neynarApiKey,
        },
        registry: {
          status: 'operational',
          domainTld: '.farcaster.celo',
          chainId: 42220,
        },
      },
      features: {
        domainRegistration: true,
        nftMinting: true,
        openSeaIntegration: true,
        frameSupport: true,
        gasTracking: true,
      },
      endpoints: {
        checkDomain: '/api/check-domain',
        gasEstimate: '/api/gas-estimate',
        farcasterUser: '/api/farcaster-user',
        metadata: '/api/metadata/[tokenId]',
        registerDomain: '/api/register-domain',
        followers: '/api/followers',
        searchUsers: '/api/search-users',
      },
    }

    return NextResponse.json(health)
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        status: 'degraded',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
