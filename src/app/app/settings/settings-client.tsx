'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'motion/react'
import { Camera, Trash2 } from 'lucide-react'
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

function SectionCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border/60 bg-card/45 backdrop-blur-md p-6 space-y-5 hover:border-border transition-all select-none hover:shadow-sm', className)}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/75 select-none">{title}</p>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground/90">{label}</label>
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
      className="w-full rounded-lg border border-border/40 bg-card/40 px-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-muted-foreground/35"
    />
  )
}

const THEMES = [
  { value: 'system',   label: 'System',   bg: 'linear-gradient(135deg, #ffffff 50%, #1c1c1c 50%)', accent: null },
  { value: 'light',    label: 'Light',    bg: '#ffffff',  accent: '#222222' },
  { value: 'dark',     label: 'Dark',     bg: '#1c1c1c',  accent: '#e5e5e5' },
  { value: 'indigo',   label: 'Indigo',   bg: '#f0eeff',  accent: '#4f46e5' },
  { value: 'rose',     label: 'Rose',     bg: '#fff0f1',  accent: '#e11d48' },
  { value: 'emerald',  label: 'Emerald',  bg: '#edfdf5',  accent: '#059669' },
  { value: 'amber',    label: 'Amber',    bg: '#fefce8',  accent: '#d97706' },
  { value: 'midnight', label: 'Midnight', bg: '#0c0f1d',  accent: '#6366f1' },
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
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Settings</h1>
          <p className="text-xs text-muted-foreground/80">Manage your profile, visibility, and privacy.</p>
        </div>
        <AnimatePresence>
          {profileSaving && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs font-medium text-muted-foreground/75 select-none"
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
        <p className="text-xs text-muted-foreground/60 select-none pt-1">{email}</p>
      </SectionCard>

      {/* ── Avatar ── */}
      <SectionCard title="Profile photo">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="size-16 rounded-full object-cover border border-border/60 hover:scale-102 transition-all hover:shadow-sm"
              />
            ) : (
              <div className="size-16 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground text-xl font-bold hover:scale-102 transition-all hover:shadow-sm select-none">
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
              className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-card px-3.5 py-2 text-sm font-medium hover:bg-muted/70 hover:border-border/60 transition disabled:opacity-50 select-none"
            >
              <Camera className="size-3.5" />
              {profile.avatar_url ? 'Change' : 'Upload'}
            </button>
            {profile.avatar_url && (
              <button
                type="button"
                onClick={removeAvatar}
                className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-card px-3.5 py-2 text-sm font-medium hover:bg-muted/70 hover:border-border/60 transition text-muted-foreground select-none"
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
            <div className="grid grid-cols-4 gap-3">
              {THEMES.map(({ value, label, bg, accent }) => {
                const active = theme === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setTheme(value)
                      supabase.from('profiles').update({ theme: value }).eq('id', userId)
                    }}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl border-2 p-2.5 transition-all select-none',
                      active
                        ? 'border-primary/80 bg-primary/5 shadow-sm shadow-primary/5'
                        : 'border-transparent hover:border-border/40'
                    )}
                  >
                    <div
                      className="size-10 rounded-lg border border-border/40 overflow-hidden relative transition-all"
                      style={{ background: bg }}
                    >
                      {accent && (
                        <div
                          className="absolute bottom-1.5 right-1.5 size-3 rounded-full shadow-sm"
                          style={{ background: accent }}
                        />
                      )}
                    </div>
                    <span className={cn(
                      'text-xs font-medium',
                      active ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-2.5">
                  <div className="size-10 rounded-lg bg-muted animate-pulse" />
                  <div className="h-3 w-10 rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
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
          <p className={cn('text-xs font-medium select-none', pwMsg.ok ? 'text-emerald-500/90' : 'text-destructive/90')}>
            {pwMsg.text}
          </p>
        )}
        <button
          type="button"
          onClick={changePassword}
          disabled={pwLoading || !newPw}
          className="w-full sm:w-auto rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 select-none shadow-sm"
        >
          {pwLoading ? 'Updating...' : 'Update password'}
        </button>
      </SectionCard>

      {/* ── Account ── */}
      <SectionCard title="Account">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Sign out</p>
            <p className="text-xs text-muted-foreground mt-0.5 select-none">{email}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-lg border border-border/40 bg-card px-4 py-2 text-sm font-medium hover:bg-muted/70 hover:border-border/60 transition select-none"
          >
            Sign out
          </button>
        </div>
      </SectionCard>

      {/* ── Danger zone ── */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 backdrop-blur-md p-6 space-y-4 hover:border-destructive/40 transition-all hover:shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-destructive/80 select-none">Danger zone</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Delete account</p>
            <p className="text-xs text-muted-foreground/80 mt-0.5 select-none">Permanently deletes all your data. Cannot be undone.</p>
          </div>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="rounded-lg border border-destructive/40 bg-card/60 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition select-none"
          >
            Delete
          </button>
        </div>
      </div>

      {/* ── Delete confirmation dialog ── */}
      <Dialog open={deleteOpen} onOpenChange={open => { setDeleteOpen(open); setDeleteInput('') }}>
        <DialogContent className="max-w-md bg-card/90 backdrop-blur-md border border-border/60 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight">Delete account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground/90">
              This will permanently delete all your entries, tasks, and data. Type <strong className="text-foreground">DELETE</strong> to confirm.
            </p>
            <Input
              value={deleteInput}
              onChange={setDeleteInput}
              placeholder="Type DELETE to confirm"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <button type="button" className="rounded-lg border border-border/40 bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition select-none">
                Cancel
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={deleteAccount}
              disabled={deleteInput !== 'DELETE' || deleting}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition disabled:opacity-50 select-none shadow-sm"
            >
              {deleting ? 'Deleting...' : 'Delete account'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
