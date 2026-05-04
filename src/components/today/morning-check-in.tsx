'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { AutoResizeTextarea } from './auto-resize-textarea'
import type { Tables, TablesUpdate } from '@/types/database'

type DailyEntry = Tables<'daily_entries'>

const ENERGY_LEVELS = [
  { value: '1', label: 'Drained', active: 'bg-rose-500 border-rose-500 shadow-rose-500/30' },
  { value: '2', label: 'Low',     active: 'bg-orange-400 border-orange-400 shadow-orange-400/30' },
  { value: '3', label: 'Neutral', active: 'bg-amber-400 border-amber-400 shadow-amber-400/30' },
  { value: '4', label: 'Good',    active: 'bg-emerald-400 border-emerald-400 shadow-emerald-400/30' },
  { value: '5', label: 'Fired up', active: 'bg-green-500 border-green-500 shadow-green-500/30' },
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
    <div className="rounded-2xl border border-muted-foreground/10 bg-card/40 hover:bg-card/60 backdrop-blur-md p-6 sm:p-7 space-y-8 transition-all duration-300 shadow-sm relative overflow-hidden">
      {/* Abstract subtle glowing orb behind header */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="flex items-center justify-between">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-primary/80 flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          Morning Check-In
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/90 flex items-center gap-1">
            🌱 How I want to feel today
          </label>
          <div className="relative group">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />
            <AutoResizeTextarea
              value={entry.feel ?? ''}
              onChange={v => onUpdate({ feel: v })}
              placeholder="Focused, calm, unstoppable..."
              minRows={2}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/90 flex items-center gap-1">
            🎯 Top 3 priorities
          </label>
          <div className="relative group">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />
            <AutoResizeTextarea
              value={entry.priorities ?? ''}
              onChange={v => onUpdate({ priorities: v })}
              placeholder={'1.\n2.\n3.'}
              minRows={3}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold text-foreground/90">⚡ Energy level</label>
        <div className="flex items-end justify-between sm:justify-start gap-3 sm:gap-7">
          {ENERGY_LEVELS.map(({ value, label, active }) => {
            const selected = entry.energy === value
            return (
              <motion.button
                key={value}
                type="button"
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onUpdate({ energy: value })}
                className="flex flex-col items-center gap-2 group relative cursor-pointer outline-none"
              >
                <div
                  className={cn(
                    'size-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center relative',
                    selected
                      ? `${active} scale-110 border-transparent shadow-lg text-white font-bold`
                      : 'bg-muted/80 border-muted-foreground/15 group-hover:border-muted-foreground/40 group-hover:bg-muted/60'
                  )}
                >
                  {selected && (
                    <span className="text-sm font-extrabold select-none">
                      {value}
                    </span>
                  )}
                </div>
                <span className={cn(
                  'text-[11px] font-medium transition-colors duration-200 select-none',
                  selected ? 'text-foreground font-bold' : 'text-muted-foreground'
                )}>
                  {label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold text-foreground/90">🔮 Today&apos;s mood</label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {MOODS.map(({ emoji, label }) => {
            const selected = entry.mood_label === label
            return (
              <motion.button
                key={label}
                type="button"
                whileHover={{ y: -2, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onUpdate({ mood_emoji: emoji, mood_label: label })}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-2xl p-2.5 transition-all duration-300 relative cursor-pointer outline-none select-none',
                  selected
                    ? 'bg-primary/15 border border-primary/25 ring-2 ring-primary/20 ring-offset-2'
                    : 'bg-muted/30 border border-transparent hover:bg-muted/60 hover:border-muted-foreground/10'
                )}
              >
                <span className="text-2xl leading-none transition-transform duration-300 group-hover:scale-110">{emoji}</span>
                <span className={cn(
                  'text-[10px] font-semibold transition-colors duration-200 truncate max-w-full text-center',
                  selected ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
