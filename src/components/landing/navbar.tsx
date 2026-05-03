import Link from 'next/link'
import { Button } from '@/components/animate-ui/components/buttons/button'
import { Zap } from 'lucide-react'

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all">
            <Zap className="size-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-gray-900">CEO Planner</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
