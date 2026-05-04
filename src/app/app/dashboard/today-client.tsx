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
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {firstName ? `Good ${getGreeting()}, ${firstName}.` : 'Today'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{displayDate}</p>
        </div>
        <AnimatePresence>
          {saving && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground mt-1.5 shrink-0"
            >
              Saving...
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Insights */}
      <DashboardInsights {...insights} />

      {/* Quick shortcuts */}
      <QuickShortcuts />

      {/* Tab nav */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150',
              tab === t.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="h-72 rounded-xl border bg-card animate-pulse" />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
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
