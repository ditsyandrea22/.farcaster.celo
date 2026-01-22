import type { FarcasterUser, NeynarUser } from './types'

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || ''
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2'

export async function getFarcasterUser(fid: number): Promise<FarcasterUser | null> {
  try {
    const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/user/by_fid?fid=${fid}`, {
      headers: {
        'x-api-key': NEYNAR_API_KEY,
      },
    })

    if (!response.ok) {
      console.error('Error fetching Farcaster user:', response.statusText)
      return null
    }

    const data = (await response.json()) as { user: NeynarUser }
    return convertNeynarUserToFarcasterUser(data.user)
  } catch (error) {
    console.error('Error fetching Farcaster user:', error)
    return null
  }
}

export async function getFarcasterUserByUsername(
  username: string
): Promise<FarcasterUser | null> {
  try {
    const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/user/by_username?username=${username}`, {
      headers: {
        'x-api-key': NEYNAR_API_KEY,
      },
    })

    if (!response.ok) {
      console.error('Error fetching Farcaster user:', response.statusText)
      return null
    }

    const data = (await response.json()) as { user: NeynarUser }
    return convertNeynarUserToFarcasterUser(data.user)
  } catch (error) {
    console.error('Error fetching Farcaster user:', error)
    return null
  }
}

function convertNeynarUserToFarcasterUser(user: NeynarUser): FarcasterUser {
  return {
    fid: user.fid,
    username: user.username,
    displayName: user.display_name,
    pfp: user.pfp_url,
    profile: {
      bio: {
        text: user.profile.bio.text,
      },
    },
    followerCount: user.follower_count,
    followingCount: user.following_count,
  }
}

export async function searchFarcasterUsers(query: string): Promise<FarcasterUser[]> {
  try {
    const response = await fetch(
      `${NEYNAR_BASE_URL}/farcaster/user/search?q=${encodeURIComponent(query)}&limit=10`,
      {
        headers: {
          'x-api-key': NEYNAR_API_KEY,
        },
      }
    )

    if (!response.ok) {
      console.error('Error searching Farcaster users:', response.statusText)
      return []
    }

    const data = (await response.json()) as { result: { users: NeynarUser[] } }
    return data.result.users.map(convertNeynarUserToFarcasterUser)
  } catch (error) {
    console.error('Error searching Farcaster users:', error)
    return []
  }
}

export async function getFarcasterFollowers(fid: number, limit = 100): Promise<FarcasterUser[]> {
  try {
    const response = await fetch(
      `${NEYNAR_BASE_URL}/farcaster/followers?fid=${fid}&limit=${limit}`,
      {
        headers: {
          'x-api-key': NEYNAR_API_KEY,
        },
      }
    )

    if (!response.ok) {
      console.error('Error fetching followers:', response.statusText)
      return []
    }

    const data = (await response.json()) as { result: { users: NeynarUser[] } }
    return data.result.users.map(convertNeynarUserToFarcasterUser)
  } catch (error) {
    console.error('Error fetching followers:', error)
    return []
  }
}

export function encodeFrameMessage(
  buttonIndex: number,
  inputText: string = '',
  fid: number = 0
): string {
  const message = {
    button: buttonIndex,
    input: inputText,
    fid,
  }
  return Buffer.from(JSON.stringify(message)).toString('base64')
}

export function decodeFrameMessage(encoded: string): {
  button?: number
  input?: string
  fid?: number
} {
  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return {}
  }
}

export function generateFarcasterShareUrl(
  domain: string,
  fid: number,
  username: string
): string {
  const text = `I just registered ${domain}.farcaster.celo on Celo mainnet! Check it out and get your own domain. #FarcasterNames #Celo`
  const embedUrl = encodeURIComponent(`https://farcaster-names.example.com?domain=${domain}`)
  return `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${embedUrl}`
}

export function generateOpenSeaUrl(contractAddress: string, tokenId: string): string {
  return `https://opensea.io/assets/celo/${contractAddress}/${tokenId}`
}
