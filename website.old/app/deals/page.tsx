import type { Metadata } from "next"
import MainLayout from "@/components/layout/main-layout"
import DealsPageContent from "@/components/deals/deals-page-content"

export const metadata: Metadata = {
  title: "Deals & Offers | VarsityMart",
  description: "Find the best deals and discounts on VarsityMart",
}

export default function DealsPage() {
  return (
    <MainLayout>
      <DealsPageContent />
    </MainLayout>
  )
}
