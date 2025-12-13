import { MainLayout } from "@/components/layout/main-layout"
import { ProductsPageContent } from "@/components/products/products-page-content"

export const metadata = {
  title: "Products - VarsityMart",
  description: "Browse all products on VarsityMart",
}

export default function ProductsPage() {
  return (
    <MainLayout>
      <ProductsPageContent />
    </MainLayout>
  )
}
