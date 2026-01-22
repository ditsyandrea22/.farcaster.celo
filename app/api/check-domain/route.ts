import { NextRequest, NextResponse } from 'next/server'
import { checkDomainAvailability, validateDomainName } from '@/lib/blockchain'

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

    // Validate domain format
    const validation = validateDomainName(domain)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid domain' },
        { status: 400 }
      )
    }

    // Check real blockchain availability
    const available = await checkDomainAvailability(domain)

    return NextResponse.json({
      domain,
      available,
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
