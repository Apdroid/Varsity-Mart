# VarsityMart API Routes Documentation

## Overview
This document outlines all API endpoints required for full backend integration of the VarsityMart campus marketplace mobile app.

**Base URL:** `https://api.varsitymart.com/v1`

**Authentication:** Most routes require JWT token in Authorization header: `Authorization: Bearer {token}`

---

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [KYC Verification](#kyc-verification)
4. [Products & Marketplace](#products--marketplace)
5. [Stores](#stores)
6. [Restaurants](#restaurants)
7. [Orders](#orders)
8. [Food Orders](#food-orders)
9. [Cart](#cart)
10. [Chat & Messaging](#chat--messaging)
11. [Payments & Escrow](#payments--escrow)
12. [Reviews & Ratings](#reviews--ratings)
13. [Admin Dashboard](#admin-dashboard)
14. [Notifications](#notifications)
15. [Night Shop](#night-shop)
16. [File Uploads](#file-uploads)

---

## Authentication

### 1. User Registration
**Screen:** `RegisterScreen.tsx`  
**Endpoint:** `POST /auth/register`  
**Auth Required:** No

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@university.edu.gh",
  "phone": "+233XXXXXXXXX",
  "password": "SecurePass123!",
    "confirmPassord": "SecurePass123!",
    "studentId": "UG12345678",
    "isStudent":true,
    "university": "KNUST", 
    "campus": "Main Campus",
    "agreeToTerms": true,
    "role":"buyer| seller | admin (default should be buyer)",
    "auth_method":"google | credentials",
    "profile_pic":"https://supabase.com/*********************"
}
// For Non-Students
{
    "fullName": "John Doe",
    "email": "john.doe@gmail.com",
    "phone": "+233XXXXXXXXX",
    "passord": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "isStudent":false,
  "university": "KNUST", 
  "campus": "Main Campus",
  "agreeToTerms": true,
        "role":"buyer| seller | admin",
    "auth_method":"google | credentials",
    "profile_pic":"https://supabase.com/*********************"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "userId": "user_123456",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user_123456",
      "fullName": "John Doe",
      "email": "john.doe@university.edu.gh",
      "phone": "+233XXXXXXXXX",
      "avatar": "👤",
      "isVerified": false,
      "role": "buyer"
    }
  }
}
```

---

### 2. User Login
**Screen:** `LoginScreen.tsx`  
**Endpoint:** `POST /auth/login`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "john.doe@university.edu.gh",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user_123456",
      "fullName": "John Doe",
      "email": "john.doe@university.edu.gh",
      "phone": "+233XXXXXXXXX",
      "avatar": "👤",
      "isVerified": true,
      "kycStatus": "verified",
      "role": "buyer",
      "rating": 4.8
    }
  }
}
```

---

### 3. Email Verification
**Screen:** `RegisterScreen.tsx`  
**Endpoint:** `POST /auth/verify-email`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "verificationCode": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "isVerified": true
  }
}
```

---

### 4. Resend Verification Email
**Screen:** `RegisterScreen.tsx`  
**Endpoint:** `POST /auth/resend-verification`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

---

### 5. Password Reset Request
**Screen:** `LoginScreen.tsx`  
**Endpoint:** `POST /auth/forgot-password`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "john.doe@university.edu.gh"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

### 6. Password Reset
**Endpoint:** `POST /auth/reset-password`  
**Auth Required:** No

**Request Body:**
```json
{
  "resetToken": "token_from_email",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### 7. Refresh Token
**Endpoint:** `POST /auth/refresh-token`  
**Auth Required:** No

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

### 8. Logout
**Endpoint:** `POST /auth/logout`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Management

### 9. Get Current User Profile
**Screen:** `ProfileScreen.tsx`  
**Endpoint:** `GET /users/me`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123456",
    "fullName": "John Doe",
    "email": "john.doe@university.edu.gh",
    "phone": "+233XXXXXXXXX",
    "avatar": "👤",
    "studentId": "UG12345678",
    "campus": "Main Campus",
    "isVerified": true,
    "kycStatus": "verified",
    "role": "buyer",
    "rating": 4.8,
    "totalReviews": 23,
    "memberSince": "2024-01-15T00:00:00Z",
    "hasStore": false,
    "hasRestaurant": false
  }
}
```

---

### 10. Update User Profile
**Screen:** `ProfileScreen.tsx`  
**Endpoint:** `PUT /users/me`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "fullName": "John Updated Doe",
  "phone": "+233XXXXXXXXX",
  "campus": "Main Campus",
  "bio": "Food enthusiast and tech lover"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_123456",
    "fullName": "John Updated Doe",
    "phone": "+233XXXXXXXXX",
    "campus": "Main Campus",
    "bio": "Food enthusiast and tech lover"
  }
}
```

---

### 11. Upload Avatar
**Screen:** `ProfileScreen.tsx`  
**Endpoint:** `POST /users/me/avatar`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
FormData: {
  avatar: File
}
```

**Response:**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatarUrl": "https://cdn.varsitymart.com/avatars/user_123456.jpg"
  }
}
```

---

### 12. Get User by ID
**Screen:** `StoreScreen.tsx`, `ChatScreen.tsx`  
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
    "rating": 4.8,
    "totalReviews": 23,
    "memberSince": "2024-01-15T00:00:00Z",
    "responseRate": "95%",
    "responseTime": "2 hours"
  }
}
```

---

## KYC Verification

### 13. Submit Student KYC
**Screen:** `StudentKycScreen.tsx`  
**Endpoint:** `POST /kyc/student`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
FormData: {
  studentIdImage: File,
  selfieImage: File,
  studentId: "UG12345678",
  university: "University of Ghana"
}
```

**Response:**
```json
{
  "success": true,
  "message": "KYC submitted successfully. Verification in progress.",
  "data": {
    "kycId": "kyc_123456",
    "status": "pending",
    "submittedAt": "2024-12-02T10:30:00Z",
    "estimatedReviewTime": "24-48 hours"
  }
}
```

---

### 14. Submit Business KYC
**Screen:** `BusinessKycScreen.tsx`  
**Endpoint:** `POST /kyc/business`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
FormData: {
  ghanaCardFront: File,
  ghanaCardBack: File,
  businessDocument: File (optional),
  selfieWithId: File,
  businessType: "store" | "restaurant",
  businessName: "Mama's Kitchen",
  registrationNumber: "BN123456" (optional)
}
```

**Response:**
```json
{
  "success": true,
  "message": "Business KYC submitted successfully. Verification in progress.",
  "data": {
    "kycId": "kyc_business_123456",
    "status": "pending",
    "submittedAt": "2024-12-02T10:30:00Z",
    "estimatedReviewTime": "48-72 hours"
  }
}
```

---

### 15. Get KYC Status
**Screen:** `ProfileScreen.tsx`  
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
    "businessKyc": {
      "status": "pending",
      "submittedAt": "2024-12-02T10:30:00Z",
      "reviewNote": null
    }
  }
}
```

---

## Products & Marketplace

### 16. Get All Products
**Screen:** `HomeScreen.tsx`, `NightShopScreen.tsx`  
**Endpoint:** `GET /products`  
**Auth Required:** No

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `category` (string, optional)
- `search` (string, optional)
- `minPrice` (number, optional)
- `maxPrice` (number, optional)
- `condition` (string: "new" | "used", optional)
- `sortBy` (string: "newest" | "price_low" | "price_high" | "popular", default: "newest")
- `isNightShop` (boolean, default: false)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123456",
        "title": "iPhone 13 Pro Max",
        "description": "Brand new, sealed. 256GB, Pacific Blue",
        "price": 4500,
        "originalPrice": 5200,
        "images": [
          "https://cdn.varsitymart.com/products/prod_123456_1.jpg",
          "https://cdn.varsitymart.com/products/prod_123456_2.jpg"
        ],
        "category": "Electronics",
        "condition": "new",
        "location": "Main Campus",
        "seller": {
          "id": "user_789",
          "name": "Tech Store",
          "avatar": "🏪",
          "rating": 4.9
        },
        "badges": ["Hot", "New"],
        "views": 245,
        "likes": 34,
        "isNightShop": false,
        "createdAt": "2024-12-01T08:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "itemsPerPage": 20
    }
  }
}
```

---

### 17. Get Product by ID
**Screen:** `ProductDetailScreen.tsx`  
**Endpoint:** `GET /products/:productId`  
**Auth Required:** No

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_123456",
    "title": "iPhone 13 Pro Max",
    "description": "Brand new, sealed. 256GB, Pacific Blue. Comes with full accessories and 1-year warranty.",
    "price": 4500,
    "originalPrice": 5200,
    "images": [
      "https://cdn.varsitymart.com/products/prod_123456_1.jpg",
      "https://cdn.varsitymart.com/products/prod_123456_2.jpg"
    ],
    "category": "Electronics",
    "condition": "new",
    "location": "Main Campus",
    "seller": {
      "id": "user_789",
      "name": "Tech Store",
      "avatar": "🏪",
      "rating": 4.9,
      "totalSales": 156,
      "responseRate": "98%",
      "responseTime": "1 hour"
    },
    "stock": 3,
    "badges": ["Hot", "New"],
    "views": 245,
    "likes": 34,
    "isLiked": false,
    "isNightShop": false,
    "deliveryOptions": ["campus_delivery", "meetup"],
    "specifications": [
      { "label": "Brand", "value": "Apple" },
      { "label": "Storage", "value": "256GB" },
      { "label": "Color", "value": "Pacific Blue" }
    ],
    "createdAt": "2024-12-01T08:00:00Z",
    "updatedAt": "2024-12-01T08:00:00Z"
  }
}
```

---

### 18. Create Product
**Screen:** `AddProductScreen.tsx`  
**Endpoint:** `POST /products`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
FormData: {
  title: "iPhone 13 Pro Max",
  description: "Brand new, sealed. 256GB, Pacific Blue",
  price: 4500,
  originalPrice: 5200,
  category: "Electronics",
  condition: "new",
  location: "Main Campus",
  stock: 3,
  deliveryOptions: ["campus_delivery", "meetup"],
  images: [File, File, File],
  specifications: JSON.stringify([
    { "label": "Brand", "value": "Apple" }
  ])
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "prod_123456",
    "title": "iPhone 13 Pro Max",
    "price": 4500,
    "status": "active"
  }
}
```

---

### 19. Update Product
**Screen:** `AddProductScreen.tsx` (edit mode)  
**Endpoint:** `PUT /products/:productId`  
**Auth Required:** Yes

**Request Body:** (Same as Create Product)

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "prod_123456",
    "title": "iPhone 13 Pro Max - Updated",
    "price": 4300
  }
}
```

---

### 20. Delete Product
**Screen:** `MyProductsScreen.tsx`  
**Endpoint:** `DELETE /products/:productId`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 21. Toggle Product Like
**Screen:** `ProductDetailScreen.tsx`, `HomeScreen.tsx`  
**Endpoint:** `POST /products/:productId/like`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "isLiked": true,
    "totalLikes": 35
  }
}
```

---

### 22. Search Products
**Screen:** `HomeScreen.tsx`  
**Endpoint:** `GET /products/search`  
**Auth Required:** No

**Query Parameters:**
- `q` (string, required)
- `page` (number, default: 1)
- `limit` (number, default: 20)

**Response:** (Same structure as Get All Products)

---

### 23. Get My Products
**Screen:** `MyProductsScreen.tsx`  
**Endpoint:** `GET /products/my-products`  
**Auth Required:** Yes

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string: "active" | "inactive" | "sold", optional)

**Response:** (Same structure as Get All Products)

---

### 24. Get Product Categories
**Screen:** `HomeScreen.tsx`, `AddProductScreen.tsx`  
**Endpoint:** `GET /products/categories`  
**Auth Required:** No

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_1",
        "name": "Electronics",
        "icon": "📱",
        "count": 450
      },
      {
        "id": "cat_2",
        "name": "Fashion",
        "icon": "👕",
        "count": 320
      },
      {
        "id": "cat_3",
        "name": "Books",
        "icon": "📚",
        "count": 280
      }
    ]
  }
}
```

