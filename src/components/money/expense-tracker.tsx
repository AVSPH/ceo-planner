'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/animate-ui/components/radix/dialog'
import type { ExpenseEntry } from '@/hooks/use-money'
import type { TablesInsert } from '@/types/database'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

function getMonthBounds() {
  const now = new Date()
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
    end:   new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
  }
}

interface Props {
  entries: ExpenseEntry[]
  onAdd:    (fields: Omit<TablesInsert<'expense_entries'>, 'user_id'>) => Promise<void>
  onRemove: (id: string) => void
}

export function ExpenseTracker({ entries, onAdd, onRemove }: Props) {
  const [open, setOpen]       = useState(false)
  const [date, setDate]       = useState(new Date().toISOString().split('T')[0])
  const [amount, setAmount]   = useState('')
  const [desc, setDesc]       = useState('')
  const [notes, setNotes]     = useState('')

  const { start, end } = getMonthBounds()
  const monthTotal = entries
    .filter(e => e.entry_date >= start && e.entry_date <= end)
    .reduce((s, e) => s + e.amount, 0)

  const sorted = [...entries].sort((a, b) => b.entry_date.localeCompare(a.entry_date))

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!amount) return
    await onAdd({ entry_date: date, amount: parseFloat(amount), description: desc || null, notes: notes || null })
    setAmount(''); setDesc(''); setNotes('')
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs text-muted-foreground font-medium">This month</p>
        <p className="text-2xl font-bold mt-0.5 text-rose-600 dark:text-rose-400">{fmt(monthTotal)}</p>
        <p className="text-xs text-muted-foreground mt-0.5">total expenses</p>
      </div>

      {/* List header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Expense Log
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 rounded-lg bg-primary text-primary-foreground px-2.5 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-3.5" /> Add
        </button>
      </div>

      {/* Entries */}
      {sorted.length === 0 ? (
        <Empty message="No expense entries yet." />
      ) : (
        <div className="space-y-2">
          {sorted.map(e => (
            <div key={e.id} className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
              <span className="text-xs text-muted-foreground w-20 shrink-0">{formatDate(e.entry_date)}</span>
              <span className="font-semibold text-sm text-rose-600 dark:text-rose-400 w-24 shrink-0">{fmt(e.amount)}</span>
              <span className="flex-1 text-sm text-muted-foreground truncate">{e.description ?? '—'}</span>
              <button type="button" onClick={() => onRemove(e.id)} className="text-muted-foreground hover:text-rose-500 transition-colors shrink-0">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 pt-1">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Amount *</label>
              <div className="flex items-center gap-1 border-b border-border focus-within:border-primary pb-1 transition-colors">
                <span className="text-sm text-muted-foreground">$</span>
                <input autoFocus type="number" min="0" step="0.01" value={amount}
                  onChange={e => setAmount(e.target.value)} placeholder="0.00" required
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/40" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Description</label>
              <input value={desc} onChange={e => setDesc(e.target.value)}
                placeholder="What was it for?" className="w-full bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Notes</label>
              <input value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Optional" className="w-full bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/40" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <button type="button" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              </DialogClose>
              <button type="submit" disabled={!amount}
                className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-40 transition-colors">
                Add
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-card/50 px-6 py-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
