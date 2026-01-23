'use client'

import { useState } from 'react'
import { LandingPage } from '@/components/LandingPage'
import { MintPage } from '@/components/MintPage'

export default function Home() {
  const [showMintPage, setShowMintPage] = useState(false)

  return showMintPage ? (
    <MintPage onBack={() => setShowMintPage(false)} />
  ) : (
    <LandingPage onLaunchApp={() => setShowMintPage(true)} />
  )
}
