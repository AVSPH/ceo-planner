import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { InsightsClient } from './insights-client'
import type { Tables } from '@/types/database'

type DailyEntry    = Tables<'daily_entries'>
type Task          = Tables<'tasks'>
type RevenueEntry  = Tables<'revenue_entries'>

// ── Types passed to client ─────────────────────────────────────────────────

export interface EnergyPoint  { date: string; energy: number | null; emoji: string | null }
export interface MoodCount    { label: string; emoji: string; count: number }
export interface WeekBar      { week: string; completed: number }
export interface MonthBar     { month: string; revenue: number }
export interface HabitRow     { key: string; label: string; emoji: string; streak: number; last30: boolean[] }

export interface InsightsData {
  energyPoints:     EnergyPoint[]
  moodFrequency:    MoodCount[]
  taskWeeks:        WeekBar[]
  thisWeekCompleted: number
  revenueMonths:    MonthBar[]
  thisMonthRevenue: number
  monthGoal:        number | null
  wellnessHabits:   HabitRow[]
  avgEnergyThisWeek: number | null
  topMood:          MoodCount | null
}

// ── Processing helpers ─────────────────────────────────────────────────────

function last30Dates(): string[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().split('T')[0]
  })
}

function shortDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function energyPoints(entries: DailyEntry[], dates: string[]): EnergyPoint[] {
  const map = new Map(entries.map(e => [e.entry_date, e]))
  return dates.map(date => {
    const e = map.get(date)
    return {
      date:   shortDate(date),
      energy: e?.energy ? parseInt(e.energy, 10) : null,
      emoji:  e?.mood_emoji ?? null,
    }
  })
}

function moodFrequency(entries: DailyEntry[]): MoodCount[] {
  const counts = new Map<string, { count: number; emoji: string }>()
  for (const e of entries) {
    if (!e.mood_label) continue
    const cur = counts.get(e.mood_label) ?? { count: 0, emoji: e.mood_emoji ?? '' }
    counts.set(e.mood_label, { count: cur.count + 1, emoji: e.mood_emoji ?? cur.emoji })
  }
  return Array.from(counts.entries())
    .map(([label, { count, emoji }]) => ({ label, emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
}

function taskWeeks(tasks: Task[]): { bars: WeekBar[]; thisWeek: number } {
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  const bars: WeekBar[] = []

  for (let w = 3; w >= 0; w--) {
    const end = new Date(today)
    end.setDate(today.getDate() - w * 7)
    const start = new Date(end)
    start.setDate(end.getDate() - 6)
    start.setHours(0, 0, 0, 0)

    const completed = tasks.filter(t => {
      if (!t.completed_at) return false
      const ca = new Date(t.completed_at)
      return ca >= start && ca <= end
    }).length

    bars.push({ week: shortDate(start.toISOString().split('T')[0]), completed })
  }

  return { bars, thisWeek: bars[bars.length - 1].completed }
}

function revenueMonths(entries: RevenueEntry[]): { bars: MonthBar[]; thisMonth: number } {
  const now = new Date()
  const bars: MonthBar[] = []

  for (let m = 5; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const total = entries.filter(e => e.entry_date.startsWith(key)).reduce((s, e) => s + e.amount, 0)
    bars.push({ month: d.toLocaleDateString('en-US', { month: 'short' }), revenue: total })
  }

  return { bars, thisMonth: bars[bars.length - 1].revenue }
}

const ALL_HABITS = [
  { key: 'b_water', label: 'Water',     emoji: '💧' },
  { key: 'b_move',  label: 'Move',      emoji: '🏃' },
  { key: 'b_meals', label: 'Meals',     emoji: '🥗' },
  { key: 'b_walk',  label: 'Walk',      emoji: '🚶' },
  { key: 'b_sleep', label: 'Sleep',     emoji: '😴' },
  { key: 'b_cycle', label: 'Cycle',     emoji: '🌙' },
  { key: 's_prayer',label: 'Prayer',    emoji: '🙏' },
  { key: 's_med',   label: 'Meditate',  emoji: '🧘' },
  { key: 's_scrip', label: 'Scripture', emoji: '📖' },
  { key: 's_breath',label: 'Breathe',   emoji: '🫁' },
  { key: 's_viz',   label: 'Visualize', emoji: '👁️' },
  { key: 's_intuit',label: 'Intuition', emoji: '💭' },
] as const

function wellnessHabits(entries: DailyEntry[], dates: string[]): HabitRow[] {
  const map = new Map(entries.map(e => [e.entry_date, e]))
  return ALL_HABITS.map(({ key, label, emoji }) => {
    const last30 = dates.map(d => map.get(d)?.[key as keyof DailyEntry] === true)
    let streak = 0
    for (let i = last30.length - 1; i >= 0; i--) {
      if (last30[i]) streak++
      else break
    }
    return { key, label, emoji, streak, last30 }
  })
}

function avgEnergyThisWeek(entries: DailyEntry[]): number | null {
  const today = new Date()
  const weekAgo = new Date(today)
  weekAgo.setDate(today.getDate() - 6)
  const isoWeekAgo = weekAgo.toISOString().split('T')[0]

  const vals = entries
    .filter(e => e.entry_date >= isoWeekAgo && e.energy)
    .map(e => parseInt(e.energy!, 10))
    .filter(n => !isNaN(n))

  if (!vals.length) return null
  return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function InsightsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const thirtyDaysAgo = (() => {
    const d = new Date(); d.setDate(d.getDate() - 29)
    return d.toISOString().split('T')[0]
  })()

  const sixMonthsAgo = (() => {
    const d = new Date(); d.setMonth(d.getMonth() - 5); d.setDate(1)
    return d.toISOString().split('T')[0]
  })()

  const [
    { data: dailyRows },
    { data: tasks },
    { data: revenue },
    { data: permanent },
  ] = await Promise.all([
    supabase.from('daily_entries').select('*').eq('user_id', user.id).gte('entry_date', thirtyDaysAgo).order('entry_date'),
    supabase.from('tasks').select('*').eq('user_id', user.id),
    supabase.from('revenue_entries').select('*').eq('user_id', user.id).gte('entry_date', sixMonthsAgo),
    supabase.from('permanent_data').select('p_month_goal').eq('user_id', user.id).maybeSingle(),
  ])

  const dates     = last30Dates()
  const entries   = dailyRows ?? []
  const taskList  = tasks ?? []
  const revList   = revenue ?? []
  const tw        = taskWeeks(taskList)
  const rm        = revenueMonths(revList)
  const moodFreq  = moodFrequency(entries)

  const data: InsightsData = {
    energyPoints:      energyPoints(entries, dates),
    moodFrequency:     moodFreq,
    taskWeeks:         tw.bars,
    thisWeekCompleted: tw.thisWeek,
    revenueMonths:     rm.bars,
    thisMonthRevenue:  rm.thisMonth,
    monthGoal:         permanent?.p_month_goal ?? null,
    wellnessHabits:    wellnessHabits(entries, dates),
    avgEnergyThisWeek: avgEnergyThisWeek(entries),
    topMood:           moodFreq[0] ?? null,
  }

  return <InsightsClient data={data} />
}
