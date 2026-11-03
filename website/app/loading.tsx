import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
  return (
    <div className="min-h-svh">
      {/* Hero skeleton */}
      <Skeleton className="h-[380px] w-full sm:h-[480px]" />

      <div className="container mx-auto space-y-12 px-4 py-10">
        {/* Section */}
        {Array.from({ length: 3 }).map((_, s) => (
          <div key={s} className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
