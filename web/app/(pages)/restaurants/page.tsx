import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { RestaurantsView } from "./restaurants-view"
import { restaurantsApi } from "@/lib/api/restaurants"

export default async function RestaurantsPage() {
  const queryClient = new QueryClient()

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: ["restaurants", "featured"],
      queryFn: async () => {
        const response = await restaurantsApi.featured(3)
        return response.data
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["restaurants", "list", { sortBy: "popular", page: 1, limit: 12 }],
      queryFn: async () => {
        const response = await restaurantsApi.list({ sortBy: "popular", page: 1, limit: 12 })
        return {
          restaurants: response.data.restaurants,
          pagination: response.data.pagination,
        }
      },
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RestaurantsView />
    </HydrationBoundary>
  )
}
