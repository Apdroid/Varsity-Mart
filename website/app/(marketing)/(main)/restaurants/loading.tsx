import { Skeleton } from "@/components/ui/skeleton"

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full rounded-xl" />
      ))}
    </div>
  )
}

function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border p-2">
          <Skeleton className="aspect-[5/3] w-full rounded-lg sm:aspect-video" />
          <div className="mt-10 space-y-2 px-4 pb-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function RestaurantsLoading() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <Skeleton className="h-8 w-48" />
      <FeaturedSkeleton />
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-36 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      <CardsSkeleton />
    </div>
  )
}
