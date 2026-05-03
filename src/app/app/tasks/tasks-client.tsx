'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTasks, shouldFireToday, isDoneToday, type Task } from '@/hooks/use-tasks'
import { TaskCard } from '@/components/tasks/task-card'
import { TaskForm } from '@/components/tasks/task-form'
import type { TablesInsert } from '@/types/database'

type Tab = 'today' | 'upcoming' | 'completed'
type TaskDraft = Omit<TablesInsert<'tasks'>, 'user_id'>

const TABS: { id: Tab; label: string }[] = [
  { id: 'today',     label: 'Today' },
  { id: 'upcoming',  label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
]

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function formatGroupLabel(dateStr: string, today: string): string {
  const tomorrow = new Date(today + 'T00:00:00')
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

interface Props {
  userId: string
  initialTasks: Task[]
}

export function TasksClient({ userId, initialTasks }: Props) {
  const today = getToday()
  const [tab, setTab] = useState<Tab>('today')
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Task | null>(null)
  const [quickAdd, setQuickAdd] = useState('')

  const { tasks, addTask, updateTask, deleteTask, toggleDone } = useTasks(userId, initialTasks)

  // ── Today buckets ──────────────────────────────────────────────────────────
  const { overdue, todayPending, recurringPending, recurringDone, completedToday } = useMemo(() => {
    const overdue: Task[] = []
    const todayPending: Task[] = []
    const recurringPending: Task[] = []
    const recurringDone: Task[] = []
    const completedToday: Task[] = []

    for (const t of tasks) {
      if (t.is_recurring) {
        if (!shouldFireToday(t.recur_pattern, today, t.created_at)) continue
        if (isDoneToday(t, today)) recurringDone.push(t)
        else recurringPending.push(t)
      } else if (t.is_done) {
        if (t.completed_at?.startsWith(today)) completedToday.push(t)
      } else if (t.due_date) {
        if (t.due_date < today) overdue.push(t)
        else if (t.due_date === today) todayPending.push(t)
      }
    }

    const byPriority = (a: Task, b: Task) => {
      const order = { high: 0, medium: 1, low: 2 }
      return (order[a.priority as keyof typeof order] ?? 1) - (order[b.priority as keyof typeof order] ?? 1)
    }

    return {
      overdue:         overdue.sort(byPriority),
      todayPending:    todayPending.sort(byPriority),
      recurringPending: recurringPending.sort(byPriority),
      recurringDone,
      completedToday,
    }
  }, [tasks, today])

  // ── Upcoming groups ────────────────────────────────────────────────────────
  const upcomingGroups = useMemo(() => {
    const future = tasks
      .filter(t => !t.is_recurring && !t.is_done && t.due_date && t.due_date > today)
      .sort((a, b) => (a.due_date ?? '').localeCompare(b.due_date ?? ''))

    const someday = tasks.filter(t => !t.is_recurring && !t.is_done && !t.due_date)

    const map = new Map<string, Task[]>()
    for (const t of future) {
      const k = t.due_date!
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(t)
    }
    return { map, someday }
  }, [tasks, today])

  // ── Completed all-time ─────────────────────────────────────────────────────
  const completedAll = useMemo(() =>
    tasks
      .filter(t => !t.is_recurring && t.is_done)
      .sort((a, b) => (b.completed_at ?? '').localeCompare(a.completed_at ?? ''))
  , [tasks])

  // ── Actions ────────────────────────────────────────────────────────────────
  async function handleSave(draft: TaskDraft) {
    if (editTarget) {
      await updateTask(editTarget.id, draft)
      setEditTarget(null)
    } else {
      await addTask(draft)
    }
  }

  async function handleQuickAdd(e: React.KeyboardEvent) {
    if (e.key !== 'Enter' || !quickAdd.trim()) return
    await addTask({ title: quickAdd.trim(), due_date: today, priority: 'medium', category: 'other' })
    setQuickAdd('')
  }

  function openEdit(task: Task) {
    setEditTarget(task)
    setFormOpen(true)
  }

  const todayCount = overdue.length + todayPending.length + recurringPending.length

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          type="button"
          onClick={() => { setEditTarget(null); setFormOpen(true) }}
          className="flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-4" />
          New task
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150',
              tab === t.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
            {t.id === 'today' && todayCount > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/20 text-primary px-1.5 py-0.5 text-[10px] font-semibold">
                {todayCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Quick add (today tab only) */}
      {tab === 'today' && (
        <input
          value={quickAdd}
          onChange={e => setQuickAdd(e.target.value)}
          onKeyDown={handleQuickAdd}
          placeholder="Quick add task for today… (Enter to save)"
          className="w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50 transition-all"
        />
      )}

      {/* ── TODAY ─────────────────────────────────────────────────────────── */}
      {tab === 'today' && (
        <div className="space-y-5">
          {overdue.length > 0 && (
            <Section label={`Overdue (${overdue.length})`} accent="rose">
              {overdue.map(t => (
                <TaskCard key={t.id} task={t} today={today}
                  onToggle={() => toggleDone(t, today)}
                  onEdit={() => openEdit(t)}
                  onDelete={() => deleteTask(t.id)}
                />
              ))}
            </Section>
          )}

          {todayPending.length > 0 && (
            <Section label="Today">
              {todayPending.map(t => (
                <TaskCard key={t.id} task={t} today={today}
                  onToggle={() => toggleDone(t, today)}
                  onEdit={() => openEdit(t)}
                  onDelete={() => deleteTask(t.id)}
                />
              ))}
            </Section>
          )}

          {recurringPending.length > 0 && (
            <Section label="Recurring">
              {recurringPending.map(t => (
                <TaskCard key={t.id} task={t} today={today}
                  onToggle={() => toggleDone(t, today)}
                  onEdit={() => openEdit(t)}
                  onDelete={() => deleteTask(t.id)}
                />
              ))}
            </Section>
          )}

          {todayCount === 0 && (
            <Empty message="No tasks for today. Add one above or press New task." />
          )}

          {(recurringDone.length > 0 || completedToday.length > 0) && (
            <Section label={`Done today (${recurringDone.length + completedToday.length})`} muted>
              {[...recurringDone, ...completedToday].map(t => (
                <TaskCard key={t.id} task={t} today={today}
                  onToggle={() => toggleDone(t, today)}
                  onEdit={() => openEdit(t)}
                  onDelete={() => deleteTask(t.id)}
                />
              ))}
            </Section>
          )}
        </div>
      )}

      {/* ── UPCOMING ─────────────────────────────────────────────────────── */}
      {tab === 'upcoming' && (
        <div className="space-y-5">
          {upcomingGroups.map.size === 0 && upcomingGroups.someday.length === 0 && (
            <Empty message="No upcoming tasks. Add one with a future due date." />
          )}
          {Array.from(upcomingGroups.map.entries()).map(([date, group]) => (
            <Section key={date} label={formatGroupLabel(date, today)}>
              {group.map(t => (
                <TaskCard key={t.id} task={t} today={today}
                  onToggle={() => toggleDone(t, today)}
                  onEdit={() => openEdit(t)}
                  onDelete={() => deleteTask(t.id)}
                />
              ))}
            </Section>
          ))}
          {upcomingGroups.someday.length > 0 && (
            <Section label="Someday" muted>
              {upcomingGroups.someday.map(t => (
                <TaskCard key={t.id} task={t} today={today}
                  onToggle={() => toggleDone(t, today)}
                  onEdit={() => openEdit(t)}
                  onDelete={() => deleteTask(t.id)}
                />
              ))}
            </Section>
          )}
        </div>
      )}

      {/* ── COMPLETED ─────────────────────────────────────────────────────── */}
      {tab === 'completed' && (
        <div className="space-y-2">
          {completedAll.length === 0 && (
            <Empty message="No completed tasks yet." />
          )}
          {completedAll.map(t => (
            <TaskCard key={t.id} task={t} today={today}
              onToggle={() => toggleDone(t, today)}
              onEdit={() => openEdit(t)}
              onDelete={() => deleteTask(t.id)}
            />
          ))}
        </div>
      )}

      {/* Form modal */}
      <TaskForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        onSave={handleSave}
        initial={editTarget}
        defaultDueDate={tab === 'today' ? today : undefined}
      />
    </div>
  )
}

function Section({
  label,
  children,
  accent,
  muted,
}: {
  label: string
  children: React.ReactNode
  accent?: 'rose'
  muted?: boolean
}) {
  return (
    <div className="space-y-2">
      <p className={cn(
        'text-xs font-semibold uppercase tracking-widest',
        accent === 'rose' ? 'text-rose-500' : muted ? 'text-muted-foreground/60' : 'text-muted-foreground'
      )}>
        {label}
      </p>
      {children}
    </div>
  )
}

function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-card/50 px-6 py-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
