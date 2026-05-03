'use client'

import { AutoResizeTextarea } from './auto-resize-textarea'
import type { Tables, TablesUpdate } from '@/types/database'

type DailyEntry = Tables<'daily_entries'>

interface Props {
  entry: Partial<DailyEntry>
  onUpdate: (fields: TablesUpdate<'daily_entries'>) => void
  isMonthEnd: boolean
}

function Field({
  label,
  field,
  entry,
  onUpdate,
  placeholder,
  minRows = 2,
}: {
  label: string
  field: keyof TablesUpdate<'daily_entries'>
  entry: Partial<DailyEntry>
  onUpdate: (fields: TablesUpdate<'daily_entries'>) => void
  placeholder?: string
  minRows?: number
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <AutoResizeTextarea
        value={(entry[field as keyof DailyEntry] as string) ?? ''}
        onChange={v => onUpdate({ [field]: v })}
        placeholder={placeholder}
        minRows={minRows}
      />
    </div>
  )
}

export function EODClose({ entry, onUpdate, isMonthEnd }: Props) {
  return (
    <div className="space-y-5">
      {/* EOD Reflection */}
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          End of Day
        </p>
        <Field label="What worked today?" field="eod_worked" entry={entry} onUpdate={onUpdate} placeholder="What moved the needle..." />
        <Field label="What deserves celebrating?" field="eod_celebrate" entry={entry} onUpdate={onUpdate} placeholder="A win, big or small..." />
        <Field label="What will I release?" field="eod_release" entry={entry} onUpdate={onUpdate} placeholder="Let it go..." />
      </div>

      {/* Wins & Reflection */}
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Wins &amp; Reflection
        </p>
        <Field label="Win of the day" field="g_win" entry={entry} onUpdate={onUpdate} placeholder="My biggest win today..." />
        <Field label="What I'm proud of" field="g_proud" entry={entry} onUpdate={onUpdate} placeholder="I'm proud that I..." />
        <Field label="Lesson learned" field="g_lesson" entry={entry} onUpdate={onUpdate} placeholder="Today I learned..." />
      </div>

      {/* Month-End Panel */}
      {isMonthEnd && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20 p-6 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Month-End Reflection
            </p>
            <p className="text-xs text-muted-foreground mt-1">Last day of the month — close it out.</p>
          </div>
          <Field label="What worked this month?" field="g_worked" entry={entry} onUpdate={onUpdate} placeholder="Patterns and wins..." />
          <Field label="What drained me?" field="g_drained" entry={entry} onUpdate={onUpdate} placeholder="Energy leaks to eliminate..." />
          <Field label="What do I need to release?" field="g_release" entry={entry} onUpdate={onUpdate} placeholder="Let go of..." />
          <Field label="Celebrations" field="g_celeb" entry={entry} onUpdate={onUpdate} placeholder="Worth celebrating this month..." />
        </div>
      )}
    </div>
  )
}
