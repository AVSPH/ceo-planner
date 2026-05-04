import Link from 'next/link'
import { CheckSquare, DollarSign, Eye, Target } from 'lucide-react'

const SHORTCUTS = [
  {
    href: '/app/tasks',
    label: 'Tasks',
    Icon: CheckSquare,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
  },
  {
    href: '/app/vision',
    label: 'Vision',
    Icon: Target,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
  },
  {
    href: '/app/money',
    label: 'Money',
    Icon: DollarSign,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    href: '/app/visibility',
    label: 'Visibility',
    Icon: Eye,
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
  },
] as const

export function QuickShortcuts() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {SHORTCUTS.map(({ href, label, Icon, color, bg }) => (
        <Link
          key={href}
          href={href}
          className="rounded-xl border bg-card p-3 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors"
        >
          <div className={`rounded-lg p-2 ${bg}`}>
            <Icon className={`size-4 ${color}`} />
          </div>
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        </Link>
      ))}
    </div>
  )
}
