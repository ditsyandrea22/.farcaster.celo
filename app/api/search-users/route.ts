import { NextRequest, NextResponse } from 'next/server'
import { searchFarcasterUsers } from '@/lib/farcaster'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }

    const users = await searchFarcasterUsers(query)

    return NextResponse.json({
      query,
      users: users.slice(0, limit),
      count: Math.min(users.length, limit),
      total: users.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error searching users:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
