import { Skeleton } from "@/components/ui/skeleton"

export default function CompleteProfileLoading() {
  return (
    <div className="flex my-20 flex-col items-center justify-center">
      <div className="w-full max-w-sm md:max-w-xl mx-auto my-5 px-4">

        {/* Back button */}
        <div className="mb-4 flex items-center gap-1.5">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>

        {/* Logo */}
        <Skeleton className="my-10 mx-auto h-[50px] w-[120px] rounded-lg" />

        {/* Form card */}
        <div className="p-6 md:p-8">

          {/* Title + description */}
          <div className="flex flex-col items-center gap-3 text-center mb-8">
            <Skeleton className="h-8 w-36 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded-lg" />
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            {/* Phone */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>

            {/* University */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            {/* Campus */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            {/* Student ID */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>

          {/* Save button */}
          <Skeleton className="mt-6 h-14 w-full rounded-full" />
        </div>

      </div>
    </div>
  )
}
