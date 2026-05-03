'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Tables, TablesUpdate } from '@/types/database'

type PermanentData = Tables<'permanent_data'>

export function usePermanent(userId: string, initial?: PermanentData | null) {
  const [data, setData] = useState<Partial<PermanentData>>(
    initial ?? { user_id: userId }
  )
  const [saving, setSaving] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase = useRef(createClient()).current

  const update = useCallback((fields: TablesUpdate<'permanent_data'>) => {
    setData(prev => ({ ...prev, ...fields }))
    if (timerRef.current) clearTimeout(timerRef.current)
    setSaving(true)
    timerRef.current = setTimeout(async () => {
      await supabase
        .from('permanent_data')
        .upsert({ user_id: userId, ...fields }, { onConflict: 'user_id' })
      setSaving(false)
    }, 400)
  }, [userId, supabase])

  return { data, saving, update }
}
