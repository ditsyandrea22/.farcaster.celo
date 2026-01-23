'use client'

import React from "react"
import dynamic from "next/dynamic"
import { ReactQueryProvider } from "@/components/react-query-provider"

// Dynamically import WalletProvider and FarcasterSDKProvider with ssr: false
// to avoid bundling pino during server-side rendering
const WalletProvider = dynamic(() => import("@/components/wallet-provider").then(mod => ({ default: mod.WalletProvider })), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

const FarcasterSDKProvider = dynamic(() => import("@/components/farcaster-sdk-provider").then(mod => ({ default: mod.FarcasterSDKProvider })), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

interface ClientProvidersProps {
  children: React.ReactNode
}

/**
 * Client-side providers wrapper untuk avoid server-side bundling of client dependencies
 */
export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ReactQueryProvider>
      <WalletProvider>
        <FarcasterSDKProvider>
          {children}
        </FarcasterSDKProvider>
      </WalletProvider>
    </ReactQueryProvider>
  )
}
