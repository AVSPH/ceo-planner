'use client'
import { useActionState, useState } from 'react'
import { signUp } from '@/lib/actions/auth'
import { Button } from '@/components/animate-ui/components/buttons/button'
import { HiEye, HiEyeOff } from 'react-icons/hi'

export function SignupForm() {
  const [state, action, pending] = useActionState(signUp, null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const mismatch = confirm.length > 0 && password !== confirm

  if (state?.message) {
    return (
      <div className="rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
        {state.message}
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <label htmlFor="full_name" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          autoComplete="name"
          placeholder="Jane Smith"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            minLength={6}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <HiEyeOff size={16} /> : <HiEye size={16} />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirm_password" className="text-sm font-medium">
          Confirm password
        </label>
        <div className="relative">
          <input
            id="confirm_password"
            name="confirm_password"
            type={showConfirm ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className={`w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring ${
              mismatch ? 'border-destructive focus:ring-destructive/50' : 'border-input'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <HiEyeOff size={16} /> : <HiEye size={16} />}
          </button>
        </div>
        {mismatch && (
          <p className="text-xs text-destructive">Passwords do not match</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={pending || mismatch}>
        {pending ? 'Creating account…' : 'Create Account'}
      </Button>
    </form>
  )
}
