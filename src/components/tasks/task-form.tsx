'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/animate-ui/components/radix/dialog'
import type { Task } from '@/hooks/use-tasks'
import type { TablesInsert } from '@/types/database'

type TaskDraft = Omit<TablesInsert<'tasks'>, 'user_id'>

const CATEGORIES = ['admin', 'sales', 'connect', 'visibility', 'other'] as const
const PRIORITIES = ['high', 'medium', 'low'] as const
const PATTERNS   = ['daily', 'weekdays', 'weekly'] as const

export const CATEGORY_COLORS: Record<string, string> = {
  admin:      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  sales:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  connect:    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  visibility: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  other:      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export const PRIORITY_COLORS: Record<string, string> = {
  high:   'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  low:    'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
}

function PillGroup<T extends string>({
  options, value, onChange, colorMap,
}: {
  options: readonly T[]
  value: T
  onChange: (v: T) => void
  colorMap: Record<string, string>
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={cn(
            'rounded-full px-3.5 py-1 text-xs font-bold capitalize transition-all duration-200 tracking-wide',
            value === o
              ? colorMap[o] + ' ring-2 ring-offset-1 ring-current'
              : 'bg-muted/40 backdrop-blur-md text-muted-foreground hover:bg-muted/65 hover:text-foreground'
          )}>
          {o}
        </button>
      ))}
    </div>
  )
}

interface Props {
  open:           boolean
  onClose:        () => void
  onSave:         (draft: TaskDraft) => void
  initial?:       Task | null
  defaultDueDate?: string
}

export function TaskForm({ open, onClose, onSave, initial, defaultDueDate }: Props) {
  const [title,     setTitle]     = useState(initial?.title ?? '')
  const [category,  setCategory]  = useState<typeof CATEGORIES[number]>((initial?.category as typeof CATEGORIES[number]) ?? 'other')
  const [priority,  setPriority]  = useState<typeof PRIORITIES[number]>((initial?.priority as typeof PRIORITIES[number]) ?? 'medium')
  const [dueDate,   setDueDate]   = useState(initial?.due_date ?? defaultDueDate ?? '')
  const [note,      setNote]      = useState(initial?.note ?? '')
  const [recurring, setRecurring] = useState(initial?.is_recurring ?? false)
  const [pattern,   setPattern]   = useState<typeof PATTERNS[number]>((initial?.recur_pattern as typeof PATTERNS[number]) ?? 'daily')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      title:        title.trim(),
      category,
      priority,
      due_date:     dueDate || null,
      note:         note || null,
      is_recurring: recurring,
      recur_pattern: recurring ? pattern : null,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose() }}>
      <DialogContent className="max-w-md border border-border/60 bg-card/75 backdrop-blur-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-lg tracking-tight font-bold">
            {initial ? 'Edit task' : 'New task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-1.5">
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full bg-transparent text-sm font-bold outline-none border-b border-border/80 focus:border-primary/60 pb-2 placeholder:text-muted-foreground/45 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Priority</p>
            <PillGroup options={PRIORITIES} value={priority} onChange={setPriority} colorMap={PRIORITY_COLORS} />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Category</p>
            <PillGroup options={CATEGORIES} value={category} onChange={setCategory} colorMap={CATEGORY_COLORS} />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Due date</p>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full border border-muted/50 bg-muted/30 backdrop-blur-md rounded-xl px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setRecurring(v => !v)}
                className={cn('relative w-10 h-5.5 rounded-full transition-colors cursor-pointer', recurring ? 'bg-primary' : 'bg-muted/45 border border-muted/80')}>
                <span className={cn('absolute top-0.5 size-4.5 rounded-full bg-white shadow-sm transition-transform', recurring ? 'translate-x-4' : 'translate-x-0.5')} />
              </div>
              <span className="text-sm font-bold tracking-wide text-foreground/80">Recurring</span>
            </label>
            {recurring && (
              <PillGroup options={PATTERNS} value={pattern} onChange={setPattern} colorMap={{
                daily: 'bg-primary/10 text-primary border border-primary/25', weekdays: 'bg-primary/10 text-primary border border-primary/25', weekly: 'bg-primary/10 text-primary border border-primary/25',
              }} />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Note</p>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
              placeholder="Optional notes..."
              className="w-full resize-none border border-muted/50 bg-muted/30 backdrop-blur-md rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/45 transition-all" />
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-muted/40">
            <DialogClose asChild>
              <button type="button" className="rounded-xl border border-muted-foreground/20 px-4 py-2.5 text-sm font-bold hover:bg-muted/40 transition-colors">
                Cancel
              </button>
            </DialogClose>
            <button type="submit" disabled={!title.trim()}
              className="rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-bold hover:bg-primary/90 disabled:opacity-40 hover:shadow-md transition-all">
              {initial ? 'Save' : 'Add task'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

