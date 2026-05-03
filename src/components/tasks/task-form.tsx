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
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium capitalize transition-all',
            value === o
              ? colorMap[o] + ' ring-2 ring-offset-1 ring-current'
              : 'bg-muted text-muted-foreground hover:bg-muted/70'
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit task' : 'New task'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full bg-transparent text-sm font-medium outline-none border-b border-border focus:border-primary pb-1.5 placeholder:text-muted-foreground/50 transition-colors"
          />

          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">Priority</p>
            <PillGroup options={PRIORITIES} value={priority} onChange={setPriority} colorMap={PRIORITY_COLORS} />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">Category</p>
            <PillGroup options={CATEGORIES} value={category} onChange={setCategory} colorMap={CATEGORY_COLORS} />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">Due date</p>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="bg-muted rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setRecurring(v => !v)}
                className={cn('relative w-9 h-5 rounded-full transition-colors cursor-pointer', recurring ? 'bg-primary' : 'bg-muted')}>
                <span className={cn('absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform', recurring ? 'translate-x-4' : 'translate-x-0.5')} />
              </div>
              <span className="text-sm font-medium">Recurring</span>
            </label>
            {recurring && (
              <PillGroup options={PATTERNS} value={pattern} onChange={setPattern} colorMap={{
                daily: 'bg-primary/10 text-primary', weekdays: 'bg-primary/10 text-primary', weekly: 'bg-primary/10 text-primary',
              }} />
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">Note</p>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
              placeholder="Optional notes..."
              className="w-full resize-none bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50 transition-all" />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <button type="button" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                Cancel
              </button>
            </DialogClose>
            <button type="submit" disabled={!title.trim()}
              className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-40 transition-colors">
              {initial ? 'Save' : 'Add task'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
