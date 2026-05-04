'use client'

import Link from 'next/link'
import { Flame, Sparkles, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InsightsData {
  streak: number
  wellnessScore: number
  openTasks: number
  yesterdayWin: string | null
}

export function DashboardInsights({ streak, wellnessScore, openTasks, yesterdayWin }: InsightsData) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <StatCard
          icon={<Flame className="size-4" />}
          label="Streak"
          value={streak > 0 ? `${streak}d` : '—'}
          color={streak >= 3 ? 'text-orange-500' : 'text-muted-foreground'}
        />
        <StatCard
          icon={<Sparkles className="size-4" />}
          label="Wellness"
          value={`${wellnessScore}%`}
          color={
            wellnessScore >= 70
              ? 'text-emerald-500'
              : wellnessScore >= 40
              ? 'text-amber-500'
              : 'text-muted-foreground'
          }
        />
        <StatCard
          icon={<CheckSquare className="size-4" />}
          label="Open tasks"
          value={String(openTasks)}
          href="/app/tasks"
          color="text-primary"
        />
      </div>

      {yesterdayWin && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Yesterday's win
          </p>
          <p className="text-sm text-foreground leading-snug line-clamp-2">{yesterdayWin}</p>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  href,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
  color?: string
}) {
  const inner = (
    <div className="rounded-xl border bg-card p-3 flex flex-col gap-1.5 h-full">
      <div className={cn('flex items-center gap-1.5', color ?? 'text-muted-foreground')}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block hover:opacity-80 transition-opacity">
        {inner}
      </Link>
    )
  }
  return inner
}
