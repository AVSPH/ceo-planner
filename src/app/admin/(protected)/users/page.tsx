import { createAdminClient } from '@/utils/supabase/admin'
import { UsersTable } from '@/components/admin/users-table'

export default async function AdminUsersPage() {
  const supabase = createAdminClient()

  const [{ data: { users } }, { data: profiles }] = await Promise.all([
    supabase.auth.admin.listUsers(),
    supabase.from('profiles').select('id, full_name, is_active, onboarding_completed, created_at'),
  ])

  const userList = users.map(u => ({
    id: u.id,
    email: u.email ?? '',
    createdAt: u.created_at,
    lastSignIn: u.last_sign_in_at ?? null,
    profile: profiles?.find(p => p.id === u.id) ?? null,
  }))

  return (
    <div className="px-8 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{userList.length} total registered</p>
      </div>
      <UsersTable users={userList} />
    </div>
  )
}
