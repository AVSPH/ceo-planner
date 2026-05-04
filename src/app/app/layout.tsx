import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { AppDock } from '@/components/app/app-dock'
import { ThemeProvider } from '@/components/theme-provider'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) redirect('/onboarding')

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      themes={['light', 'dark', 'indigo', 'rose', 'emerald', 'amber', 'midnight']}
    >
    <div className="flex flex-col h-screen overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 pb-28">{children}</main>
      <AppDock />
    </div>
    </ThemeProvider>  
  )
}
