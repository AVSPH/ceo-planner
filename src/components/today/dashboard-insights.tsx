'use client'

import Link from 'next/link'
import { Flame, Sparkles, CheckSquare } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface InsightsData {
  streak: number
  wellnessScore: number
  openTasks: number
  yesterdayWin: string | null
}

export function DashboardInsights({ streak, wellnessScore, openTasks, yesterdayWin }: InsightsData) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Flame className="size-4.5" />
            </motion.div>
          }
          label="Streak"
          value={streak > 0 ? `${streak}d` : '—'}
          color={streak >= 3 ? 'text-orange-500 bg-orange-500/10 border-orange-500/20' : 'text-muted-foreground bg-muted/40'}
        />
        <StatCard
          icon={
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="size-4.5" />
            </motion.div>
          }
          label="Wellness"
          value={`${wellnessScore}%`}
          color={
            wellnessScore >= 70
              ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
              : wellnessScore >= 40
              ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
              : 'text-muted-foreground bg-muted/40'
          }
        />
        <StatCard
          icon={
            <motion.div
              whileHover={{ scale: 1.15 }}
            >
              <CheckSquare className="size-4.5" />
            </motion.div>
          }
          label="Open tasks"
          value={String(openTasks)}
          href="/app/tasks"
          color="text-primary bg-primary/10 border-primary/20"
        />
      </div>

      {yesterdayWin && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-primary/10 bg-card/40 hover:bg-card/60 hover:border-primary/25 backdrop-blur-md px-5 py-3.5 transition-all duration-300 relative overflow-hidden group shadow-sm flex items-center justify-between gap-4"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10 group-hover:bg-primary/10 transition-colors" />
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary/80 mb-1 flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-primary" />
              Yesterday's win
            </p>
            <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">{yesterdayWin}</p>
          </div>
          <span className="text-xl select-none group-hover:scale-110 transition-transform duration-200">🏆</span>
        </motion.div>
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
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 350, damping: 14 }}
      className="rounded-2xl border border-muted-foreground/10 bg-card/50 hover:bg-card/75 backdrop-blur-md p-4 flex flex-col justify-between gap-3 h-full transition-all duration-200 relative overflow-hidden group hover:border-primary/20 shadow-sm select-none"
    >
      <div className="absolute inset-0 -top-1/2 left-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center justify-between">
        <div className={cn('p-2 rounded-xl border flex items-center justify-center transition-all duration-300 backdrop-blur-sm group-hover:scale-105', color)}>
          {icon}
        </div>
        {href && (
          <span className="text-muted-foreground/40 text-[10px] uppercase font-bold group-hover:text-primary transition-colors">
            Go →
          </span>
        )}
      </div>
      <div>
        <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground/80 transition-colors block mb-0.5">{label}</span>
        <p className="text-2xl font-extrabold tracking-tight text-foreground font-display group-hover:text-primary/90 transition-colors">{value}</p>
      </div>
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full cursor-pointer">
        {inner}
      </Link>
    )
  }
  return inner
}
