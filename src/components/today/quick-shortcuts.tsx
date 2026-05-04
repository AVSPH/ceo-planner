import Link from 'next/link'
import { CheckSquare, DollarSign, Eye, Target } from 'lucide-react'

const SHORTCUTS = [
  {
    href: '/app/tasks',
    label: 'Tasks',
    Icon: CheckSquare,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    border: 'border-blue-200/60 dark:border-blue-500/20 hover:border-blue-400/50 dark:hover:border-blue-400/50 hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10',
    hover: 'hover:bg-blue-50/60 dark:hover:bg-blue-500/5',
  },
  {
    href: '/app/vision',
    label: 'Vision',
    Icon: Target,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10 dark:bg-purple-500/15',
    border: 'border-purple-200/60 dark:border-purple-500/20 hover:border-purple-400/50 dark:hover:border-purple-400/50 hover:shadow-purple-500/5 dark:hover:shadow-purple-500/10',
    hover: 'hover:bg-purple-50/60 dark:hover:bg-purple-500/5',
  },
  {
    href: '/app/money',
    label: 'Money',
    Icon: DollarSign,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    border: 'border-emerald-200/60 dark:border-emerald-500/20 hover:border-emerald-400/50 dark:hover:border-emerald-400/50 hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/10',
    hover: 'hover:bg-emerald-50/60 dark:hover:bg-emerald-500/5',
  },
  {
    href: '/app/visibility',
    label: 'Visibility',
    Icon: Eye,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    border: 'border-rose-200/60 dark:border-rose-500/20 hover:border-rose-400/50 dark:hover:border-rose-400/50 hover:shadow-rose-500/5 dark:hover:shadow-rose-500/10',
    hover: 'hover:bg-rose-50/60 dark:hover:bg-rose-500/5',
  },
] as const

export function QuickShortcuts() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {SHORTCUTS.map(({ href, label, Icon, color, bg, border, hover }) => (
        <Link
          key={href}
          href={href}
          className={`rounded-2xl border backdrop-blur-xl bg-card/45 p-3.5 flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${border} ${hover}`}
        >
          <div className={`rounded-xl p-2.5 transition-all duration-300 ${bg}`}>
            <Icon className={`size-5 ${color}`} />
          </div>
          <span className="text-xs font-semibold tracking-wide text-muted-foreground transition-colors group-hover:text-foreground">
            {label}
          </span>
        </Link>
      ))}
    </div>
  )
}

