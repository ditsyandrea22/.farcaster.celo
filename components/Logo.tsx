import Image from 'next/image'

export function Logo() {
  return (
    <div className="flex items-center gap-4 animate-fade-in-down">
      <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
        <Image
          src="/logo-192-v2.png"
          alt="Farcaster Names Logo"
          width={48}
          height={48}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-black gradient-text">Farcaster Names</h1>
          <span className="text-xs font-semibold text-accent tracking-wider">BETA</span>
        </div>
        <p className="text-xs text-muted-foreground font-medium">Your identity. On Celo. Forever yours.</p>
      </div>
    </div>
  )
}
