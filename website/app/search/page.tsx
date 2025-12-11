import { Suspense } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { SearchPageContent } from "@/components/search/search-page-content"

export const metadata = {
  title: "Search - VarsityMart",
  description: "Search for products, stores, and food on VarsityMart",
}

export default function SearchPage() {
  return (
    <MainLayout>
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchPageContent />
      </Suspense>
    </MainLayout>
  )
}

function SearchPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="h-12 bg-muted rounded-lg mb-6 max-w-xl" />
        <div className="flex gap-8">
          <div className="w-64 shrink-0 hidden lg:block">
            <div className="h-8 bg-muted rounded mb-4 w-24" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-muted rounded" />
              ))}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
