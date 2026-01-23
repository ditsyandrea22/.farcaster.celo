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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 p-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all"></div>
              <Sparkles className="w-6 h-6 text-white relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">Farcaster Names</span>
              <span className="text-xs text-purple-300">powered by Celo</span>
            </div>
          </div>
          <Button
            onClick={onLaunchApp}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
          >
            Launch App
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black text-white leading-tight">
              Welcome to the
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                New Internet
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Register your .farcaster.celo domain and claim your digital identity on Web3. Built on Celo for everyone.
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              onClick={onLaunchApp}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 text-lg px-8 py-6 h-auto"
            >
              Launch App Now
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
            >
              Learn More
            </Button>
          </div>

          {/* Domain Showcase Cards */}
          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {domainShowcases.map((domain, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all hover:bg-white/10 group cursor-pointer"
              >
                <div className="text-sm font-mono text-purple-300 group-hover:text-purple-200 truncate">
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
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to own your digital identity on Web3
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-purple-500/50 transition-all group hover:bg-white/10"
                onMouseEnter={() => setActiveFeature(idx)}
              >
                <div className="p-3 w-fit rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/40 group-hover:to-blue-500/40 transition-all mb-4">
                  <div className="text-purple-300 group-hover:text-purple-200">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Ready to claim your identity?
            </h2>
            <p className="text-gray-400 text-lg">
              Join thousands of builders and creators on Celo. Register your domain today.
            </p>
          </div>

          <Button
            onClick={onLaunchApp}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 text-lg px-12 py-7 h-auto mx-auto"
          >
            Launch App
            <ArrowRight className="w-5 h-5 ml-3" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2026 Farcaster Names. Built on Celo. Your identity. Forever yours.</p>
        </div>
      </footer>
    </div>
  )
}
