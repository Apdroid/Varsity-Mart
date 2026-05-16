// API Response Wrappers - Match actual backend responses
export interface ApiResponse<T> {
	success: boolean
	message?: string
	data: T
}

// Pagination structure used by most endpoints
export interface Pagination {
	currentPage: number
	totalPages: number
	totalItems: number
	itemsPerPage: number
}

// Django REST Framework pagination (used by store-categories)
export interface DRFPaginatedList<T> {
	count: number
	next: string | null
	previous: string | null
	results: T[]
}

/** Alias for DRF-style paginated JSON (`count`, `next`, `previous`, `results`). */
export type PaginatedList<T> = DRFPaginatedList<T>

export interface ConversationListResponse {
	count: number
	next: string | null
	previous: string | null
	results: {
		conversations: Conversation[]
	}
}

export interface MessageListResponse {
	count: number
	next: string | null
	previous: string | null
	results: {
		messages: Message[]
		pagination: {
			currentPage: number
			totalPages: number
			totalItems: number
		}
	}
}

// Products list response
export interface ProductsListResponse {
	success: boolean
	data: {
		products: Product[]
		pagination: Pagination
	}
}

// Stores list response
export interface StoresListResponse {
	success: boolean
	data: {
		stores: StoreListItem[]
		pagination: Pagination
	}
}

// Restaurants list response
export interface RestaurantsListResponse {
	success: boolean
	data: {
		restaurants: RestaurantListItem[]
		pagination: Pagination
	}
}

// Featured items response (direct array)
export interface FeaturedResponse<T> {
	success: boolean
	data: T[]
}

// Categories response
export interface CategoriesResponse<T> {
	success: boolean
	data: {
		categories: T[]
	}
}

// Reviews response
export interface ReviewsResponse {
	success: boolean
	message?: string
	data: {
		reviews: Review[]
		pagination: {
			total_items: number
			total_pages: number
			current_page: number
			itemsPerPage: number
		}
		averageRating: number
		totalReviews: number
		ratingDistribution: Record<string, number>
	}
}

// User Types
export type KycStatus = "not_submitted" | "pending" | "approved" | "rejected"
export type UserRole = "user" | "admin" | "delivery"
export type AuthMethod = "credentials" | "google"

export interface User {
	id: string
	firstName: string
	lastName: string
	email: string
	phone: string
	avatar?: string
	profilePic?: string
	avatarUrl?: string
	studentId?: string
	campus: string
	university: string
	isStudent: boolean
	isVerified: boolean
	kycStatus: KycStatus
	role: UserRole
	rating: number
	totalReviews: number
	bio?: string
	memberSince: string
	hasStore: boolean
	hasRestaurant: boolean
	responseRate?: string
	responseTime?: string
	cloudinaryPublicId?: string
}

export interface PublicUser {
	id: string
	firstName?: string
	lastName?: string
	name?: string
	avatar?: string
	rating: number
	totalReviews?: number
	memberSince?: string
	role?: UserRole
	isVerified?: boolean
	hasStore?: boolean
	hasRestaurant?: boolean
	responseRate?: string
	responseTime?: string
	university?: string
	campus?: string
	is_online?: boolean
}

// Auth Types
export interface LoginRequest {
	email: string
	password: string
}

export interface LoginResponse {
	success: boolean
	message: string
	data: {
		user: User
		isNewUser?: boolean
		profileComplete?: boolean
	}
}

export interface RegisterRequest {
	firstName: string
	lastName: string
	email: string
	phone: string
	password: string
	confirmPassword: string
	studentId?: string
	isStudent?: boolean
	university: string
	campus: string
	agreeToTerms: boolean
	authMethod?: AuthMethod
	profilePic?: string
}

export interface GoogleLoginRequest {
	id_token: string
}

export interface VerifyEmailRequest {
	email?: string
	verification_code: string
}

export interface ForgotPasswordRequest {
	email: string
}

export interface ResetPasswordRequest {
	reset_token: string
	new_password: string
	confirm_password: string
}

export interface AuthStatus {
	isAuthenticated: boolean
	user?: User
}

export interface SellerStatus {
	isActiveSeller: boolean
	hasStore: boolean
	hasRestaurant: boolean
	storeId?: string
	restaurantId?: string
}

// Product Types - Match actual API response
export interface ProductImage {
	id: string
	product: string
	url: string
	thumbnail_url: string
	optimized_url: string
	width: number
	height: number
	format: string
	display_order: number
	created_at: string
}

