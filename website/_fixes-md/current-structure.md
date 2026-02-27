# VarsityMart - Current Structure Documentation

## Overview
This document outlines the current application structure, routes, data organization, and backend API expectations for the VarsityMart platform.

---

## Data Directory Structure

All static/mock data is centralized in the `data/` directory following the pattern: `data/(category)/(resource).ts`

### Data Organization

```
data/
├── account/
│   ├── account.tsx          # User account data, menu items, recent orders
│   └── orders.ts            # Order history data
├── auth/
│   ├── register-schemas.ts  # Zod validation schemas for registration
│   ├── register-steps.ts    # Step titles, descriptions, images, mock Google user
│   └── universities.ts      # University and campus data
├── cart/
│   └── cart-items.ts        # Shopping cart items (uses full Product type)
├── checkout/
│   └── checkout-items.ts    # Checkout cart items, saved addresses, payment methods
├── food/
│   ├── restaurant-detail.ts # Single restaurant with menu
│   └── restaurants.ts       # Restaurant listings (uses Restaurant from @/types/models)
├── messages/
│   ├── conversations.ts     # Message conversations list
│   └── messages.ts          # Individual messages
├── notifications/
│   └── notifications.ts     # Notification data
├── offers/
│   └── offers.ts            # Product offers/negotiations
├── products/
│   ├── product-detail.ts    # Single product detail (full Product type)
│   └── products.ts          # Product listings array
├── shared/
│   └── status-colors.ts     # Shared order status color mappings
├── stores/
│   ├── store-detail.ts      # Single store with products
│   └── stores.ts            # Store listings
└── wishlist/
    └── wishlist.ts          # Wishlist items (uses Product type)
```

### Key Data Structures

**Products**: All product data uses the `Product` type from `@/types/models`
- `data/products/products.ts` - Array of products for listings
- `data/products/product-detail.ts` - Single detailed product
- `data/stores/store-detail.ts` - Products within a store context
- `data/wishlist/wishlist.ts` - Wishlisted products
- `data/cart/cart-items.ts` - Cart items with full Product reference

**Restaurants**: Uses `Restaurant` type from `@/types/models`
- `data/food/restaurants.ts` - Restaurant listings
- `data/food/restaurant-detail.ts` - Single restaurant with menu

**Orders**: Order status colors are centralized in `data/shared/status-colors.ts`

---

## Application Routes

### Public Routes

| Route | Component | Data Source | Backend Endpoint Expected |
|-------|-----------|-------------|---------------------------|
| `/` | Home page | `data/products/products.ts`, `data/food/restaurants.ts` | `GET /api/products?featured=true`, `GET /api/restaurants?featured=true` |
| `/products` | Products listing | `data/products/products.ts` | `GET /api/products` |
| `/products/[id]` | Product detail | `data/products/product-detail.ts` | `GET /api/products/:id` |
| `/stores` | Stores listing | `data/stores/stores.ts` | `GET /api/stores` |
| `/stores/[id]` | Store detail | `data/stores/store-detail.ts` | `GET /api/stores/:id`, `GET /api/stores/:id/products` |
| `/food` | Restaurants listing | `data/food/restaurants.ts` | `GET /api/restaurants` |
| `/food/[id]` | Restaurant detail | `data/food/restaurant-detail.ts` | `GET /api/restaurants/:id`, `GET /api/restaurants/:id/menu` |
| `/categories` | Categories page | Inline categories data | `GET /api/categories` |
| `/search` | Search page | `data/products/products.ts` | `GET /api/search?q=:query&category=:category` |
| `/deals` | Deals page | TBD | `GET /api/deals` |
| `/about` | About page | `data/about.js` | Static content |
| `/contact` | Contact page | - | `POST /api/contact` |
| `/help` | Help page | - | Static content |

### Authentication Routes

| Route | Component | Data Source | Backend Endpoint Expected |
|-------|-----------|-------------|---------------------------|
| `/auth/login` | Login form | - | `POST /api/auth/login` |
| `/auth/register` | Registration form | `data/auth/universities.ts`, `data/auth/register-steps.ts` | `POST /api/auth/register`, `GET /api/universities` |

### User Account Routes (Protected)

| Route | Component | Data Source | Backend Endpoint Expected |
|-------|-----------|-------------|---------------------------|
| `/account` | Account dashboard | `data/account/account.tsx` | `GET /api/user/profile`, `GET /api/user/stats` |
| `/account/orders` | Orders history | `data/account/orders.ts` | `GET /api/orders` |
| `/account/settings` | Account settings | - | `GET /api/user/settings`, `PUT /api/user/settings` |
| `/wishlist` | Wishlist | `data/wishlist/wishlist.ts` | `GET /api/wishlist`, `POST /api/wishlist`, `DELETE /api/wishlist/:id` |
| `/cart` | Shopping cart | `data/cart/cart-items.ts` | `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/:id`, `DELETE /api/cart/:id` |
| `/checkout` | Checkout | `data/checkout/checkout-items.ts` | `GET /api/user/addresses`, `GET /api/payment-methods`, `POST /api/orders` |
| `/checkout/success` | Order success | - | - |
| `/messages` | Messages | `data/messages/conversations.ts`, `data/messages/messages.ts` | `GET /api/messages/conversations`, `GET /api/messages/:id`, `POST /api/messages` |
| `/notifications` | Notifications | `data/notifications/notifications.ts` | `GET /api/notifications`, `PUT /api/notifications/:id/read` |
| `/offers` | Offers (Seller) | `data/offers/offers.ts` | `GET /api/offers`, `PUT /api/offers/:id/accept`, `PUT /api/offers/:id/decline`, `POST /api/offers/:id/counter` |

