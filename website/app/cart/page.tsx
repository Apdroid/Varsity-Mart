import { MainLayout } from "@/components/layout/main-layout"
import { CartPageContent } from "@/components/cart/cart-page-content"

export const metadata = {
  title: "Shopping Cart - VarsityMart",
  description: "Review your shopping cart",
}

export default function CartPage() {
  return (
    <MainLayout>
      <CartPageContent />
    </MainLayout>
  )
}
