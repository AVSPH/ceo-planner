'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, DollarSign, Eye, Target, BarChart2, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dock, DockIcon } from '@/components/ui/dock'
import {
  Tooltip, TooltipTrigger, TooltipContent,
} from '@/components/animate-ui/components/radix/tooltip'

const NAV = [
  { href: '/app/dashboard',  label: 'Today',      Icon: Home },
  { href: '/app/tasks',      label: 'Tasks',      Icon: CheckSquare },
  { href: '/app/money',      label: 'Money',      Icon: DollarSign },
  { href: '/app/visibility', label: 'Visibility', Icon: Eye },
  { href: '/app/vision',     label: 'Vision',     Icon: Target },
  { href: '/app/insights',   label: 'Insights',   Icon: BarChart2 },
  { href: '/app/settings',   label: 'Settings',   Icon: Settings },
]

export function AppDock() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
      <Dock className="mt-0 shadow-lg">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <DockIcon
              key={href}
              className={cn(active && 'bg-primary/15 dark:bg-primary/20')}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className="flex items-center justify-center w-full h-full"
                    aria-label={label}
                  >
                    <Icon
                      className={cn(
                        'size-5 transition-colors',
                        active ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8}>
                  {label}
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          )
        })}
      </Dock>
    </div>
  )
}
