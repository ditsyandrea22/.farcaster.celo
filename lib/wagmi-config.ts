import { createConfig, http } from "wagmi";
import { walletConnect } from "wagmi/connectors";
import { mainnet, base, optimism, celo } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [mainnet, base, optimism, celo],
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
      showQrModal: false, // WAJIB untuk mobile Farcaster Mini App
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [celo.id]: http(),
  },
});