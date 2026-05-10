import type { Product } from "@/components/main/product-card"

export const mockProducts: Product[] = [
	{
		id: "p_01HZ8K2N3P4Q5R6S7T8U9V0W1A",
		title: "Nike Air Force 1 '07 — White, lightly used",
		description:
			"Worn 5 times. Original box and laces included. Size 42 EU / 9 US.",
		price: "320",
		originalPrice: "450",
		images: [
			{
				id: "img_001",
				product: "p_01HZ8K2N3P4Q5R6S7T8U9V0W1A",
				url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
				thumbnail_url:
					"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
				optimized_url:
					"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
				width: 800,
				height: 800,
				format: "jpg",
				display_order: 0,
				created_at: "2026-04-28T09:14:00.000Z",
			},
		],
		category: { id: "cat_fashion", name: "Fashion", icon: "shirt", count: 248 },
		condition: "Like New",
		location: "Unity Hall, KNUST",
		seller: {
			id: "s_kwame",
			name: "Kwame Mensah",
			email: "kwame.m@st.knust.edu.gh",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
			rating: "4.8",
		},
		badges: "Verified",
		status: "active",
		views: 1240,
		likes: 86,
		isNightShop: false,
		createdAt: "2026-04-28T09:14:00.000Z",
	},
	{
		id: "p_01HZ8K2N3P4Q5R6S7T8U9V0W2B",
		title: 'MacBook Pro M2 13" — 256GB, Space Grey',
		description:
			"Bought December 2025, AppleCare+ till 2027. Battery cycle count under 50.",
		price: "8500",
		originalPrice: "10000",
		images: [
			{
				id: "img_002",
				product: "p_01HZ8K2N3P4Q5R6S7T8U9V0W2B",
				url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
				thumbnail_url:
					"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop",
				optimized_url:
					"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
				width: 800,
				height: 800,
				format: "jpg",
				display_order: 0,
				created_at: "2026-05-01T18:42:00.000Z",
			},
		],
		category: {
			id: "cat_electronics",
			name: "Electronics",
			icon: "laptop",
			count: 412,
		},
		condition: "Used",
		location: "Hall 7 Annex",
		seller: {
			id: "s_ama",
			name: "Ama Owusu",
			email: "ama.owusu@st.knust.edu.gh",
			avatar:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
			rating: "5.0",
		},
		badges: "",
		status: "active",
		views: 3400,
		likes: 220,
		isNightShop: true,
		createdAt: "2026-05-01T18:42:00.000Z",
	},
	{
		id: "p_01HZ8K2N3P4Q5R6S7T8U9V0W3C",
		title: "Calculus: Early Transcendentals (Stewart, 8th Ed.)",
		description:
			"Used for MATH 161 last semester. Some highlighting in chapters 1–4.",
		price: "85",
		originalPrice: "150",
		images: [
			{
				id: "img_003",
				product: "p_01HZ8K2N3P4Q5R6S7T8U9V0W3C",
				url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=800&fit=crop",
				thumbnail_url:
					"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=200&fit=crop",
				optimized_url:
					"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&h=600&fit=crop",
				width: 800,
				height: 800,
				format: "jpg",
				display_order: 0,
				created_at: "2026-04-22T11:08:00.000Z",
			},
		],
		category: { id: "cat_books", name: "Books", icon: "book-open", count: 178 },
		condition: "Good",
		location: "Republic Hall",
		seller: {
			id: "s_kojo",
			name: "Kojo Asante",
			email: "kojo.a@st.knust.edu.gh",
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
			rating: "4.6",
		},
		badges: "",
		status: "sold",
		views: 540,
		likes: 32,
		isNightShop: false,
		createdAt: "2026-04-22T11:08:00.000Z",
	},
	{
		id: "p_01HZ8K2N3P4Q5R6S7T8U9V0W4D",
		title: "Hand-stitched Kente backpack — Tangerine accent",
		description:
			"Made in Bonwire by local artisans. Padded laptop sleeve fits up to 15-inch.",
		price: "180",
		originalPrice: "180",
		images: [
			{
				id: "img_004",
				product: "p_01HZ8K2N3P4Q5R6S7T8U9V0W4D",
				url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
				thumbnail_url:
					"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
				optimized_url:
					"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
				width: 800,
				height: 800,
				format: "jpg",
				display_order: 0,
				created_at: "2026-05-03T14:30:00.000Z",
			},
		],
		category: { id: "cat_fashion", name: "Fashion", icon: "shirt", count: 248 },
		condition: "New",
		location: "Africa Hall",
		seller: {
			id: "s_adwoa",
			name: "Adwoa Boateng",
			email: "adwoa.b@st.knust.edu.gh",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
			rating: "4.9",
		},
		badges: "Trending",
		status: "active",
		views: 890,
		likes: 145,
		isNightShop: false,
		createdAt: "2026-05-03T14:30:00.000Z",
	},
	{
		id: "p_01HZ8K2N3P4Q5R6S7T8U9V0W5E",
		title: "Sony WH-1000XM5 Wireless Headphones — Black",
		description: "Sealed in box. Won at a hackathon, never opened.",
		price: "2400",
		originalPrice: "3200",
		images: [
			{
				id: "img_005",
				product: "p_01HZ8K2N3P4Q5R6S7T8U9V0W5E",
				url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
				thumbnail_url:
					"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
				optimized_url:
					"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
				width: 800,
				height: 800,
				format: "jpg",
				display_order: 0,
				created_at: "2026-05-04T20:15:00.000Z",
			},
		],
		category: {
			id: "cat_electronics",
			name: "Electronics",
			icon: "laptop",
			count: 412,
		},
		condition: "New",
		location: "University Hall (Katanga)",
		seller: {
			id: "s_yaw",
			name: "Yaw Darko",
			email: "yaw.darko@st.knust.edu.gh",
			avatar:
				"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
			rating: "4.7",
		},
		badges: "Verified",
		status: "active",
		views: 2105,
		likes: 312,
		isNightShop: true,
		createdAt: "2026-05-04T20:15:00.000Z",
	},
	{
		id: "p_01HZ8K2N3P4Q5R6S7T8U9V0W6F",
		title: "IKEA-style study desk — Birch finish",
		description:
			"Disassembled, easy to move. Selling because I'm graduating in June.",
		price: "350",
		originalPrice: "500",
		images: [
			{
				id: "img_006",
				product: "p_01HZ8K2N3P4Q5R6S7T8U9V0W6F",
				url: "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=800&h=800&fit=crop",
				thumbnail_url:
					"https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=200&h=200&fit=crop",
				optimized_url:
					"https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=600&h=600&fit=crop",
				width: 800,
				height: 800,
				format: "jpg",
				display_order: 0,
				created_at: "2026-04-15T08:00:00.000Z",
			},
		],
		category: {
			id: "cat_home",
			name: "Hostel Supplies",
			icon: "home",
			count: 96,
		},
		condition: "Used",
		location: "Independence Hall",
		seller: {
			id: "s_efua",
			name: "Efua Sarpong",
			email: "efua.s@st.knust.edu.gh",
			avatar:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
			rating: "4.5",
		},
		badges: "",
		status: "active",
		views: 420,
		likes: 28,
		isNightShop: false,
		createdAt: "2026-04-15T08:00:00.000Z",
	},
	{
		id: "p_01HZ8K2N3P4Q5R6S7T8U9V0W7G",
		title: "TI-84 Plus CE Graphing Calculator",
		description:
			"Required for ENGE 161/162. Works perfectly, comes with USB cable.",
		price: "650",
		originalPrice: "900",
		images: [
			{
				id: "img_007",
				product: "p_01HZ8K2N3P4Q5R6S7T8U9V0W7G",
				url: "https://images.unsplash.com/photo-1564631027894-5bdb17618445?w=800&h=800&fit=crop",
				thumbnail_url:
					"https://images.unsplash.com/photo-1564631027894-5bdb17618445?w=200&h=200&fit=crop",
				optimized_url:
					"https://images.unsplash.com/photo-1564631027894-5bdb17618445?w=600&h=600&fit=crop",
				width: 800,
				height: 800,
				format: "jpg",
				display_order: 0,
				created_at: "2026-05-02T07:45:00.000Z",
			},
		],
		category: {
			id: "cat_electronics",
			name: "Electronics",
			icon: "laptop",
			count: 412,
		},
		condition: "Good",
		location: "College of Engineering",
		seller: {
			id: "s_kofi",
			name: "Kofi Asare",
			email: "kofi.a@st.knust.edu.gh",
			avatar:
				"https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop",
			rating: "4.4",
		},
		badges: "Exam Ready",
		status: "active",
		views: 1850,
		likes: 94,
		isNightShop: false,
		createdAt: "2026-05-02T07:45:00.000Z",
	},
	{
		id: "p_01HZ8K2N3P4Q5R6S7T8U9V0W8H",
		title: "Vintage denim jacket — Levi's, Size M",
		description:
			"Thrifted from Kantamanto. Faded indigo wash, perfect for harmattan.",
		price: "120",
		originalPrice: "120",
		images: [
			{
				id: "img_008",
				product: "p_01HZ8K2N3P4Q5R6S7T8U9V0W8H",
				url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop",
				thumbnail_url:
					"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&h=200&fit=crop",
				optimized_url:
					"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&h=600&fit=crop",
				width: 800,
				height: 800,
				format: "jpg",
				display_order: 0,
				created_at: "2026-05-05T16:22:00.000Z",
			},
		],
		category: { id: "cat_fashion", name: "Fashion", icon: "shirt", count: 248 },
		condition: "Used",
		location: "Queen's Hall",
		seller: {
			id: "s_akosua",
			name: "Akosua Mensah",
			email: "akosua.m@st.knust.edu.gh",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
			rating: "4.8",
		},
		badges: "",
		status: "active",
		views: 670,
		likes: 88,
		isNightShop: false,
		createdAt: "2026-05-05T16:22:00.000Z",
	},
	{
		id: "p_01HZ8K2N3P4Q5R6S7T8U9V0W9I",
		title: "Mini fridge — 50L, energy efficient",
		description:
			"Perfect for hostel rooms. Quiet operation, 1-year warranty remaining.",
		price: "780",
		originalPrice: "1100",
		images: [
			{
				id: "img_009",
				product: "p_01HZ8K2N3P4Q5R6S7T8U9V0W9I",
				url: "https://images.unsplash.com/photo-1601599963565-b7f49deedabb?w=800&h=800&fit=crop",
				thumbnail_url:
					"https://images.unsplash.com/photo-1601599963565-b7f49deedabb?w=200&h=200&fit=crop",
				optimized_url:
					"https://images.unsplash.com/photo-1601599963565-b7f49deedabb?w=600&h=600&fit=crop",
				width: 800,
				height: 800,
				format: "jpg",
				display_order: 0,
				created_at: "2026-04-30T12:00:00.000Z",
			},
		],
		category: {
			id: "cat_home",
			name: "Hostel Supplies",
			icon: "home",
			count: 96,
		},
		condition: "Like New",
		location: "Hall 6",
		seller: {
			id: "s_nana",
			name: "Nana Yaa Adjei",
			email: "nana.adjei@st.knust.edu.gh",
			avatar:
				"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
			rating: "4.7",
		},
		badges: "Hostel Pick",
		status: "active",
		views: 980,
		likes: 67,
		isNightShop: false,
		createdAt: "2026-04-30T12:00:00.000Z",
	},
	{
		id: "p_01HZ8K2N3P4Q5R6S7T8U9V0WAJ",
		title: "Logitech MX Master 3S Mouse — Graphite",
		description:
			"Wireless, ergonomic, USB-C. Works flawlessly with Mac and Windows.",
		price: "560",
		originalPrice: "750",
		images: [
			{
				id: "img_010",
				product: "p_01HZ8K2N3P4Q5R6S7T8U9V0WAJ",
				url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop",
				thumbnail_url:
					"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop",
				optimized_url:
					"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop",
				width: 800,
				height: 800,
				format: "jpg",
				display_order: 0,
				created_at: "2026-05-04T22:30:00.000Z",
			},
		],
		category: {
			id: "cat_electronics",
			name: "Electronics",
			icon: "laptop",
			count: 412,
		},
		condition: "Like New",
		location: "Hall 7",
		seller: {
			id: "s_emma",
			name: "Emmanuel Tetteh",
			email: "emma.t@st.knust.edu.gh",
			avatar:
				"https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop",
			rating: "4.9",
		},
		badges: "",
		status: "active",
		views: 1320,
		likes: 102,
		isNightShop: true,
		createdAt: "2026-05-04T22:30:00.000Z",
	},
	{
		id: "p_01HZ8K2N3P4Q5R6S7T8U9V0WBK",
		title: "Acoustic guitar — Yamaha F310, with case",
		description:
			"Great beginner guitar. Includes gig bag, picks, and extra strings.",
		price: "950",
		originalPrice: "1300",
		images: [
			{
				id: "img_011",
				product: "p_01HZ8K2N3P4Q5R6S7T8U9V0WBK",
				url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop",
				thumbnail_url:
					"https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200&h=200&fit=crop",
				optimized_url:
					"https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=600&fit=crop",
				width: 800,
				height: 800,
				format: "jpg",
				display_order: 0,
				created_at: "2026-04-19T15:00:00.000Z",
			},
		],
		category: {
			id: "cat_gifts",
			name: "Music & Arts",
			icon: "gift",
			count: 54,
		},
		condition: "Good",
		location: "Africa Hall",
		seller: {
			id: "s_micheal",
			name: "Micheal Ofori",
			email: "micheal.o@st.knust.edu.gh",
			avatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
			rating: "4.3",
		},
		badges: "",
		status: "active",
		views: 380,
		likes: 41,
		isNightShop: false,
		createdAt: "2026-04-19T15:00:00.000Z",
	},
	{
		id: "p_01HZ8K2N3P4Q5R6S7T8U9V0WCL",
		title: "Adidas Gym Set — Tee + Joggers, Size L",
		description: "Bought last month, never worn. Black with white stripes.",
		price: "240",
		originalPrice: "340",
		images: [
			{
				id: "img_012",
				product: "p_01HZ8K2N3P4Q5R6S7T8U9V0WCL",
				url: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=800&fit=crop",
				thumbnail_url:
					"https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&h=200&fit=crop",
				optimized_url:
					"https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop",
				width: 800,
				height: 800,
				format: "jpg",
				display_order: 0,
				created_at: "2026-05-06T01:10:00.000Z",
			},
		],
		category: {
			id: "cat_fashion",
			name: "Sports & Fitness",
			icon: "dumbbell",
			count: 73,
		},
		condition: "New",
		location: "Hall 5",
		seller: {
			id: "s_priscilla",
			name: "Priscilla Owusu",
			email: "priscilla.o@st.knust.edu.gh",
			avatar:
				"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
			rating: "4.6",
		},
		badges: "Just In",
		status: "active",
		views: 240,
		likes: 18,
		isNightShop: false,
		createdAt: "2026-05-06T01:10:00.000Z",
	},
]
