import { createConfig, http } from "wagmi";
import { walletConnect } from "wagmi/connectors";
import { celo } from "wagmi/chains";

/**
 * Wagmi config untuk Farcaster Mini App
 * HANYA support Celo mainnet untuk .farcaster.celo domains
 * Menggunakan WalletConnect connector untuk Farcaster built-in wallet
 */
export const wagmiConfig = createConfig({
  chains: [celo],
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "",
      metadata: {
        name: "Farcaster Domain",
        description: "Mint .farcaster.celo domain names on Celo",
        url: typeof window !== 'undefined' ? window.location.origin : "",
        icons: [
          "https://farcaster-celo.vercel.app/logo-512-v2.png",
        ],
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [celo.id]: http(process.env.NEXT_PUBLIC_CELO_RPC_URL || "https://forno.celo.org"),
  },
});