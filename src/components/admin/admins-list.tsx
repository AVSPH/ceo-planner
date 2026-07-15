'use client'
import { removeAdmin, resetAdminPassword } from '@/lib/actions/admin'
import { ResetPasswordDialog } from '@/components/admin/reset-password-dialog'

type Admin = {
  id: string
  email: string
  full_name: string | null
  created_at: string | null
}

export function AdminsList({ admins, currentAdminId }: { admins: Admin[]; currentAdminId: string }) {
  return (
    <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
      {admins.length === 0 && (
        <p className="px-4 py-6 text-sm text-muted-foreground text-center">No admins found</p>
      )}
      {admins.map(admin => {
        const isSelf = admin.id === currentAdminId
        return (
          <div key={admin.id} className="flex items-center justify-between px-4 py-3 gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate flex items-center gap-1.5">
                {admin.full_name || '—'}
                {isSelf && (
                  <span className="text-xs font-normal text-muted-foreground bg-muted rounded-full px-2 py-0.5">You</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
              <p className="text-xs text-muted-foreground">
                Added {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : '—'}
              </p>
            </div>
            {!isSelf && (
              <div className="flex items-center gap-2 shrink-0">
                <ResetPasswordDialog
                  targetName={admin.full_name ?? ''}
                  targetEmail={admin.email}
                  action={resetAdminPassword.bind(null, admin.id)}
                />
                <form action={removeAdmin.bind(null, admin.id)}>
                  <button
                    type="submit"
                    className="rounded-md border border-destructive/40 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                  >
                    Remove
                  </button>
                </form>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
