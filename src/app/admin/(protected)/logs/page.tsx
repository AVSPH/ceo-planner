import { createAdminClient } from '@/utils/supabase/admin'

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  approve_user: { label: 'Approved user', color: 'text-emerald-600 dark:text-emerald-400' },
  deactivate_user: { label: 'Deactivated user', color: 'text-amber-600 dark:text-amber-400' },
  create_admin: { label: 'Created admin', color: 'text-blue-600 dark:text-blue-400' },
  remove_admin: { label: 'Removed admin', color: 'text-rose-600 dark:text-rose-400' },
  change_password: { label: 'Changed password', color: 'text-muted-foreground' },
}

export default async function AdminLogsPage() {
  const supabase = createAdminClient()

  const { data: logs } = await supabase
    .from('admin_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  return (
    <div className="px-8 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Audit Log</h1>
        <p className="text-sm text-muted-foreground mt-0.5">All admin actions — last 200 entries</p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">When</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Admin</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Action</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!logs?.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">No logs yet</td>
              </tr>
            ) : (
              logs.map(log => {
                const meta = ACTION_LABELS[log.action] ?? { label: log.action, color: 'text-foreground' }
                return (
                  <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs truncate max-w-[160px]">{log.admin_email}</td>
                    <td className={`px-4 py-3 text-xs font-medium ${meta.color}`}>{meta.label}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-[200px]">
                      {log.target_email || log.target_id || '—'}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
