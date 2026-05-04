'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/animate-ui/components/radix/dialog'
import { cn } from '@/lib/utils'
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
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-rose-500/15 bg-rose-500/[0.01] backdrop-blur-md p-5 flex flex-col justify-between transition-all select-none hover:bg-rose-500/[0.03]">
          <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase select-none">Total Debt Balance</p>
          <p className="text-3xl font-extrabold tracking-tight mt-1 text-rose-600 dark:text-rose-400 select-none">{fmt(totalBalance)}</p>
        </div>
        <div className="rounded-2xl border border-primary/15 bg-primary/[0.01] backdrop-blur-md p-5 flex flex-col justify-between transition-all select-none hover:bg-primary/[0.03]">
          <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase select-none">Monthly Payments</p>
          <p className="text-3xl font-extrabold tracking-tight mt-1 text-foreground select-none">{fmt(totalMonthly)}</p>
        </div>
      </div>

      {/* List header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground select-none">Debts</p>
        <button type="button" onClick={openAdd}
          className="flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-3.5 py-2 text-xs font-bold hover:bg-primary/90 hover:shadow-md transition-all select-none cursor-pointer">
          <Plus className="size-3.5" /> Add Debt
        </button>
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-muted bg-muted/20 px-6 py-10 text-center select-none">
          <p className="text-sm font-medium text-muted-foreground select-none">No debts tracked. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {entries.map(e => (
            <div key={e.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/45 backdrop-blur-md px-4 py-3.5 hover:shadow-sm hover:border-border transition-all select-none group">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold tracking-tight text-foreground truncate">{e.name}</p>
                {e.notes && <p className="text-xs text-muted-foreground/80 truncate mt-0.5">{e.notes}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">{fmt(e.balance)}</p>
                {e.monthly_payment && (
                  <p className="text-xs font-bold text-muted-foreground/80 mt-0.5 uppercase tracking-wide">{fmt(e.monthly_payment)}/mo</p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => openEdit(e)} className="p-1 text-muted-foreground/60 hover:text-foreground transition-all cursor-pointer">
                  <Pencil className="size-4" />
                </button>
                <button type="button" onClick={() => onRemove(e.id)} className="p-1 text-muted-foreground/60 hover:text-rose-500 transition-all cursor-pointer">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border border-border/60 bg-card/75 backdrop-blur-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg tracking-tight font-bold select-none">
              {editing ? 'Edit Debt' : 'Add Debt'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-5 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase select-none">Name *</label>
              <input autoFocus value={draft.name} onChange={set('name')} placeholder="e.g. Credit card, student loan"
                required className="w-full border border-muted/50 bg-muted/30 backdrop-blur-md rounded-xl px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/45 transition-all select-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase select-none">Balance</label>
              <div className="flex items-center gap-1.5 border-b border-border/60 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all pb-1 pt-0.5">
                <span className="text-sm font-semibold text-muted-foreground">$</span>
                <input type="number" min="0" step="0.01" value={draft.balance} onChange={set('balance')}
                  placeholder="0.00" className="w-full bg-transparent text-sm font-bold tracking-tight outline-none placeholder:text-muted-foreground/45" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase select-none">Monthly Payment</label>
              <div className="flex items-center gap-1.5 border-b border-border/60 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all pb-1 pt-0.5">
                <span className="text-sm font-semibold text-muted-foreground">$</span>
                <input type="number" min="0" step="0.01" value={draft.monthly_payment} onChange={set('monthly_payment')}
                  placeholder="0.00" className="w-full bg-transparent text-sm font-bold tracking-tight outline-none placeholder:text-muted-foreground/45" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase select-none">Notes</label>
              <input value={draft.notes} onChange={set('notes')} placeholder="Interest rate, lender..."
                className="w-full border border-muted/50 bg-muted/30 backdrop-blur-md rounded-xl px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/45 transition-all select-none" />
            </div>
            <DialogFooter className="gap-2 pt-2 border-t border-muted/40">
              <DialogClose asChild>
                <button type="button" className="rounded-xl border border-muted-foreground/20 px-4 py-2.5 text-sm font-bold hover:bg-muted/40 transition-colors select-none">Cancel</button>
              </DialogClose>
              <button type="submit" disabled={!draft.name.trim()}
                className="rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-bold hover:bg-primary/90 disabled:opacity-40 hover:shadow-md transition-all select-none">
                {editing ? 'Save Changes' : 'Add Debt'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