---

## Stores

### 25. Create Store
**Screen:** `StoreCreationScreen.tsx`  
**Endpoint:** `POST /stores`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
FormData: {
  storeName: "Tech Store",
  description: "Your one-stop shop for electronics",
  category: "Electronics",
  logo: File,
  location: "Main Campus",
  phone: "+233XXXXXXXXX",
  openingTime: "08:00",
  closingTime: "20:00",
  deliveryFee: 5,
  minOrder: 20
}
```

**Response:**
```json
{
  "success": true,
  "message": "Store created successfully. Please complete payment.",
  "data": {
    "storeId": "store_123456",
    "paymentRequired": true,
    "amount": 25,
    "paymentUrl": "https://api.varsitymart.com/payments/store_123456"
  }
}
```

---

### 26. Get Store by ID
**Screen:** `StoreScreen.tsx`  
**Endpoint:** `GET /stores/:storeId`  
**Auth Required:** No

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "store_123456",
    "name": "Tech Store",
    "description": "Your one-stop shop for electronics",
    "logo": "https://cdn.varsitymart.com/stores/store_123456_logo.jpg",
    "banner": "https://cdn.varsitymart.com/stores/store_123456_banner.jpg",
    "category": "Electronics",
    "location": "Main Campus",
    "phone": "+233XXXXXXXXX",
    "isOpen": true,
    "openingTime": "08:00",
    "closingTime": "20:00",
    "rating": 4.9,
    "totalReviews": 234,
    "totalProducts": 45,
    "totalSales": 1250,
    "deliveryFee": 5,
    "minOrder": 20,
    "owner": {
      "id": "user_789",
      "name": "John Store Owner",
      "avatar": "👤"
    },
    "memberSince": "2024-01-15T00:00:00Z",
    "subscriptionStatus": "active",
    "subscriptionEnds": "2024-06-15T00:00:00Z"
  }
}
```

