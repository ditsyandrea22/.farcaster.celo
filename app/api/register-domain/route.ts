import { NextRequest, NextResponse } from 'next/server'
import type { RegistrationRequest, TransactionResult } from '@/lib/types'

interface RegisterRequest extends RegistrationRequest {
  walletAddress: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterRequest

    const { domain, bio, socialLinks, farcasterUsername, fid, walletAddress } = body

    if (!domain || !farcasterUsername || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const simulatedHash = `0x${Math.random().toString(16).slice(2)}${Math.random()
      .toString(16)
      .slice(2)}`
    const blockNumber = Math.floor(Math.random() * 1000000) + 20000000

    const result: TransactionResult = {
      hash: simulatedHash,
      blockNumber,
      status: 'success',
      gasUsed: '50000000000000000',
      gasPrice: '250000000000000000',
    }

    const registrationData = {
      domain: `${domain}.farcaster.celo`,
      owner: walletAddress,
      farcasterUsername,
      fid,
      bio,
      socialLinks,
      registeredAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      nftMetadata: {
        name: `${domain}.farcaster.celo`,
        description: 'A Farcaster domain registered on Celo mainnet',
        image: `https://via.placeholder.com/500x500?text=${domain}.farcaster.celo`,
        external_url: `https://opensea.io/assets/celo/${walletAddress}`,
        attributes: [
          {
            trait_type: 'Domain',
            value: `${domain}.farcaster.celo`,
          },
          {
            trait_type: 'Farcaster Username',
            value: farcasterUsername,
          },
          {
            trait_type: 'Farcaster ID',
            value: fid.toString(),
          },
        ],
      },
    }

    return NextResponse.json({
      success: true,
      transaction: result,
      registration: registrationData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error registering domain:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
