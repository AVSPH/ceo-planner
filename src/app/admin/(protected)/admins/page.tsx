import { createAdminClient } from '@/utils/supabase/admin'
import { verifyAdminSession } from '@/lib/actions/admin'
import { AddAdminForm } from '@/components/admin/add-admin-form'
import { AdminsList } from '@/components/admin/admins-list'
import { ChangePasswordForm } from '@/components/admin/change-password-form'

export default async function AdminsPage() {
  const session = await verifyAdminSession()
  const supabase = createAdminClient()

  const { data: admins } = await supabase
    .from('admin_users')
    .select('id, email, full_name, created_at')
    .order('created_at', { ascending: true })

  return (
    <div className="px-8 py-8 space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Admins</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage administrator accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">Current Admins</h2>
          <AdminsList admins={admins ?? []} currentAdminId={session?.adminId ?? ''} />
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold">Add Co-Admin</h2>
            <div className="rounded-lg border border-border p-5">
              <AddAdminForm />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold">Change Your Password</h2>
            <div className="rounded-lg border border-border p-5">
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
