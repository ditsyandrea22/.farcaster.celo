import { NextRequest, NextResponse } from 'next/server'
import { getFarcasterUser, getFarcasterUserByUsername } from '@/lib/farcaster'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fid = searchParams.get('fid')
    const username = searchParams.get('username')

    if (!fid && !username) {
      return NextResponse.json(
        { error: 'Either fid or username is required' },
        { status: 400 }
      )
    }

    let user = null

    if (fid) {
      user = await getFarcasterUser(parseInt(fid))
    } else if (username) {
      user = await getFarcasterUserByUsername(username)
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching Farcaster user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
