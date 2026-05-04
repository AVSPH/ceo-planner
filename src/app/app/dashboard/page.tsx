import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { TodayClient } from './today-client'

const WELLNESS_KEYS = [
  'b_cycle', 'b_meals', 'b_move', 'b_sleep', 'b_walk', 'b_water',
] as const

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const today = new Date().toISOString().split('T')[0]

  const yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterday = yesterdayDate.toISOString().split('T')[0]

  const fourteenAgo = new Date()
  fourteenAgo.setDate(fourteenAgo.getDate() - 14)
  const fourteenAgoStr = fourteenAgo.toISOString().split('T')[0]

  const [
    { data: entry },
    { data: profile },
    { data: recentEntries },
    { count: openTasksCount },
  ] = await Promise.all([
    supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', today)
      .maybeSingle(),
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single(),
    supabase
      .from('daily_entries')
      .select('entry_date, b_cycle, b_meals, b_move, b_sleep, b_walk, b_water, g_win, eod_celebrate')
      .eq('user_id', user.id)
      .gte('entry_date', fourteenAgoStr)
      .lte('entry_date', yesterday)
      .order('entry_date', { ascending: false }),
    supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_done', false),
  ])

  const firstName = profile?.full_name?.split(' ')[0] ?? ''

  // streak: consecutive logged days ending yesterday
  let streak = 0
  if (recentEntries?.length) {
    const dates = new Set(recentEntries.map(e => e.entry_date))
    const cursor = new Date(yesterdayDate)
    while (dates.has(cursor.toISOString().split('T')[0])) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }
  }

  // wellness score: % of body booleans true over last 7 logged days
  const last7 = recentEntries?.slice(0, 7) ?? []
  let wellnessScore = 0
  if (last7.length > 0) {
    let trueCount = 0
    for (const e of last7) {
      for (const k of WELLNESS_KEYS) {
        if (e[k]) trueCount++
      }
    }
    wellnessScore = Math.round((trueCount / (last7.length * WELLNESS_KEYS.length)) * 100)
  }

  const yesterdayEntry = recentEntries?.find(e => e.entry_date === yesterday)
  const yesterdayWin = yesterdayEntry?.eod_celebrate ?? yesterdayEntry?.g_win ?? null

  return (
    <TodayClient
      userId={user.id}
      date={today}
      initialEntry={entry}
      firstName={firstName}
      insights={{
        streak,
        wellnessScore,
        openTasks: openTasksCount ?? 0,
        yesterdayWin,
      }}
    />
  )
}
