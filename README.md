# Farcaster Names - .celo Domain Registry

A comprehensive Farcaster mini app for registering and managing .farcaster.celo domain names with NFT functionality on Celo mainnet.

## Features

- **Auto-Connect Wallet**: Automatically connects wallet on page load
- **Auto-Fetch FID**: Reads FID from Neynar API automatically when wallet connects
- **Auto-Generate Domain**: Domain names auto-generated from Farcaster username or FID
- **Domain Registration**: Search, claim, and register .farcaster.celo domains
- **NFT Minting**: Real blockchain transactions with wallet popup for on-chain minting
- **OpenSea Integration**: View and trade your domain NFTs on OpenSea
- **Real Blockchain Data**: Uses actual Celo mainnet transactions and Neynar API data
- **Gas Estimation**: Real-time gas price display and cost estimation
- **Farcaster Integration**: Full frame wallet support for transactions
- **Profile Management**: Store bio and social links in NFT metadata

## Tech Stack

- **Frontend**: Next.js 16 with React 19
- **Blockchain**: Celo Mainnet (42220)
- **Data**: Neynar API for Farcaster data
- **Styling**: Tailwind CSS v4 with custom animations
- **Smart Contracts**: ENS-pattern registry contract
- **NFT Metadata**: IPFS-compatible format for OpenSea

## Getting Started

### Prerequisites

- Node.js 18+
- Farcaster frame wallet
- Celo mainnet RPC access
- Neynar API key

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd farcaster-names

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
# Farcaster
NEXT_PUBLIC_FARCASTER_FRAME_URL=https://your-domain.com
FARCASTER_HUB_URL=https://hub-api.neynar.com
NEYNAR_API_KEY=your_neynar_api_key
NEXT_PUBLIC_NEYNAR_API_KEY=your_neynar_api_key

# Celo Blockchain
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_CELO_CHAIN_ID=42220
NEXT_PUBLIC_CELO_CONTRACT_ADDRESS=0x...

# NFT & Metadata
NEXT_PUBLIC_NFT_METADATA_BASE_URL=https://your-domain.com/api/metadata
NEXT_PUBLIC_OPENSEA_URL=https://opensea.io/collection/farcaster-names
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Gas & Fees
NEXT_PUBLIC_GAS_PRICE_GWEI=1
NEXT_PUBLIC_REGISTRATION_FEE_USD=0.25
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### 1. Wallet Connection & FID Auto-Fetch
- User visits the app and connects their Farcaster frame wallet
- System automatically reads FID from Neynar API
- Wallet address is automatically set for transactions

### 2. Auto-Domain Generation
- Domain name is automatically generated from:
  - Farcaster username (sanitized)
  - Fallback to FID-based domain (e.g., `fid123`)
- User can customize the domain before registration

### 3. Registration Flow
- Fill in bio and optional social links
- System validates all data
- Prepare transaction with NFT metadata

### 4. Minting with Wallet Popup
- Click "Sign & Mint NFT" button
- Wallet popup appears for transaction confirmation
- Sign transaction with your frame wallet
- Real blockchain transaction on Celo mainnet
- NFT automatically available on OpenSea

## New Files & Components

### Services
- **`lib/neynar-service.ts`**: Comprehensive Neynar API integration
- **`lib/minting-service.ts`**: Real blockchain minting transactions
- **`lib/domain-generator.ts`**: Domain name generation and validation

### Hooks
- **`hooks/use-farcaster-auto-mint.ts`**: Auto-connect and FID fetching hook

### Components
- **`components/MintTransactionHandler.tsx`**: Real transaction handler with wallet popup
- **Updated `components/RegistrationForm.tsx`**: Auto-fill FID and domain
- **Updated `components/WalletStatus.tsx`**: Auto-fetch Farcaster data

## Project Structure

