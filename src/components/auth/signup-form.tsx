'use client'
import { useActionState } from 'react'
import { signUp } from '@/lib/actions/auth'
import { Button } from '@/components/animate-ui/components/buttons/button'

export function SignupForm() {
  const [state, action, pending] = useActionState(signUp, null)

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
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={6}
          placeholder="••••••••"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Creating account…' : 'Create Account'}
      </Button>
    </form>
  )
}
