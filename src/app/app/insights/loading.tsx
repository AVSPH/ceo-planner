import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <Skeleton className="h-8 w-24" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-52 w-full rounded-xl" />
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-44 w-full rounded-xl" />

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <Skeleton className="h-3 w-32" />
        <div className="space-y-5">
          <div className="space-y-2.5">
            <Skeleton className="h-2.5 w-10" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-3.5 w-full rounded-sm" />
            ))}
          </div>
          <div className="space-y-2.5">
            <Skeleton className="h-2.5 w-12" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-3.5 w-full rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
