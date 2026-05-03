'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Tables, TablesUpdate } from '@/types/database'

type DailyEntry = Tables<'daily_entries'>

export function useDailyEntry(
  userId: string,
  date: string,
  initialEntry?: DailyEntry | null
) {
  const [entry, setEntry] = useState<Partial<DailyEntry>>(
    initialEntry ?? { user_id: userId, entry_date: date }
  )
  const [loading, setLoading] = useState(initialEntry === undefined)
  const [saving, setSaving] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase = useRef(createClient()).current

  useEffect(() => {
    if (initialEntry !== undefined) return
    let mounted = true
    async function load() {
      const { data } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('entry_date', date)
        .maybeSingle()
      if (mounted) {
        setEntry(data ?? { user_id: userId, entry_date: date })
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [userId, date, initialEntry, supabase])

  const update = useCallback(
    (fields: TablesUpdate<'daily_entries'>) => {
      setEntry(prev => ({ ...prev, ...fields }))
      if (timerRef.current) clearTimeout(timerRef.current)
      setSaving(true)
      timerRef.current = setTimeout(async () => {
        await supabase
          .from('daily_entries')
          .upsert(
            { user_id: userId, entry_date: date, ...fields },
            { onConflict: 'user_id,entry_date' }
          )
        setSaving(false)
      }, 400)
    },
    [userId, date, supabase]
  )

  return { entry, loading, saving, update }
}
