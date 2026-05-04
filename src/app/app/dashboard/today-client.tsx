'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { useDailyEntry } from '@/hooks/use-daily-entry'
import { MorningCheckIn } from '@/components/today/morning-check-in'
import { WellnessTrackers } from '@/components/today/wellness-trackers'
import { EODClose } from '@/components/today/eod-close'
import { DashboardInsights, type InsightsData } from '@/components/today/dashboard-insights'
import { QuickShortcuts } from '@/components/today/quick-shortcuts'
import type { Tables } from '@/types/database'

type Tab = 'morning' | 'wellness' | 'eod'

const TABS: { id: Tab; label: string }[] = [
  { id: 'morning',  label: 'Morning' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'eod',      label: 'End of Day' },
]

function getDefaultTab(): Tab {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'wellness'
  return 'eod'
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function isLastDayOfMonth(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00')
  const next = new Date(d)
  next.setDate(d.getDate() + 1)
  return next.getMonth() !== d.getMonth()
}

interface Props {
  userId: string
  date: string
  initialEntry: Tables<'daily_entries'> | null
  firstName: string
  insights: InsightsData
}

export function TodayClient({ userId, date, initialEntry, firstName, insights }: Props) {
  const [tab, setTab] = useState<Tab>(getDefaultTab())
  const { entry, loading, saving, update } = useDailyEntry(userId, date, initialEntry)

  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10 relative">
      {/* Visual Ambient Light Background Blobs */}
      <div className="absolute inset-0 -top-10 -z-10 h-72 overflow-hidden opacity-30 select-none pointer-events-none">
        <div className="absolute -top-10 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-20 right-1/4 w-60 h-60 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold font-display tracking-tight text-foreground">
            {firstName ? `Good ${getGreeting()}, ${firstName}.` : 'Today'}
          </h1>
          <p className="text-sm text-muted-foreground/80 mt-1 font-medium">{displayDate}</p>
        </div>
        <AnimatePresence>
          {saving && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mt-1.5 shrink-0"
            >
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">
                Saving
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Insights */}
      <DashboardInsights {...insights} />

      {/* Quick shortcuts */}
      <QuickShortcuts />

      {/* Tab nav */}
      <div className="flex gap-1 rounded-xl bg-muted/60 backdrop-blur-md p-1.5 border border-muted-foreground/10 relative">
        {TABS.map(t => {
          const isActive = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200 relative',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="activeTabUnderlay"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 bg-background rounded-lg shadow-md -z-10 border border-muted-foreground/10"
                />
              )}
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="h-72 rounded-2xl border bg-card/60 animate-pulse backdrop-blur-md border-primary/10" />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab === 'morning' && (
              <MorningCheckIn entry={entry} onUpdate={update} />
            )}
            {tab === 'wellness' && (
              <WellnessTrackers entry={entry} onUpdate={update} />
            )}
            {tab === 'eod' && (
              <EODClose
                entry={entry}
                onUpdate={update}
                isMonthEnd={isLastDayOfMonth(date)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
