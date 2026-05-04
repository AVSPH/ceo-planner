'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/animate-ui/components/radix/dialog'
import { cn } from '@/lib/utils'
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
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-2xl border border-rose-500/15 bg-rose-500/[0.01] backdrop-blur-md p-5 flex items-center justify-between transition-all select-none hover:bg-rose-500/[0.03]">
        <div>
          <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase select-none">This Month</p>
          <p className="text-3xl font-extrabold tracking-tight mt-1 text-rose-600 dark:text-rose-400 select-none">{fmt(monthTotal)}</p>
          <p className="text-xs font-bold text-muted-foreground mt-1 uppercase select-none">Total Expenses</p>
        </div>
      </div>

      {/* List header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground select-none">
          Expense Log
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-3.5 py-2 text-xs font-bold hover:bg-primary/90 hover:shadow-md transition-all select-none cursor-pointer"
        >
          <Plus className="size-3.5" /> Add Expense
        </button>
      </div>

      {/* Entries */}
      {sorted.length === 0 ? (
        <Empty message="No expense entries yet." />
      ) : (
        <div className="space-y-2.5">
          {sorted.map(e => (
            <div key={e.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/45 backdrop-blur-md px-4 py-3.5 hover:shadow-sm hover:border-border transition-all select-none group">
              <span className="text-xs font-bold text-muted-foreground/80 w-20 shrink-0">{formatDate(e.entry_date)}</span>
              <span className="font-extrabold text-sm text-rose-600 dark:text-rose-400 w-24 shrink-0 tracking-tight">{fmt(e.amount)}</span>
              <span className="flex-1 text-sm font-medium text-foreground/85 truncate">{e.description ?? '—'}</span>
              <button type="button" onClick={() => onRemove(e.id)} className="text-muted-foreground/60 hover:text-rose-500 hover:scale-105 transition-all shrink-0 cursor-pointer p-1">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border border-border/60 bg-card/75 backdrop-blur-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg tracking-tight font-bold select-none">
              Add Expense
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-5 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase select-none">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full border border-muted/50 bg-muted/30 backdrop-blur-md rounded-xl px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all select-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase select-none">Amount *</label>
              <div className="flex items-center gap-1.5 border-b border-border/60 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all pb-1 pt-0.5">
                <span className="text-sm font-semibold text-muted-foreground">$</span>
                <input autoFocus type="number" min="0" step="0.01" value={amount}
                  onChange={e => setAmount(e.target.value)} placeholder="0.00" required
                  className="w-full bg-transparent text-sm font-bold tracking-tight outline-none placeholder:text-muted-foreground/45" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase select-none">Description</label>
              <input value={desc} onChange={e => setDesc(e.target.value)}
                placeholder="What was it for?" className="w-full border border-muted/50 bg-muted/30 backdrop-blur-md rounded-xl px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/45 transition-all select-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase select-none">Notes</label>
              <input value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Optional notes" className="w-full border border-muted/50 bg-muted/30 backdrop-blur-md rounded-xl px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/45 transition-all select-none" />
            </div>
            <DialogFooter className="gap-2 pt-2 border-t border-muted/40">
              <DialogClose asChild>
                <button type="button" className="rounded-xl border border-muted-foreground/20 px-4 py-2.5 text-sm font-bold hover:bg-muted/40 transition-colors select-none">Cancel</button>
              </DialogClose>
              <button type="submit" disabled={!amount}
                className="rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-bold hover:bg-primary/90 disabled:opacity-40 hover:shadow-md transition-all select-none">
                Add Expense
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
    <div className="rounded-2xl border border-dashed border-muted bg-muted/20 px-6 py-10 text-center select-none">
      <p className="text-sm font-medium text-muted-foreground select-none">{message}</p>
    </div>
  )
}

