import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <Skeleton className="h-8 w-24" />

      <div className="rounded-xl border bg-card p-6 space-y-5">
        <Skeleton className="h-3 w-14" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-5">
        <Skeleton className="h-3 w-24" />
        <div className="flex items-center gap-5">
          <Skeleton className="size-16 rounded-full shrink-0" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-5">
        <Skeleton className="h-3 w-20" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 p-2.5">
              <Skeleton className="size-10 rounded-lg" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-5">
        <Skeleton className="h-3 w-16" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </div>
  )
}
