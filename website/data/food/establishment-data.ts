export interface MenuItem {
	id: string;
	name: string;
	price: number;
	description?: string;
}

export interface Establishment {
	id: string;
	name: string;
	banner: string;
	establishmentType: "restaurant" | "food_stall";
	seller: {
		firstName: string;
		lastName: string;
	};
	price?: number;
	compareAtPrice?: number;
	rating?: number;
	reviewsCount?: number;
	deliveryTime?: string;
	deliveryFee?: number;
	description?: string;
	meals?: MenuItem[];
}

export const establishments: Establishment[] = [
	{
		id: "1",
		name: "Golden Spoon Restaurant",
		banner: "https://images.unsplash.com/photo-1739792598744-3512897156e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGludGVyaW9yfGVufDF8fHx8MTc2NzcxMjg4MXww&ixlib=rb-4.1.0&q=80&w=1080",
		establishmentType: "restaurant" as const,
		seller: {
			firstName: "Rebecca",
			lastName: "Nkrumah",
		},
		price: 45,
		compareAtPrice: 60,
		rating: 4.8,
		reviewsCount: 234,
		deliveryTime: "25-35 min",
		deliveryFee: 5,
		description: "Authentic Ghanaian cuisine with a modern twist. Experience the finest local and international dishes prepared by expert chefs.",
		meals: [
			{
				id: "m1",
				name: "Jollof Rice with Grilled Chicken",
				price: 35,
				description: "Spicy Jollof rice served with perfectly grilled chicken and fresh salad",
			},
			{
				id: "m2",
				name: "Banku & Tilapia",
				price: 40,
				description: "Traditional fermented corn dough with grilled tilapia and hot pepper",
			},
			{
				id: "m3",
				name: "Waakye Deluxe",
				price: 30,
				description: "Rice and beans with spaghetti, gari, egg, and your choice of protein",
			},
			{
				id: "m4",
				name: "Fufu & Light Soup",
				price: 38,
				description: "Pounded cassava and plantain with aromatic light soup and goat meat",
			},
			{
				id: "m5",
				name: "Kelewele Platter",
				price: 25,
				description: "Spicy fried plantains served with peanuts and fish",
			},
		],
	},
	{
		id: "2",
		name: "Mama's Street Kitchen",
		banner: "https://images.unsplash.com/photo-1767485219678-89affb4329a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmb29kJTIwc3RhbGx8ZW58MXx8fHwxNzY3NTk3MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
		establishmentType: "food_stall" as const,
		seller: {
			firstName: "Akosua",
			lastName: "Mensah",
		},
		price: 15,
		compareAtPrice: 25,
		rating: 4.9,
		reviewsCount: 567,
		deliveryTime: "10-20 min",
		deliveryFee: 3,
		description: "Fast, affordable, and delicious street food. Made with love and authentic Ghanaian recipes passed down through generations.",
		meals: [
			{
				id: "m6",
				name: "Rice & Beans",
				price: 12,
				description: "Classic rice and beans with gari and your choice of protein",
			},
			{
				id: "m7",
				name: "Fried Yam & Fish",
				price: 18,
				description: "Crispy fried yam with perfectly seasoned fish and pepper sauce",
			},
			{
				id: "m8",
				name: "Kenkey & Fish",
				price: 15,
				description: "Traditional fermented corn meal with fried fish and shito",
			},
			{
				id: "m9",
				name: "Red Red",
				price: 20,
				description: "Black-eyed peas stew with fried plantains and gari",
			},
		],
	},
	{
		id: "3",
		name: "The Elegant Bistro",
		banner: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3Njc2MTMyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
		establishmentType: "restaurant" as const,
		seller: {
			firstName: "Kwame",
			lastName: "Osei",
		},
		price: 85,
		rating: 4.7,
		reviewsCount: 189,
		deliveryTime: "35-45 min",
		deliveryFee: 8,
		description: "Fine dining experience with a fusion of African and European cuisine. Perfect for special occasions and business meetings.",
		meals: [
			{
				id: "m10",
				name: "Grilled Salmon",
				price: 95,
				description: "Atlantic salmon with lemon butter sauce, asparagus, and mashed potatoes",
			},
			{
				id: "m11",
				name: "Beef Wellington",
				price: 120,
				description: "Tender beef fillet wrapped in puff pastry with mushroom duxelles",
			},
			{
				id: "m12",
				name: "Lobster Thermidor",
				price: 150,
				description: "Luxurious lobster in creamy cognac sauce with Gruyère cheese",
			},
		],
	},
	{
		id: "4",
		name: "Chop Bar Express",
		banner: "https://images.unsplash.com/photo-1674066233489-7c8a6082ed52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbWFya2V0JTIwc3RhbGx8ZW58MXx8fHwxNzY3NzEyODgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
		establishmentType: "food_stall" as const,
		seller: {
			firstName: "Yaw",
			lastName: "Boateng",
		},
		price: 18,
		compareAtPrice: 28,
		rating: 4.6,
		reviewsCount: 421,
		deliveryTime: "15-25 min",
		deliveryFee: 4,
		description: "Quick bites and authentic local flavors. Great for lunch breaks and quick meals on the go.",
		meals: [
			{
			id: "m13",
				name: "Omo Tuo & Groundnut Soup",
				price: 22,
				description: "Rice balls with rich peanut soup and chicken",
			},
			{
				id: "m14",
				name: "Ampesi",
				price: 20,
				description: "Boiled yam and plantain with kontomire stew",
			},
			{
				id: "m15",
				name: "Tuo Zaafi",
				price: 25,
				description: "Corn flour dish with ayoyo soup and beef",
			},
		],
	},

{
	id: "5",
	name: "Coastal Catch",
	banner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
	establishmentType: "restaurant" as const,
	seller: {
		firstName: "Esi",
		lastName: "Quaye",
	},
	price: 55,
	rating: 4.5,
	reviewsCount: 198,
	deliveryTime: "30-40 min",
	deliveryFee: 6,
	description: "Fresh seafood inspired by Ghana’s coastal flavors.",
	meals: [
		{ id: "m16", name: "Grilled Red Snapper", price: 55 },
		{ id: "m17", name: "Shrimp Jollof", price: 48 },
	],
},
{
	id: "6",
	name: "Urban Grill House",
	banner: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee",
	establishmentType: "restaurant" as const,
	seller: {
		firstName: "Daniel",
		lastName: "Asante",
	},
	price: 60,
	rating: 4.4,
	reviewsCount: 312,
	deliveryTime: "30-45 min",
	deliveryFee: 7,
	description: "Modern grill house serving premium meats and sides.",
	meals: [
		{ id: "m18", name: "BBQ Ribs", price: 65 },
		{ id: "m19", name: "Grilled Chicken Wings", price: 40 },
	],
},
{
	id: "7",
	name: "Sunrise Breakfast Spot",
	banner: "https://images.unsplash.com/photo-1551218808-94e220e084d2",
	establishmentType: "food_stall" as const,
	seller: {
		firstName: "Adjoa",
		lastName: "Owusu",
	},
	price: 12,
	rating: 4.7,
	reviewsCount: 654,
	deliveryTime: "10-15 min",
	deliveryFee: 2,
	description: "Quick breakfast favorites to start your day right.",
	meals: [
		{ id: "m20", name: "Hausa Koko & Koose", price: 10 },
		{ id: "m21", name: "Bread & Egg", price: 12 },
	],
},
{
	id: "8",
	name: "Northern Delights",
	banner: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
	establishmentType: "restaurant" as const,
	seller: {
		firstName: "Sadiq",
		lastName: "Abdul",
	},
	price: 35,
	rating: 4.6,
	reviewsCount: 276,
	deliveryTime: "25-35 min",
	deliveryFee: 5,
	description: "Traditional dishes from Northern Ghana.",
	meals: [
		{ id: "m22", name: "Tuo Zaafi Special", price: 35 },
		{ id: "m23", name: "Fried Guinea Fowl", price: 45 },
	],
},
{
	id: "9",
	name: "Plantain Palace",
	banner: "https://images.unsplash.com/photo-1604908554027-36c19f9cf1b8",
	establishmentType: "food_stall" as const,
	seller: {
		firstName: "Mavis",
		lastName: "Darko",
	},
	price: 14,
	rating: 4.8,
	reviewsCount: 502,
	deliveryTime: "15-20 min",
	deliveryFee: 3,
	description: "Everything plantain, sweet or savory.",
	meals: [
		{ id: "m24", name: "Kelewele & Gizzard", price: 18 },
		{ id: "m25", name: "Plantain Chips", price: 10 },
	],
},
{
	id: "10",
	name: "Spice Route",
	banner: "https://images.unsplash.com/photo-1526318896980-cf78c088247c",
	establishmentType: "restaurant" as const,
	seller: {
		firstName: "Rahim",
		lastName: "Issah",
	},
	price: 50,
	rating: 4.3,
	reviewsCount: 167,
	deliveryTime: "30-40 min",
	deliveryFee: 6,
	description: "Bold spices and rich stews inspired by West Africa.",
	meals: [
		{ id: "m26", name: "Spicy Goat Stew", price: 50 },
		{ id: "m27", name: "Pepper Soup", price: 35 },
	],
},
{
	id: "11",
	name: "Campus Bites",
	banner: "https://images.unsplash.com/photo-1525351484163-7529414344d8",
	establishmentType: "food_stall" as const,
	seller: {
		firstName: "Kojo",
		lastName: "Antwi",
	},
	price: 10,
	rating: 4.5,
	reviewsCount: 889,
	deliveryTime: "10-15 min",
	deliveryFee: 2,
	description: "Affordable meals loved by students.",
	meals: [
		{ id: "m28", name: "Indomie & Egg", price: 10 },
		{ id: "m29", name: "Fried Rice", price: 15 },
	],
},
{
	id: "12",
	name: "Heritage Kitchen",
	banner: "https://images.unsplash.com/photo-1543353071-873f17a7a088",
	establishmentType: "restaurant" as const,
	seller: {
		firstName: "Abena",
		lastName: "Boadu",
	},
	price: 40,
	rating: 4.9,
	reviewsCount: 341,
	deliveryTime: "25-35 min",
	deliveryFee: 5,
	description: "Preserving traditional recipes with authentic taste.",
	meals: [
		{ id: "m30", name: "Palm Nut Soup & Fufu", price: 40 },
		{ id: "m31", name: "Kontomire Stew", price: 30 },
	],
},
{
	id: "13",
	name: "Late Night Cravings",
	banner: "https://images.unsplash.com/photo-1550547660-d9450f859349",
	establishmentType: "food_stall" as const,
	seller: {
		firstName: "Yaw",
		lastName: "Kusi",
	},
	price: 16,
	rating: 4.4,
	reviewsCount: 378,
	deliveryTime: "20-30 min",
	deliveryFee: 4,
	description: "Perfect meals for late-night hunger.",
	meals: [
		{ id: "m32", name: "Fried Rice & Chicken", price: 20 },
		{ id: "m33", name: "Hot Dogs & Fries", price: 15 },
	],
},
{
	id: "14",
	name: "Green Bowl",
	banner: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
	establishmentType: "restaurant" as const,
	seller: {
		firstName: "Linda",
		lastName: "Appiah",
	},
	price: 30,
	rating: 4.6,
	reviewsCount: 214,
	deliveryTime: "20-30 min",
	deliveryFee: 4,
	description: "Healthy bowls, salads, and light meals.",
	meals: [
		{ id: "m34", name: "Grilled Chicken Salad", price: 30 },
		{ id: "m35", name: "Veggie Rice Bowl", price: 25 },
	],
},
];
