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
  activeClass,
}: {
  emoji: string
  label: string
  checked: boolean
  onToggle: () => void
  activeClass?: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 select-none border',
        checked
          ? activeClass || 'bg-primary text-primary-foreground border-transparent shadow-sm'
          : 'bg-muted/60 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground'
      )}
    >
      <span className="text-sm leading-none">{emoji}</span>
      <span>{label}</span>
    </button>
  )
}

function SectionLabel({ children, emoji }: { children: React.ReactNode; emoji?: string }) {
  return (
    <p className="text-[11px] font-extrabold uppercase tracking-widest text-foreground/70 flex items-center gap-1.5">
      {emoji && <span className="text-sm select-none">{emoji}</span>}
      {children}
    </p>
  )
}

export function WellnessTrackers({ entry, onUpdate }: Props) {
  const scriptureActive = entry.s_scrip === true

  return (
    <div className="space-y-6">
      {/* Body */}
      <div className="rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card/50 to-emerald-500/2 backdrop-blur-md p-6 space-y-4 shadow-sm relative overflow-hidden group hover:border-emerald-500/25 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -z-10 group-hover:bg-emerald-500/10 transition-colors" />
        <SectionLabel emoji="🏃">Body</SectionLabel>
        <div className="flex flex-wrap gap-2 py-1">
          {BODY_HABITS.map(({ key, emoji, label }) => (
            <HabitChip
              key={key}
              emoji={emoji}
              label={label}
              checked={entry[key] === true}
              activeClass="bg-emerald-500 text-white border-transparent shadow-emerald-500/25 shadow-md"
              onToggle={() => onUpdate({ [key]: !entry[key] })}
            />
          ))}
        </div>
        <div className="relative group/notes">
          <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-emerald-500/15 via-transparent to-transparent opacity-0 group-focus-within/notes:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />
          <AutoResizeTextarea
            value={entry.w_bnotes ?? ''}
            onChange={v => onUpdate({ w_bnotes: v })}
            placeholder="How did your body feel today? Sleep, meals, movement notes..."
            minRows={1}
          />
        </div>
      </div>

      {/* Spirit */}
      <div className="rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 via-card/50 to-indigo-500/2 backdrop-blur-md p-6 space-y-4 shadow-sm relative overflow-hidden group hover:border-indigo-500/25 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -z-10 group-hover:bg-indigo-500/10 transition-colors" />
        <SectionLabel emoji="🧘">Spirit</SectionLabel>
        <div className="flex flex-wrap gap-2 py-1">
          {SPIRIT_HABITS.map(({ key, emoji, label }) => (
            <HabitChip
              key={key}
              emoji={emoji}
              label={label}
              checked={entry[key] === true}
              activeClass="bg-indigo-500 text-white border-transparent shadow-indigo-500/25 shadow-md"
              onToggle={() => onUpdate({ [key]: !entry[key] })}
            />
          ))}
        </div>
        {scriptureActive && (
          <div className="relative group/scripture">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-indigo-500/15 via-transparent to-transparent opacity-0 group-focus-within/scripture:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />
            <AutoResizeTextarea
              value={entry.w_scrip_text ?? ''}
              onChange={v => onUpdate({ w_scrip_text: v })}
              placeholder="Scripture or devotional passage..."
              minRows={2}
            />
          </div>
        )}
        <div className="relative group/snotes">
          <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-indigo-500/15 via-transparent to-transparent opacity-0 group-focus-within/snotes:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />
          <AutoResizeTextarea
            value={entry.w_snotes ?? ''}
            onChange={v => onUpdate({ w_snotes: v })}
            placeholder="Spiritual reflections or intuitive thoughts..."
            minRows={1}
          />
        </div>
      </div>

      {/* Mind */}
      <div className="rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card/50 to-amber-500/2 backdrop-blur-md p-6 space-y-5 shadow-sm relative overflow-hidden group hover:border-amber-500/25 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -z-10 group-hover:bg-amber-500/10 transition-colors" />
        <SectionLabel emoji="🧠">Mind</SectionLabel>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
            ✨ Gratitude
          </label>
          <div className="relative group/grat">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-amber-500/15 via-transparent to-transparent opacity-0 group-focus-within/grat:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />
            <AutoResizeTextarea
              value={entry.w_grat ?? ''}
              onChange={v => onUpdate({ w_grat: v })}
              placeholder="What are 3 things you're grateful for today?"
              minRows={2}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
            🔥 Daily affirmation
          </label>
          <div className="relative group/aff">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-amber-500/15 via-transparent to-transparent opacity-0 group-focus-within/aff:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />
            <AutoResizeTextarea
              value={entry.w_aff ?? ''}
              onChange={v => onUpdate({ w_aff: v })}
              placeholder="I am..."
              minRows={2}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
            📔 Journal
          </label>
          <div className="relative group/journal">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-amber-500/15 via-transparent to-transparent opacity-0 group-focus-within/journal:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />
            <AutoResizeTextarea
              value={entry.w_journal ?? ''}
              onChange={v => onUpdate({ w_journal: v })}
              placeholder="What's on your mind today?"
              minRows={3}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
            💬 Mental check-in
          </label>
          <div className="relative group/mental">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-amber-500/15 via-transparent to-transparent opacity-0 group-focus-within/mental:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />
            <AutoResizeTextarea
              value={entry.w_mental ?? ''}
              onChange={v => onUpdate({ w_mental: v })}
              placeholder="How are you really feeling? Clear, overwhelmed, inspired?"
              minRows={2}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
