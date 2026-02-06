'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Shield, Users, Globe, Check, Sparkles } from 'lucide-react'
import Image from 'next/image'

interface LandingPageProps {
  onLaunchApp: () => void
}

export function LandingPage({ onLaunchApp }: LandingPageProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Register and manage domains instantly on Celo blockchain',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Decentralized',
      description: 'Your domain ownership stored securely on-chain',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Farcaster Integration',
      description: 'Seamlessly connect with your Farcaster identity',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Web3 Native',
      description: 'Full control with wallet integration and NFT support',
    },
  ]

  const domainShowcases = [
    { name: 'alice.farcaster.celo', status: 'Available' },
    { name: 'builder.farcaster.celo', status: 'Available' },
    { name: 'crypto.farcaster.celo', status: 'Available' },
    { name: 'web3.farcaster.celo', status: 'Available' },
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-md border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="relative w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 p-1.5 sm:p-2 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all"></div>
              <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-white relative z-10" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-base sm:text-lg font-bold text-white truncate">Farcaster Names</span>
              <span className="text-xs text-purple-300 hidden sm:block">powered by Celo</span>
            </div>
          </div>
          <Button
            onClick={onLaunchApp}
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 text-xs sm:text-base h-9 sm:h-auto sm:size-lg flex-shrink-0 px-3 sm:px-6"
          >
            <span className="hidden sm:inline">Launch App</span>
            <span className="sm:hidden">Launch</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 flex-shrink-0" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto text-center space-y-6 sm:space-y-8 animate-fade-in">
          {/* Main Title */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
              Welcome to the
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                New Internet
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Register your .farcaster.celo domain and claim your digital identity on Web3. Built on Celo for everyone.
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-6 sm:pt-8">
            <Button
              onClick={onLaunchApp}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto w-full sm:w-auto"
            >
              Launch App Now
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 sm:ml-3" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>

          {/* Domain Showcase Cards */}
          <div className="pt-12 sm:pt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {domainShowcases.map((domain, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all hover:bg-white/10 group cursor-pointer"
              >
                <div className="text-xs sm:text-sm font-mono text-purple-300 group-hover:text-purple-200 truncate">
                  {domain.name}
                </div>
                <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {domain.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Everything you need to own your digital identity on Web3
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-purple-500/50 transition-all group hover:bg-white/10"
                onMouseEnter={() => setActiveFeature(idx)}
              >
                <div className="p-2 sm:p-3 w-fit rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/40 group-hover:to-blue-500/40 transition-all mb-3 sm:mb-4">
                  <div className="text-purple-300 group-hover:text-purple-200 text-4 sm:text-6">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4">
              Ready to claim your identity?
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              Join thousands of builders and creators on Celo. Register your domain today.
            </p>
          </div>

          <Button
            onClick={onLaunchApp}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 text-base sm:text-lg px-8 sm:px-12 py-5 sm:py-7 h-auto mx-auto w-full sm:w-auto"
          >
            Launch App
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 sm:ml-3" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-xs sm:text-sm">
          <p>© 2026 Farcaster Names. Built on Celo. Your identity. Forever yours.</p>
        </div>
      </footer>
    </div>
  )
}
