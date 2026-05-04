'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AutoResizeTextarea } from '@/components/today/auto-resize-textarea'
import { cn } from '@/lib/utils'
import type { Tables, TablesUpdate } from '@/types/database'

type DailyEntry = Tables<'daily_entries'>

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function formatDate(dateStr: string, today: string): string {
  if (dateStr === today) return 'Today'
  const yesterday = addDays(today, -1)
  if (dateStr === yesterday) return 'Yesterday'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function CurrencyInput({
  value,
  onChange,
  placeholder = '0.00',
}: {
  value: number | null
  onChange: (v: number | null) => void
  placeholder?: string
}) {
  return (
    <div className="flex items-center gap-1.5 border-b border-border/60 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all pb-1 pt-0.5">
      <span className="text-sm font-semibold text-muted-foreground">$</span>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value ?? ''}
        onChange={e => onChange(e.target.value ? parseFloat(e.target.value) : null)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-bold tracking-tight outline-none placeholder:text-muted-foreground/45"
      />
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{label}</label>
      {children}
    </div>
  )
}

interface Props {
  entry: Partial<DailyEntry>
  onUpdate: (fields: TablesUpdate<'daily_entries'>) => void
  date: string
  today: string
  onDateChange: (d: string) => void
  loading?: boolean
}

export function DailyLog({ entry, onUpdate, date, today, onDateChange, loading }: Props) {
  return (
    <div className="space-y-4">
      {/* Date nav */}
      <div className="flex items-center justify-between bg-muted/30 backdrop-blur-md rounded-xl p-2 border border-muted/50">
        <button
          type="button"
          onClick={() => onDateChange(addDays(date, -1))}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:border-muted border border-transparent transition-all select-none cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 select-none">
          <span className="text-sm font-bold tracking-tight text-foreground/90">{formatDate(date, today)}</span>
          {date !== today && (
            <button
              type="button"
              onClick={() => onDateChange(today)}
              className="text-xs font-bold text-primary/80 hover:text-primary hover:underline underline-offset-4 transition-colors select-none cursor-pointer"
            >
              Back to today
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDateChange(addDays(date, 1))}
          disabled={date >= today}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:border-muted border border-transparent transition-all disabled:opacity-30 disabled:cursor-not-allowed select-none cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs font-medium text-muted-foreground pl-1">
        {date === today
          ? '✦ Fields save automatically as you type.'
          : '✦ Viewing a past entry. Changes save automatically.'}
      </p>

      <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-6 transition-opacity', loading && 'opacity-40 pointer-events-none')}>
        {/* Revenue */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] backdrop-blur-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Revenue Today
            </p>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <Field label="Amount received">
            <CurrencyInput
              value={entry.m_rev ?? null}
              onChange={v => onUpdate({ m_rev: v })}
            />
          </Field>

          <Field label="Offer / service sold">
            <AutoResizeTextarea
              value={entry.m_offer ?? ''}
              onChange={v => onUpdate({ m_offer: v })}
              placeholder="What did you sell?"
              minRows={1}
            />
          </Field>

          <Field label="Client payment from">
            <AutoResizeTextarea
              value={entry.m_client ?? ''}
              onChange={v => onUpdate({ m_client: v })}
              placeholder="Client name"
              minRows={1}
            />
          </Field>

          <Field label="Revenue-creating activity">
            <AutoResizeTextarea
              value={entry.m_ract ?? ''}
              onChange={v => onUpdate({ m_ract: v })}
              placeholder="What did you do to generate revenue?"
              minRows={1}
            />
          </Field>

          <Field label="Sales activity notes">
            <AutoResizeTextarea
              value={entry.m_snotes ?? ''}
              onChange={v => onUpdate({ m_snotes: v })}
              placeholder="Calls, DMs, proposals..."
              minRows={2}
            />
          </Field>

          <Field label="Cash flow note">
            <AutoResizeTextarea
              value={entry.m_cash ?? ''}
              onChange={v => onUpdate({ m_cash: v })}
              placeholder="Invoices pending, payments expected..."
              minRows={1}
            />
          </Field>
        </div>

        {/* Expenses */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.02] backdrop-blur-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-rose-500/10 pb-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              Expense Today
            </p>
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          </div>

          <Field label="Amount spent">
            <CurrencyInput
              value={entry.m_exp ?? null}
              onChange={v => onUpdate({ m_exp: v })}
            />
          </Field>

          <Field label="What was it for?">
            <AutoResizeTextarea
              value={entry.m_expdesc ?? ''}
              onChange={v => onUpdate({ m_expdesc: v })}
              placeholder="Software, ads, contractor..."
              minRows={2}
            />
          </Field>

          <Field label="Tax write-off note">
            <AutoResizeTextarea
              value={entry.m_tax ?? ''}
              onChange={v => onUpdate({ m_tax: v })}
              placeholder="Category or deduction note..."
              minRows={1}
            />
          </Field>
        </div>
      </div>
    </div>
  )
}
