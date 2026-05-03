import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { TodayClient } from './today-client'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const today = new Date().toISOString().split('T')[0]

  const [{ data: entry }, { data: profile }] = await Promise.all([
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
  ])

  const firstName = profile?.full_name?.split(' ')[0] ?? ''

  return (
    <TodayClient
      userId={user.id}
      date={today}
      initialEntry={entry}
      firstName={firstName}
    />
  )
}
