'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'

export type RevenueEntry = Tables<'revenue_entries'>
export type ExpenseEntry = Tables<'expense_entries'>
export type DebtEntry   = Tables<'debt_entries'>

export function useRevenue(userId: string, initial: RevenueEntry[] = []) {
  const [entries, setEntries] = useState(initial)
  const supabase = useRef(createClient()).current

  const add = useCallback(async (fields: Omit<TablesInsert<'revenue_entries'>, 'user_id'>) => {
    const { data } = await supabase
      .from('revenue_entries')
      .insert({ ...fields, user_id: userId })
      .select()
      .single()
    if (data) setEntries(prev => [data, ...prev])
  }, [userId, supabase])

  const remove = useCallback(async (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    await supabase.from('revenue_entries').delete().eq('id', id)
  }, [supabase])

  return { entries, add, remove }
}

export function useExpenses(userId: string, initial: ExpenseEntry[] = []) {
  const [entries, setEntries] = useState(initial)
  const supabase = useRef(createClient()).current

  const add = useCallback(async (fields: Omit<TablesInsert<'expense_entries'>, 'user_id'>) => {
    const { data } = await supabase
      .from('expense_entries')
      .insert({ ...fields, user_id: userId })
      .select()
      .single()
    if (data) setEntries(prev => [data, ...prev])
  }, [userId, supabase])

  const remove = useCallback(async (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    await supabase.from('expense_entries').delete().eq('id', id)
  }, [supabase])

  return { entries, add, remove }
}

export function useDebt(userId: string, initial: DebtEntry[] = []) {
  const [entries, setEntries] = useState(initial)
  const supabase = useRef(createClient()).current

  const add = useCallback(async (fields: Omit<TablesInsert<'debt_entries'>, 'user_id'>) => {
    const { data } = await supabase
      .from('debt_entries')
      .insert({ ...fields, user_id: userId })
      .select()
      .single()
    if (data) setEntries(prev => [...prev, data])
  }, [userId, supabase])

  const update = useCallback(async (id: string, fields: TablesUpdate<'debt_entries'>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...fields } : e))
    await supabase.from('debt_entries').update(fields).eq('id', id)
  }, [supabase])

  const remove = useCallback(async (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    await supabase.from('debt_entries').delete().eq('id', id)
  }, [supabase])

  return { entries, add, update, remove }
}
