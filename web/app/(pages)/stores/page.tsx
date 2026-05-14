import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { StoresView } from "./stores-view"
import { storesApi } from "@/lib/api/stores"

export default async function StoresPage() {
  const queryClient = new QueryClient()

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: ["stores", "featured"],
      queryFn: async () => {
        const response = await storesApi.featured(3)
        return response.data
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["stores", "list", { sortBy: "popular", page: 1, limit: 12 }],
      queryFn: async () => {
        const response = await storesApi.list({ sortBy: "popular", page: 1, limit: 12 })
        return {
          stores: response.data.stores,
          pagination: response.data.pagination,
        }
      },
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StoresView />
    </HydrationBoundary>
  )
}
