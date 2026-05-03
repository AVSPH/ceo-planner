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
      'rounded-xl border bg-card transition-all duration-150',
      isDone && 'opacity-60'
    )}>
      <div className="flex items-start gap-3 p-3.5">
        {/* Checkbox */}
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'mt-0.5 size-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all',
            isDone
              ? 'bg-primary border-primary'
              : 'border-muted-foreground/30 hover:border-primary/60'
          )}
        >
          {isDone && (
            <svg className="size-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              'text-sm font-medium leading-snug',
              isDone && 'line-through text-muted-foreground'
            )}>
              {task.title}
            </span>
            {task.is_recurring && (
              <RotateCcw className="size-3 text-muted-foreground shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Priority dot */}
            <span className={cn('size-2 rounded-full shrink-0', PRIORITY_DOT[task.priority])} />

            {/* Category */}
            <span className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
              CATEGORY_COLORS[task.category]
            )}>
              {task.category}
            </span>

            {/* Due date */}
            {task.due_date && !task.is_recurring && (
              <span className={cn(
                'text-[10px] font-medium',
                isOverdue ? 'text-rose-500' : 'text-muted-foreground'
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
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1 text-muted-foreground hover:text-rose-500 transition-colors"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {expanded && task.note && (
        <div className="px-4 pb-3.5 pt-0">
          <p className="text-xs text-muted-foreground leading-relaxed border-t pt-2.5">
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
