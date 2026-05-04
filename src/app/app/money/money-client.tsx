'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { useDailyEntry } from '@/hooks/use-daily-entry'
import { useRevenue, useExpenses, useDebt } from '@/hooks/use-money'
import { DailyLog } from '@/components/money/daily-log'
import { RevenueTracker } from '@/components/money/revenue-tracker'
import { ExpenseTracker } from '@/components/money/expense-tracker'
import { DebtTracker } from '@/components/money/debt-tracker'
import type { Tables } from '@/types/database'
import type { RevenueEntry, ExpenseEntry, DebtEntry } from '@/hooks/use-money'

type Tab = 'daily' | 'revenue' | 'expenses' | 'debt'

const TABS: { id: Tab; label: string }[] = [
  { id: 'daily',    label: 'Daily Log' },
  { id: 'revenue',  label: 'Revenue' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'debt',     label: 'Debt' },
]

interface Props {
  userId:         string
  today:          string
  initialEntry:   Tables<'daily_entries'> | null
  initialRevenue: RevenueEntry[]
  initialExpenses: ExpenseEntry[]
  initialDebt:    DebtEntry[]
  monthGoal:      number | null
  yearGoal:       number | null
}

export function MoneyClient({
  userId, today, initialEntry,
  initialRevenue, initialExpenses, initialDebt,
  monthGoal, yearGoal,
}: Props) {
  const [tab, setTab] = useState<Tab>('daily')
  const [activeDate, setActiveDate] = useState(today)

  const { entry, loading, saving, update } = useDailyEntry(
    userId,
    activeDate,
    activeDate === today ? initialEntry : undefined
  )
  const revenue  = useRevenue(userId, initialRevenue)
  const expenses = useExpenses(userId, initialExpenses)
  const debt     = useDebt(userId, initialDebt)

  return (
    <div className="relative max-w-2xl mx-auto space-y-8 pb-10">
      {/* Background ambient light blobs */}
      <div className="absolute -top-12 -left-12 -z-10 h-64 w-64 rounded-full bg-primary/8 opacity-20 blur-3xl" />
      <div className="absolute top-20 -right-12 -z-10 h-72 w-72 rounded-full bg-rose-500/8 opacity-15 blur-3xl" />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight font-display bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">Money</h1>
          <p className="text-xs text-muted-foreground font-medium">Track your income, expenses, and monthly financial goals</p>
        </div>
        <AnimatePresence>
          {saving && tab === 'daily' && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs font-semibold px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 backdrop-blur-md animate-pulse"
            >
              Saving...
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs with premium underlay animation */}
      <div className="flex p-1 gap-1.5 rounded-xl bg-muted/40 backdrop-blur-md border border-muted/50 select-none">
        {TABS.map(t => {
          const isActive = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'relative flex-1 rounded-lg px-3 py-2 text-xs font-bold tracking-wide transition-all duration-200 uppercase text-center select-none cursor-pointer outline-none',
                isActive
                  ? 'bg-background text-foreground shadow-sm border border-muted-foreground/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              )}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'daily' && (
        <DailyLog
          entry={entry}
          onUpdate={update}
          date={activeDate}
          today={today}
          onDateChange={setActiveDate}
          loading={loading}
        />
      )}
      {tab === 'revenue' && (
        <RevenueTracker
          entries={revenue.entries}
          monthGoal={monthGoal}
          yearGoal={yearGoal}
          onAdd={revenue.add}
          onRemove={revenue.remove}
        />
      )}
      {tab === 'expenses' && (
        <ExpenseTracker
          entries={expenses.entries}
          onAdd={expenses.add}
          onRemove={expenses.remove}
        />
      )}
      {tab === 'debt' && (
        <DebtTracker
          entries={debt.entries}
          onAdd={debt.add}
          onUpdate={debt.update}
          onRemove={debt.remove}
        />
      )}
    </div>
  )
}
