import type { ApiProduct } from "@/types/api";
import type { Product } from "@/types/models";

/**
 * Maps an ApiProduct (from the live backend) to the internal Product model
 * used by UI components. All fields are null-safe.
 */
export function apiProductToModel(p: ApiProduct): Product {
	const categoryName = p.category?.name ?? "";
	return {
		id: p.id,
		title: p.title ?? "",
		description: p.description ?? "",
		price: parseFloat(p.price ?? "0"),
		compareAtPrice: p.originalPrice ? parseFloat(p.originalPrice) : undefined,
		images: (p.images ?? []).map((img) =>
			typeof img === "string" ? img : (img.optimized_url || img.url || img.thumbnail_url || "")
		),
		category: {
			id: p.category?.id ?? "",
			name: categoryName,
			slug: categoryName.toLowerCase(),
			icon: p.category?.icon ?? "",
		},
		condition: (p.condition ?? "new") as Product["condition"],
		quantity: 1,
		status: (p.status ?? "active").toLowerCase() as Product["status"],
		sellerId: p.seller?.id ?? "",
		seller: {
			id: p.seller?.id ?? "",
			email: p.seller?.email ?? "",
			fullName: p.seller?.name ?? "",
			role: "seller",
			isEmailVerified: true,
			isPhoneVerified: false,
			kycStatus: "approved",
			createdAt: p.createdAt,
			updatedAt: p.createdAt,
		},
		likesCount: p.likes ?? 0,
		tags: p.badges ? [p.badges] : [],
		createdAt: p.createdAt,
		updatedAt: p.createdAt,
	};
}
