import { MainLayout } from "@/components/layout/main-layout"
import { WishlistPageContent } from "@/components/wishlist/wishlist-page-content"

export const metadata = {
  title: "Wishlist - VarsityMart",
  description: "Your saved items on VarsityMart",
}

export default function WishlistPage() {
  return (
    <MainLayout>
      <WishlistPageContent />
    </MainLayout>
  )
}
