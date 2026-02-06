import { createConfig, http } from "wagmi";
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";
import { celo, mainnet, base } from "wagmi/chains";

/**
 * Dynamic import untuk Farcaster Mini App Connector
 * Hanya tersedia di mini app environment
 */
let farcasterMiniAppConnector: any = null;
try {
  const module = require("@farcaster/miniapp-wagmi-connector");
  if (module?.farcasterMiniApp) {
    farcasterMiniAppConnector = module.farcasterMiniApp();
  }
} catch (e) {
  // Connector tidak tersedia (OK - fallback ke injected)
}

/**
 * Wagmi config untuk Farcaster Mini App
 * Support multiple chains (user bisa terhubung dari berbagai chain)
 * Tapi user harus switch ke Celo untuk mint .farcaster.celo domains
 * Menggunakan multiple connectors dengan prioritas khusus untuk mini app
 */
const baseConnectors = [
  // Prioritas 1: Farcaster Mini App Connector (jika tersedia)
  // Ini adalah connector resmi untuk Farcaster mini apps
  ...(farcasterMiniAppConnector ? [farcasterMiniAppConnector] : []),
  
  // Prioritas 2: Injected wallet (window.ethereum) - untuk Farcaster Mini App
  // Ini HARUS tinggi di list untuk mini app context karena wallet ter-expose melalui window.ethereum
  injected({
    target: undefined, // Accept all injected wallets (MetaMask, Coinbase, Trust Wallet, dll)
    shimDisconnect: true,
  }),
  
  // Prioritas 3: Coinbase Wallet (fallback)
  coinbaseWallet({
    appName: "Farcaster Domain",
    appLogoUrl: "https://farcaster-celo.vercel.app/logo-512-v2.png",
  }),
  
  // Prioritas 4: WalletConnect (untuk desktop atau jika tidak ada injected)
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
    qrModalOptions: {
      themeMode: 'dark',
    },
    // Mark chains as fresh to avoid unnecessary reconnections
    isNewChainsStale: false,
  }),
];

export const wagmiConfig = createConfig({
  chains: [celo, mainnet, base],
  connectors: baseConnectors,
  transports: {
    [celo.id]: http(process.env.NEXT_PUBLIC_CELO_RPC_URL || "https://forno.celo.org"),
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});