---

### 27. Update Store
**Screen:** `StoreEditScreen.tsx`  
**Endpoint:** `PUT /stores/:storeId`  
**Auth Required:** Yes

**Request Body:** (Same as Create Store)

**Response:**
```json
{
  "success": true,
  "message": "Store updated successfully",
  "data": {
    "storeId": "store_123456",
    "name": "Tech Store - Updated"
  }
}
```

---

### 28. Get All Stores
**Screen:** `AllStoresScreen.tsx`  
**Endpoint:** `GET /stores`  
**Auth Required:** No

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `category` (string, optional)
- `search` (string, optional)
- `sortBy` (string: "popular" | "newest" | "rating", default: "popular")

**Response:**
```json
{
  "success": true,
  "data": {
    "stores": [
      {
        "id": "store_123456",
        "name": "Tech Store",
        "logo": "https://cdn.varsitymart.com/stores/store_123456_logo.jpg",
        "category": "Electronics",
        "rating": 4.9,
        "totalReviews": 234,
        "totalProducts": 45,
        "isOpen": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    }
  }
}
```

---

### 29. Get Store Products
**Screen:** `StoreScreen.tsx`  
**Endpoint:** `GET /stores/:storeId/products`  
**Auth Required:** No

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)

**Response:** (Same structure as Get All Products)

---

### 30. Get My Store
**Screen:** `StoreEditScreen.tsx`  
**Endpoint:** `GET /stores/my-store`  
**Auth Required:** Yes

**Response:** (Same as Get Store by ID)

---

### 31. Renew Store Subscription
**Screen:** `StorePaymentScreen.tsx`  
**Endpoint:** `POST /stores/:storeId/renew`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "duration": "semester"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription renewed successfully",
  "data": {
    "storeId": "store_123456",
    "amount": 25,
    "subscriptionEnds": "2025-06-15T00:00:00Z",
    "paymentUrl": "https://api.varsitymart.com/payments/renewal_123456"
  }
}
```

---

## Restaurants

### 32. Create Restaurant
**Screen:** `RestaurantCreationScreen.tsx`  
**Endpoint:** `POST /restaurants`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
FormData: {
  restaurantName: "Mama's Kitchen",
  description: "Authentic Ghanaian cuisine",
  category: "ghanaian",
  logo: File,
  location: "Behind Central Cafeteria",
  phone: "+233XXXXXXXXX",
  openingTime: "08:00",
  closingTime: "22:00",
  deliveryFee: 5,
  minOrder: 15
}
```

**Response:**
```json
{
  "success": true,
  "message": "Restaurant created successfully. Please complete payment and KYC.",
  "data": {
    "restaurantId": "rest_123456",
    "paymentRequired": true,
    "amount": 30,
    "kycRequired": true,
    "paymentUrl": "https://api.varsitymart.com/payments/rest_123456"
  }
}
```

---

### 33. Get All Restaurants
**Screen:** `RestaurantsScreen.tsx`  
**Endpoint:** `GET /restaurants`  
**Auth Required:** No

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `category` (string, optional)
- `search` (string, optional)
- `isOpen` (boolean, optional)
- `sortBy` (string: "popular" | "rating" | "newest", default: "popular")

**Response:**
```json
{
  "success": true,
  "data": {
    "restaurants": [
      {
        "id": "rest_123456",
        "name": "Mama's Kitchen",
        "logo": "https://cdn.varsitymart.com/restaurants/rest_123456_logo.jpg",
        "banner": "https://cdn.varsitymart.com/restaurants/rest_123456_banner.jpg",
        "category": "Ghanaian Cuisine",
        "rating": 4.8,
        "totalReviews": 342,
        "deliveryTime": "30-45 mins",
        "deliveryFee": 5,
        "minOrder": 15,
        "isOpen": true,
        "badge": "Popular"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 60,
      "itemsPerPage": 20
    }
  }
}
```

---

### 34. Get Restaurant by ID
**Screen:** `RestaurantDetailScreen.tsx`  
**Endpoint:** `GET /restaurants/:restaurantId`  
**Auth Required:** No

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "rest_123456",
    "name": "Mama's Kitchen",
    "description": "Authentic Ghanaian cuisine made with love",
    "logo": "https://cdn.varsitymart.com/restaurants/rest_123456_logo.jpg",
    "banner": "https://cdn.varsitymart.com/restaurants/rest_123456_banner.jpg",
    "category": "Ghanaian Cuisine",
    "location": "Behind Central Cafeteria",
    "phone": "+233XXXXXXXXX",
    "rating": 4.8,
    "totalReviews": 342,
    "deliveryTime": "30-45 mins",
    "deliveryFee": 5,
    "minOrder": 15,
    "isOpen": true,
    "openingTime": "08:00",
    "closingTime": "22:00",
    "owner": {
      "id": "user_456",
      "name": "Mama Grace",
      "avatar": "👩‍🍳"
    },
    "memberSince": "2024-01-20T00:00:00Z"
  }
}
```

---

### 35. Get Restaurant Menu
**Screen:** `RestaurantDetailScreen.tsx`  
**Endpoint:** `GET /restaurants/:restaurantId/menu`  
**Auth Required:** No

**Query Parameters:**
- `category` (string, optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_main",
        "name": "Main Dishes",
        "items": [
          {
            "id": "food_123",
            "name": "Waakye Special",
            "description": "Rice and beans with chicken, spaghetti, gari, egg",
            "price": 18,
            "image": "https://cdn.varsitymart.com/food/food_123.jpg",
            "isAvailable": true,
            "preparationTime": "20 mins",
            "spicyLevel": 2,
            "isVegetarian": false,
            "tags": ["Popular", "Spicy"]
          }
        ]
      }
    ]
  }
}
```

---

