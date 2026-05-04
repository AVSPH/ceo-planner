import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <Skeleton className="h-3 w-24" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
