'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/animate-ui/components/radix/dialog'
import type { DebtEntry } from '@/hooks/use-money'
import type { TablesInsert, TablesUpdate } from '@/types/database'

const fmt = (n: number | null) =>
  n == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

type DebtDraft = { name: string; balance: string; monthly_payment: string; notes: string }

const emptyDraft = (): DebtDraft => ({ name: '', balance: '', monthly_payment: '', notes: '' })

interface Props {
  entries:  DebtEntry[]
  onAdd:    (fields: Omit<TablesInsert<'debt_entries'>, 'user_id'>) => Promise<void>
  onUpdate: (id: string, fields: TablesUpdate<'debt_entries'>) => Promise<void>
  onRemove: (id: string) => void
}

export function DebtTracker({ entries, onAdd, onUpdate, onRemove }: Props) {
  const [open, setOpen]           = useState(false)
  const [editing, setEditing]     = useState<DebtEntry | null>(null)
  const [draft, setDraft]         = useState<DebtDraft>(emptyDraft())

  const totalBalance  = entries.reduce((s, e) => s + (e.balance ?? 0), 0)
  const totalMonthly  = entries.reduce((s, e) => s + (e.monthly_payment ?? 0), 0)

  function openAdd() {
    setEditing(null)
    setDraft(emptyDraft())
    setOpen(true)
  }

  function openEdit(entry: DebtEntry) {
    setEditing(entry)
    setDraft({
      name:            entry.name,
      balance:         entry.balance?.toString() ?? '',
      monthly_payment: entry.monthly_payment?.toString() ?? '',
      notes:           entry.notes ?? '',
    })
    setOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.name.trim()) return
    const fields = {
      name:            draft.name.trim(),
      balance:         draft.balance ? parseFloat(draft.balance) : null,
      monthly_payment: draft.monthly_payment ? parseFloat(draft.monthly_payment) : null,
      notes:           draft.notes || null,
    }
    if (editing) {
      await onUpdate(editing.id, fields)
    } else {
      await onAdd(fields)
    }
    setOpen(false)
  }

  function set(k: keyof DebtDraft) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft(prev => ({ ...prev, [k]: e.target.value }))
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground font-medium">Total balance</p>
          <p className="text-2xl font-bold mt-0.5 text-rose-600 dark:text-rose-400">{fmt(totalBalance)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground font-medium">Monthly payments</p>
          <p className="text-2xl font-bold mt-0.5">{fmt(totalMonthly)}</p>
        </div>
      </div>

      {/* List header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Debts</p>
        <button type="button" onClick={openAdd}
          className="flex items-center gap-1 rounded-lg bg-primary text-primary-foreground px-2.5 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors">
          <Plus className="size-3.5" /> Add
        </button>
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card/50 px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">No debts tracked. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map(e => (
            <div key={e.id} className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{e.name}</p>
                {e.notes && <p className="text-xs text-muted-foreground truncate mt-0.5">{e.notes}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{fmt(e.balance)}</p>
                {e.monthly_payment && (
                  <p className="text-xs text-muted-foreground">{fmt(e.monthly_payment)}/mo</p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => openEdit(e)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="size-3.5" />
                </button>
                <button type="button" onClick={() => onRemove(e.id)} className="p-1 text-muted-foreground hover:text-rose-500 transition-colors">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit debt' : 'Add debt'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-1">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Name *</label>
              <input autoFocus value={draft.name} onChange={set('name')} placeholder="e.g. Credit card, student loan"
                required className="w-full bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Balance</label>
              <div className="flex items-center gap-1 border-b border-border focus-within:border-primary pb-1 transition-colors">
                <span className="text-sm text-muted-foreground">$</span>
                <input type="number" min="0" step="0.01" value={draft.balance} onChange={set('balance')}
                  placeholder="0.00" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/40" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Monthly payment</label>
              <div className="flex items-center gap-1 border-b border-border focus-within:border-primary pb-1 transition-colors">
                <span className="text-sm text-muted-foreground">$</span>
                <input type="number" min="0" step="0.01" value={draft.monthly_payment} onChange={set('monthly_payment')}
                  placeholder="0.00" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/40" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Notes</label>
              <input value={draft.notes} onChange={set('notes')} placeholder="Interest rate, lender..."
                className="w-full bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/40" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <button type="button" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              </DialogClose>
              <button type="submit" disabled={!draft.name.trim()}
                className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-40 transition-colors">
                {editing ? 'Save' : 'Add'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