### 36. Get Food Item Details
**Screen:** `FoodItemDetailScreen.tsx`  
**Endpoint:** `GET /restaurants/:restaurantId/menu/:itemId`  
**Auth Required:** No

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "food_123",
    "name": "Waakye Special",
    "description": "Rice and beans with chicken, spaghetti, gari, egg",
    "price": 18,
    "images": [
      "https://cdn.varsitymart.com/food/food_123_1.jpg",
      "https://cdn.varsitymart.com/food/food_123_2.jpg"
    ],
    "isAvailable": true,
    "preparationTime": "20 mins",
    "spicyLevel": 2,
    "isVegetarian": false,
    "ingredients": [
      "Rice",
      "Black-eyed beans",
      "Chicken",
      "Spaghetti",
      "Gari",
      "Boiled egg"
    ],
    "customizations": [
      {
        "id": "custom_1",
        "name": "Spice Level",
        "options": ["Mild", "Medium", "Hot"],
        "required": false
      },
      {
        "id": "custom_2",
        "name": "Protein",
        "options": [
          { "name": "Chicken", "price": 0 },
          { "name": "Fish", "price": 5 },
          { "name": "Beef", "price": 8 }
        ],
        "required": true
      }
    ],
    "tags": ["Popular", "Spicy"],
    "restaurantId": "rest_123456",
    "restaurantName": "Mama's Kitchen"
  }
}
```

---

### 37. Add Menu Item
**Screen:** `RestaurantDashboardScreen.tsx`  
**Endpoint:** `POST /restaurants/:restaurantId/menu`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
FormData: {
  name: "Jollof Rice Special",
  description: "Spicy jollof rice with chicken",
  price: 22,
  category: "Main Dishes",
  preparationTime: "25 mins",
  spicyLevel: 2,
  isVegetarian: false,
  ingredients: JSON.stringify(["Rice", "Chicken", "Tomatoes"]),
  customizations: JSON.stringify([...]),
  images: [File, File]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Menu item added successfully",
  "data": {
    "itemId": "food_456",
    "name": "Jollof Rice Special",
    "price": 22
  }
}
```

---

### 38. Update Menu Item
**Screen:** `RestaurantDashboardScreen.tsx`  
**Endpoint:** `PUT /restaurants/:restaurantId/menu/:itemId`  
**Auth Required:** Yes

**Request Body:** (Same as Add Menu Item)

**Response:**
```json
{
  "success": true,
  "message": "Menu item updated successfully",
  "data": {
    "itemId": "food_456",
    "name": "Jollof Rice Special - Updated"
  }
}
```

---

### 39. Delete Menu Item
**Screen:** `RestaurantDashboardScreen.tsx`  
**Endpoint:** `DELETE /restaurants/:restaurantId/menu/:itemId`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

---

### 40. Toggle Menu Item Availability
**Screen:** `RestaurantDashboardScreen.tsx`  
**Endpoint:** `PATCH /restaurants/:restaurantId/menu/:itemId/availability`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "isAvailable": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item availability updated",
  "data": {
    "itemId": "food_456",
    "isAvailable": false
  }
}
```

---

### 41. Get My Restaurant
**Screen:** `RestaurantDashboardScreen.tsx`  
**Endpoint:** `GET /restaurants/my-restaurant`  
**Auth Required:** Yes

**Response:** (Same as Get Restaurant by ID)

---

### 42. Get Restaurant Dashboard Stats
**Screen:** `RestaurantDashboardScreen.tsx`  
**Endpoint:** `GET /restaurants/:restaurantId/dashboard`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "todayOrders": 28,
    "todayRevenue": 1240,
    "monthlyRevenue": 18500,
    "pendingOrders": 5,
    "totalMenuItems": 23,
    "averageOrderValue": 44,
    "topSellingItems": [
      {
        "itemId": "food_123",
        "name": "Waakye Special",
        "sales": 145,
        "revenue": 2610
      }
    ],
    "recentOrders": [
      {
        "id": "FOOD-128",
        "customer": "John D.",
        "items": 3,
        "total": 58,
        "status": "preparing",
        "time": "5 mins ago"
      }
    ]
  }
}
```

---

## Orders

### 43. Create Order
**Screen:** `CheckoutScreen.tsx`  
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

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "ORD-123456",
    "status": "pending_payment",
    "total": 4505,
    "paymentUrl": "https://api.varsitymart.com/payments/order/ORD-123456",
    "estimatedDelivery": "2024-12-03T15:00:00Z"
  }
}
```

---

### 44. Get Order by ID
**Screen:** `OrderTrackingScreen.tsx`  
**Endpoint:** `GET /orders/:orderId`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ORD-123456",
    "status": "in_transit",
    "product": {
      "id": "prod_123456",
      "title": "iPhone 13 Pro Max",
      "image": "https://cdn.varsitymart.com/products/prod_123456_1.jpg",
      "price": 4500
    },
    "quantity": 1,
    "subtotal": 4500,
    "deliveryFee": 5,
    "serviceFee": 225,
    "total": 4730,
    "seller": {
      "id": "user_789",
      "name": "Tech Store",
      "phone": "+233XXXXXXXXX"
    },
    "buyer": {
      "id": "user_123",
      "name": "John Doe",
      "phone": "+233XXXXXXXXX"
    },
    "deliveryMethod": "campus_delivery",
    "deliveryAddress": "Hall 3, Room 205",
    "deliveryInstructions": "Call when you arrive",
    "paymentMethod": "momo",
    "paymentStatus": "paid",
    "escrowStatus": "held",
    "timeline": [
      {
        "status": "order_placed",
        "timestamp": "2024-12-02T10:00:00Z",
        "description": "Order placed successfully"
      },
      {
        "status": "payment_confirmed",
        "timestamp": "2024-12-02T10:05:00Z",
        "description": "Payment confirmed"
      },
      {
        "status": "seller_confirmed",
        "timestamp": "2024-12-02T10:15:00Z",
        "description": "Seller confirmed order"
      },
      {
        "status": "in_transit",
        "timestamp": "2024-12-02T11:00:00Z",
        "description": "Order is on the way"
      }
    ],
    "estimatedDelivery": "2024-12-02T13:00:00Z",
    "createdAt": "2024-12-02T10:00:00Z"
  }
}
```

---

