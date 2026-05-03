'use client'

import { cn } from '@/lib/utils'
import { AutoResizeTextarea } from './auto-resize-textarea'
import type { Tables, TablesUpdate } from '@/types/database'

type DailyEntry = Tables<'daily_entries'>

const BODY_HABITS = [
  { key: 'b_water' as const, emoji: '💧', label: 'Water' },
  { key: 'b_move'  as const, emoji: '🏃', label: 'Move' },
  { key: 'b_meals' as const, emoji: '🥗', label: 'Meals' },
  { key: 'b_walk'  as const, emoji: '🚶', label: 'Walk' },
  { key: 'b_sleep' as const, emoji: '😴', label: 'Sleep' },
  { key: 'b_cycle' as const, emoji: '🌙', label: 'Cycle' },
]

const SPIRIT_HABITS = [
  { key: 's_prayer' as const, emoji: '🙏', label: 'Prayer' },
  { key: 's_med'    as const, emoji: '🧘', label: 'Meditate' },
  { key: 's_scrip'  as const, emoji: '📖', label: 'Scripture' },
  { key: 's_breath' as const, emoji: '🫁', label: 'Breathe' },
  { key: 's_viz'    as const, emoji: '👁️', label: 'Visualize' },
  { key: 's_intuit' as const, emoji: '💭', label: 'Intuition' },
]

interface Props {
  entry: Partial<DailyEntry>
  onUpdate: (fields: TablesUpdate<'daily_entries'>) => void
}

function HabitChip({
  emoji,
  label,
  checked,
  onToggle,
}: {
  emoji: string
  label: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150',
        checked
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'bg-muted text-muted-foreground hover:bg-muted/70'
      )}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  )
}

export function WellnessTrackers({ entry, onUpdate }: Props) {
  const scriptureActive = entry.s_scrip === true

  return (
    <div className="space-y-5">
      {/* Body */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <SectionLabel>Body</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {BODY_HABITS.map(({ key, emoji, label }) => (
            <HabitChip
              key={key}
              emoji={emoji}
              label={label}
              checked={entry[key] === true}
              onToggle={() => onUpdate({ [key]: !entry[key] })}
            />
          ))}
        </div>
        <AutoResizeTextarea
          value={entry.w_bnotes ?? ''}
          onChange={v => onUpdate({ w_bnotes: v })}
          placeholder="Body notes..."
          minRows={1}
        />
      </div>

      {/* Spirit */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <SectionLabel>Spirit</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {SPIRIT_HABITS.map(({ key, emoji, label }) => (
            <HabitChip
              key={key}
              emoji={emoji}
              label={label}
              checked={entry[key] === true}
              onToggle={() => onUpdate({ [key]: !entry[key] })}
            />
          ))}
        </div>
        {scriptureActive && (
          <AutoResizeTextarea
            value={entry.w_scrip_text ?? ''}
            onChange={v => onUpdate({ w_scrip_text: v })}
            placeholder="Scripture or devotional..."
            minRows={2}
          />
        )}
        <AutoResizeTextarea
          value={entry.w_snotes ?? ''}
          onChange={v => onUpdate({ w_snotes: v })}
          placeholder="Spirit notes..."
          minRows={1}
        />
      </div>

      {/* Mind */}
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <SectionLabel>Mind</SectionLabel>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Gratitude</label>
          <AutoResizeTextarea
            value={entry.w_grat ?? ''}
            onChange={v => onUpdate({ w_grat: v })}
            placeholder="I'm grateful for..."
            minRows={2}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Daily affirmation</label>
          <AutoResizeTextarea
            value={entry.w_aff ?? ''}
            onChange={v => onUpdate({ w_aff: v })}
            placeholder="I am..."
            minRows={2}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Journal</label>
          <AutoResizeTextarea
            value={entry.w_journal ?? ''}
            onChange={v => onUpdate({ w_journal: v })}
            placeholder="What's on my mind..."
            minRows={3}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Mental check-in</label>
          <AutoResizeTextarea
            value={entry.w_mental ?? ''}
            onChange={v => onUpdate({ w_mental: v })}
            placeholder="How am I really doing..."
            minRows={2}
          />
        </div>
      </div>
    </div>
  )
}
