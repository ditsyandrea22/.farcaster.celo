/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mini App specific configuration
  reactStrictMode: true,
  
  // TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Image optimization for Mini Apps
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Headers for Mini App security and sharing
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=10, stale-while-revalidate=59',
          },
        ],
      },
      {
        source: '/:path*/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ]
  },
  
  // Redirects for Mini App discovery
  redirects: async () => {
    return [
      {
        source: '/index.json',
        destination: '/manifest.json',
        permanent: true,
      },
    ]
  },
  
  // Rewrites for API routes
  rewrites: async () => {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // Production optimizations
  productionBrowserSourceMaps: false,
  compress: true,
  
  // Experimental features
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'lucide-react',
    ],
  },

  // Webpack configuration untuk handle problematic dependencies
  webpack: (config, { isServer, dev }) => {
    // Create a stub file to avoid pino bundling
    config.resolve.alias = {
      ...config.resolve.alias,
      pino: false,
      'thread-stream': false,
      'sonic-boom': false,
    }

    if (isServer) {
      // Externalize pino for server since we don't use it in SSR
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push(
          'pino',
          'thread-stream',
          'sonic-boom',
        )
      }
    } else {
      // Client-side fallback for modules that don't exist
      config.resolve.fallback = {
        ...config.resolve.fallback,
        pino: false,
        'thread-stream': false,
        'sonic-boom': false,
        'desm': false,
        'fastbench': false,
        'tap': false,
        'tape': false,
        'why-is-node-running': false,
      }
    }
    
    return config
  },

  // Add turbopack config to suppress Turbopack + webpack warning
  // The webpack config handles problematic dependencies, turbopack will be skipped
  turbopack: {},
}

export default nextConfig