export interface ProductCategorySimple {
	id: string
	name: string
	icon?: string
	count?: number
}

export interface ProductSeller {
	id: string
	name: string
	email?: string
	avatarUrl?: string
	rating: number
	total_sales?: number
	response_rate?: string
	response_time?: string
}

export type ProductCondition = "new" | "like_new" | "good" | "fair" | "poor"
export type ProductStatus = "Active" | "draft" | "pending" | "sold" | "archived"

// Product in list response
export interface Product {
	id: string
	title: string
	description: string
	price: string
	originalPrice?: string
	images: ProductImage[]
	category: ProductCategorySimple
	condition: string
	location: string
	seller: ProductSeller
	badges?: string
	status: string
	views: number
	likes: number
	isNightShop: boolean
	createdAt: string
}

// Product detail response (single product)
export interface ProductDetail extends Omit<Product, 'category' | 'badges'> {
	category: string
	stock: number
	badges: string[]
	isLiked: boolean
	deliveryOptions: string[]
	specifications: string[]
	store?: { id: string; name: string }
	updatedAt: string
}

export interface CreateProductRequest {
	title: string
	description: string
	price: number
	originalPrice?: number
	category: string
	condition: ProductCondition
	location: string
	quantity?: number
	isNightShop?: boolean
	tags?: string[]
	storeId?: string
}

export interface ProductFilters {
	page?: number
	limit?: number
	category?: string
	condition?: ProductCondition
	minPrice?: number
	maxPrice?: number
	sortBy?: "newest" | "popular" | "price_low" | "price_high"
	search?: string
	sellerId?: string
	storeId?: string
}

// Product Category (full)
export interface ProductCategory {
	id: string
	name: string
	icon: string
	count: number
}

// Store Types - Match actual API
export interface StoreListItem {
	id: string
	name: string
	logo: string
	category: string
	rating: string
	totalReviews: number
	totalProducts: number
	isOpen: boolean
}

export interface StoreDetail {
	id: string
	storeName: string
	description: string
	logo?: string
	banner?: string
	category: string
	location: string
	phone?: string
	isOpen: boolean
	openingTime?: string
	closingTime?: string
	rating: string
	totalReviews: number
	totalProducts: number
	totalSales: string
	deliveryFee: string
	minOrder: number
	owner: {
		id: string
		name: string
		avatarUrl?: string
	}
	member_since: string
	subscriptionStatus: string
	subscriptionEnds?: string | null
}

export interface StoreCategory {
	id: string
	name: string
	featured_store?: StoreListItem
	count: number
}

export interface CreateStoreRequest {
	storeName: string
	description: string
	category: string
	location: string
	deliveryFee: number
	minOrder: number
	phone?: string
	openingTime?: string
	closingTime?: string
	logo?: File
	banner?: File
	migrateProducts?: boolean
}

export interface StoreFilters {
	page?: number
	limit?: number
	category?: string
	search?: string
	sortBy?: "popular" | "newest"
}

// Restaurant Types - Match actual API
export interface RestaurantListItem {
	id: string
	name: string
	logo: string
	banner: string
	category: string
	rating: string
	totalReviews: number
	deliveryTime: string
	deliveryFee: string
	minOrder: number
	isOpen: boolean
	badge?: string
}

export interface RestaurantDetail {
	id: string
	name: string
	description: string
	logo: string
	banner: string
	category: string
	location: string
	phone?: string
	rating: string
	totalReviews: number
	deliveryTime: string
	deliveryFee: string
	minOrder: number
	isOpen: boolean
	openingTime?: string
	closingTime?: string
	owner: {
		id: string
		name: string
		avatar?: string
	}
	memberSince: string
	isFeatured?: boolean
	cuisineType?: string
}

export interface RestaurantCategory {
	id: string
	name: string
	featured_restaurant?: RestaurantListItem
}

export interface MenuItemOption {
	name: string
	priceMod: number
}

export interface MenuItem {
	id: string
	name: string
	description: string
	price: number
	image: string
	isAvailable: boolean
	preparationTime: string
	spicyLevel: number
	isVegetarian: boolean
	tags: string[]
}

export interface MenuCategory {
	id: string
	name: string
	items: MenuItem[]
}

export interface RestaurantFilters {
	page?: number
	limit?: number
	category?: string
	search?: string
	cuisineType?: string
	isOpen?: boolean
	sortBy?: "popular" | "newest" | "rating"
}

