'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { usePermanent } from '@/hooks/use-permanent'
import { AutoResizeTextarea } from '@/components/today/auto-resize-textarea'
import type { Tables, TablesUpdate } from '@/types/database'

type PermanentData = Tables<'permanent_data'>
type Tab = 'identity' | 'goals' | 'money'

const TABS: { id: Tab; label: string }[] = [
  { id: 'identity', label: 'Identity' },
  { id: 'goals',    label: 'Goals' },
  { id: 'money',    label: 'Money Goals' },
]

// ── Shared primitives ──────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  )
}

function Field({
  label, sublabel, children,
}: {
  label: string
  sublabel?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div>
        <label className="text-sm font-medium">{label}</label>
        {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
      </div>
      {children}
    </div>
  )
}

function TA({
  value, onChange, placeholder, minRows = 2,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  minRows?: number
}) {
  return (
    <AutoResizeTextarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      minRows={minRows}
    />
  )
}

function CurrencyInput({
  value, onChange, placeholder = '0',
}: {
  value: number | null
  onChange: (v: number | null) => void
  placeholder?: string
}) {
  return (
    <div className="flex items-center gap-1 border-b border-border focus-within:border-primary pb-1 transition-colors">
      <span className="text-sm text-muted-foreground">$</span>
      <input
        type="number"
        min="0"
        step="1"
        value={value ?? ''}
        onChange={e => onChange(e.target.value ? parseFloat(e.target.value) : null)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
      />
    </div>
  )
}

// ── Identity tab ───────────────────────────────────────────────────────────

function IdentityTab({ data, update }: { data: Partial<PermanentData>; update: (f: TablesUpdate<'permanent_data'>) => void }) {
  return (
    <div className="space-y-5">
      {/* Word of the year */}
      <div className="rounded-xl border bg-card p-6 text-center space-y-2">
        <SectionLabel>Word of the Year</SectionLabel>
        <input
          value={data.p_word ?? ''}
          onChange={e => update({ p_word: e.target.value })}
          placeholder="e.g. Abundance"
          className="w-full text-center text-3xl font-bold bg-transparent outline-none placeholder:text-muted-foreground/30 placeholder:text-2xl"
        />
      </div>

      {/* CEO Identity */}
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <SectionLabel>CEO Identity</SectionLabel>

        <Field label="Who I'm becoming" sublabel="This season's growth edge">
          <TA value={data.p_becoming ?? ''} onChange={v => update({ p_becoming: v })} placeholder="I am becoming a leader who..." />
        </Field>

        <Field label="Business mission">
          <TA value={data.p_mission ?? ''} onChange={v => update({ p_mission: v })} placeholder="I exist to..." />
        </Field>

        <Field label="My why" sublabel="The deeper reason behind the work">
          <TA value={data.p_why ?? ''} onChange={v => update({ p_why: v })} placeholder="I do this because..." minRows={3} />
        </Field>
      </div>

      {/* Dream Life */}
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <SectionLabel>Dream Life</SectionLabel>

        <Field label="Vision for this year">
          <TA value={data.p_vision ?? ''} onChange={v => update({ p_vision: v })} placeholder="By end of year I will..." minRows={3} />
        </Field>

        <Field label="Dream lifestyle">
          <TA value={data.p_lifestyle ?? ''} onChange={v => update({ p_lifestyle: v })} placeholder="What does my ideal day look like?" minRows={3} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Ideal client profile">
            <TA value={data.p_client ?? ''} onChange={v => update({ p_client: v })} placeholder="Who do I serve best?" />
          </Field>
          <Field label="Signature offer">
            <TA value={data.p_offer ?? ''} onChange={v => update({ p_offer: v })} placeholder="My core service or product" />
          </Field>
        </div>
      </div>

      {/* Business Values */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <SectionLabel>Business Values</SectionLabel>
        <p className="text-xs text-muted-foreground">Up to 6 core values that guide how you operate.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(['p_v1', 'p_v2', 'p_v3', 'p_v4', 'p_v5', 'p_v6'] as const).map((k, i) => (
            <div key={k} className="rounded-lg border bg-muted/30 px-3 py-2.5 space-y-1">
              <p className="text-[10px] text-muted-foreground font-medium">Value {i + 1}</p>
              <input
                value={data[k] ?? ''}
                onChange={e => update({ [k]: e.target.value })}
                placeholder="e.g. Integrity"
                className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/40"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Goals tab ──────────────────────────────────────────────────────────────

function GoalsTab({ data, update }: { data: Partial<PermanentData>; update: (f: TablesUpdate<'permanent_data'>) => void }) {
  return (
    <div className="space-y-5">
      {/* Annual */}
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <SectionLabel>Annual Vision</SectionLabel>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Annual revenue goal">
            <TA value={data.p_annual ?? ''} onChange={v => update({ p_annual: v })} placeholder="$X by Dec 31" />
          </Field>
          <Field label="Annual personal goal">
            <TA value={data.p_personal ?? ''} onChange={v => update({ p_personal: v })} placeholder="Personal milestone" />
          </Field>
        </div>

        <Field label="Annual business goal">
          <TA value={data.p_bizgoal ?? ''} onChange={v => update({ p_bizgoal: v })} placeholder="What does business success look like?" minRows={2} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Mid-year check-in" sublabel="June reflection">
            <TA value={data.p_midyear ?? ''} onChange={v => update({ p_midyear: v })} placeholder="Where will I be at mid-year?" />
          </Field>
          <Field label="Year-end vision" sublabel="December celebration">
            <TA value={data.p_yearend ?? ''} onChange={v => update({ p_yearend: v })} placeholder="What am I celebrating Dec 31?" />
          </Field>
        </div>
      </div>

      {/* Quarterly */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <SectionLabel>Quarterly Focus</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {(['p_q1', 'p_q2', 'p_q3', 'p_q4'] as const).map((k, i) => (
            <Field key={k} label={`Q${i + 1} Goal`}>
              <TA
                value={data[k] ?? ''}
                onChange={v => update({ [k]: v })}
                placeholder={`Q${i + 1} focus and target`}
                minRows={2}
              />
            </Field>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Money Goals tab ────────────────────────────────────────────────────────

function MoneyGoalsTab({ data, update }: { data: Partial<PermanentData>; update: (f: TablesUpdate<'permanent_data'>) => void }) {
  return (
    <div className="space-y-5">
      {/* Income & Sales */}
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <SectionLabel>Income &amp; Sales Goals</SectionLabel>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Annual income goal">
            <CurrencyInput value={data.p_income_goal ?? null} onChange={v => update({ p_income_goal: v })} />
          </Field>
          <Field label="Monthly sales goal">
            <CurrencyInput value={data.p_month_goal ?? null} onChange={v => update({ p_month_goal: v })} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Clients needed to hit goal">
            <TA value={data.p_clients ?? ''} onChange={v => update({ p_clients: v })} placeholder="e.g. 4 clients at $2,500/mo" />
          </Field>
          <Field label="Offer sales goal">
            <TA value={data.p_offer_goal ?? ''} onChange={v => update({ p_offer_goal: v })} placeholder="e.g. 10 units of signature offer" />
          </Field>
        </div>

        <Field label="Revenue-creating activities" sublabel="Daily actions that generate income">
          <TA value={data.p_rev_act ?? ''} onChange={v => update({ p_rev_act: v })} placeholder="DMs, discovery calls, content, follow-ups..." minRows={2} />
        </Field>
      </div>

      {/* Living Budget */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <SectionLabel>Essential Living Budget</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-4">
          {([
            ['p_rent', 'Rent / mortgage'],
            ['p_food', 'Food & groceries'],
            ['p_transport', 'Transport'],
            ['p_insurance', 'Insurance'],
            ['p_internet', 'Internet / phone'],
          ] as const).map(([k, label]) => (
            <Field key={k} label={label}>
              <CurrencyInput value={(data[k] as number | null) ?? null} onChange={v => update({ [k]: v })} />
            </Field>
          ))}
          <Field label="Other bills">
            <AutoResizeTextarea
              value={data.p_other_bills ?? ''}
              onChange={v => update({ p_other_bills: v })}
              placeholder="List + amounts"
              minRows={1}
            />
          </Field>
        </div>
      </div>

      {/* Business Budget */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <SectionLabel>Recurring Business Expenses</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-4">
          {([
            ['p_website', 'Website / hosting'],
            ['p_email_mkt', 'Email marketing'],
            ['p_subs', 'Subscriptions'],
            ['p_coaching', 'Coaching / courses'],
            ['p_ads', 'Paid ads'],
          ] as const).map(([k, label]) => (
            <Field key={k} label={label}>
              <CurrencyInput value={(data[k] as number | null) ?? null} onChange={v => update({ [k]: v })} />
            </Field>
          ))}
          <Field label="Other business">
            <AutoResizeTextarea
              value={data.p_other_biz ?? ''}
              onChange={v => update({ p_other_biz: v })}
              placeholder="List + amounts"
              minRows={1}
            />
          </Field>
        </div>
      </div>
    </div>
  )
}

// ── Main client ────────────────────────────────────────────────────────────

interface Props {
  userId:      string
  initialData: Tables<'permanent_data'> | null
}

export function VisionClient({ userId, initialData }: Props) {
  const [tab, setTab] = useState<Tab>('identity')
  const { data, saving, update } = usePermanent(userId, initialData)

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vision</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Permanent — set once, revisit anytime.</p>
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
          {tab === 'identity' && <IdentityTab data={data} update={update} />}
          {tab === 'goals'    && <GoalsTab    data={data} update={update} />}
          {tab === 'money'    && <MoneyGoalsTab data={data} update={update} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
