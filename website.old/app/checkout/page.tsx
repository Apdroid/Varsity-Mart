import { MainLayout } from "@/components/layout/main-layout"
import { CheckoutPageContent } from "@/components/checkout/checkout-page-content"

export const metadata = {
  title: "Checkout - VarsityMart",
  description: "Complete your purchase",
}

export default function CheckoutPage() {
  return (
    <MainLayout showFooter={false}>
      <CheckoutPageContent />
    </MainLayout>
  )
}
