'use client'

import { AutoResizeTextarea } from './auto-resize-textarea'
import type { Tables, TablesUpdate } from '@/types/database'
import { Moon, Sparkles, Calendar } from 'lucide-react'

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
    <div className="space-y-2">
      <label className="text-sm font-semibold tracking-wide text-foreground/90">{label}</label>
      <AutoResizeTextarea
        value={(entry[field as keyof DailyEntry] as string) ?? ''}
        onChange={v => onUpdate({ [field]: v })}
        placeholder={placeholder}
        minRows={minRows}
        className="focus-visible:ring-primary/20 bg-background/50 backdrop-blur-sm border-border/80 rounded-xl transition-all duration-300 focus:border-primary/50"
      />
    </div>
  )
}

export function EODClose({ entry, onUpdate, isMonthEnd }: Props) {
  return (
    <div className="space-y-6">
      {/* EOD Reflection */}
      <div className="rounded-2xl border border-indigo-200/50 dark:border-indigo-500/15 bg-indigo-500/[0.03] dark:bg-indigo-500/[0.06] backdrop-blur-xl p-6 space-y-6 hover:border-indigo-300 dark:hover:border-indigo-400/40 transition-all duration-300">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400">
            <Moon className="size-4.5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600/90 dark:text-indigo-400/90">
            End of Day Reflection
          </p>
        </div>
        <div className="space-y-4">
          <Field label="What worked today?" field="eod_worked" entry={entry} onUpdate={onUpdate} placeholder="What moved the needle..." />
          <Field label="What deserves celebrating?" field="eod_celebrate" entry={entry} onUpdate={onUpdate} placeholder="A win, big or small..." />
          <Field label="What will I release?" field="eod_release" entry={entry} onUpdate={onUpdate} placeholder="Let it go..." />
        </div>
      </div>

      {/* Wins & Reflection */}
      <div className="rounded-2xl border border-rose-200/50 dark:border-rose-500/15 bg-rose-500/[0.03] dark:bg-rose-500/[0.06] backdrop-blur-xl p-6 space-y-6 hover:border-rose-300 dark:hover:border-rose-400/40 transition-all duration-300">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
            <Sparkles className="size-4.5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-rose-600/90 dark:text-rose-400/90">
            Wins &amp; Gratitude
          </p>
        </div>
        <div className="space-y-4">
          <Field label="Win of the day" field="g_win" entry={entry} onUpdate={onUpdate} placeholder="My biggest win today..." />
          <Field label="What I'm proud of" field="g_proud" entry={entry} onUpdate={onUpdate} placeholder="I'm proud that I..." />
          <Field label="Lesson learned" field="g_lesson" entry={entry} onUpdate={onUpdate} placeholder="Today I learned..." />
        </div>
      </div>

      {/* Month-End Panel */}
      {isMonthEnd && (
        <div className="rounded-2xl border border-amber-300/50 dark:border-amber-500/15 bg-amber-500/[0.03] dark:bg-amber-500/[0.06] backdrop-blur-xl p-6 space-y-6 hover:border-amber-400 dark:hover:border-amber-400/40 transition-all duration-300">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              <Calendar className="size-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Month-End Reflection
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Last day of the month — close it out.</p>
            </div>
          </div>
          <div className="space-y-4">
            <Field label="What worked this month?" field="g_worked" entry={entry} onUpdate={onUpdate} placeholder="Patterns and wins..." />
            <Field label="What drained me?" field="g_drained" entry={entry} onUpdate={onUpdate} placeholder="Energy leaks to eliminate..." />
            <Field label="What do I need to release?" field="g_release" entry={entry} onUpdate={onUpdate} placeholder="Let go of..." />
            <Field label="Celebrations" field="g_celeb" entry={entry} onUpdate={onUpdate} placeholder="Worth celebrating this month..." />
          </div>
        </div>
      )}
    </div>
  )
}

