type StatsCardProps = {
  label: string
  value: number
  sub?: string
  accent?: 'default' | 'amber' | 'emerald' | 'blue' | 'rose'
}

const accentMap = {
  default: 'bg-muted/60',
  amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  emerald: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
  blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  rose: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
}

const valueMap = {
  default: 'text-foreground',
  amber: 'text-amber-700 dark:text-amber-400',
  emerald: 'text-emerald-700 dark:text-emerald-400',
  blue: 'text-blue-700 dark:text-blue-400',
  rose: 'text-rose-700 dark:text-rose-400',
}

export function StatsCard({ label, value, sub, accent = 'default' }: StatsCardProps) {
  return (
    <div className={`rounded-lg border px-5 py-4 ${accentMap[accent]}`}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${valueMap[accent]}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  )
}
