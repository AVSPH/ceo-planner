import { createAdminClient } from '@/utils/supabase/admin'
import { StatsCard } from '@/components/admin/stats-card'

export default async function AdminOverviewPage() {
  const supabase = createAdminClient()

  const [{ data: { users } }, { data: profiles }] = await Promise.all([
    supabase.auth.admin.listUsers(),
    supabase.from('profiles').select('id, full_name, is_active, onboarding_completed, created_at'),
  ])

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const total = profiles?.length ?? 0
  const active = profiles?.filter(p => p.is_active).length ?? 0
  const pending = profiles?.filter(p => !p.is_active).length ?? 0
  const onboarded = profiles?.filter(p => p.onboarding_completed).length ?? 0
  const newThisWeek = profiles?.filter(p => p.created_at && new Date(p.created_at) >= weekAgo).length ?? 0
  const newThisMonth = profiles?.filter(p => p.created_at && new Date(p.created_at) >= monthAgo).length ?? 0

  const recentUsers = users
    .filter(u => profiles?.find(p => p.id === u.id))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
    .map(u => ({
      id: u.id,
      email: u.email ?? '',
      profile: profiles?.find(p => p.id === u.id),
      createdAt: u.created_at,
    }))

  return (
    <div className="px-8 py-8 space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Platform snapshot</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard label="Total Users" value={total} accent="blue" />
        <StatsCard label="Active" value={active} accent="emerald" />
        <StatsCard label="Pending Approval" value={pending} accent="amber" />
        <StatsCard label="Onboarding Done" value={onboarded} sub={`${total ? Math.round((onboarded / total) * 100) : 0}% of total`} />
        <StatsCard label="New This Week" value={newThisWeek} accent="blue" />
        <StatsCard label="New This Month" value={newThisMonth} />
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3">Recent Signups</h2>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Name / Email</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Joined</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Onboarding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentUsers.map(u => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-[200px]">{u.profile?.full_name || '—'}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge active={!!u.profile?.is_active} />
                  </td>
                  <td className="px-4 py-3">
                    <OnboardingBadge done={!!u.profile?.onboarding_completed} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
      active
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {active ? 'Active' : 'Pending'}
    </span>
  )
}

function OnboardingBadge({ done }: { done: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
      done
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        : 'bg-muted text-muted-foreground'
    }`}>
      {done ? 'Complete' : 'Pending'}
    </span>
  )
}
