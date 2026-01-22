import { NextRequest, NextResponse } from 'next/server'
import { getFarcasterFollowers } from '@/lib/farcaster'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fid = searchParams.get('fid')
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000)

    if (!fid) {
      return NextResponse.json(
        { error: 'FID parameter is required' },
        { status: 400 }
      )
    }

    const followers = await getFarcasterFollowers(parseInt(fid), limit)

    return NextResponse.json({
      fid: parseInt(fid),
      followers,
      count: followers.length,
      limit,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching followers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch followers' },
      { status: 500 }
    )
  }
}
