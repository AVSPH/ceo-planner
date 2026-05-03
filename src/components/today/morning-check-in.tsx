'use client'

import { cn } from '@/lib/utils'
import { AutoResizeTextarea } from './auto-resize-textarea'
import type { Tables, TablesUpdate } from '@/types/database'

type DailyEntry = Tables<'daily_entries'>

const ENERGY_LEVELS = [
  { value: '1', label: 'Drained', active: 'bg-rose-500 border-rose-500' },
  { value: '2', label: 'Low',     active: 'bg-orange-400 border-orange-400' },
  { value: '3', label: 'Neutral', active: 'bg-amber-400 border-amber-400' },
  { value: '4', label: 'Good',    active: 'bg-emerald-400 border-emerald-400' },
  { value: '5', label: 'Fired up', active: 'bg-green-500 border-green-500' },
] as const

const MOODS = [
  { emoji: '😊', label: 'Joyful' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '🎯', label: 'Focused' },
  { emoji: '⚡', label: 'Energized' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '🙏', label: 'Grateful' },
  { emoji: '😐', label: 'Meh' },
] as const

interface Props {
  entry: Partial<DailyEntry>
  onUpdate: (fields: TablesUpdate<'daily_entries'>) => void
}

export function MorningCheckIn({ entry, onUpdate }: Props) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-7">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Morning Check-In
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">How I want to feel today</label>
          <AutoResizeTextarea
            value={entry.feel ?? ''}
            onChange={v => onUpdate({ feel: v })}
            placeholder="Focused, calm, unstoppable..."
            minRows={2}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Top 3 priorities</label>
          <AutoResizeTextarea
            value={entry.priorities ?? ''}
            onChange={v => onUpdate({ priorities: v })}
            placeholder={'1.\n2.\n3.'}
            minRows={3}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Energy level</label>
        <div className="flex items-end gap-4 sm:gap-6">
          {ENERGY_LEVELS.map(({ value, label, active }) => {
            const selected = entry.energy === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => onUpdate({ energy: value })}
                className="flex flex-col items-center gap-2 group"
              >
                <span
                  className={cn(
                    'size-9 rounded-full border-2 transition-all duration-150',
                    selected
                      ? `${active} scale-110 shadow-sm`
                      : 'bg-muted border-muted-foreground/20 group-hover:border-muted-foreground/50'
                  )}
                />
                <span className={cn(
                  'text-xs transition-colors',
                  selected ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Today&apos;s mood</label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {MOODS.map(({ emoji, label }) => {
            const selected = entry.mood_label === label
            return (
              <button
                key={label}
                type="button"
                onClick={() => onUpdate({ mood_emoji: emoji, mood_label: label })}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl p-2.5 transition-all duration-150',
                  selected
                    ? 'bg-primary/10 ring-2 ring-primary ring-offset-1'
                    : 'hover:bg-muted'
                )}
              >
                <span className="text-2xl leading-none">{emoji}</span>
                <span className={cn(
                  'text-[10px] font-medium transition-colors',
                  selected ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
