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

  const { entry, saving, update } = useDailyEntry(userId, today, initialEntry)
  const revenue  = useRevenue(userId, initialRevenue)
  const expenses = useExpenses(userId, initialExpenses)
  const debt     = useDebt(userId, initialDebt)

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Money</h1>
        <AnimatePresence>
          {saving && tab === 'daily' && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground"
            >
              Saving...
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs */}
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

      {tab === 'daily' && (
        <DailyLog entry={entry} onUpdate={update} />
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
