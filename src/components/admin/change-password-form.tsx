'use client'
import { useActionState, useState } from 'react'
import { changeAdminPassword } from '@/lib/actions/admin'
import { HiEye, HiEyeOff } from 'react-icons/hi'

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changeAdminPassword, null)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
          {state.success}
        </p>
      )}

      <div className="space-y-1.5">
        <label htmlFor="current_password" className="text-sm font-medium">Current Password</label>
        <div className="relative">
          <input
            id="current_password"
            name="current_password"
            type={showCurrent ? 'text' : 'password'}
            required
            placeholder="••••••••"
            className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {showCurrent ? <HiEyeOff size={16} /> : <HiEye size={16} />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="new_password" className="text-sm font-medium">New Password</label>
        <div className="relative">
          <input
            id="new_password"
            name="new_password"
            type={showNew ? 'text' : 'password'}
            required
            minLength={8}
            placeholder="Min. 8 characters"
            className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {showNew ? <HiEyeOff size={16} /> : <HiEye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {pending ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  )
}
