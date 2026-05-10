# VarsityMart API Routes — v3 (Refactored)

> **Refactor basis:** Unified identity model. Every user signs up as a buyer. Selling is an additive capability unlocked via a dedicated "Become a Seller" flow. The `role` field is removed from registration. Seller capabilities are resolved server-side by checking `seller_profiles.kyc_status = approved`. One token, one session, one user.

**Base URL:** `https://api.varsitymart.com/v1`  
**Authentication:** JWT stored in HTTP-Only cookies (`accessToken` / `refreshToken`). No manual token handling required on the client.

---

## What Changed from v2

| Area | v2 | v3 |
|---|---|---|
| Registration `role` field | `"buyer \| seller \| admin"` in request body | **Removed.** All users register as buyers by default. |
| Seller identity | Tied to `users.role` | Separate `seller_profiles` table linked via FK |
| KYC split | `POST /kyc/student` and `POST /kyc/business` | Unified `POST /kyc` with `kycType` field |
| Seller activation | No dedicated flow | New `POST /seller/activate` endpoint initiates seller onboarding |
| Seller status in auth responses | Implied by `role` | Explicit `sellerProfile` object returned when activated |
| `/users/me` response | `hasStore`, `hasRestaurant` flags | `sellerProfile` object (null if not a seller) |
| `GET /orders/my-orders` | Returns orders for a role | Returns buyer orders; `GET /seller/orders` returns seller orders |
| Wallet | Escrow only, seller-side | Unified wallet: tracks both incoming revenue and outgoing payments |
| `GET /payments/escrow/balance` | Standalone escrow endpoint | Replaced by `GET /wallet` (unified) |
| Store creation | Standalone flow requiring a subscription payment | Part of `POST /seller/activate` → seller type `products` |
| Food service creation | Standalone flow | Part of `POST /seller/activate` → seller type `food` |
| `seller_type` field | Per-resource (`businessType` in KYC body) | Resolved from `seller_profiles.seller_type` |

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [User Management](#2-user-management)
3. [KYC Verification](#3-kyc-verification)
4. [Seller Activation & Profile](#4-seller-activation--profile)
5. [Products & Marketplace](#5-products--marketplace)
6. [Stores](#6-stores)
7. [Food Services](#7-food-services)
8. [Orders (Buyer)](#8-orders-buyer)
9. [Orders (Seller)](#9-orders-seller)
10. [Food Orders](#10-food-orders)
11. [Cart](#11-cart)
12. [Chat & Messaging](#12-chat--messaging)
13. [Wallet & Payments](#13-wallet--payments)
14. [Reviews & Ratings](#14-reviews--ratings)
15. [Admin Dashboard](#15-admin-dashboard)
16. [Notifications](#16-notifications)
17. [Night Shop](#17-night-shop)
18. [File Uploads](#18-file-uploads)
19. [Support & Settings](#19-support--settings)

---

## Database Schema (Reference)

```sql
-- Core identity. No role column.
users:
  id, full_name, email, student_email, phone, hashed_password,
  is_student, is_verified, avatar_url, campus, university,
  auth_method, buyer_rating, buyer_review_count, created_at

-- Seller layer. Separate table, FK to users.
seller_profiles:
  id, user_id (FK → users.id),
  seller_type  ENUM('products', 'food'),
  kyc_status   ENUM('pending', 'approved', 'rejected'),
  shop_name, shop_description, shop_banner_url,
  payout_method_id (FK → payment_methods.id),
  is_live,      -- food sellers only: live/closed toggle
  created_at

-- Products and food listings both FK to seller_profiles, not users
products:        seller_profile_id (FK → seller_profiles.id), ...
food_listings:   seller_profile_id (FK → seller_profiles.id), ...

-- Unified wallet
wallets:
  id, user_id (FK), balance, total_earned, total_spent, updated_at
```

---

## 1. Authentication

### Token Management (HTTP-Only Cookies)

```
accessToken:   HttpOnly, Secure, SameSite=Strict, Path=/, Max-Age=900
refreshToken:  HttpOnly, Secure, SameSite=Strict, Path=/auth/refresh-token, Max-Age=2592000
```

---

### 1.1 Register
**Screen:** `RegisterScreen.tsx`  
**Endpoint:** `POST /auth/register`  
**Auth Required:** No

> **v3 change:** `role` field removed entirely. No role-selection at signup.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@gmail.com",
  "phone": "+233XXXXXXXXX",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "isStudent": true,
  "studentEmail": "john.doe@knust.edu.gh",
  "university": "KNUST",
  "campus": "Main Campus",
  "agreeToTerms": true,
  "authMethod": "google | credentials",
  "profilePic": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "userId": "user_123456",
    "user": {
      "id": "user_123456",
      "fullName": "John Doe",
      "email": "john.doe@gmail.com",
      "isVerified": false,
      "isStudent": true,
      "sellerProfile": null
    }
  }
}
```

---

### 1.2 Login
**Screen:** `LoginScreen.tsx`  
**Endpoint:** `POST /auth/login`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "john.doe@gmail.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123456",
      "fullName": "John Doe",
      "email": "john.doe@gmail.com",
      "isVerified": true,
      "isStudent": true,
      "buyerRating": 4.8,
      "sellerProfile": {
        "id": "sp_789",
        "sellerType": "products",
        "kycStatus": "approved",
        "shopName": "Tech Store",
        "isLive": null
      }
    }
  }
}
```

> `sellerProfile` is `null` for users who have not activated selling. The client uses this to decide whether to render the "My Shop" tab in the bottom nav.

---

### 1.3 Email Verification
**Endpoint:** `POST /auth/verify-email`  
**Auth Required:** Yes

**Request Body:**
```json
{ "verificationCode": "123456" }
```

**Backend Logic:**
```
if (user.isStudent) → verify against studentEmail
else               → verify against email

On success: user.isVerified = true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isVerified": true,
    "nextStep": "account_ready"
  }
}
```

---

### 1.4 Resend Verification Email
**Endpoint:** `POST /auth/resend-verification`  
**Auth Required:** Yes

---

### 1.5 Forgot Password
**Endpoint:** `POST /auth/forgot-password`  
**Request Body:** `{ "email": "..." }`

---

### 1.6 Reset Password
**Endpoint:** `POST /auth/reset-password`  
**Request Body:** `{ "resetToken": "...", "newPassword": "...", "confirmPassword": "..." }`

---

### 1.7 Refresh Token
**Endpoint:** `POST /auth/refresh-token`  
Reads `refreshToken` from HTTP-only cookie. Returns new cookie pair.

---

### 1.8 Logout
**Endpoint:** `POST /auth/logout`  
Clears both cookies.

---

## 2. User Management

### 2.1 Get Current User Profile
**Screen:** `ProfileScreen.tsx`  
**Endpoint:** `GET /users/me`  
**Auth Required:** Yes

> **v3 change:** `hasStore` and `hasRestaurant` flags replaced by the `sellerProfile` object. Ratings split into `buyerRating` and `sellerRating`.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123456",
    "fullName": "John Doe",
    "email": "john.doe@gmail.com",
    "studentEmail": "john.doe@knust.edu.gh",
    "phone": "+233XXXXXXXXX",
    "avatar": "👤",
    "isVerified": true,
    "isStudent": true,
    "campus": "Main Campus",
    "kycStatus": "verified",
    "buyerRating": 4.8,
    "buyerReviewCount": 23,
    "sellerRating": 4.9,
    "sellerReviewCount": 156,
    "memberSince": "2024-01-15T00:00:00Z",
    "sellerProfile": {
      "id": "sp_789",
      "sellerType": "products",
      "kycStatus": "approved",
      "shopName": "Tech Store",
      "shopDescription": "Your one-stop shop for electronics",
      "shopBannerUrl": "https://cdn.varsitymart.com/banners/sp_789.jpg",
      "isLive": null
    }
  }
}
```

---

### 2.2 Update User Profile
**Endpoint:** `PUT /users/me`  
**Request Body:**
```json
{
  "fullName": "John Updated Doe",
  "phone": "+233XXXXXXXXX",
  "campus": "Main Campus",
  "bio": "Tech enthusiast"
}
```

---

### 2.3 Upload Avatar
**Endpoint:** `POST /users/me/avatar`  
`multipart/form-data` → `{ avatar: File }`

---

### 2.4 Get User by ID (Public)
**Endpoint:** `GET /users/:userId`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123456",
    "fullName": "John Doe",
    "avatar": "👤",
    "buyerRating": 4.8,
    "sellerRating": 4.9,
    "memberSince": "2024-01-15T00:00:00Z",
    "responseRate": "95%",
    "responseTime": "2 hours"
  }
}
```

---

## 3. KYC Verification

> **v3 change:** `POST /kyc/student` and `POST /kyc/business` are merged into a single `POST /kyc` endpoint driven by a `kycType` field. This avoids duplicating validation logic and maps cleanly to the unified identity model.

### 3.1 Submit KYC
**Screen:** `KycScreen.tsx`  
**Endpoint:** `POST /kyc`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
FormData: {
  kycType: "student" | "seller",

  -- student KYC fields (kycType = "student") --
  studentIdImage: File,
  selfieImage: File,
  studentEmail: "john.doe@knust.edu.gh",
  university: "KNUST",

  -- seller KYC fields (kycType = "seller") --
  ghanaCardFront: File,
  ghanaCardBack: File,
  selfieWithId: File,
  businessDocument: File (optional),
  businessName: "Tech Store",
  registrationNumber: "BN123456" (optional)
}
```

**Backend Logic:**
```typescript
if (kycType === "student") {
  // Requires: user.isStudent === true, studentEmail matches
  // Sets: users.is_verified = true after approval
}

if (kycType === "seller") {
  // Sets: seller_profiles.kyc_status = "pending"
  // Does NOT require user to already be a student
}
```

**Response:**
```json
{
  "success": true,
  "message": "KYC submitted. Verification in progress.",
  "data": {
    "kycId": "kyc_123456",
    "kycType": "seller",
    "status": "pending",
    "submittedAt": "2024-12-02T10:30:00Z",
    "estimatedReviewTime": "24-48 hours"
  }
}
```

---

### 3.2 Get KYC Status
**Endpoint:** `GET /kyc/status`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "studentKyc": {
      "status": "verified",
      "verifiedAt": "2024-01-16T14:20:00Z"
    },
    "sellerKyc": {
      "status": "pending",
      "submittedAt": "2024-12-02T10:30:00Z",
      "reviewNote": null
    }
  }
}
```

---

## 4. Seller Activation & Profile

> **v3 addition:** This is an entirely new section. It replaces the old pattern where a user would go directly to `POST /stores` or `POST /food-services` to "become a seller." The activation flow creates the `seller_profiles` row and kicks off KYC. The seller's shop/food service setup is scoped to their profile — not loosely to the user.

### 4.1 Initiate Seller Activation
**Screen:** `BecomeSellerScreen.tsx`  
**Endpoint:** `POST /seller/activate`  
**Auth Required:** Yes

> Called when a buyer taps "Start Selling." Creates the `seller_profiles` row in draft/pending state. KYC must be submitted separately via `POST /kyc` with `kycType: "seller"`.

**Request Body:**
```json
{
  "sellerType": "products | food",
  "shopName": "Tech Store",
  "shopDescription": "Your one-stop shop for electronics",
  "shopBannerUrl": "https://cdn.varsitymart.com/banners/sp_789.jpg"
}
```

**Backend Logic:**
```
// Prevent duplicate activation
if (seller_profiles.where(user_id = user.id).exists()) {
  throw CONFLICT("Seller profile already exists");
}

// Create seller profile in pending KYC state
seller_profiles.create({
  user_id: user.id,
  seller_type: body.sellerType,
  kyc_status: "pending",
  shop_name: body.shopName,
  ...
})
```

**Response:**
```json
{
  "success": true,
  "message": "Seller profile created. Please complete KYC to activate your shop.",
  "data": {
    "sellerProfileId": "sp_789",
    "sellerType": "products",
    "kycStatus": "pending",
    "nextStep": "submit_kyc"
  }
}
```

---

### 4.2 Get Seller Profile
**Screen:** `MyShopScreen.tsx`  
**Endpoint:** `GET /seller/profile`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sp_789",
    "userId": "user_123456",
    "sellerType": "products",
    "kycStatus": "approved",
    "shopName": "Tech Store",
    "shopDescription": "Your one-stop shop for electronics",
    "shopBannerUrl": "https://cdn.varsitymart.com/banners/sp_789.jpg",
    "isLive": null,
    "sellerRating": 4.9,
    "totalSales": 1250,
    "totalReviews": 156,
    "payoutMethod": {
      "id": "method_1",
      "type": "momo",
      "provider": "MTN",
      "number": "+233XXXX5678"
    },
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

---

### 4.3 Update Seller Profile
**Screen:** `ShopSettingsScreen.tsx`  
**Endpoint:** `PUT /seller/profile`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "shopName": "Tech Store Pro",
  "shopDescription": "Updated description",
  "shopBannerUrl": "https://..."
}
```

---

### 4.4 Toggle Food Shop Live Status
**Screen:** `MyShopScreen.tsx` (food sellers only)  
**Endpoint:** `PATCH /seller/profile/live-status`  
**Auth Required:** Yes

> Only valid when `seller_profiles.seller_type = 'food'` and `kyc_status = 'approved'`.

**Request Body:**
```json
{ "isLive": true }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isLive": true,
    "updatedAt": "2024-12-02T10:00:00Z"
  }
}
```

---

### 4.5 Get Seller Dashboard Stats
**Screen:** `MyShopScreen.tsx`  
**Endpoint:** `GET /seller/dashboard`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "sellerType": "products",
    "todayOrders": 12,
    "todayRevenue": 5400,
    "monthlyRevenue": 62000,
    "pendingOrders": 3,
    "totalProducts": 34,
    "walletBalance": 18200,
    "topSellingItems": [
      { "itemId": "prod_456", "name": "iPhone 13 Pro Max", "sales": 45, "revenue": 202500 }
    ],
    "recentOrders": [
      { "id": "ORD-128", "buyer": "John D.", "total": 4500, "status": "confirmed", "time": "10 mins ago" }
    ]
  }
}
```

---

## 5. Products & Marketplace

> No structural changes here beyond `sellerId` in responses now referring to `seller_profiles.id` rather than `users.id`. The `seller` object in product responses reflects this.

### 5.1 Get All Products
**Endpoint:** `GET /products`  
**Auth Required:** No

**Query Parameters:** `page`, `limit`, `category`, `search`, `minPrice`, `maxPrice`, `condition`, `sortBy`, `isNightShop`

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123456",
        "title": "iPhone 13 Pro Max",
        "price": 4500,
        "images": ["https://cdn.varsitymart.com/products/prod_123456_1.jpg"],
        "category": "Electronics",
        "condition": "new",
        "location": "Main Campus",
        "seller": {
          "sellerProfileId": "sp_789",
          "shopName": "Tech Store",
          "sellerRating": 4.9
        },
        "badges": ["Hot", "New"],
        "views": 245,
        "likes": 34,
        "isNightShop": false,
        "createdAt": "2024-12-01T08:00:00Z"
      }
    ],
    "pagination": { "currentPage": 1, "totalPages": 10, "totalItems": 200, "itemsPerPage": 20 }
  }
}
```

---

### 5.2 Get Product by ID
**Endpoint:** `GET /products/:productId`  
**Auth Required:** No

---

### 5.3 Create Product
**Screen:** `AddProductScreen.tsx`  
**Endpoint:** `POST /products`  
**Auth Required:** Yes

> **Guard:** Server checks `seller_profiles.kyc_status = 'approved'` and `seller_type = 'products'` before allowing creation. Returns `KYC_REQUIRED` if not.

**Request Body:** `multipart/form-data`
```
title, description, price, originalPrice, category, condition,
location, stock, deliveryOptions[], images[], specifications (JSON string)
```

---

### 5.4 Update Product
**Endpoint:** `PUT /products/:productId`  
**Auth Required:** Yes

---

### 5.5 Delete Product
**Endpoint:** `DELETE /products/:productId`  
**Auth Required:** Yes

---

### 5.6 Toggle Product Like
**Endpoint:** `POST /products/:productId/like`  
**Auth Required:** Yes

---

### 5.7 Search Products
**Endpoint:** `GET /products/search?q=...`  
**Auth Required:** No

---

### 5.8 Get My Products
**Endpoint:** `GET /products/my-products`  
**Auth Required:** Yes  
**Query Parameters:** `page`, `limit`, `status`

---

### 5.9 Get Product Categories
**Endpoint:** `GET /products/categories`  
**Auth Required:** No

---

## 6. Stores

> No breaking changes. `GET /stores/my-store` still works. Internally, the store row now has `seller_profile_id` instead of `user_id` as its owner reference. The subscription payment flow is unchanged.

### 6.1 Create Store
**Screen:** `StoreCreationScreen.tsx`  
**Endpoint:** `POST /stores`  
**Auth Required:** Yes

> Only reachable after seller activation (`sellerType: 'products'`) and KYC approval.

**Request Body:** `multipart/form-data`
```
storeName, description, category, logo: File, location,
phone, openingTime, closingTime, deliveryFee, minOrder
```

**Response:**
```json
{
  "success": true,
  "message": "Store created successfully. Please complete subscription payment.",
  "data": {
    "storeId": "store_123456",
    "paymentRequired": true,
    "amount": 25,
    "paymentUrl": "https://api.varsitymart.com/payments/store_123456"
  }
}
```

---

### 6.2 Get Store by ID
**Endpoint:** `GET /stores/:storeId`  
**Auth Required:** No

---

### 6.3 Update Store
**Endpoint:** `PUT /stores/:storeId`  
**Auth Required:** Yes

---

### 6.4 Get All Stores
**Endpoint:** `GET /stores`  
**Auth Required:** No  
**Query Parameters:** `page`, `limit`, `category`, `search`, `sortBy`

---

### 6.5 Get Store Products
**Endpoint:** `GET /stores/:storeId/products`  
**Auth Required:** No

---

### 6.6 Get My Store
**Endpoint:** `GET /stores/my-store`  
**Auth Required:** Yes

---

### 6.7 Renew Store Subscription
**Endpoint:** `POST /stores/:storeId/renew`  
**Request Body:** `{ "duration": "semester" }`

---

## 7. Food Services

> The `restaurantId` field in food order request bodies (v2 §49) is renamed to `foodServiceId` for consistency.

### 7.1 Create Food Service
**Screen:** `CreateFoodServiceScreen.tsx`  
**Endpoint:** `POST /food-services`  
**Auth Required:** Yes

> Only reachable after seller activation (`sellerType: 'food'`) and KYC approval.

**Request Body:** `multipart/form-data`
```
name, type: "restaurant | foodstall", description, logo: File,
coverImage: File, location, latitude, longitude, phone,
operatingHours (JSON), cuisineType, averageDeliveryTime,
minOrderAmount, deliveryFee,
restaurantOnly: { seatingCapacity, diningType, parkingAvailable },
foodstallOnly: { marketName, stallNumber, speciality }
```

---

### 7.2 Get Food Service by ID
**Endpoint:** `GET /food-services/:foodServiceId`  
**Auth Required:** No

---

### 7.3 Update Food Service
**Endpoint:** `PUT /food-services/:foodServiceId`  
**Auth Required:** Yes (owner or admin)

---

### 7.4 List Food Services
**Endpoint:** `GET /food-services`  
**Auth Required:** No  
**Query Parameters:** `page`, `limit`, `type`, `search`, `campus`, `sortBy`

---

### 7.5 Delete Food Service
**Endpoint:** `DELETE /food-services/:foodServiceId`  
**Auth Required:** Yes (owner or admin)

---

### 7.6 Get Food Service Menu
**Endpoint:** `GET /food-services/:foodServiceId/menu`  
**Auth Required:** No

---

### 7.7 Create Menu Item
**Endpoint:** `POST /food-services/:foodServiceId/menu-items`  
**Auth Required:** Yes (owner)  
**Content-Type:** `multipart/form-data`

---

### 7.8 Update Menu Item
**Endpoint:** `PUT /food-services/:foodServiceId/menu-items/:itemId`  
**Auth Required:** Yes (owner)

---

### 7.9 Delete Menu Item
**Endpoint:** `DELETE /food-services/:foodServiceId/menu-items/:itemId`  
**Auth Required:** Yes (owner)

---

### 7.10 Get Food Service Dashboard
**Endpoint:** `GET /food-services/:foodServiceId/dashboard`  
**Auth Required:** Yes

---

## 8. Orders (Buyer)

> **v3 change:** `GET /orders/my-orders` previously used a `type=buyer|seller` query param. Buyer and seller order lists are now separate endpoints to reduce ambiguity and simplify authorization logic.

### 8.1 Create Order
**Endpoint:** `POST /orders`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "productId": "prod_123456",
  "quantity": 1,
  "deliveryMethod": "campus_delivery",
  "deliveryAddress": "Hall 3, Room 205",
  "deliveryInstructions": "Call when you arrive",
  "paymentMethod": "momo",
  "momoNumber": "+233XXXXXXXXX",
  "momoProvider": "MTN"
}
```

---

### 8.2 Get Order by ID
**Endpoint:** `GET /orders/:orderId`  
**Auth Required:** Yes

---

### 8.3 Get My Purchases
**Screen:** `MyOrdersScreen.tsx` → Purchases tab  
**Endpoint:** `GET /orders/purchases`  
**Auth Required:** Yes  
**Query Parameters:** `page`, `limit`, `status`

---

### 8.4 Confirm Order Delivery
**Endpoint:** `POST /orders/:orderId/confirm-delivery`  
**Auth Required:** Yes (buyer only)

---

### 8.5 Cancel Order
**Endpoint:** `POST /orders/:orderId/cancel`  
**Request Body:** `{ "reason": "...", "details": "..." }`

---

### 8.6 Rate Order
**Endpoint:** `POST /orders/:orderId/rate`  
**Request Body:** `{ "rating": 5, "review": "...", "rateProduct": true, "rateSeller": true }`

---

## 9. Orders (Seller)

> **v3 addition:** All seller-side order management is scoped under `/seller/orders` to make authorization clean — the server simply checks `seller_profiles.user_id = currentUser.id`.

### 9.1 Get My Sales
**Screen:** `MyOrdersScreen.tsx` → Sales tab  
**Endpoint:** `GET /seller/orders`  
**Auth Required:** Yes  
**Query Parameters:** `page`, `limit`, `status`

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ORD-123456",
        "status": "confirmed",
        "product": { "id": "prod_123456", "title": "iPhone 13 Pro Max", "image": "..." },
        "quantity": 1,
        "total": 4730,
        "buyer": { "id": "user_123", "name": "John Doe" },
        "estimatedDelivery": "2024-12-02T13:00:00Z",
        "createdAt": "2024-12-02T10:00:00Z"
      }
    ],
    "pagination": { "currentPage": 1, "totalPages": 3, "totalItems": 52, "itemsPerPage": 20 }
  }
}
```

---

### 9.2 Update Order Status (Seller)
**Endpoint:** `PATCH /seller/orders/:orderId/status`  
**Auth Required:** Yes

**Request Body:**
```json
{ "status": "in_transit", "note": "Order is on the way" }
```

---

## 10. Food Orders

> **v3 change:** `restaurantId` in request body renamed to `foodServiceId`.

### 10.1 Create Food Order
**Endpoint:** `POST /food-orders`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "foodServiceId": "fs_123456",
  "items": [
    {
      "itemId": "food_123",
      "quantity": 2,
      "customizations": [{ "name": "Spice Level", "value": "Hot" }],
      "specialInstructions": "Extra spicy please"
    }
  ],
  "deliveryMethod": "campus_delivery",
  "deliveryAddress": "Hall 7, Room 301",
  "paymentMethod": "momo",
  "momoNumber": "+233XXXXXXXXX",
  "momoProvider": "MTN"
}
```

---

### 10.2 Get Food Order by ID
**Endpoint:** `GET /food-orders/:orderId`  
**Auth Required:** Yes

---

### 10.3 Get My Food Orders (Buyer)
**Endpoint:** `GET /food-orders/purchases`  
**Auth Required:** Yes  
**Query Parameters:** `page`, `limit`, `status`

---

### 10.4 Get My Food Sales (Seller)
**Endpoint:** `GET /seller/food-orders`  
**Auth Required:** Yes  
**Query Parameters:** `page`, `limit`, `status`

---

### 10.5 Update Food Order Status (Seller)
**Endpoint:** `PATCH /seller/food-orders/:orderId/status`  
**Auth Required:** Yes  
**Request Body:** `{ "status": "preparing | ready | out_for_delivery", "estimatedDeliveryTime": "20 mins" }`

---

### 10.6 Confirm Food Order Delivery (Buyer)
**Endpoint:** `POST /food-orders/:orderId/confirm-delivery`  
**Auth Required:** Yes

---

### 10.7 Rate Food Order
**Endpoint:** `POST /food-orders/:orderId/rate`  
**Request Body:** `{ "rating": 5, "review": "...", "foodQuality": 5, "deliverySpeed": 5, "packaging": 5 }`

---

## 11. Cart

### 11.1 Get Cart
**Endpoint:** `GET /cart`  
**Auth Required:** Yes

---

### 11.2 Add to Cart
**Endpoint:** `POST /cart/add`  
**Request Body:** `{ "productId": "...", "quantity": 1 }`

---

### 11.3 Update Cart Item
**Endpoint:** `PUT /cart/items/:itemId`  
**Request Body:** `{ "quantity": 2 }`

---

### 11.4 Remove from Cart
**Endpoint:** `DELETE /cart/items/:itemId`

---

### 11.5 Clear Cart
**Endpoint:** `DELETE /cart/clear`

---

## 12. Chat & Messaging

### 12.1 Get Conversations
**Endpoint:** `GET /chats/conversations`  
**Auth Required:** Yes

---

### 12.2 Get Messages
**Endpoint:** `GET /chats/conversations/:conversationId/messages`  
**Auth Required:** Yes  
**Query Parameters:** `page`, `limit`

---

### 12.3 Send Message
**Endpoint:** `POST /chats/conversations/:conversationId/messages`  
**Request Body:** `{ "text": "...", "productId": "..." }`

> Messages containing contact info (phone, email, social handles) are auto-flagged.

---

### 12.4 Mark Messages as Read
**Endpoint:** `POST /chats/conversations/:conversationId/mark-read`

---

### 12.5 Report Message
**Endpoint:** `POST /chats/messages/:messageId/report`  
**Request Body:** `{ "reason": "spam", "details": "..." }`

---

## 13. Wallet & Payments

> **v3 change:** The separate escrow-only view (`GET /payments/escrow/balance`) is replaced by a unified wallet. Both buyers and sellers see one balance that tracks incoming revenue and outgoing payments. The escrow mechanism still works internally — it's just surfaced through the wallet.

### 13.1 Get Wallet
**Screen:** `WalletScreen.tsx`  
**Endpoint:** `GET /wallet`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 18200,
    "totalEarned": 45600,
    "totalSpent": 27400,
    "escrowHeld": 12450,
    "pendingPayouts": 5000,
    "recentTransactions": [
      {
        "id": "txn_123",
        "type": "sale_credit",
        "amount": 4500,
        "description": "Sale: iPhone 13 Pro Max",
        "status": "completed",
        "timestamp": "2024-12-02T10:00:00Z"
      },
      {
        "id": "txn_124",
        "type": "purchase_debit",
        "amount": 1200,
        "description": "Purchase: Course Materials",
        "status": "completed",
        "timestamp": "2024-12-01T14:00:00Z"
      }
    ]
  }
}
```

---

### 13.2 Initiate Payment
**Endpoint:** `POST /payments/initiate`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "type": "order | store_subscription | food_order",
  "referenceId": "ORD-123456",
  "amount": 4730,
  "paymentMethod": "momo",
  "momoNumber": "+233XXXXXXXXX",
  "momoProvider": "MTN | Vodafone | AirtelTigo"
}
```

---

### 13.3 Verify Payment
**Endpoint:** `GET /payments/:paymentId/verify`  
**Auth Required:** Yes

---

### 13.4 Get Payment Methods
**Endpoint:** `GET /payments/methods`  
**Auth Required:** Yes

---

### 13.5 Add Payment Method
**Endpoint:** `POST /payments/methods`  
**Request Body:** `{ "type": "momo", "provider": "MTN", "number": "+233...", "name": "John Doe", "isDefault": false }`

---

### 13.6 Delete Payment Method
**Endpoint:** `DELETE /payments/methods/:methodId`

---

### 13.7 Request Payout (Sellers)
**Endpoint:** `POST /payments/payout`  
**Auth Required:** Yes

**Request Body:** `{ "amount": 5000, "paymentMethodId": "method_1" }`

---

## 14. Reviews & Ratings

### 14.1 Get Product Reviews
**Endpoint:** `GET /reviews/products/:productId`  
**Auth Required:** No

---

### 14.2 Get Seller Reviews
**Endpoint:** `GET /reviews/sellers/:sellerProfileId`  
**Auth Required:** No

> **v3 change:** Was `GET /reviews/sellers/:userId`. Now uses `sellerProfileId` as the identifier to be consistent with the seller_profiles table.

---

### 14.3 Get Food Service Reviews
**Endpoint:** `GET /reviews/food-services/:foodServiceId`  
**Auth Required:** No

---

## 15. Admin Dashboard

All existing admin endpoints remain. One addition:

### 15.1 Review Seller KYC Applications
**Endpoint:** `GET /admin/kyc/pending`  
**Auth Required:** Yes (admin)

**Response:** Lists all `seller_profiles` where `kyc_status = 'pending'` with submitted documents.

---

### 15.2 Approve / Reject Seller KYC
**Endpoint:** `PATCH /admin/kyc/:kycId`  
**Auth Required:** Yes (admin)

**Request Body:**
```json
{
  "decision": "approved | rejected",
  "reviewNote": "Documents verified successfully"
}
```

**Backend Logic:**
```
// On approval:
seller_profiles.kyc_status = "approved"
// Fire notification to user: "Your shop is now live"

// On rejection:
seller_profiles.kyc_status = "rejected"
// Fire notification with reason
```

---

## 16. Notifications

All existing notification endpoints and WebSocket events remain.  

**v3 addition:** Notification tags for dual-role users:

| Tag | Meaning |
|---|---|
| `🛒` | Order received (seller) |
| `📦` | Your order shipped (buyer) |
| `✅` | KYC approved |
| `💰` | Payout processed |

---

## 17. Night Shop

Unchanged from v2. `isNightShop` filter on `GET /products` still functions the same way.

---

## 18. File Uploads

### 18.1 Upload Product Images
**Endpoint:** `POST /uploads/images`  
**Content-Type:** `multipart/form-data`  
**Body:** `{ images: [File] }` (max 5)

---

### 18.2 Upload Store / Food Service Logo
**Endpoint:** `POST /uploads/logo`  
**Body:** `{ logo: File, type: "store | food_service" }`

---

### 18.3 Upload KYC Documents
**Endpoint:** `POST /uploads/kyc-documents`  
**Body:** `{ documents: [File], documentType: "student_id | ghana_card | business_doc | selfie" }`

---

## 19. Support & Settings

### 19.1 Get App Settings
**Endpoint:** `GET /settings/app`  
**Auth Required:** No

---

### 19.2 Report Issue
**Endpoint:** `POST /support/report`  
**Request Body:** `{ "type": "bug | fraud | ...", "subject": "...", "description": "...", "referenceId": "...", "screenshots": [] }`

---

### 19.3 Get FAQs
**Endpoint:** `GET /support/faqs`  
**Auth Required:** No

---

## WebSocket Events

### Chat
**WSS:** `wss://api.varsitymart.com/ws/chat`  
Listen: `new_message`, `message_read`, `user_typing`  
Emit: `typing`, `stop_typing`

### Orders
**WSS:** `wss://api.varsitymart.com/ws/orders`  
Listen: `order_status_update`, `delivery_location_update`

### Food Orders
**WSS:** `wss://api.varsitymart.com/ws/food-orders`  
Listen: `food_order_status_update`, `food_service_notification`, `delivery_status_update`

### Notifications
**WSS:** `wss://api.varsitymart.com/ws/notifications`  
Listen: `new_notification`, `order_update`, `food_service_update`

---

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [{ "field": "email", "message": "Email is required" }]
  }
}
```

**Error Codes (v3 additions in bold):**
- `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`
- `RATE_LIMIT_EXCEEDED`, `PAYMENT_FAILED`, `INSUFFICIENT_STOCK`
- `ORDER_CANCELLED`, `KYC_REQUIRED`, `ACCOUNT_SUSPENDED`
- **`SELLER_NOT_ACTIVATED`** — User has no seller_profile row
- **`SELLER_KYC_PENDING`** — seller_profile exists but kyc_status ≠ approved
- **`INVALID_SELLER_TYPE`** — Operation not allowed for this seller_type
- `INVALID_FOOD_SERVICE_TYPE`, `UNAUTHORIZED_FOOD_SERVICE_ACCESS`
- `SERVER_ERROR`

---

## Rate Limiting

- General API: 100 req/min
- Authentication: 10 req/min
- File Uploads: 20 req/min
- Chat Messages: 50 msg/min

---

## Backend Implementation Notes (Updated)

1. **No role at signup.** The `users` table has no `role` column. Seller capabilities are resolved by querying `seller_profiles`.
2. **Seller guard middleware.** Create a reusable `requireSellerApproved` middleware that checks `seller_profiles.kyc_status = 'approved'` and `seller_profiles.user_id = req.user.id`. Apply to all product creation, store creation, and food service creation routes.
3. **Unified wallet.** One `wallets` row per user. Credit on sale confirmation (escrow release), debit on purchase. Escrow is an internal accounting state, not a separate user-visible balance.
4. **Dual ratings.** `users` table has `buyer_rating` + `buyer_review_count`. `seller_profiles` table has `seller_rating` + `seller_review_count`. Both are surfaced on the public user profile.
5. **KYC is unified.** `POST /kyc` handles both student and seller KYC via `kycType`. Internal tables can still separate them (e.g., `kyc_submissions` with a `type` column), but the API surface is one endpoint.
6. **Seller order endpoints.** `GET /seller/orders` and `PATCH /seller/orders/:orderId/status` are scoped to the authenticated seller. No `type=seller` query param required.
7. **Cookies.** All auth tokens remain HTTP-only. `SameSite=Strict`. No changes.
8. **MoMo, escrow, CDN, WebSockets, Redis, FCM, email, SMS** — all unchanged from v2.
