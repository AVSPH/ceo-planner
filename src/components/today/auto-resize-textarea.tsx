'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minRows?: number
}

export function AutoResizeTextarea({ value, onChange, placeholder, className, minRows = 2 }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={minRows}
      className={cn(
        'w-full resize-none overflow-hidden bg-transparent text-sm leading-relaxed',
        'border-b border-border focus:border-primary outline-none',
        'placeholder:text-muted-foreground/40 py-1.5 transition-colors',
        className
      )}
    />
  )
}