### 45. Get User Orders
**Screen:** `MyOrdersScreen.tsx`  
**Endpoint:** `GET /orders/my-orders`  
**Auth Required:** Yes

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string: "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled", optional)
- `type` (string: "buyer" | "seller", default: "buyer")

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ORD-123456",
        "status": "in_transit",
        "product": {
          "id": "prod_123456",
          "title": "iPhone 13 Pro Max",
          "image": "https://cdn.varsitymart.com/products/prod_123456_1.jpg"
        },
        "quantity": 1,
        "total": 4730,
        "seller": {
          "id": "user_789",
          "name": "Tech Store"
        },
        "estimatedDelivery": "2024-12-02T13:00:00Z",
        "createdAt": "2024-12-02T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 52,
      "itemsPerPage": 20
    }
  }
}
```

---

### 46. Update Order Status
**Screen:** `OrderTrackingScreen.tsx` (seller side)  
**Endpoint:** `PATCH /orders/:orderId/status`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "in_transit",
  "note": "Order is on the way to your location"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "orderId": "ORD-123456",
    "status": "in_transit"
  }
}
```

---

### 47. Confirm Order Delivery
**Screen:** `OrderTrackingScreen.tsx`  
**Endpoint:** `POST /orders/:orderId/confirm-delivery`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Order delivery confirmed. Escrow released to seller.",
  "data": {
    "orderId": "ORD-123456",
    "status": "delivered",
    "escrowStatus": "released"
  }
}
```

---

### 48. Cancel Order
**Screen:** `OrderTrackingScreen.tsx`  
**Endpoint:** `POST /orders/:orderId/cancel`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "reason": "Changed my mind",
  "details": "Found a better deal elsewhere"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully. Refund initiated.",
  "data": {
    "orderId": "ORD-123456",
    "status": "cancelled",
    "refundStatus": "processing",
    "refundAmount": 4730
  }
}
```

---

### 49. Rate Order
**Screen:** `OrderTrackingScreen.tsx` (after delivery)  
**Endpoint:** `POST /orders/:orderId/rate`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "rating": 5,
  "review": "Great product! Fast delivery.",
  "rateProduct": true,
  "rateSeller": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your review!",
  "data": {
    "reviewId": "rev_123456"
  }
}
```

---

## Food Orders

### 50. Create Food Order
**Screen:** `FoodItemDetailScreen.tsx`, `CartScreen.tsx`  
**Endpoint:** `POST /food-orders`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "restaurantId": "rest_123456",
  "items": [
    {
      "itemId": "food_123",
      "quantity": 2,
      "customizations": [
        {
          "name": "Spice Level",
          "value": "Hot"
        },
        {
          "name": "Protein",
          "value": "Fish"
        }
      ],
      "specialInstructions": "Extra spicy please"
    }
  ],
  "deliveryMethod": "campus_delivery",
  "deliveryAddress": "Hall 7, Room 301",
  "deliveryInstructions": "Leave at the gate",
  "paymentMethod": "momo",
  "momoNumber": "+233XXXXXXXXX",
  "momoProvider": "MTN"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Food order placed successfully",
  "data": {
    "orderId": "FOOD-123456",
    "status": "pending_payment",
    "subtotal": 46,
    "deliveryFee": 5,
    "serviceFee": 2.3,
    "total": 53.3,
    "estimatedDelivery": "2024-12-02T12:30:00Z",
    "paymentUrl": "https://api.varsitymart.com/payments/food-order/FOOD-123456"
  }
}
```

---

### 51. Get Food Order by ID
**Screen:** `FoodOrderTrackingScreen.tsx`  
**Endpoint:** `GET /food-orders/:orderId`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "FOOD-123456",
    "status": "preparing",
    "restaurant": {
      "id": "rest_123456",
      "name": "Mama's Kitchen",
      "logo": "https://cdn.varsitymart.com/restaurants/rest_123456_logo.jpg",
      "phone": "+233XXXXXXXXX"
    },
    "items": [
      {
        "id": "food_123",
        "name": "Waakye Special",
        "image": "https://cdn.varsitymart.com/food/food_123.jpg",
        "quantity": 2,
        "price": 18,
        "customizations": [
          {
            "name": "Spice Level",
            "value": "Hot"
          }
        ],
        "specialInstructions": "Extra spicy please"
      }
    ],
    "subtotal": 46,
    "deliveryFee": 5,
    "serviceFee": 2.3,
    "total": 53.3,
    "customer": {
      "id": "user_123",
      "name": "John Doe",
      "phone": "+233XXXXXXXXX"
    },
    "deliveryMethod": "campus_delivery",
    "deliveryAddress": "Hall 7, Room 301",
    "deliveryInstructions": "Leave at the gate",
    "paymentMethod": "momo",
    "paymentStatus": "paid",
    "timeline": [
      {
        "status": "order_placed",
        "timestamp": "2024-12-02T11:00:00Z",
        "description": "Order placed"
      },
      {
        "status": "payment_confirmed",
        "timestamp": "2024-12-02T11:05:00Z",
        "description": "Payment confirmed"
      },
      {
        "status": "preparing",
        "timestamp": "2024-12-02T11:10:00Z",
        "description": "Restaurant is preparing your order",
        "estimatedCompletion": "15 mins"
      }
    ],
    "estimatedDelivery": "2024-12-02T12:30:00Z",
    "createdAt": "2024-12-02T11:00:00Z"
  }
}
```

---

### 52. Get User Food Orders
**Screen:** `MyOrdersScreen.tsx`  
**Endpoint:** `GET /food-orders/my-orders`  
**Auth Required:** Yes

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string, optional)

**Response:** (Similar structure to Get User Orders)

---

### 53. Update Food Order Status
**Screen:** `RestaurantDashboardScreen.tsx`  
**Endpoint:** `PATCH /food-orders/:orderId/status`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "ready",
  "estimatedDeliveryTime": "20 mins"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "orderId": "FOOD-123456",
    "status": "ready"
  }
}
```

---

### 54. Confirm Food Order Delivery
**Screen:** `FoodOrderTrackingScreen.tsx`  
**Endpoint:** `POST /food-orders/:orderId/confirm-delivery`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Food order delivered successfully",
  "data": {
    "orderId": "FOOD-123456",
    "status": "delivered"
  }
}
```

---

### 55. Rate Food Order
**Screen:** `FoodOrderTrackingScreen.tsx`  
**Endpoint:** `POST /food-orders/:orderId/rate`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "rating": 5,
  "review": "Delicious food! Quick delivery.",
  "foodQuality": 5,
  "deliverySpeed": 5,
  "packaging": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your review!",
  "data": {
    "reviewId": "rev_food_123456"
  }
}
```

---

## Cart

