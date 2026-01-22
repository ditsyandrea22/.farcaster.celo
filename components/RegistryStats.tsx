'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { BarChart3, Users, Globe, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Stat {
  label: string
  value: string
  icon: React.ReactNode
  change?: string
}

export function RegistryStats() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats([
        {
          label: 'Total Domains',
          value: '12,458',
          icon: <Globe className="w-5 h-5" />,
          change: '+245 today',
        },
        {
          label: 'Active Users',
          value: '3,847',
          icon: <Users className="w-5 h-5" />,
          change: '+18% this week',
        },
        {
          label: 'Total Value',
          value: '1,234 CELO',
          icon: <Zap className="w-5 h-5" />,
          change: '~$3,102 USD',
        },
        {
          label: 'Avg. Price',
          value: '0.25 CELO',
          icon: <BarChart3 className="w-5 h-5" />,
          change: 'Stable',
        },
      ])
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className="p-4 border-border/50 hover:border-primary/50 transition-colors group cursor-pointer"
          style={{
            animation: `fadeInUp 0.5s ease-out ${index * 100}ms both`,
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </p>
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                {stat.icon}
              </div>
            </div>

            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              {stat.change && (
                <p className="text-xs text-accent mt-1">{stat.change}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
