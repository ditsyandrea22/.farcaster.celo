import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'
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

    // Validate wallet address
    if (!ethers.isAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      )
    }

    // Real smart contract call would happen here
    // This is a placeholder for actual transaction
    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CELO_CONTRACT_ADDRESS || ''
    
    if (!CONTRACT_ADDRESS) {
      return NextResponse.json(
        { error: 'Contract not configured' },
        { status: 500 }
      )
    }

    // For now, prepare the transaction data structure
    // Actual transaction signing happens on client with wallet
    const fullDomain = `${domain}.farcaster.celo`
    const metadataURI = `/api/metadata/${domain}`

    // These values would be returned from actual blockchain transaction
    const mockResult: TransactionResult = {
      hash: `0x${'0'.repeat(64)}`, // Placeholder - replace with actual tx hash
      blockNumber: 0, // Placeholder
      status: 'pending',
      gasUsed: '0',
      gasPrice: '0',
    }

    const registrationData = {
      domain: fullDomain,
      owner: walletAddress,
      farcasterUsername,
      fid,
      bio,
      socialLinks,
      registeredAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      metadataURI,
      nftMetadata: {
        name: fullDomain,
        description: `Farcaster domain ${fullDomain} on Celo mainnet`,
        external_url: `https://opensea.io/collection/farcaster-celo-domains`,
        attributes: [
          {
            trait_type: 'Domain',
            value: fullDomain,
          },
          {
            trait_type: 'Farcaster Username',
            value: farcasterUsername,
          },
          {
            trait_type: 'Farcaster ID',
            value: fid.toString(),
          },
          {
            trait_type: 'Owner',
            value: walletAddress,
          },
        ],
      },
    }

    return NextResponse.json({
      success: true,
      transaction: mockResult,
      registration: registrationData,
      contractAddress: CONTRACT_ADDRESS,
      timestamp: new Date().toISOString(),
      message: 'Prepare to sign transaction with your wallet',
    })
  } catch (error) {
    console.error('Error preparing domain registration:', error)
    return NextResponse.json(
      { error: 'Registration preparation failed' },
      { status: 500 }
    )
  }
}
