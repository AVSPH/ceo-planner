'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'

export type Task = Tables<'tasks'>

export function shouldFireToday(pattern: string | null, today: string, createdAt: string): boolean {
  if (!pattern) return false
  const d = new Date(today + 'T00:00:00')
  const dow = d.getDay()
  if (pattern === 'daily') return true
  if (pattern === 'weekdays') return dow >= 1 && dow <= 5
  if (pattern === 'weekly') return new Date(createdAt).getDay() === dow
  return false
}

export function isDoneToday(task: Task, today: string): boolean {
  return (task.completed_at?.startsWith(today)) ?? false
}

export function useTasks(userId: string, initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [loading, setLoading] = useState(false)
  const supabase = useRef(createClient()).current

  const reload = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    setTasks(data ?? [])
    setLoading(false)
  }, [userId, supabase])

  const addTask = useCallback(async (fields: Omit<TablesInsert<'tasks'>, 'user_id'>) => {
    const { data } = await supabase
      .from('tasks')
      .insert({ ...fields, user_id: userId })
      .select()
      .single()
    if (data) setTasks(prev => [data, ...prev])
    return data
  }, [userId, supabase])

  const updateTask = useCallback(async (id: string, fields: TablesUpdate<'tasks'>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...fields } : t))
    await supabase.from('tasks').update(fields).eq('id', id)
  }, [supabase])

  const deleteTask = useCallback(async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    await supabase.from('tasks').delete().eq('id', id)
  }, [supabase])

  const toggleDone = useCallback(async (task: Task, today: string) => {
    if (task.is_recurring) {
      const doneToday = isDoneToday(task, today)
      await updateTask(task.id, {
        completed_at: doneToday ? null : new Date().toISOString(),
      })
    } else {
      const next = !task.is_done
      await updateTask(task.id, {
        is_done: next,
        completed_at: next ? new Date().toISOString() : null,
      })
    }
  }, [updateTask])

  return { tasks, loading, reload, addTask, updateTask, deleteTask, toggleDone }
}
