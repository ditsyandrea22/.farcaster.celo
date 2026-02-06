'use client'

import { useState } from 'react'
import { LandingPage } from '@/components/LandingPage'
import { MintPage } from '@/components/MintPage'
import { LearnMorePage } from '@/components/LearnMorePage'

export default function Home() {
  const [showMintPage, setShowMintPage] = useState(false)
  const [showLearnMore, setShowLearnMore] = useState(false)

  if (showLearnMore) {
    return <LearnMorePage onBack={() => setShowLearnMore(false)} />
  }

  return showMintPage ? (
    <MintPage onBack={() => setShowMintPage(false)} />
  ) : (
    <LandingPage onLaunchApp={() => setShowMintPage(true)} onLearnMore={() => setShowLearnMore(true)} />
  )
}
