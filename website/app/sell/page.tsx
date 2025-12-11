import { MainLayout } from "@/components/layout/main-layout"
import { SellPageContent } from "@/components/sell/sell-page-content"

export const metadata = {
  title: "Start Selling - VarsityMart",
  description: "Start your campus business on VarsityMart",
}

export default function SellPage() {
  return (
    <MainLayout>
      <SellPageContent />
    </MainLayout>
  )
}
