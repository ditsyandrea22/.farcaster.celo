import { NextRequest, NextResponse } from 'next/server'

const MOCK_REGISTERED_DOMAINS = ['alice', 'bob', 'charlie', 'farcaster', 'celo']

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')?.toLowerCase()

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      )
    }

    if (domain.length < 3 || domain.length > 63) {
      return NextResponse.json(
        { error: 'Invalid domain length' },
        { status: 400 }
      )
    }

    const isAvailable = !MOCK_REGISTERED_DOMAINS.includes(domain)

    return NextResponse.json({
      domain,
      available: isAvailable,
      fullDomain: `${domain}.farcaster.celo`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error checking domain:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
