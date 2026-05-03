'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { useDailyEntry } from '@/hooks/use-daily-entry'
import { AutoResizeTextarea } from '@/components/today/auto-resize-textarea'
import type { Tables } from '@/types/database'

type Tab = 'plan' | 'reflect'

const TABS: { id: Tab; label: string }[] = [
  { id: 'plan',    label: 'Content Plan' },
  { id: 'reflect', label: 'Reflection' },
]

const PLATFORMS = [
  { key: 'fb',  label: 'Facebook',  color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  { key: 'ig',  label: 'Instagram', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' },
  { key: 'li',  label: 'LinkedIn',  color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
  { key: 'tt',  label: 'TikTok',    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { key: 'yt',  label: 'YouTube',   color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
] as const

const PILLARS = [
  { value: 'Educational',   color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  { value: 'Storytelling',  color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  { value: 'Promotional',   color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  { value: 'Inspirational', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { value: 'Other',         color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
] as const

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
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
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Visibility</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{displayDate}</p>
        </div>
        <AnimatePresence>
          {saving && (
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

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {/* ── Content Plan ── */}
          {tab === 'plan' && (
            <div className="rounded-xl border bg-card p-6 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Content Plan
              </p>

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

              <div className="space-y-2">
                <label className="text-sm font-medium">Platforms today</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(({ key, label, color }) => {
                    const active = activePlatforms.includes(key)
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => togglePlatform(key)}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150',
                          active
                            ? color + ' ring-2 ring-offset-1 ring-current'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
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
            <div className="rounded-xl border bg-card p-6 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Content Reflection
              </p>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content pillar</label>
                <div className="flex flex-wrap gap-2">
                  {PILLARS.map(({ value, color }) => {
                    const active = entry.vis_pillar === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => update({ vis_pillar: active ? null : value })}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150',
                          active
                            ? color + ' ring-2 ring-offset-1 ring-current'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
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