```
├── app/
│   ├── api/              # API routes for blockchain and Farcaster
│   ├── frame.tsx         # Frame metadata generation
│   ├── layout.tsx        # Root layout with metadata
│   ├── globals.css       # Global styles and animations
│   └── page.tsx          # Main page
├── components/
│   ├── DomainSearch.tsx  # Domain availability search
│   ├── RegistrationForm.tsx # Auto-fill registration form
│   ├── MintTransactionHandler.tsx # Real minting with wallet popup
│   ├── NFTGallery.tsx    # NFT display gallery
│   ├── WalletStatus.tsx  # Auto-connect wallet & FID fetch
│   └── Logo.tsx          # App logo
├── hooks/
│   └── use-farcaster-auto-mint.ts # Auto-mint hook
├── lib/
│   ├── types.ts          # TypeScript interfaces
│   ├── blockchain.ts     # Celo blockchain utilities
│   ├── farcaster.ts      # Farcaster utilities
│   ├── neynar-service.ts # Neynar API service
│   ├── minting-service.ts # Real minting service
│   └── domain-generator.ts # Domain generation
├── public/
│   ├── manifest.json     # PWA manifest
│   ├── farcaster.json    # Farcaster frame config
│   └── NameRegistry.json # Smart contract ABI
└── env.example           # Environment template
```

## API Routes

### `GET /api/check-domain`
Check domain availability
- Query: `domain` (string)
- Returns: `{ domain, available, fullDomain, timestamp }`

### `GET /api/gas-estimate`
Get real-time gas estimation
- Returns: `{ gasEstimate, gasPrice, totalCostWei, totalCostCELO, totalCostUSD }`

### `GET /api/farcaster-user`
Fetch Farcaster user data
- Query: `fid` or `username`
- Returns: Farcaster user profile from Neynar

### `GET /api/metadata/[tokenId]`
NFT metadata for OpenSea
- Params: `tokenId`
- Returns: Standard ERC-721 metadata

## Smart Contract

The registry uses an ENS-pattern contract with:
- Domain registration with annual expiration
- NFT minting on registration
- Metadata storage (bio, social links)
- Owner-based domain lookup
- Domain availability checking

See `/public/NameRegistry.json` for ABI.

## Animations

Custom animations included:
- `animate-fade-in-up` - Fade in with upward movement
- `animate-fade-in-down` - Fade in with downward movement
- `animate-scale-in` - Scale in from smaller size
- `animate-slide-in-right` - Slide in from right
- `animate-pulse-glow` - Pulsing glow effect

## Styling

- **Colors**: Dark theme with Farcaster purple (#8A63D2) and Celo green (#35C759)
- **Typography**: Geist font family
- **Layout**: Flexbox-first, mobile-responsive design
- **Components**: shadcn/ui with custom overrides

## Farcaster Frame Integration

The app works as a Farcaster frame with:
- Frame wallet connection
- Button-based interactions
- Share-to-Warpcast functionality
- OpenGraph previews

## OpenSea Integration

NFTs are displayed on OpenSea with:
- Metadata URI pointing to `/api/metadata/[tokenId]`
- Domain-specific image generation
- Farcaster username and bio attributes
- Social links in metadata

## Development Notes

### Adding Real Smart Contract

1. Deploy registry contract to Celo mainnet
2. Update `NEXT_PUBLIC_CELO_CONTRACT_ADDRESS`
3. Update ABI in `/public/NameRegistry.json`
4. Implement contract interaction in `lib/blockchain.ts`

### Enabling IPFS Metadata

1. Set up Pinata or web3.storage API key
2. Update metadata API to upload JSON to IPFS
3. Update OpenSea URL generation to use IPFS CIDs

### Custom Domain TLD

1. Modify domain validation in `lib/blockchain.ts`
2. Update registry contract ABI
3. Update TLD in UI components

## Testing

Currently uses mock data for:
- Domain availability (predefined unavailable domains)
- Wallet connection (generates mock address)
- NFT gallery (hardcoded mock NFTs)
- Gas estimation (fixed values)

For production, implement real contract calls using web3.js or ethers.js.

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy
```

The app is optimized for Vercel's deployment:
- Serverless API routes
- Static optimization
- Edge caching
- Streaming support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

For issues and questions:
- GitHub Issues: [project-repo/issues]
- Farcaster: @farcaster-names
- Discord: [community-server]

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Components from [shadcn/ui](https://ui.shadcn.com/)
- Farcaster data via [Neynar API](https://neynar.com/)
- Blockchain: [Celo Network](https://celo.org/)
- NFT Standard: [ERC-721](https://eips.ethereum.org/EIPS/eip-721)
