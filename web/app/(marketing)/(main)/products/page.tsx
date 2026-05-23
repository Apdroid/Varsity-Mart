import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { ProductsView } from "./products-view"
import { productsApi } from "@/lib/api/products"

export const dynamic = "force-dynamic"

export default async function ProductsPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["products", "list", { page: 1, limit: 20 }],
    queryFn: async () => {
      const response = await productsApi.list({ page: 1, limit: 20 })
      return {
        products: response.data.products,
        pagination: response.data.pagination,
      }
    },
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsView />
    </HydrationBoundary>
  )
}
