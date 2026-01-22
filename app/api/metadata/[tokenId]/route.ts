import { NextRequest, NextResponse } from 'next/server'
import type { NFTMetadata } from '@/lib/types'

const MOCK_DOMAINS: { [key: string]: NFTMetadata } = {
  '1': {
    name: 'alice.farcaster.celo',
    description: 'A Farcaster domain registered on Celo mainnet',
    image: 'https://via.placeholder.com/500x500?text=alice.farcaster.celo',
    external_url: 'https://opensea.io/assets/celo/0x0000/1',
    attributes: [
      {
        trait_type: 'Domain',
        value: 'alice.farcaster.celo',
      },
      {
        trait_type: 'Registration Year',
        value: '2024',
      },
      {
        trait_type: 'Status',
        value: 'Active',
      },
    ],
    domain_owner: '0x1234567890123456789012345678901234567890',
    farcaster_username: 'alice',
    expires_at: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
  },
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tokenId: string }>
  }
) {
  try {
    const { tokenId } = await params

    const metadata =
      MOCK_DOMAINS[tokenId] ||
      ({
        name: `Token #${tokenId}`,
        description: 'A Farcaster domain registered on Celo mainnet',
        image: `https://via.placeholder.com/500x500?text=Token+${tokenId}`,
        external_url: `https://opensea.io/assets/celo/0x0000/${tokenId}`,
        attributes: [
          {
            trait_type: 'Token ID',
            value: tokenId,
          },
        ],
        domain_owner: '0x0000000000000000000000000000000000000000',
        expires_at: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
      } as NFTMetadata)

    return NextResponse.json(metadata, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
