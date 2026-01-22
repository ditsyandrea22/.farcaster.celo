import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Farcaster Names - .celo Domain Registry',
  description: 'Register and manage .farcaster.celo domain names with NFT functionality on Celo mainnet',
  generator: 'app',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo-192.png',
    apple: '/logo-512.png',
  },
  openGraph: {
    title: 'Farcaster Names - .celo Domain Registry',
    description: 'Register and manage .farcaster.celo domain names with NFT functionality on Celo mainnet',
    images: ['/logo-512.png'],
  },
  metadataBase: new URL('https://farcaster-names.example.com'),
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://farcaster-names.example.com/frame',
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:post_url': 'https://farcaster-names.example.com/api/frame',
    'fc:frame:button:1': 'Get Started',
    'fc:frame:button:1:action': 'post',
    'fc:frame:button:2': 'Register Domain',
    'fc:frame:button:2:action': 'post',
    'fc:frame:button:3': 'My Domains',
    'fc:frame:button:3:action': 'post',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
