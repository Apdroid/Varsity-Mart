import { MainLayout } from "@/components/layout/main-layout"
import { OrdersPageContent } from "@/components/account/orders-page-content"

export const metadata = {
  title: "My Orders - VarsityMart",
  description: "View and track your orders",
}

export default function OrdersPage() {
  return (
    <MainLayout>
      <OrdersPageContent />
    </MainLayout>
  )
}
