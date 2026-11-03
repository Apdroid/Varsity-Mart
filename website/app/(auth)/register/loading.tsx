import { Skeleton } from "@/components/ui/skeleton"

export default function RegisterLoading() {
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
            <Skeleton className="h-8 w-52 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>

          {/* Two sign-in-method buttons */}
          <div className="flex flex-col gap-4 mb-6">
            <Skeleton className="h-14 w-full rounded-full" />
            <Skeleton className="h-14 w-full rounded-full" />
          </div>

          {/* OR separator */}
          <div className="flex items-center gap-3 my-5">
            <Skeleton className="h-px flex-1" />
            <Skeleton className="h-4 w-8 rounded" />
            <Skeleton className="h-px flex-1" />
          </div>

          {/* Step 1 fields — first/last name row */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-12 w-full rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-12 w-full rounded-full" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-12 w-full rounded-full" />
              {/* Password strength bar */}
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-1.5 flex-1 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Continue button */}
          <Skeleton className="mt-6 h-14 w-full rounded-full" />

          {/* Sign in link */}
          <Skeleton className="mx-auto mt-5 h-4 w-44 rounded-lg" />
        </div>

        {/* Legal notice */}
        <Skeleton className="mx-auto h-4 w-64 rounded-lg" />

      </div>
    </div>
  )
}