export interface RestaurantWithMenu {
	id: string
	name: string
	logo?: string
	banner?: string
	category?: string
	cuisineType?: string
	rating?: number | string
	totalReviews?: number
	deliveryTime?: string
	deliveryFee?: number | string
	minOrder?: number
	isOpen?: boolean
	isFeatured?: boolean
	tags?: string[]
	badge?: string
	menu: {
		categories: MenuCategory[]
	}
}

// Cart Types (Marketplace Products)
export interface CartItem {
	id: string
	product: {
		id: string
		name: string
		price: number
		image?: string
		slug: string
		inStock: boolean
	}
	quantity: number
	unitPrice: number
	subtotal: number
	createdAt: string
	updatedAt: string
}

export interface Cart {
	items: CartItem[]
	total: number
	itemCount: number
}

export interface AddToCartRequest {
	productId: string
	quantity: number
}

export interface UpdateCartItemRequest {
	quantity: number
}

// Order Types (Marketplace)
export type OrderStatus =
	| "pending"
	| "pending_payment"
	| "payment_confirmed"
	| "paid"
	| "confirmed"
	| "processing"
	| "shipped"
	| "in_delivery"
	| "delivered"
	| "cancelled"
	| "refunded"

export interface OrderItem {
	id: string
	product: {
		id: string
		title: string
		price: number
		image?: string
	}
	quantity: number
	unitPrice: number
	subtotal: number
}

export interface Order {
	id: string
	orderNumber: string
	status: OrderStatus
	items: OrderItem[]
	subtotal: number
	deliveryFee: number
	serviceFee: number
	total: number
	deliveryAddress?: string
	deliveryInstructions?: string
	deliveryMethod?: "campus_delivery" | "pickup"
	paymentMethod: string
	paymentStatus: string
	seller: {
		id: string
		name: string
		firstName?: string
		lastName?: string
		avatar?: string
		phone?: string
	}
	buyer: {
		id: string
		name: string
	}
	createdAt: string
	updatedAt: string
	estimatedDelivery?: string
	deliveredAt?: string
	cancelledAt?: string
	cancelReason?: string
	timeline?: { status: string; timestamp: string; note?: string }[]
}

export interface CreateOrderRequest {
	productId: string,
	deliveryMethod?: "campus_delivery" | "pickup"
	deliveryAddress?: string
	deliveryInstructions?: string
	paymentMethod: "momo" | "card"
	momoNumber?: string
	momoProvider?: string
}

export interface OrderFilters {
	page?: number
	limit?: number
	status?: OrderStatus
}

// Food Order Types
export type FoodOrderStatus =
	| "pending"
	| "confirmed"
	| "preparing"
	| "ready"
	| "picked_up"
	| "in_delivery"
	| "delivered"
	| "cancelled"

export interface FoodOrderItem {
	id: string
	menuItem: {
		id: string
		name: string
		basePrice: number
		image?: string
	}
	quantity: number
	selectedSize?: MenuItemOption
	selectedProtein?: MenuItemOption
	selectedSides?: MenuItemOption[]
	selectedModifiers?: string[]
	notes?: string
	unitPrice: number
	subtotal: number
}

export interface FoodOrder {
	id: string
	orderNumber: string
	status: FoodOrderStatus
	restaurant: {
		id: string
		name: string
		logo?: string
		phone?: string
	}
	items: FoodOrderItem[]
	subtotal: number
	deliveryFee: number
	serviceFee: number
	total: number
	deliveryAddress?: string
	deliveryInstructions?: string
	paymentMethod: string
	paymentStatus: string
	createdAt: string
	updatedAt: string
	estimatedDelivery?: string
	deliveredAt?: string
}

export interface CreateFoodOrderRequest {
	restaurant_id: string
	items: {
		menu_item_id: string
		quantity: number
		selected_size?: MenuItemOption
		selected_protein?: MenuItemOption
		selected_sides?: MenuItemOption[]
		selected_modifiers?: string[]
		notes?: string
	}[]
	delivery_address?: string
	delivery_instructions?: string
	payment_method: "momo" | "card"
}

export interface RateFoodOrderRequest {
	food_rating: number
	delivery_rating: number
	review?: string
}

// Review Types
export interface ReviewAuthor {
	id: string
	firstName: string
	lastName: string
	avatar?: string
	isVerified?: boolean
}

