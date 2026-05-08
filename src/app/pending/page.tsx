import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/lib/actions/auth'
import { PendingAutoRefresh } from '@/components/pending-auto-refresh'

export default async function PendingPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_active, onboarding_completed')
    .eq('id', user.id)
    .single()

  if (profile?.is_active) {
    redirect(profile.onboarding_completed ? '/app' : '/onboarding')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <PendingAutoRefresh />
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Account Pending Approval</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your account is under review. Once we confirm your payment, you'll get full access.
            This usually takes less than 24 hours. This page checks automatically every 30 seconds.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Logged in as <span className="font-medium text-foreground">{user.email}</span>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href="/pending"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            Check Now
          </a>
          <form action={signOut}>
            <button type="submit" className="w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
