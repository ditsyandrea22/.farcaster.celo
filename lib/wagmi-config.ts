import { createConfig, http } from "wagmi";
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";
import { celo } from "wagmi/chains";

/**
 * Wagmi config untuk Farcaster Mini App
 * HANYA support Celo mainnet untuk .farcaster.celo domains
 * Menggunakan multiple connectors: Injected (built-in), WalletConnect, dan Coinbase
 */
export const wagmiConfig = createConfig({
  chains: [celo],
  connectors: [
    // Prioritas 1: Injected wallet (MetaMask, Coinbase Wallet, dll di Farcaster Mini App)
    injected({
      target: 'metaMask',
    }),
    // Prioritas 2: WalletConnect dengan konfigurasi yang lebih robust
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
      showQrModal: false, // Disable QR modal di mini app context
      qrModalOptions: {
        themeMode: 'dark',
      },
      // Mark chains as fresh to avoid unnecessary reconnections
      isNewChainsStale: false,
    }),
    // Prioritas 3: Coinbase Wallet
    coinbaseWallet({
      appName: "Farcaster Domain",
      appLogoUrl: "https://farcaster-celo.vercel.app/logo-512-v2.png",
    }),
  ],
  transports: {
    [celo.id]: http(process.env.NEXT_PUBLIC_CELO_RPC_URL || "https://forno.celo.org"),
  },
});