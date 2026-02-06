'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Check, Zap, Shield, Users, Globe, Sparkles, BookOpen, Wallet, Rocket, Github } from 'lucide-react'

interface LearnMorePageProps {
  onBack: () => void
}

export function LearnMorePage({ onBack }: LearnMorePageProps) {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast Transactions',
      description: 'Register and manage domains instantly on the Celo blockchain with minimal gas fees and instant confirmation times.',
      details: [
        'Sub-second domain registration',
        'Ultra-low transaction costs',
        'High throughput processing',
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Decentralized',
      description: 'Your domain ownership is stored securely on-chain. Complete control with no intermediaries or central authorities.',
      details: [
        'Immutable domain records',
        'Decentralized ownership verification',
        'Full wallet control',
        'Transparent smart contracts',
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Farcaster Integration',
      description: 'Seamlessly connect your .farcaster.celo domain with your Farcaster identity and social profile.',
      details: [
        'One-click Farcaster connection',
        'Unified digital identity',
        'Cross-platform compatibility',
      ]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Web3 Native',
      description: 'Full Web3 capabilities including NFT support, wallet integration, and complete decentralized control.',
      details: [
        'Multi-wallet support',
        'NFT integration',
        'DeFi compatibility',
        'Smart contract enabled',
      ]
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: 'Multi-Wallet Support',
      description: 'Connect with any Ethereum-compatible wallet. Manage your domains with the wallet of your choice.',
      details: [
        'MetaMask, WalletConnect, and more',
        'Ledger and hardware wallet support',
        'Session management',
        'Secure transaction signing',
      ]
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Future-Ready Platform',
      description: 'Built on the latest Web3 technologies and ready for the future of decentralized identity.',
      details: [
        'Upgradeable smart contracts',
        'Community governance ready',
        'Scalable architecture',
      ]
    },
  ]

  const benefits = [
    'Own your digital identity permanently',
    'Build your Web3 reputation',
    'Connect with Farcaster community',
    'Full control over your data',
    'Transparent and verifiable ownership',
    'No annual fees or renewals',
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Connect Your Wallet',
      description: 'Link your Ethereum-compatible wallet (MetaMask, WalletConnect, etc.) to get started.',
    },
    {
      step: 2,
      title: 'Search Available Domains',
      description: 'Browse and search for your desired .farcaster.celo domain names. Check availability in real-time.',
    },
    {
      step: 3,
      title: 'Register Your Domain',
      description: 'Confirm your selection and complete the registration in one transaction on Celo blockchain.',
    },
    {
      step: 4,
      title: 'Manage & Connect',
      description: 'Manage your domain, connect with Farcaster, and showcase your digital identity to the world.',
    },
  ]

  const useCases = [
    {
      title: 'Farcaster Users',
      description: 'Secure your unique identity on Farcaster with a branded .farcaster.celo domain.',
      icon: ''
    },
    {
      title: 'Content Creators',
      description: 'Build your Web3 brand and monetize your content with your own domain.',
      icon: ''
    },
    {
      title: 'Developers',
      description: 'Use domains for dApp registration, smart contract identification, and Web3 services.',
      icon: ''
    },
    {
      title: 'Traders & Investors',
      description: 'Establish credibility and reputation in the DeFi community.',
      icon: ''
    },
    {
      title: 'Businesses',
      description: 'Create decentralized business identities and accept Web3 payments.',
      icon: ''
    },
    {
      title: 'Communities',
      description: 'Build community-owned namespaces and shared digital identities.',
      icon: ''
    },
  ]

  const techStack = [
    { category: 'Blockchain', tech: 'Celo Network' },
    { category: 'Smart Contracts', tech: 'Solidity' },
    { category: 'Frontend', tech: 'Next.js 15, React 19' },
    { category: 'Wallet Integration', tech: 'Wagmi, Web3Modal' },
    { category: 'Social Integration', tech: 'Farcaster SDK' },
    { category: 'Data Layer', tech: 'IPFS, GraphQL' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 p-2 flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">Farcaster Names</span>
              <span className="text-xs text-purple-300">powered by Celo</span>
            </div>
          </div>
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero Section */}
        <section className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6">
            Everything About
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Farcaster Names
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Learn how to register, manage, and leverage your .farcaster.celo domain to build your Web3 identity on the Celo blockchain.
          </p>
        </section>

        {/* What is Farcaster Names */}
        <section className="mb-16 sm:mb-20 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-400" />
            What is Farcaster Names?
          </h2>
          <div className="space-y-4 text-gray-300 text-base sm:text-lg leading-relaxed">
            <p>
              <strong className="text-white">Farcaster Names</strong> is a decentralized domain registration platform built on the Celo blockchain. It allows anyone to register a unique .farcaster.celo domain and claim their digital identity in the Web3 ecosystem.
            </p>
            <p>
              Unlike traditional domain registrars, Farcaster Names puts you in complete control. Your domain ownership is recorded on-chain, making it immutable, transparent, and permanently yours. No central authority can take it away or censor your identity.
            </p>
            <p>
              The platform is deeply integrated with Farcaster, a decentralized social network, allowing you to connect your domain with your Farcaster profile and build your reputation in the community.
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12 text-center">
            Key Features & Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-purple-500/50 transition-all group hover:bg-white/10"
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/40 group-hover:to-blue-500/40 transition-all flex-shrink-0">
                    <div className="text-purple-300 group-hover:text-purple-200">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    {feature.details && (
                      <ul className="space-y-2">
                        {feature.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300 text-xs sm:text-sm">
                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            {howItWorks.map((item, idx) => (
              <div key={idx} className="relative">
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(100%+1.5rem)] w-12 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
                )}
                <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-lg mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 text-center">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm text-center">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16 sm:mb-20 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
            Why Use Farcaster Names?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 sm:gap-4 p-4">
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300 text-sm sm:text-base">{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12 text-center">
            Who Should Use This?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {useCases.map((useCase, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-purple-500/50 transition-all group hover:bg-white/10 text-center"
              >
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                  {useCase.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16 sm:mb-20 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all">
                <p className="text-purple-300 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">
                  {item.category}
                </p>
                <p className="text-white text-base sm:text-lg font-bold">
                  {item.tech}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Security Section */}
        <section className="mb-16 sm:mb-20 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" />
            Security & Trust
          </h2>
          <div className="space-y-4 text-gray-300 text-base sm:text-lg leading-relaxed">
            <p>
              <strong className="text-white">Blockchain Verified:</strong> All domain registrations are recorded on the Celo blockchain, making them immutable and publicly verifiable.
            </p>
            <p>
              <strong className="text-white">Non-Custodial:</strong> You maintain full control of your domains through your own wallet. We never have access to your private keys or funds.
            </p>
            <p>
              <strong className="text-white">Smart Contract Security:</strong> Our smart contracts are designed following industry best practices and are continuously audited for security.
            </p>
            <p>
              <strong className="text-white">Transparent Fees:</strong> All costs are clearly visible before you complete any transaction. No hidden fees or surprise charges.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                q: 'How much does it cost to register a domain?',
                a: 'Costs vary based on domain name and current Celo gas prices. Typical registration costs between $1-10 USD. You\'ll see the exact price before confirming your transaction.'
              },
              {
                q: 'Can I sell or transfer my domain?',
                a: 'Yes! As an NFT on the Celo blockchain, your domain can be transferred to other wallets or sold on secondary markets.'
              },
              {
                q: 'Do I need to renew my domain?',
                a: 'No! Unlike traditional domains, your .farcaster.celo domain is permanent. Once registered, it\'s yours forever with no annual renewal fees.'
              },
              {
                q: 'What if my desired domain is taken?',
                a: 'You can search for alternatives, use subdomains, or contact the domain holder for potential negotiation.'
              },
              {
                q: 'Which wallets are supported?',
                a: 'Any Ethereum-compatible wallet works, including MetaMask, WalletConnect, Ledger, Coinbase Wallet, and many others.'
              },
              {
                q: 'How does this connect with Farcaster?',
                a: 'Your domain is displayed on your Farcaster profile and serves as your verified Web3 identity on the platform.'
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 sm:py-16 px-4 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Claim Your Digital Identity?
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of Web3 builders and claim your unique .farcaster.celo domain today.
          </p>
          <Button
            onClick={onBack}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 text-base sm:text-lg px-8 sm:px-12 py-5 sm:py-7 h-auto"
          >
            Launch App
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 ml-2 sm:ml-3 rotate-180" />
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 sm:py-12 px-4 sm:px-6 mt-16 sm:mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
            <div className="text-center text-gray-400 text-xs sm:text-sm">
              <p>© 2026 Farcaster Names. Built on Celo. Your identity. Forever yours.</p>
            </div>
            <a
              href="https://github.com/ditsyandrea22/.farcaster.celo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-purple-500/50 hover:bg-white/10 transition-all text-xs sm:text-sm"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
