'use client'
import { useState, useMemo, useTransition } from 'react'
import { approveUser, deactivateUser, bulkApproveUsers, resetUserPassword } from '@/lib/actions/admin'
import { ResetPasswordDialog } from '@/components/admin/reset-password-dialog'
import { LuDownload } from 'react-icons/lu'

type User = {
  id: string
  email: string
  createdAt: string
  lastSignIn: string | null
  profile: {
    full_name?: string | null
    is_active?: boolean | null
    onboarding_completed?: boolean | null
    created_at?: string | null
  } | null
}

type Filter = 'all' | 'pending' | 'active'

export function UsersTable({ users }: { users: User[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    return users.filter(u => {
      const q = search.toLowerCase()
      const matchesSearch =
        u.email.toLowerCase().includes(q) ||
        (u.profile?.full_name ?? '').toLowerCase().includes(q)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && u.profile?.is_active) ||
        (filter === 'pending' && !u.profile?.is_active)
      return matchesSearch && matchesFilter
    })
  }, [users, search, filter])

  const pendingInView = filtered.filter(u => !u.profile?.is_active)

  const counts = useMemo(() => ({
    all: users.length,
    pending: users.filter(u => !u.profile?.is_active).length,
    active: users.filter(u => u.profile?.is_active).length,
  }), [users])

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAllPending() {
    const pendingIds = pendingInView.map(u => u.id)
    const allSelected = pendingIds.every(id => selected.has(id))
    setSelected(prev => {
      const next = new Set(prev)
      if (allSelected) pendingIds.forEach(id => next.delete(id))
      else pendingIds.forEach(id => next.add(id))
      return next
    })
  }

  function handleBulkApprove() {
    const ids = Array.from(selected)
    startTransition(async () => {
      await bulkApproveUsers(ids)
      setSelected(new Set())
    })
  }

  function exportCSV() {
    const headers = ['Name', 'Email', 'Joined', 'Status', 'Onboarding', 'Last Sign In']
    const rows = filtered.map(u => [
      u.profile?.full_name ?? '',
      u.email,
      new Date(u.createdAt).toLocaleDateString(),
      u.profile?.is_active ? 'Active' : 'Pending',
      u.profile?.onboarding_completed ? 'Complete' : 'Pending',
      u.lastSignIn ? new Date(u.lastSignIn).toLocaleDateString() : '',
    ])
    const csv = [headers, ...rows]
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring w-64"
        />
        <div className="flex items-center gap-1 rounded-md border border-border p-0.5 bg-muted/30">
          {(['all', 'pending', 'active'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
                filter === f ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleBulkApprove}
              disabled={isPending}
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Approving…' : `Approve ${selected.size} Selected`}
            </button>
          )}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
          >
            <LuDownload size={13} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-2.5 w-8">
                {pendingInView.length > 0 && (
                  <input
                    type="checkbox"
                    checked={pendingInView.every(u => selected.has(u.id))}
                    onChange={toggleAllPending}
                    className="rounded"
                  />
                )}
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">User</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Joined</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Last Sign In</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Onboarding</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">No users found</td>
              </tr>
            ) : (
              filtered.map(u => {
                const isPending = !u.profile?.is_active
                return (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      {isPending && (
                        <input
                          type="checkbox"
                          checked={selected.has(u.id)}
                          onChange={() => toggleSelect(u.id)}
                          className="rounded"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium truncate max-w-[180px]">{u.profile?.full_name || '—'}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">{u.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {u.lastSignIn ? new Date(u.lastSignIn).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.profile?.is_active
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.profile?.is_active ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {u.profile?.is_active ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.profile?.onboarding_completed
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {u.profile?.onboarding_completed ? 'Complete' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {u.profile?.is_active ? (
                          <form action={deactivateUser.bind(null, u.id)}>
                            <button type="submit" className="rounded-md border border-destructive/40 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
                              Deactivate
                            </button>
                          </form>
                        ) : (
                          <form action={approveUser.bind(null, u.id)}>
                            <button type="submit" className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 transition-colors">
                              Approve
                            </button>
                          </form>
                        )}
                        <ResetPasswordDialog
                          targetName={u.profile?.full_name ?? ''}
                          targetEmail={u.email}
                          action={resetUserPassword.bind(null, u.id)}
                        />
                      </div>
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
