'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { CheckSquare, Eye, DollarSign, Target, BarChart2, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LayoutDashboard } from '@/components/animate-ui/icons/layout-dashboard'

type NavItem = {
  href: string
  label: string
  renderIcon: (hovered: boolean) => React.ReactNode
}

function lucideIcon(Icon: React.ElementType) {
  return (hovered: boolean) => (
    <motion.span
      animate={{ scale: hovered ? 1.2 : 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="inline-flex shrink-0"
    >
      <Icon className="size-5" />
    </motion.span>
  )
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/app/dashboard',
    label: 'Today',
    renderIcon: (hovered) => (
      <LayoutDashboard animate={hovered} className="size-5 shrink-0" />
    ),
  },
  { href: '/app/tasks',      label: 'Tasks',      renderIcon: lucideIcon(CheckSquare) },
  { href: '/app/money',      label: 'Money',      renderIcon: lucideIcon(DollarSign) },
  { href: '/app/visibility', label: 'Visibility', renderIcon: lucideIcon(Eye) },
  { href: '/app/vision',     label: 'Vision',     renderIcon: lucideIcon(Target) },
  { href: '/app/insights',   label: 'Insights',   renderIcon: lucideIcon(BarChart2) },
]

function NavLink({ href, label, renderIcon }: NavItem) {
  const pathname = usePathname()
  const [hovered, setHovered] = useState(false)
  const active = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
      )}
    >
      {renderIcon(hovered)}
      {label}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [settingsHovered, setSettingsHovered] = useState(false)

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
          CEO Planner
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 p-3 pt-4">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>

      <div className="border-t p-3">
        <Link
          href="/app/settings"
          onMouseEnter={() => setSettingsHovered(true)}
          onMouseLeave={() => setSettingsHovered(false)}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            pathname === '/app/settings' || pathname.startsWith('/app/settings/')
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
          )}
        >
          <motion.span
            animate={{ scale: settingsHovered ? 1.2 : 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="inline-flex shrink-0"
          >
            <Settings className="size-5" />
          </motion.span>
          Settings
        </Link>
      </div>
    </aside>
  )
}
