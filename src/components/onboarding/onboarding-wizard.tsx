'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDownIcon } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/animate-ui/components/buttons/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu'

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Manila',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
]

type FormState = {
  full_name: string
  business_name: string
  role: string
  timezone: string
  theme: string
  income_goal: string
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}

export function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>({
    full_name: '',
    business_name: '',
    role: '',
    timezone: 'UTC',
    theme: 'light',
    income_goal: '',
  })

  function update(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function finish() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await Promise.all([
      supabase
        .from('profiles')
        .update({
          full_name: form.full_name || null,
          business_name: form.business_name || null,
          role: form.role || null,
          timezone: form.timezone,
          theme: form.theme,
          onboarding_completed: true,
        })
        .eq('id', user.id),
      supabase.from('permanent_data').upsert(
        {
          user_id: user.id,
          p_income_goal: form.income_goal ? parseFloat(form.income_goal) : null,
        },
        { onConflict: 'user_id' },
      ),
    ])

    router.push('/app')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Progress bar */}
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                n <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Tell us about you</h1>
              <p className="mt-1 text-sm text-muted-foreground">Step 1 of 3</p>
            </div>
            <div className="space-y-4">
              <Field
                label="Full name"
                value={form.full_name}
                onChange={(v) => update('full_name', v)}
                placeholder="Jane Smith"
              />
              <Field
                label="Business name"
                value={form.business_name}
                onChange={(v) => update('business_name', v)}
                placeholder="Acme Co."
              />
              <Field
                label="Your role"
                value={form.role}
                onChange={(v) => update('role', v)}
                placeholder="CEO / Founder / Coach"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!form.full_name.trim()}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Preferences</h1>
              <p className="mt-1 text-sm text-muted-foreground">Step 2 of 3</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Timezone</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-shadow hover:bg-accent focus:ring-2 focus:ring-ring">
                      {form.timezone}
                      <ChevronDownIcon className="size-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 max-h-60">
                    <DropdownMenuRadioGroup
                      value={form.timezone}
                      onValueChange={(v) => update('timezone', v)}
                    >
                      {TIMEZONES.map((tz) => (
                        <DropdownMenuRadioItem key={tz} value={tz}>
                          {tz}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Theme</label>
                <div className="flex gap-3">
                  {(['light', 'dark'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update('theme', t)}
                      className={`flex-1 rounded-md border py-2 text-sm capitalize transition-colors ${
                        form.theme === t
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input bg-background hover:bg-accent'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Set your money goal</h1>
              <p className="mt-1 text-sm text-muted-foreground">Step 3 of 3</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Annual income goal</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  value={form.income_goal}
                  onChange={(e) => update('income_goal', e.target.value)}
                  placeholder="100000"
                  className="w-full rounded-md border border-input bg-background py-2 pl-7 pr-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                You can update this anytime in Vision &amp; Goals.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button className="flex-1" onClick={finish} disabled={saving}>
                {saving ? 'Saving…' : 'Get Started'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
