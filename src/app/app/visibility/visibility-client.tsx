'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { useDailyEntry } from '@/hooks/use-daily-entry'
import { AutoResizeTextarea } from '@/components/today/auto-resize-textarea'
import { Sparkles, Eye } from 'lucide-react'
import type { Tables } from '@/types/database'

type Tab = 'plan' | 'reflect'

const TABS: { id: Tab; label: string }[] = [
  { id: 'plan',    label: 'Content Plan' },
  { id: 'reflect', label: 'Reflection' },
]

const PLATFORMS = [
  { key: 'fb',  label: 'Facebook',  color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 ring-blue-500/30' },
  { key: 'ig',  label: 'Instagram', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 ring-pink-500/30' },
  { key: 'li',  label: 'LinkedIn',  color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 ring-sky-500/30' },
  { key: 'tt',  label: 'TikTok',    color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 ring-slate-500/30' },
  { key: 'yt',  label: 'YouTube',   color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 ring-red-500/30' },
] as const

const PILLARS = [
  { value: 'Educational',   color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 ring-blue-500/30' },
  { value: 'Storytelling',  color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 ring-violet-500/30' },
  { value: 'Promotional',   color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 ring-amber-500/30' },
  { value: 'Inspirational', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 ring-emerald-500/30' },
  { value: 'Other',         color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20 ring-gray-500/30' },
] as const

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 select-none">
      <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{label}</label>
      {children}
    </div>
  )
}

interface Props {
  userId:       string
  today:        string
  initialEntry: Tables<'daily_entries'> | null
}

export function VisibilityClient({ userId, today, initialEntry }: Props) {
  const [tab, setTab] = useState<Tab>('plan')
  const { entry, saving, update } = useDailyEntry(userId, today, initialEntry)

  const activePlatforms: string[] = entry.vis_platforms ?? []

  function togglePlatform(key: string) {
    const next = activePlatforms.includes(key)
      ? activePlatforms.filter(p => p !== key)
      : [...activePlatforms, key]
    update({ vis_platforms: next })
  }

  const displayDate = new Date(today + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-md flex items-center justify-center text-primary shadow-sm shrink-0 select-none">
            <Eye className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight select-none">Visibility Tracker</h1>
            <p className="text-xs font-bold text-muted-foreground/80 mt-0.5 select-none uppercase tracking-wide">{displayDate}</p>
          </div>
        </div>
        <AnimatePresence>
          {saving && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1 bg-muted/40 backdrop-blur-md border border-muted/50 rounded-full text-xs font-bold text-muted-foreground tracking-wide select-none shadow-sm"
            >
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              Saving...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 rounded-2xl bg-muted/30 backdrop-blur-md border border-muted/20 p-1.5 transition-all select-none">
        {TABS.map(t => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'flex-1 rounded-xl px-4 py-2 text-xs font-bold tracking-wide uppercase transition-all duration-200 select-none cursor-pointer',
                active
                  ? 'bg-background text-foreground shadow-sm ring-1 ring-border/40 font-extrabold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/25'
              )}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: 'easeInOut' }}
        >
          {/* ── Content Plan ── */}
          {tab === 'plan' && (
            <div className="rounded-2xl border border-border/60 bg-card/45 backdrop-blur-md p-6 space-y-6 hover:shadow-sm hover:border-border transition-all select-none">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary shrink-0 select-none animate-pulse" />
                <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground/80 select-none">
                  Content Plan Strategy
                </p>
              </div>

              <Field label="What am I promoting today?">
                <AutoResizeTextarea
                  value={entry.vis_promo ?? ''}
                  onChange={v => update({ vis_promo: v })}
                  placeholder="Offer, freebie, event, service..."
                  minRows={2}
                />
              </Field>

              <Field label="Content idea / topic">
                <AutoResizeTextarea
                  value={entry.vis_idea ?? ''}
                  onChange={v => update({ vis_idea: v })}
                  placeholder="Hook, angle, story idea..."
                  minRows={3}
                />
              </Field>

              <Field label="Call to action">
                <AutoResizeTextarea
                  value={entry.vis_cta ?? ''}
                  onChange={v => update({ vis_cta: v })}
                  placeholder="DM me, book a call, grab the freebie at..."
                  minRows={2}
                />
              </Field>

              <div className="space-y-2 select-none">
                <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Platforms Today</label>
                <div className="flex flex-wrap gap-2.5 pt-0.5">
                  {PLATFORMS.map(({ key, label, color }) => {
                    const active = activePlatforms.includes(key)
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => togglePlatform(key)}
                        className={cn(
                          'rounded-xl px-3.5 py-2 text-xs font-bold transition-all border select-none cursor-pointer',
                          active
                            ? color + ' ring-2 ring-offset-1 scale-102 shadow-sm font-extrabold'
                            : 'bg-muted/40 border-muted-foreground/15 text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Reflection ── */}
          {tab === 'reflect' && (
            <div className="rounded-2xl border border-border/60 bg-card/45 backdrop-blur-md p-6 space-y-6 hover:shadow-sm hover:border-border transition-all select-none">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary shrink-0 select-none animate-pulse" />
                <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground/80 select-none">
                  Content Reflection Insights
                </p>
              </div>

              <div className="space-y-2 select-none">
                <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Content Pillar</label>
                <div className="flex flex-wrap gap-2.5 pt-0.5">
                  {PILLARS.map(({ value, color }) => {
                    const active = entry.vis_pillar === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => update({ vis_pillar: active ? null : value })}
                        className={cn(
                          'rounded-xl px-3.5 py-2 text-xs font-bold transition-all border select-none cursor-pointer',
                          active
                            ? color + ' ring-2 ring-offset-1 scale-102 shadow-sm font-extrabold'
                            : 'bg-muted/40 border-muted-foreground/15 text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                        )}
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Field label="What does my audience need to hear?">
                <AutoResizeTextarea
                  value={entry.vis_aud ?? ''}
                  onChange={v => update({ vis_aud: v })}
                  placeholder="Their pain, fear, desire that this content speaks to..."
                  minRows={2}
                />
              </Field>

              <Field label="What conversation am I leading?">
                <AutoResizeTextarea
                  value={entry.vis_convo ?? ''}
                  onChange={v => update({ vis_convo: v })}
                  placeholder="The bigger narrative or movement I'm driving..."
                  minRows={2}
                />
              </Field>

              <Field label="Engagement notes">
                <AutoResizeTextarea
                  value={entry.vis_engage ?? ''}
                  onChange={v => update({ vis_engage: v })}
                  placeholder="Comments, DMs, reactions worth noting..."
                  minRows={3}
                />
              </Field>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

