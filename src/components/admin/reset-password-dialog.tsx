'use client'
import { useActionState, useState } from 'react'
import { Dialog } from 'radix-ui'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { LuCheck, LuCopy, LuRefreshCw, LuX } from 'react-icons/lu'
import type { AdminState } from '@/lib/actions/admin'

export type ResetAction = (prevState: AdminState, formData: FormData) => Promise<AdminState>

// Omits look-alike glyphs (l/1/I, O/0) so a password read aloud or copied by hand survives the trip.
const CHARS = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generatePassword(length = 20) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => CHARS[b % CHARS.length]).join('')
}

function ResetPasswordForm({ action, targetEmail }: { action: ResetAction; targetEmail: string }) {
  const [state, formAction, pending] = useActionState(action, null)
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (state?.success) {
    return (
      <div className="space-y-4">
        <p className="rounded-md border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
          Password updated for {targetEmail}
        </p>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">New password</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm font-mono break-all">
              {password}
            </code>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-md border border-border p-2 hover:bg-accent transition-colors"
              aria-label="Copy password"
            >
              {copied ? <LuCheck size={15} className="text-emerald-600" /> : <LuCopy size={15} />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Copy it now — it is not stored anywhere and cannot be shown again. Send it to the user
            over a channel you trust, and have them change it after signing in.
          </p>
        </div>
        <Dialog.Close asChild>
          <button className="w-full rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
            Done
          </button>
        </Dialog.Close>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">New Password</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              id="password"
              name="password"
              type={show ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => setShow(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <HiEyeOff size={16} /> : <HiEye size={16} />}
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setPassword(generatePassword())
              setShow(true)
            }}
            className="shrink-0 flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-accent transition-colors"
          >
            <LuRefreshCw size={13} />
            Generate
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {pending ? 'Updating…' : 'Reset Password'}
      </button>
    </form>
  )
}

export function ResetPasswordDialog({
  targetName,
  targetEmail,
  action,
}: {
  targetName: string
  targetEmail: string
  action: ResetAction
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-accent transition-colors shrink-0">
          Reset Password
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background p-5 shadow-lg focus:outline-none">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <Dialog.Title className="text-sm font-semibold">Reset Password</Dialog.Title>
              <Dialog.Description className="text-xs text-muted-foreground mt-0.5 truncate">
                {targetName || '—'} · {targetEmail}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <LuX size={16} />
              </button>
            </Dialog.Close>
          </div>
          <ResetPasswordForm action={action} targetEmail={targetEmail} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
