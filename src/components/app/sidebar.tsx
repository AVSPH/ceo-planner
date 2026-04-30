'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Heart,
  Eye,
  DollarSign,
  Users,
  Target,
  Star,
  Settings,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/app/wellness', label: 'Wellness', icon: Heart },
  { href: '/app/visibility', label: 'Visibility', icon: Eye },
  { href: '/app/money', label: 'Money', icon: DollarSign },
  { href: '/app/networking', label: 'Networking', icon: Users },
  { href: '/app/vision', label: 'Vision', icon: Target },
  { href: '/app/wins', label: 'Wins', icon: Star },
]

export function Sidebar() {
  const pathname = usePathname()

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
          CEO Planner
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 p-3 pt-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive(href)
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-3">
        <Link
          href="/app/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            isActive('/app/settings')
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
          )}
        >
          <Settings className="size-4 shrink-0" />
          Settings
        </Link>
      </div>
    </aside>
  )
}
