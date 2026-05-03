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
    <div className={cn('rounded-xl border bg-card p-5 space-y-4', className)}>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
      {children}
    </div>
  )
}

function StatPill({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-0.5">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-2xl font-bold leading-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

const chartTooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'hsl(var(--foreground))',
}

// ── Wellness streak heatmap ────────────────────────────────────────────────

function HabitHeatmap({ habit }: { habit: HabitRow }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-base leading-none w-6 shrink-0">{habit.emoji}</span>
      <span className="text-xs font-medium w-16 shrink-0 text-muted-foreground">{habit.label}</span>
      <div className="flex gap-0.5 flex-1">
        {habit.last30.map((done, i) => (
          <div
            key={i}
            title={done ? 'Done' : 'Missed'}
            className={cn(
              'h-3.5 flex-1 rounded-sm transition-colors',
              done ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>
      <span className={cn(
        'text-xs font-semibold w-10 text-right shrink-0',
        habit.streak > 0 ? 'text-primary' : 'text-muted-foreground'
      )}>
        {habit.streak > 0 ? `${habit.streak}d` : '—'}
      </span>
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
      <h1 className="text-2xl font-bold">Insights</h1>

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
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={6} />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(v) => [`${v as number}/5`, 'Energy']}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  const point = payload[0].payload
                  return (
                    <div style={chartTooltipStyle} className="px-3 py-2 space-y-0.5">
                      <p className="font-medium">{label}</p>
                      {point.emoji && <p className="text-lg">{point.emoji}</p>}
                      <p>Energy: {payload[0].value ?? '—'}/5</p>
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
              <div key={m.label} className="flex items-center gap-3">
                <span className="text-lg w-7 shrink-0">{m.emoji}</span>
                <span className="text-xs font-medium w-20 shrink-0">{m.label}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-700"
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
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [v as number, 'Completed']} />
            <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ── Revenue ── */}
      <Card title="Revenue — last 6 months">
        {monthGoal && (
          <div className="flex items-center gap-3 pb-1">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${goalPct}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {fmt(thisMonthRevenue)} / {fmt(monthGoal)} goal
            </span>
          </div>
        )}
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={revenueMonths} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false}
              tickFormatter={v => v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`} />
            <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [fmt(v as number), 'Revenue']} />
            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ── Wellness streaks ── */}
      <Card title="Wellness streaks — last 30 days">
        <div className="space-y-5">
          <div className="space-y-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Body</p>
            {bodyHabits.map(h => <HabitHeatmap key={h.key} habit={h} />)}
          </div>
          <div className="space-y-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Spirit</p>
            {spiritHabits.map(h => <HabitHeatmap key={h.key} habit={h} />)}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t">
          <div className="flex gap-0.5">
            <div className="h-3 w-6 rounded-sm bg-primary" />
            <div className="h-3 w-6 rounded-sm bg-muted" />
          </div>
          <span className="text-[10px] text-muted-foreground">Done / Missed · rightmost = today · number = current streak</span>
        </div>
      </Card>
    </div>
  )
}
