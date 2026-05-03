import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { MoneyClient } from './money-client'

export default async function MoneyPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const today = new Date().toISOString().split('T')[0]

  const [
    { data: entry },
    { data: revenue },
    { data: expenses },
    { data: debt },
    { data: permanent },
  ] = await Promise.all([
    supabase.from('daily_entries').select('*').eq('user_id', user.id).eq('entry_date', today).maybeSingle(),
    supabase.from('revenue_entries').select('*').eq('user_id', user.id).order('entry_date', { ascending: false }),
    supabase.from('expense_entries').select('*').eq('user_id', user.id).order('entry_date', { ascending: false }),
    supabase.from('debt_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
    supabase.from('permanent_data').select('p_month_goal, p_income_goal').eq('user_id', user.id).maybeSingle(),
  ])

  return (
    <MoneyClient
      userId={user.id}
      today={today}
      initialEntry={entry}
      initialRevenue={revenue ?? []}
      initialExpenses={expenses ?? []}
      initialDebt={debt ?? []}
      monthGoal={permanent?.p_month_goal ?? null}
      yearGoal={permanent?.p_income_goal ?? null}
    />
  )
}