### 56. Get Cart
**Screen:** `CartScreen.tsx`  
**Endpoint:** `GET /cart`  
**Auth Required:** Yes (or session-based for guests)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart_item_1",
        "product": {
          "id": "prod_123456",
          "title": "iPhone 13 Pro Max",
          "image": "https://cdn.varsitymart.com/products/prod_123456_1.jpg",
          "price": 4500,
          "stock": 3
        },
        "quantity": 1,
        "seller": {
          "id": "user_789",
          "name": "Tech Store"
        }
      }
    ],
    "subtotal": 4500,
    "totalItems": 1
  }
}
```

---

### 57. Add to Cart
**Screen:** `ProductDetailScreen.tsx`  
**Endpoint:** `POST /cart/add`  
**Auth Required:** Yes (or session-based for guests)

**Request Body:**
```json
{
  "productId": "prod_123456",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    "cartItemId": "cart_item_1",
    "totalItems": 1
  }
}
```

---

### 58. Update Cart Item
**Screen:** `CartScreen.tsx`  
**Endpoint:** `PUT /cart/items/:itemId`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart updated",
  "data": {
    "cartItemId": "cart_item_1",
    "quantity": 2
  }
}
```

---

### 59. Remove from Cart
**Screen:** `CartScreen.tsx`  
**Endpoint:** `DELETE /cart/items/:itemId`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

### 60. Clear Cart
**Screen:** `CartScreen.tsx`  
**Endpoint:** `DELETE /cart/clear`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

## Chat & Messaging

### 61. Get Conversations
**Screen:** `ChatListScreen.tsx`  
**Endpoint:** `GET /chats/conversations`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv_123456",
        "product": {
          "id": "prod_123456",
          "title": "iPhone 13 Pro Max",
          "image": "https://cdn.varsitymart.com/products/prod_123456_1.jpg"
        },
        "otherUser": {
          "id": "user_789",
          "name": "Tech Store",
          "avatar": "🏪",
          "isOnline": true
        },
        "lastMessage": {
          "text": "Yes, it's still available!",
          "timestamp": "2024-12-02T10:30:00Z",
          "isRead": false
        },
        "unreadCount": 2
      }
    ]
  }
}
```

---

### 62. Get Messages
**Screen:** `ChatScreen.tsx`  
**Endpoint:** `GET /chats/conversations/:conversationId/messages`  
**Auth Required:** Yes

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_123456",
        "senderId": "user_123",
        "text": "Is this still available?",
        "timestamp": "2024-12-02T10:25:00Z",
        "isRead": true,
        "flagged": false
      },
      {
        "id": "msg_123457",
        "senderId": "user_789",
        "text": "Yes, it's still available!",
        "timestamp": "2024-12-02T10:30:00Z",
        "isRead": false,
        "flagged": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 2
    }
  }
}
```

---

### 63. Send Message
**Screen:** `ChatScreen.tsx`  
**Endpoint:** `POST /chats/conversations/:conversationId/messages`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "text": "What's your best price?",
  "productId": "prod_123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent",
  "data": {
    "messageId": "msg_123458",
    "timestamp": "2024-12-02T10:35:00Z",
    "flagged": false,
    "flagReason": null
  }
}
```

**Note:** Message will be flagged if it contains contact information (phone, email, social media).

---

### 64. Mark Messages as Read
**Screen:** `ChatScreen.tsx`  
**Endpoint:** `POST /chats/conversations/:conversationId/mark-read`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Messages marked as read"
}
```

---

### 65. Report Message
**Screen:** `ChatScreen.tsx`  
**Endpoint:** `POST /chats/messages/:messageId/report`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "reason": "spam",
  "details": "User trying to share external contact"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message reported. Admin will review."
}
```

---

## Payments & Escrow

### 66. Initiate Payment
**Screen:** `CheckoutScreen.tsx`, `StorePaymentScreen.tsx`  
**Endpoint:** `POST /payments/initiate`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "type": "order" | "store_subscription" | "restaurant_subscription" | "food_order",
  "referenceId": "ORD-123456",
  "amount": 4730,
  "paymentMethod": "momo",
  "momoNumber": "+233XXXXXXXXX",
  "momoProvider": "MTN" | "Vodafone" | "AirtelTigo"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment initiated",
  "data": {
    "paymentId": "pay_123456",
    "status": "pending",
    "momoPrompt": "Please approve the payment on your phone",
    "expiresAt": "2024-12-02T10:40:00Z"
  }
}
```

---

### 67. Verify Payment
**Screen:** `CheckoutScreen.tsx` (polling)  
**Endpoint:** `GET /payments/:paymentId/verify`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_123456",
    "status": "success",
    "amount": 4730,
    "transactionId": "txn_789456123",
    "paidAt": "2024-12-02T10:38:00Z"
  }
}
```

---

### 68. Get Payment Methods
**Screen:** `PaymentMethodsScreen.tsx`  
**Endpoint:** `GET /payments/methods`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "methods": [
      {
        "id": "method_1",
        "type": "momo",
        "provider": "MTN",
        "number": "+233XXXX5678",
        "isDefault": true
      }
    ]
  }
}
```

---

### 69. Add Payment Method
**Screen:** `PaymentMethodsScreen.tsx`  
**Endpoint:** `POST /payments/methods`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "type": "momo",
  "provider": "MTN",
  "number": "+233XXXXXXXXX",
  "name": "John Doe",
  "isDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment method added",
  "data": {
    "methodId": "method_2"
  }
}
```

---

### 70. Delete Payment Method
**Screen:** `PaymentMethodsScreen.tsx`  
**Endpoint:** `DELETE /payments/methods/:methodId`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Payment method removed"
}
```

---

### 71. Get Escrow Balance
**Screen:** `ProfileScreen.tsx`  
**Endpoint:** `GET /payments/escrow/balance`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "totalHeld": 12450,
    "totalReleased": 45600,
    "pendingOrders": 8,
    "transactions": [
      {
        "id": "escrow_123",
        "orderId": "ORD-123456",
        "amount": 4730,
        "status": "held",
        "heldAt": "2024-12-02T10:00:00Z"
      }
    ]
  }
}
```

---

### 72. Request Payout
**Screen:** `ProfileScreen.tsx` (seller)  
**Endpoint:** `POST /payments/payout`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "amount": 5000,
  "paymentMethod": "method_1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payout requested. Processing within 1-2 business days.",
  "data": {
    "payoutId": "payout_123456",
    "amount": 5000,
    "status": "processing"
  }
}
```

---

## Reviews & Ratings

