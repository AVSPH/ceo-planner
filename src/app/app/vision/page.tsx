import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { VisionClient } from './vision-client'

export default async function VisionPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data } = await supabase
    .from('permanent_data')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return <VisionClient userId={user.id} initialData={data} />
}
