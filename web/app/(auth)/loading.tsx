import { Skeleton } from "@/components/ui/skeleton"

export default function AuthLoading() {
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
            <Skeleton className="h-8 w-44 rounded-lg" />
            <Skeleton className="h-4 w-60 rounded-lg" />
          </div>

          {/* Two pill-shaped buttons (Google + Email) */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-14 w-full rounded-full" />
            <Skeleton className="h-14 w-full rounded-full" />
          </div>

          {/* "Don't have an account?" */}
          <Skeleton className="mx-auto mt-5 h-4 w-48 rounded-lg" />
        </div>

        {/* Legal notice */}
        <Skeleton className="mx-auto h-4 w-64 rounded-lg" />

      </div>
    </div>
  )
}