### 73. Get Product Reviews
**Screen:** `ProductDetailScreen.tsx`  
**Endpoint:** `GET /reviews/products/:productId`  
**Auth Required:** No

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `rating` (number 1-5, optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "averageRating": 4.7,
    "totalReviews": 45,
    "ratingDistribution": {
      "5": 30,
      "4": 10,
      "3": 3,
      "2": 1,
      "1": 1
    },
    "reviews": [
      {
        "id": "rev_123456",
        "user": {
          "id": "user_456",
          "name": "Sarah M.",
          "avatar": "👩"
        },
        "rating": 5,
        "review": "Great product! Exactly as described.",
        "images": [
          "https://cdn.varsitymart.com/reviews/rev_123456_1.jpg"
        ],
        "helpful": 12,
        "verified": true,
        "createdAt": "2024-11-28T14:20:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 45
    }
  }
}
```

---

### 74. Get Store Reviews
**Screen:** `StoreScreen.tsx`  
**Endpoint:** `GET /reviews/stores/:storeId`  
**Auth Required:** No

**Response:** (Similar structure to Get Product Reviews)

---

### 75. Get Restaurant Reviews
**Screen:** `RestaurantDetailScreen.tsx`  
**Endpoint:** `GET /reviews/restaurants/:restaurantId`  
**Auth Required:** No

**Response:** (Similar structure to Get Product Reviews)

---

### 76. Mark Review as Helpful
**Screen:** `ProductDetailScreen.tsx`  
**Endpoint:** `POST /reviews/:reviewId/helpful`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "reviewId": "rev_123456",
    "helpfulCount": 13
  }
}
```

---

## Admin Dashboard

### 77. Get Admin Dashboard Stats
**Screen:** `AdminDashboard.tsx`  
**Endpoint:** `GET /admin/dashboard`  
**Auth Required:** Yes (Admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 2456,
      "activeStores": 89,
      "activeRestaurants": 34,
      "totalProducts": 1234,
      "totalOrders": 5678,
      "totalRevenue": 125000,
      "platformCommission": 6250
    },
    "recentActivity": {
      "newUsers": 45,
      "newOrders": 123,
      "newListings": 67,
      "pendingDisputes": 8
    },
    "popularCategories": [
      {
        "category": "Electronics",
        "count": 450,
        "revenue": 45000
      }
    ]
  }
}
```

---

### 78. Get All Users (Admin)
**Screen:** `AdminDashboard.tsx`  
**Endpoint:** `GET /admin/users`  
**Auth Required:** Yes (Admin only)

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `search` (string, optional)
- `role` (string, optional)
- `kycStatus` (string, optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123456",
        "fullName": "John Doe",
        "email": "john.doe@university.edu.gh",
        "role": "buyer",
        "kycStatus": "verified",
        "isVerified": true,
        "isActive": true,
        "totalOrders": 23,
        "totalSpent": 5600,
        "memberSince": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 50,
      "totalItems": 2456
    }
  }
}
```

---

### 79. Suspend/Ban User
**Screen:** `AdminDashboard.tsx`  
**Endpoint:** `POST /admin/users/:userId/suspend`  
**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "reason": "Violation of terms",
  "duration": "7d" | "30d" | "permanent",
  "details": "User was reported multiple times for fraud"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User suspended successfully",
  "data": {
    "userId": "user_123456",
    "suspendedUntil": "2024-12-09T00:00:00Z"
  }
}
```

---

### 80. Approve/Reject Listing
**Screen:** `AdminDashboard.tsx`  
**Endpoint:** `POST /admin/listings/:listingId/review`  
**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "action": "approve" | "reject",
  "reason": "Contains prohibited items"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Listing reviewed",
  "data": {
    "listingId": "prod_123456",
    "status": "approved" | "rejected"
  }
}
```

---

### 81. Handle Dispute
**Screen:** `AdminDashboard.tsx`  
**Endpoint:** `POST /admin/disputes/:disputeId/resolve`  
**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "resolution": "refund_buyer" | "release_to_seller" | "partial_refund",
  "refundAmount": 4730,
  "notes": "Evidence supports buyer's claim"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Dispute resolved",
  "data": {
    "disputeId": "dispute_123456",
    "resolution": "refund_buyer",
    "refundAmount": 4730
  }
}
```

---

### 82. Get Flagged Messages
**Screen:** `AdminDashboard.tsx`  
**Endpoint:** `GET /admin/flagged-messages`  
**Auth Required:** Yes (Admin only)

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_123456",
        "text": "Call me at 0244123456",
        "sender": {
          "id": "user_789",
          "name": "Seller Joe"
        },
        "conversation": {
          "id": "conv_123456",
          "productId": "prod_123456"
        },
        "flagReason": "Contains phone number",
        "timestamp": "2024-12-02T10:30:00Z",
        "reviewedBy": null,
        "status": "pending"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 124
    }
  }
}
```

---

## Notifications

### 83. Get Notifications
**Screen:** `NotificationsScreen.tsx`  
**Endpoint:** `GET /notifications`  
**Auth Required:** Yes

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `unreadOnly` (boolean, default: false)

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5,
    "notifications": [
      {
        "id": "notif_123456",
        "type": "order_update",
        "title": "Order Update",
        "message": "Your order #ORD-123456 is on the way!",
        "data": {
          "orderId": "ORD-123456",
          "screen": "orderTracking"
        },
        "isRead": false,
        "createdAt": "2024-12-02T11:00:00Z"
      },
      {
        "id": "notif_123457",
        "type": "new_message",
        "title": "New Message",
        "message": "Tech Store sent you a message",
        "data": {
          "conversationId": "conv_123456",
          "screen": "chat"
        },
        "isRead": false,
        "createdAt": "2024-12-02T10:45:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 35
    }
  }
}
```

---

### 84. Mark Notification as Read
**Screen:** `NotificationsScreen.tsx`  
**Endpoint:** `POST /notifications/:notificationId/read`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### 85. Mark All Notifications as Read
**Screen:** `NotificationsScreen.tsx`  
**Endpoint:** `POST /notifications/read-all`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### 86. Get Notification Settings
**Screen:** `SettingsScreen.tsx`  
**Endpoint:** `GET /notifications/settings`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "orderUpdates": true,
    "newMessages": true,
    "promotions": false,
    "priceDrops": true,
    "newFollowers": true,
    "pushEnabled": true,
    "emailEnabled": true,
    "smsEnabled": false
  }
}
```

---

### 87. Update Notification Settings
**Screen:** `SettingsScreen.tsx`  
**Endpoint:** `PUT /notifications/settings`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "orderUpdates": true,
  "newMessages": true,
  "promotions": false,
  "pushEnabled": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification settings updated"
}
```

---

## Night Shop

### 88. Get Night Shop Products
**Screen:** `NightShopScreen.tsx`  
**Endpoint:** `GET /nightshop/products`  
**Auth Required:** No

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `category` (string, optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "isNightShopActive": true,
    "nightShopHours": {
      "start": "22:00",
      "end": "06:00"
    },
    "additionalFee": {
      "percentage": 15,
      "description": "15% Night Shop fee applies"
    },
    "products": [
      {
        "id": "prod_night_123",
        "title": "Late Night Snacks Bundle",
        "price": 35,
        "nightShopFee": 5.25,
        "totalPrice": 40.25,
        "image": "https://cdn.varsitymart.com/products/prod_night_123.jpg",
        "seller": {
          "id": "user_456",
          "name": "Night Shop Express"
        },
        "estimatedDelivery": "30 mins"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 4,
      "totalItems": 78
    }
  }
}
```