export interface ReviewImage {
	id: string
	url: string
}

export interface Review {
	id: string
	author: ReviewAuthor
	rating: number
	review: string
	createdAt: string
	helpfulCount: number
	images?: ReviewImage[]
}

export interface ReviewStats {
	averageRating: number
	totalReviews: number
	ratingDistribution: {
		1: number
		2: number
		3: number
		4: number
		5: number
	}
}

export interface CreateReviewRequest {
	rating: number
	review: string
}

export interface ReviewFilters {
	page?: number
	limit?: number
	sortBy?: "newest" | "highest" | "lowest" | "helpful"
}

// Notification Types
export type NotificationType =
	| "order_update"
	| "message"
	| "new_message"
	| "promotion"
	| "price_drop"
	| "new_follower"
	| "review"
	| "system"

export interface Notification {
	id: string
	type: NotificationType
	title: string
	message: string
	isRead: boolean
	data?: Record<string, unknown>
	createdAt: string
}

export interface NotificationSettings {
	orderUpdates: boolean
	newMessages: boolean
	promotions: boolean
	priceDrops: boolean
	newFollowers: boolean
	emailEnabled: boolean
	pushEnabled: boolean
	smsEnabled: boolean
}

// Conversation/Message Types
export interface Conversation {
	id: string
	other_user: PublicUser
	last_message?: {
		text: string
		timestamp: string
		senderId?: string
		delivered_at?: string
		is_read: boolean
		read_at: string
	}
	unread_count: number
	product?: {
		id: string
		title: string
		price: number
		image?: string
	}
	created_at: string
	updated_at: string
}

export interface Message {
	id: string
	sender_id: string
	text: string
	timestamp: string
	delivered_at?: string | null
	is_read: boolean
	read_at?: string | null
	flagged: boolean
	flag_reason?: "contact_info" | "spam" | "inappropriate" | "harassment" | "other" | null
	product?: {
		id: string
		title: string
		price: number
		firstImageUrl?: string
	} | null
}

export interface StartConversationRequest {
	other_user_id: string
	product_id?: string
	initial_message?: string
}

export interface SendMessageRequest {
	text: string
	product_id?: string
}

// Payment Types
export interface PaymentMethod {
	id: string
	type: "momo" | "card" | "bank"
	provider?: string
	last4?: string
	expiryMonth?: number
	expiryYear?: number
	isDefault: boolean
	createdAt: string
}

export interface InitiatePaymentRequest {
	order_id: string
	payment_method: "momo" | "card"
	return_url?: string
}

export interface PaymentResponse {
	success: boolean
	data: {
		paymentUrl: string
		reference: string
	}
}

// Search Types
export interface FoodSearchItem {
	id: string
	name: string
	description: string
	price: string
	isAvailable: boolean
	preparationTime: string
	spicyLevel: number
	isVegetarian: boolean
	tags: string[]
	total_sales: number
	restaurant_id: string
	restaurant_name: string
	restaurant_logo: string
	restaurant_rating: string
	restaurant_is_open: boolean
	restaurant_delivery_fee: string
	restaurant_location: string
}

export interface SearchFilters {
	query: string
	type?: "all" | "products" | "stores" | "food"
	category?: string
	minPrice?: number
	maxPrice?: number
	condition?: ProductCondition
	sortBy?: "relevance" | "newest" | "price_low" | "price_high"
	page?: number
	limit?: number
}

export interface SearchResults {
	products: Product[]
	stores: StoreListItem[]
	restaurants: RestaurantListItem[]
	totalProducts: number
	totalStores: number
	totalRestaurants: number
}

// KYC Types
export interface KycApplication {
	id: string
	userId: string
	status: KycStatus
	documentType: string
	documentUrl: string
	selfieUrl: string
	rejectionReason?: string
	submittedAt: string
	reviewedAt?: string
}

// Escrow Types
export interface EscrowBalance {
	available: number
	pending: number
	total: number
}

// Payout Types
export interface Bank {
	id: string
	name: string
	code: string
}

export interface PayoutRequest {
	amount: number
	bank_code: string
	account_number: string
	account_name: string
}

export interface AddPaymentMethodRequest {
	provider: "mtn" | "vodafone" | "airteltigo"
	phone: string
}

export interface VerifyPaymentResponse {
	success: boolean
	status: string
	orderId?: string
	amount?: number
	message?: string
}
