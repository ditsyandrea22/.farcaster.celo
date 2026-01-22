import { NextRequest, NextResponse } from 'next/server'
import { estimateRegistrationCost } from '@/lib/blockchain'

export async function GET(request: NextRequest) {
  try {
    const gasEstimate = await estimateRegistrationCost()

    return NextResponse.json({
      ...gasEstimate,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error estimating gas:', error)

    return NextResponse.json(
      {
        gasEstimate: '50000000000000000',
        gasPrice: '250000000000000000',
        totalCostWei: '12500000000000000000',
        totalCostCELO: '12.5',
        totalCostUSD: '0.25',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  }
}
