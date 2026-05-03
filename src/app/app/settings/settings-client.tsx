'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'motion/react'
import { Camera, Trash2, Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { signOut } from '@/lib/actions/auth'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose,
} from '@/components/animate-ui/components/radix/dialog'
import type { Tables } from '@/types/database'

type Profile = Tables<'profiles'>

interface Props {
  userId:         string
  email:          string
  initialProfile: Profile | null
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition"
    />
  )
}

const THEMES = [
  { value: 'light',  label: 'Light',  Icon: Sun },
  { value: 'dark',   label: 'Dark',   Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
] as const

export function SettingsClient({ userId, email, initialProfile }: Props) {
  const supabase = createClient()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // ── Profile ──────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<Partial<Profile>>(initialProfile ?? {})
  const [profileSaving, setProfileSaving] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function updateProfile(patch: Partial<Profile>) {
    setProfile(prev => ({ ...prev, ...patch }))
    clearTimeout(saveTimer.current)
    setProfileSaving(true)
    saveTimer.current = setTimeout(async () => {
      await supabase.from('profiles').update(patch).eq('id', userId)
      setProfileSaving(false)
    }, 400)
  }

  // ── Avatar ────────────────────────────────────────────────────────────────
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function uploadAvatar(file: File) {
    setUploading(true)
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${userId}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId)
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
    }
    setUploading(false)
  }

  async function removeAvatar() {
    if (!profile.avatar_url) return
    const parts = profile.avatar_url.split('/object/public/avatars/')
    if (parts[1]) await supabase.storage.from('avatars').remove([parts[1]])
    await supabase.from('profiles').update({ avatar_url: null }).eq('id', userId)
    setProfile(prev => ({ ...prev, avatar_url: null }))
  }

  const initials = (profile.full_name ?? 'U')
    .split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  // ── Password ──────────────────────────────────────────────────────────────
  const [newPw, setNewPw]         = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwMsg, setPwMsg]         = useState<{ text: string; ok: boolean } | null>(null)
  const [pwLoading, setPwLoading] = useState(false)

  async function changePassword() {
    if (newPw.length < 8)       { setPwMsg({ text: 'Min 8 characters', ok: false }); return }
    if (newPw !== confirmPw)    { setPwMsg({ text: 'Passwords do not match', ok: false }); return }
    setPwLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setPwLoading(false)
    if (error) setPwMsg({ text: error.message, ok: false })
    else { setPwMsg({ text: 'Password updated', ok: true }); setNewPw(''); setConfirmPw('') }
  }

  // ── Delete account ────────────────────────────────────────────────────────
  const [deleteOpen, setDeleteOpen]       = useState(false)
  const [deleteInput, setDeleteInput]     = useState('')
  const [deleting, setDeleting]           = useState(false)

  async function deleteAccount() {
    setDeleting(true)
    const tables = [
      'daily_entries', 'tasks', 'revenue_entries',
      'expense_entries', 'debt_entries', 'permanent_data',
    ] as const
    for (const t of tables) {
      await (supabase.from(t) as ReturnType<typeof supabase.from>).delete().eq('user_id', userId)
    }
    await supabase.from('profiles').delete().eq('id', userId)
    await signOut()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <AnimatePresence>
          {profileSaving && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground"
            >
              Saving...
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Profile ── */}
      <SectionCard title="Profile">
        <Field label="Full name">
          <Input
            value={profile.full_name ?? ''}
            onChange={v => updateProfile({ full_name: v })}
            placeholder="Your name"
          />
        </Field>
        <Field label="Business name">
          <Input
            value={profile.business_name ?? ''}
            onChange={v => updateProfile({ business_name: v })}
            placeholder="Your company or brand"
          />
        </Field>
        <Field label="Role">
          <Input
            value={profile.role ?? ''}
            onChange={v => updateProfile({ role: v })}
            placeholder="CEO, Founder, Coach..."
          />
        </Field>
        <p className="text-xs text-muted-foreground">{email}</p>
      </SectionCard>

      {/* ── Avatar ── */}
      <SectionCard title="Profile photo">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="size-16 rounded-full object-cover border"
              />
            ) : (
              <div className="size-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                {initials}
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadAvatar(f) }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted transition disabled:opacity-50"
            >
              <Camera className="size-3.5" />
              {profile.avatar_url ? 'Change' : 'Upload'}
            </button>
            {profile.avatar_url && (
              <button
                type="button"
                onClick={removeAvatar}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted transition text-muted-foreground"
              >
                <Trash2 className="size-3.5" />
                Remove
              </button>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ── Appearance ── */}
      <SectionCard title="Appearance">
        <Field label="Theme">
          {mounted ? (
            <div className="flex gap-2">
              {THEMES.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setTheme(value)
                    supabase.from('profiles').update({ theme: value }).eq('id', userId)
                  }}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                    theme === value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted text-muted-foreground'
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <div className="h-9 w-48 rounded-lg bg-muted animate-pulse" />
          )}
        </Field>
      </SectionCard>

      {/* ── Security ── */}
      <SectionCard title="Security">
        <Field label="New password">
          <Input type="password" value={newPw} onChange={setNewPw} placeholder="Min 8 characters" />
        </Field>
        <Field label="Confirm password">
          <Input type="password" value={confirmPw} onChange={setConfirmPw} placeholder="Repeat password" />
        </Field>
        {pwMsg && (
          <p className={cn('text-xs', pwMsg.ok ? 'text-emerald-500' : 'text-destructive')}>
            {pwMsg.text}
          </p>
        )}
        <button
          type="button"
          onClick={changePassword}
          disabled={pwLoading || !newPw}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
        >
          {pwLoading ? 'Updating...' : 'Update password'}
        </button>
      </SectionCard>

      {/* ── Danger zone ── */}
      <div className="rounded-xl border border-destructive/40 bg-card p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-destructive/70">Danger zone</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Delete account</p>
            <p className="text-xs text-muted-foreground mt-0.5">Permanently deletes all your data. Cannot be undone.</p>
          </div>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* ── Delete confirmation dialog ── */}
      <Dialog open={deleteOpen} onOpenChange={open => { setDeleteOpen(open); setDeleteInput('') }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              This will permanently delete all your entries, tasks, and data. Type <strong>DELETE</strong> to confirm.
            </p>
            <Input
              value={deleteInput}
              onChange={setDeleteInput}
              placeholder="Type DELETE to confirm"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button type="button" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition">
                Cancel
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={deleteAccount}
              disabled={deleteInput !== 'DELETE' || deleting}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete account'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
