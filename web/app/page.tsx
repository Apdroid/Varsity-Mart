import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import HeroSlider from "@/components/main/hero"
import Newsletter from "@/components/main/newsletter"
import { HomepageContent } from "@/components/main/homepage-content"
import { restaurantsApi } from "@/lib/api/restaurants"
import { storesApi } from "@/lib/api/stores"
import { productsApi } from "@/lib/api/products"

export default async function Page() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { staleTime: 10 * 60 * 1000 } },
	})

	await Promise.allSettled([
		queryClient.prefetchQuery({
			queryKey: ["restaurants", "featured"],
			queryFn: async () => {
				const response = await restaurantsApi.featured(6)
				return response.data
			},
		}),
		queryClient.prefetchQuery({
			queryKey: ["stores", "featured"],
			queryFn: async () => {
				const response = await storesApi.featured(6)
				return response.data
			},
		}),
		queryClient.prefetchQuery({
			queryKey: ["products", "featured"],
			queryFn: async () => {
				const response = await productsApi.featured(12)
				return response.data
			},
		}),
		queryClient.prefetchQuery({
			queryKey: ["products", "list", { category: "hostel-supplies", limit: 12 }],
			queryFn: async () => {
				const response = await productsApi.list({ category: "hostel-supplies", limit: 12 })
				return {
					products: response.data.stores,
					pagination: response.data.pagination,
				}
			},
		}),
	])

	return (
		<div className="max-w-8xl mx-auto min-h-svh">
			<HeroSlider />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<HomepageContent />
			</HydrationBoundary>
			<Newsletter />
		</div>
	)
}
