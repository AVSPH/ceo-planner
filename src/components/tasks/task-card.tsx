'use client'

import { useState } from 'react'
import { RotateCcw, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_COLORS, PRIORITY_COLORS } from './task-form'
import type { Task } from '@/hooks/use-tasks'

const PRIORITY_DOT: Record<string, string> = {
  high:   'bg-rose-500',
  medium: 'bg-amber-400',
  low:    'bg-sky-400',
}

const PRIORITY_CARD_CLASSES: Record<string, string> = {
  high: 'border-rose-200/60 dark:border-rose-500/15 bg-rose-500/[0.03] dark:bg-rose-500/[0.06] hover:border-rose-300 dark:hover:border-rose-400/40 hover:shadow-rose-500/5 dark:hover:shadow-rose-500/10',
  medium: 'border-amber-200/60 dark:border-amber-500/15 bg-amber-500/[0.03] dark:bg-amber-500/[0.06] hover:border-amber-300 dark:hover:border-amber-400/40 hover:shadow-amber-500/5 dark:hover:shadow-amber-500/10',
  low: 'border-sky-200/60 dark:border-sky-500/15 bg-sky-500/[0.03] dark:bg-sky-500/[0.06] hover:border-sky-300 dark:hover:border-sky-400/40 hover:shadow-sky-500/5 dark:hover:shadow-sky-500/10',
}

interface Props {
  task: Task
  today: string
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

export function TaskCard({ task, today, onToggle, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)

  const isDone = task.is_recurring
    ? (task.completed_at?.startsWith(today) ?? false)
    : task.is_done

  const isOverdue = !task.is_recurring && !task.is_done && task.due_date !== null && task.due_date < today

  return (
    <div className={cn(
      'rounded-2xl border backdrop-blur-xl bg-card/45 p-1 transition-all duration-300 hover:-translate-y-0.5',
      isDone ? 'opacity-55 hover:opacity-85 border-muted/30 bg-muted/20' : PRIORITY_CARD_CLASSES[task.priority]
    )}>
      <div className="flex items-start gap-3.5 p-3.5">
        {/* Checkbox */}
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'mt-1 size-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-105',
            isDone
              ? 'bg-primary border-primary'
              : 'border-muted-foreground/35 hover:border-primary/65 hover:bg-primary/5'
          )}
        >
          {isDone && (
            <svg className="size-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              'text-sm font-bold leading-snug tracking-wide transition-colors',
              isDone ? 'line-through text-muted-foreground' : 'text-foreground'
            )}>
              {task.title}
            </span>
            {task.is_recurring && (
              <RotateCcw className="size-3.5 text-muted-foreground/75 shrink-0 animate-pulse" />
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority dot */}
            <span className={cn('size-2 rounded-full shrink-0 shadow-sm', PRIORITY_DOT[task.priority])} />

            {/* Category */}
            <span className={cn(
              'rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize tracking-wider',
              CATEGORY_COLORS[task.category]
            )}>
              {task.category}
            </span>

            {/* Due date */}
            {task.due_date && !task.is_recurring && (
              <span className={cn(
                'text-[10px] font-bold tracking-wider',
                isOverdue ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-muted-foreground'
              )}>
                {isOverdue ? '⚠ ' : ''}{formatDue(task.due_date, today)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {task.note && (
            <button
              type="button"
              onClick={() => setExpanded(v => !v)}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all"
            >
              {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {expanded && task.note && (
        <div className="px-4 pb-3.5 pt-0">
          <p className="text-xs text-muted-foreground leading-relaxed border-t border-muted/40 pt-3">
            {task.note}
          </p>
        </div>
      )}
    </div>
  )
}

function formatDue(dateStr: string, today: string): string {
  const tomorrow = new Date(today + 'T00:00:00')
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  if (dateStr === today) return 'Today'
  if (dateStr === tomorrowStr) return 'Tomorrow'

  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

