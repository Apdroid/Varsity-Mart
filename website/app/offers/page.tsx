import { Suspense } from "react"
import MainLayout from "@/components/layout/main-layout"
import { OffersPageContent } from "@/components/offers/offers-page-content"

export default function OffersPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="p-8">Loading offers...</div>}>
        <OffersPageContent />
      </Suspense>
    </MainLayout>
  )
}