### Seller Routes (Protected)

| Route | Component | Data Source | Backend Endpoint Expected |
|-------|-----------|-------------|---------------------------|
| `/sell` | Sell page | `data/sell.js` | `GET /api/seller/dashboard`, `POST /api/products` |

---

## Backend API Endpoints Expected

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/universities` - Get universities and campuses list

### Products
- `GET /api/products` - List products (with pagination, filters)
- `GET /api/products/:id` - Get product detail
- `POST /api/products` - Create product (seller)
- `PUT /api/products/:id` - Update product (seller)
- `DELETE /api/products/:id` - Delete product (seller)
- `POST /api/products/:id/like` - Like/unlike product
- `GET /api/products/featured` - Get featured products

### Stores
- `GET /api/stores` - List stores
- `GET /api/stores/:id` - Get store detail
- `GET /api/stores/:id/products` - Get store products
- `POST /api/stores` - Create store (seller)
- `PUT /api/stores/:id` - Update store (seller)

### Restaurants/Food
- `GET /api/restaurants` - List restaurants
- `GET /api/restaurants/:id` - Get restaurant detail
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `POST /api/restaurants/:id/orders` - Place food order

### Categories
- `GET /api/categories` - Get all categories

### Search
- `GET /api/search` - Search products/stores/restaurants
  - Query params: `q`, `category`, `type`, `page`, `limit`

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Checkout
- `GET /api/user/addresses` - Get user addresses
- `POST /api/user/addresses` - Add address
- `PUT /api/user/addresses/:id` - Update address
- `DELETE /api/user/addresses/:id` - Delete address
- `GET /api/payment-methods` - Get payment methods
- `POST /api/orders` - Create order

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order detail
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/status` - Update order status (seller)

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

### Messages
- `GET /api/messages/conversations` - Get conversations list
- `GET /api/messages/:id` - Get conversation messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read

### Offers
- `GET /api/offers` - Get offers (seller: received, buyer: sent)
- `POST /api/offers` - Create offer
- `PUT /api/offers/:id/accept` - Accept offer
- `PUT /api/offers/:id/decline` - Decline offer
- `POST /api/offers/:id/counter` - Counter offer

### User Account
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update user settings
- `GET /api/user/stats` - Get user statistics

---

## Data Type Definitions

All type definitions are in `types/models.ts`. Key types:

- `User` - User account information
- `Product` - Product listing/detail
- `Store` - Store information
- `Restaurant` - Restaurant information
- `MenuItem` - Restaurant menu item
- `Order` - Order information
- `OrderItem` - Order line item
- `Address` - Delivery address
- `Offer` - Product offer/negotiation
- `Conversation` - Message conversation
- `Message` - Individual message
- `Notification` - Notification data
- `Category` - Product category

---

## Component Structure

Components are organized by feature in `components/`:

```
components/
├── account/          # Account-related components
├── auth/             # Authentication components
├── cart/             # Shopping cart components
├── checkout/         # Checkout components
├── food/             # Restaurant/food components
├── home/             # Home page components
├── layout/           # Layout components
├── messages/         # Messaging components
├── notifications/    # Notification components
├── offers/           # Offer components
├── products/         # Product components
├── search/           # Search components
├── sell/             # Seller components
├── stores/           # Store components
├── wishlist/         # Wishlist components
└── ui/               # Reusable UI components
```

---

## Where to Work

### Frontend Development
- **Components**: `components/` directory
- **Pages**: `app/` directory (Next.js App Router)
- **Data**: `data/` directory (single source of truth)
- **Types**: `types/models.ts`
- **Hooks**: `hooks/` directory
- **Utils**: `lib/utils/` directory

### Backend Integration Points
1. **API Client**: `lib/api/` directory - Create API client functions
2. **Hooks**: `hooks/` directory - Create data fetching hooks (use React Query)
3. **Stores**: `lib/stores/` directory - State management (Zustand)

### Data Migration Strategy
When backend is ready:
1. Replace mock data imports in components with API hooks
2. Update `lib/api/` with actual API endpoints
3. Keep `data/` directory for fallback/default data if needed
4. Update types in `types/models.ts` to match backend responses

---

## Notes

- All static/mock data is in `data/` directory
- Components should import from `data/` directory, not inline data
- Type definitions are centralized in `types/models.ts`
- Status colors are shared in `data/shared/status-colors.ts`
- Restaurant data uses `Restaurant` type from `@/types/models` (not custom interface)

---

## Known Issues Fixed

1. ✅ **statusColors duplication**: Consolidated in `data/shared/status-colors.ts`
2. ✅ **Restaurant interface**: Now uses `Restaurant` from `@/types/models`
3. ✅ **Cart vs Checkout items**: Different structures maintained (Cart uses full Product, Checkout uses simplified for performance)

## Known Data Structure Mismatches

✅ **All resolved**: 
- Restaurant type now includes `tags?: string[]` field
- Restaurant type uses `minOrder` instead of `minimumOrder`
- All components updated to use `restaurant.location.street` (from Address type)

---

Last Updated: 2024-01-XX

