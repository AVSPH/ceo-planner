'use client'

import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { cn } from '@/lib/utils'
import type { InsightsData, HabitRow } from './page'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

// ── Shared primitives ──────────────────────────────────────────────────────

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border/60 bg-card/45 backdrop-blur-md p-5 space-y-4 hover:border-border transition-all select-none hover:shadow-sm', className)}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/75 select-none">{title}</p>
      {children}
    </div>
  )
}

function StatPill({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/45 backdrop-blur-md p-4 space-y-0.5 hover:border-border transition-all hover:shadow-sm select-none">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-2xl font-bold leading-tight tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground/80">{sub}</p>}
    </div>
  )
}

const chartTooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'hsl(var(--foreground))',
  backdropFilter: 'blur(8px)',
}

// ── Wellness habit card ────────────────────────────────────────────────────

const GRID_COLS = 6

function HabitCard({ habit }: { habit: HabitRow }) {
  const rows: boolean[][] = []
  for (let i = 0; i < habit.last30.length; i += GRID_COLS) {
    rows.push(habit.last30.slice(i, i + GRID_COLS))
  }

  return (
    <div className="rounded-xl border border-border/40 bg-card/30 p-3 space-y-2 hover:border-border/60 hover:bg-card/40 transition-all select-none hover:shadow-sm">
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm leading-none shrink-0">{habit.emoji}</span>
          <span className="text-xs font-medium text-foreground truncate">{habit.label}</span>
        </div>
        <span className={cn(
          'text-xs font-semibold shrink-0',
          habit.streak > 0 ? 'text-primary' : 'text-muted-foreground/60'
        )}>
          {habit.streak > 0 ? `${habit.streak}d` : '—'}
        </span>
      </div>
      <div className="space-y-0.5">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-0.5">
            {row.map((done, ci) => (
              <div
                key={ci}
                className={cn('flex-1 h-3 rounded-sm transition-all', done ? 'bg-primary/90' : 'bg-muted/40')}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────

export function InsightsClient({ data }: { data: InsightsData }) {
  const {
    energyPoints, moodFrequency, taskWeeks, thisWeekCompleted,
    revenueMonths, thisMonthRevenue, monthGoal,
    wellnessHabits, avgEnergyThisWeek, topMood,
  } = data

  const energyWithData = energyPoints.filter(p => p.energy !== null)
  const goalPct = monthGoal ? Math.min(Math.round((thisMonthRevenue / monthGoal) * 100), 100) : null

  const bodyHabits   = wellnessHabits.filter(h => h.key.startsWith('b_'))
  const spiritHabits = wellnessHabits.filter(h => h.key.startsWith('s_'))

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Insights</h1>
        <p className="text-xs text-muted-foreground/80">Growth and trend analysis over time.</p>
      </div>

      {/* ── Key stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill
          label="Avg energy"
          value={avgEnergyThisWeek ? `${avgEnergyThisWeek}/5` : '—'}
          sub="this week"
        />
        <StatPill
          label="Top mood"
          value={topMood ? `${topMood.emoji} ${topMood.label}` : '—'}
          sub={topMood ? `${topMood.count}x this month` : 'no data'}
        />
        <StatPill
          label="Tasks done"
          value={String(thisWeekCompleted)}
          sub="this week"
        />
        <StatPill
          label="Revenue"
          value={fmt(thisMonthRevenue)}
          sub={goalPct !== null ? `${goalPct}% of goal` : 'this month'}
        />
      </div>

      {/* ── Energy trend ── */}
      {energyWithData.length > 0 && (
        <Card title="Energy — last 30 days">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={energyPoints} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.4)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={6} />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(v) => [`${v as number}/5`, 'Energy']}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  const point = payload[0].payload
                  return (
                    <div className="bg-card/90 border border-border/80 backdrop-blur-md p-2.5 rounded-xl text-xs space-y-0.5 select-none shadow-md">
                      <p className="font-semibold text-foreground/90">{label}</p>
                      {point.emoji && <p className="text-xl">{point.emoji}</p>}
                      <p className="text-muted-foreground">Energy: <span className="font-semibold text-foreground/90">{payload[0].value ?? '—'}/5</span></p>
                    </div>
                  )
                }}
              />
              <Area type="monotone" dataKey="energy" stroke="#6366f1" strokeWidth={2} fill="url(#energyGrad)" connectNulls dot={false} activeDot={{ r: 4, fill: '#6366f1' }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* ── Mood frequency ── */}
      {moodFrequency.length > 0 && (
        <Card title="Mood frequency — this month">
          <div className="space-y-2.5">
            {moodFrequency.map(m => (
              <div key={m.label} className="flex items-center gap-3 select-none">
                <span className="text-lg w-7 shrink-0 text-center">{m.emoji}</span>
                <span className="text-xs font-medium w-20 shrink-0 text-foreground/90">{m.label}</span>
                <div className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden border border-border/20">
                  <div
                    className="h-2 rounded-full bg-primary/80 transition-all duration-700"
                    style={{ width: `${(m.count / (moodFrequency[0]?.count || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right shrink-0">{m.count}x</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Task completion ── */}
      <Card title="Tasks completed — last 4 weeks">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={taskWeeks} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.4)" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={chartTooltipStyle}
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="bg-card/90 border border-border/80 backdrop-blur-md p-2.5 rounded-xl text-xs space-y-0.5 select-none shadow-md">
                    <p className="font-semibold text-foreground/90">{label}</p>
                    <p className="text-muted-foreground">Completed: <span className="font-semibold text-foreground/90">{payload[0].value ?? 0}</span></p>
                  </div>
                )
              }}
            />
            <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} className="opacity-90" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ── Revenue ── */}
      <Card title="Revenue — last 6 months">
        {monthGoal && (
          <div className="flex items-center gap-3 pb-1 select-none">
            <div className="flex-1 h-2 rounded-full bg-muted/40 border border-border/20 overflow-hidden">
              <div
                className="h-2 rounded-full bg-emerald-500/80 transition-all duration-700"
                style={{ width: `${goalPct}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground/90 font-medium shrink-0">
              {fmt(thisMonthRevenue)} / <span className="text-foreground/90">{fmt(monthGoal)} goal</span>
            </span>
          </div>
        )}
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={revenueMonths} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.4)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false}
              tickFormatter={v => v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`} />
            <Tooltip
              contentStyle={chartTooltipStyle}
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="bg-card/90 border border-border/80 backdrop-blur-md p-2.5 rounded-xl text-xs space-y-0.5 select-none shadow-md">
                    <p className="font-semibold text-foreground/90">{label}</p>
                    <p className="text-muted-foreground">Revenue: <span className="font-semibold text-foreground/90">{fmt(payload[0].value as number ?? 0)}</span></p>
                  </div>
                )
              }}
            />
            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} className="opacity-90" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ── Wellness streaks ── */}
      <Card title="Wellness streaks — last 30 days">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70 select-none">Body</p>
            <div className="grid grid-cols-2 gap-2">
              {bodyHabits.map(h => <HabitCard key={h.key} habit={h} />)}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70 select-none">Spirit</p>
            <div className="grid grid-cols-2 gap-2">
              {spiritHabits.map(h => <HabitCard key={h.key} habit={h} />)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-border/40 select-none">
          <div className="flex gap-0.5">
            <div className="h-3 w-6 rounded-sm bg-primary/90" />
            <div className="h-3 w-6 rounded-sm bg-muted/40" />
          </div>
          <span className="text-[10px] text-muted-foreground/80">Done / Missed · bottom-right = today · number = current streak</span>
        </div>
      </Card>
    </div>
  )
}