---

### 89. Check Night Shop Status
**Screen:** `HomeScreen.tsx`, `NightShopScreen.tsx`  
**Endpoint:** `GET /nightshop/status`  
**Auth Required:** No

**Response:**
```json
{
  "success": true,
  "data": {
    "isActive": true,
    "currentTime": "2024-12-02T22:30:00Z",
    "opensAt": null,
    "closesAt": "2024-12-03T06:00:00Z",
    "additionalFeePercentage": 15
  }
}
```

---

## File Uploads

### 90. Upload Product Images
**Screen:** `AddProductScreen.tsx`  
**Endpoint:** `POST /uploads/product-images`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
FormData: {
  images: [File, File, File] (max 5 images)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "images": [
      {
        "id": "img_123456",
        "url": "https://cdn.varsitymart.com/products/img_123456.jpg",
        "thumbnailUrl": "https://cdn.varsitymart.com/products/thumbnails/img_123456.jpg"
      }
    ]
  }
}
```

---

### 91. Upload Store/Restaurant Logo
**Screen:** `StoreCreationScreen.tsx`, `RestaurantCreationScreen.tsx`  
**Endpoint:** `POST /uploads/logo`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
FormData: {
  logo: File,
  type: "store" | "restaurant"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "logoUrl": "https://cdn.varsitymart.com/logos/logo_123456.jpg"
  }
}
```

---

### 92. Upload KYC Documents
**Screen:** `StudentKycScreen.tsx`, `BusinessKycScreen.tsx`  
**Endpoint:** `POST /uploads/kyc-documents`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
FormData: {
  documents: [File, File],
  documentType: "student_id" | "ghana_card" | "business_doc" | "selfie"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "doc_123456",
        "url": "https://cdn.varsitymart.com/kyc/doc_123456_encrypted.jpg",
        "type": "ghana_card"
      }
    ]
  }
}
```

---

## Additional Routes

### 93. Get App Settings
**Screen:** All screens  
**Endpoint:** `GET /settings/app`  
**Auth Required:** No

**Response:**
```json
{
  "success": true,
  "data": {
    "commissionRate": 0.05,
    "storeSubscriptionFee": 25,
    "restaurantSubscriptionFee": 30,
    "nightShopFeePercentage": 0.15,
    "nightShopHours": {
      "start": "22:00",
      "end": "06:00"
    },
    "minOrderAmount": 5,
    "maxOrderAmount": 10000,
    "deliveryFeeRange": {
      "min": 3,
      "max": 10
    },
    "supportContact": {
      "email": "support@varsitymart.com",
      "phone": "+233XXXXXXXXX",
      "whatsapp": "+233XXXXXXXXX"
    },
    "termsUrl": "https://varsitymart.com/terms",
    "privacyUrl": "https://varsitymart.com/privacy"
  }
}
```

---

### 94. Report Issue
**Screen:** `SettingsScreen.tsx`  
**Endpoint:** `POST /support/report`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "type": "bug" | "fraud" | "inappropriate_content" | "other",
  "subject": "Issue with payment",
  "description": "Payment was deducted but order wasn't created",
  "referenceId": "ORD-123456",
  "screenshots": ["url1", "url2"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report submitted successfully",
  "data": {
    "ticketId": "ticket_123456",
    "estimatedResponseTime": "24 hours"
  }
}
```

---

### 95. Get FAQs
**Screen:** `SettingsScreen.tsx`  
**Endpoint:** `GET /support/faqs`  
**Auth Required:** No

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "category": "Getting Started",
        "faqs": [
          {
            "question": "How do I create an account?",
            "answer": "To create an account, tap on 'Sign Up' and enter your university email..."
          }
        ]
      }
    ]
  }
}
```

---

## WebSocket Events (Real-time)

### Chat Messages
**Connection:** `wss://api.varsitymart.com/ws/chat`  
**Auth:** JWT token in query param

**Events to Listen:**
- `new_message` - New message received
- `message_read` - Message marked as read
- `user_typing` - Other user is typing

**Events to Emit:**
- `typing` - User is typing
- `stop_typing` - User stopped typing

---

### Order Updates
**Connection:** `wss://api.varsitymart.com/ws/orders`  
**Auth:** JWT token in query param

**Events to Listen:**
- `order_status_update` - Order status changed
- `delivery_location_update` - Delivery person location update

---

### Notifications
**Connection:** `wss://api.varsitymart.com/ws/notifications`  
**Auth:** JWT token in query param

**Events to Listen:**
- `new_notification` - New notification received

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Invalid input
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Access denied
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `PAYMENT_FAILED` - Payment processing error
- `INSUFFICIENT_STOCK` - Product out of stock
- `ORDER_CANCELLED` - Order was cancelled
- `KYC_REQUIRED` - KYC verification needed
- `ACCOUNT_SUSPENDED` - Account is suspended
- `SERVER_ERROR` - Internal server error

---

## Rate Limiting

- **General API:** 100 requests per minute
- **Authentication:** 10 requests per minute
- **File Uploads:** 20 requests per minute
- **Chat Messages:** 50 messages per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1638360000
```

---

## Notes for Backend Implementation

1. **Authentication:** Use JWT tokens with refresh token mechanism
2. **File Storage:** Use CDN (e.g., Cloudinary, AWS S3) for images and documents
3. **Payment:** Integrate with Ghana MoMo providers (MTN, Vodafone, AirtelTigo)
4. **Escrow:** Implement secure escrow system with 5% platform commission
5. **Anti-Bypass:** Implement ML-based keyword detection for contact sharing in chat
6. **Real-time:** Use WebSockets for chat, notifications, and order tracking
7. **Search:** Implement full-text search with Elasticsearch or similar
8. **Caching:** Use Redis for caching frequently accessed data
9. **Queue:** Use message queue (RabbitMQ, Redis Queue) for background jobs
10. **Logging:** Implement comprehensive logging and monitoring
11. **Security:** Rate limiting, SQL injection prevention, XSS protection
12. **KYC:** Secure document encryption and storage with access logs
13. **Push Notifications:** Integrate FCM for push notifications
14. **SMS:** Integrate SMS provider for OTP and notifications
15. **Email:** Use transactional email service (SendGrid, Mailgun)

---

