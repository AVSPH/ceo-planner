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
    <div className="flex items-center gap-1 border-b border-border focus-within:border-primary transition-colors pb-1">
      <span className="text-sm text-muted-foreground">$</span>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value ?? ''}
        onChange={e => onChange(e.target.value ? parseFloat(e.target.value) : null)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
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
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
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
    <div className="space-y-3">
      {/* Date nav */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onDateChange(addDays(date, -1))}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{formatDate(date, today)}</span>
          {date !== today && (
            <button
              type="button"
              onClick={() => onDateChange(today)}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              Back to today
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDateChange(addDays(date, 1))}
          disabled={date >= today}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {date === today
          ? 'Fields save automatically as you type. No save button needed.'
          : 'Viewing a past entry. Changes save automatically.'}
      </p>
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-5 transition-opacity', loading && 'opacity-40 pointer-events-none')}>
      {/* Revenue */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Revenue Today
        </p>

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
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Expense Today
        </p>

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
