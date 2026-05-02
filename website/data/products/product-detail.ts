import type { Product } from "@/types/models";

export const mockProduct: Product = {
	id: "1",
	title: 'MacBook Pro 13" M2 2023 - Perfect Condition with Box & Accessories',
	description: `Selling my MacBook Pro 13" with M2 chip in excellent condition. Only used for 6 months for school work.

Specs:
- Apple M2 chip with 8-core CPU and 10-core GPU
- 16GB unified memory
- 512GB SSD storage
- 13.3-inch Retina display
- macOS Sonoma installed

Includes:
- Original box
- 67W USB-C Power Adapter
- USB-C to MagSafe 3 Cable
- AppleCare+ until December 2025

Battery health: 98%
Cycle count: 45

Reason for selling: Upgraded to 16" model for work.

Can meet on campus for inspection. Serious buyers only.`,
	price: 4500,
	compareAtPrice: 5200,
	images: [
		"/silver-macbook-on-desk.png",
		"/macbook-keyboard.jpg",
		"/macbook-side-view.jpg",
		"/macbook-box-accessories.jpg",
	],
	category: { id: "1", name: "Electronics", slug: "electronics" },
	subcategory: "Laptops",
	condition: "like-new",
	quantity: 1,
	status: "active",
	sellerId: "1",
	seller: {
		id: "1",
		email: "john@campus.edu",
		firstName: "John",
		lastName: "Mensah",
		avatar: "/male-student-portrait.png",
		role: "seller",
		isEmailVerified: true,
		isPhoneVerified: true,
		kycStatus: "approved",
		createdAt: "2023-01-15",
		updatedAt: "2024-01-01",
	},
	storeId: "store-1",
	store: {
		id: "store-1",
		name: "TechDeals GH",
		description: "Premium tech at student prices",
		logo: "/tech-store-logo.png",
		ownerId: "1",
		owner: {} as any,
		rating: 4.8,
		reviewsCount: 127,
		productsCount: 45,
		isVerified: true,
		isOpen: true,
		createdAt: "",
		updatedAt: "",
	},
	likesCount: 24,
	isLiked: false,
	tags: ["laptop", "apple", "macbook", "m2"],
	createdAt: "2024-01-10",
	updatedAt: "2024-01-10",
};

