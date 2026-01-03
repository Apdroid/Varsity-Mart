# VarsityMart API Routes Documentation

## Overview
This document outlines all API endpoints required for full backend integration of the VarsityMart campus marketplace mobile app.

**Base URL:** `https://api.varsitymart.com/v1`

**Authentication:** Most routes require JWT token in Authorization header: `Authorization: Bearer {token}` or automatically via HTTP-Only cookies

---

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [KYC Verification](#kyc-verification)
4. [Products & Marketplace](#products--marketplace)
5. [Stores](#stores)
6. [Food Services](#food-services)
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

### Token Management (HTTP-Only Cookies)

All tokens are automatically set as secure, HTTP-only cookies on the client. This prevents XSS attacks as the cookies cannot be accessed via JavaScript.

**Cookie Specifications:**
```
accessToken:
  - HttpOnly: true
  - Secure: true (HTTPS only)
  - SameSite: Strict
  - Path: /
  - Max-Age: 900 (15 minutes)

refreshToken:
  - HttpOnly: true
  - Secure: true (HTTPS only)
  - SameSite: Strict
  - Path: /auth/refresh-token
  - Max-Age: 2592000 (30 days)
```

Clients do **NOT** need to manually handle tokens in the request body. The browser automatically includes HTTP-only cookies in all requests.

---

### 1. User Registration
**Screen:** `RegisterScreen.tsx`  
**Endpoint:** `POST /auth/register`  
**Auth Required:** No

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@gmail.com",
  "phone": "+233XXXXXXXXX",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "isStudent": true,
  "studentEmail": "john.doe@university.edu.gh",
  "university": "KNUST", 
  "campus": "Main Campus",
  "agreeToTerms": true,
  "role": "buyer | seller | admin (default: buyer)",
  "auth_method": "google | credentials",
  "profile_pic": "https://supabase.com/*********************"
}
```

**Student Registration (isStudent = true):**
- `studentEmail` is required (e.g., john.doe@university.edu.gh)
- This email is used for student verification during KYC
- Regular `email` field is for account login purposes

**Non-Student Registration (isStudent = false):**
- `studentEmail` field is ignored
- Regular `email` is used for account login
- No student ID verification required

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
      "studentEmail": "john.doe@university.edu.gh",
      "phone": "+233XXXXXXXXX",
      "avatar": "👤",
      "isVerified": false,
      "isStudent": true,
      "role": "buyer"
    }
  }
}
```

**Set-Cookie Headers (Automatic):**
```
Set-Cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900
Set-Cookie: refreshToken=refresh_token_here; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh-token; Max-Age=2592000
```

---

### 2. User Login
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
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123456",
      "fullName": "John Doe",
      "email": "john.doe@gmail.com",
      "studentEmail": "john.doe@university.edu.gh",
      "phone": "+233XXXXXXXXX",
      "avatar": "👤",
      "isVerified": true,
      "isStudent": true,
      "kycStatus": "verified",
      "role": "buyer",
      "rating": 4.8
    }
  }
}
```

**Set-Cookie Headers (Automatic):**
```
Set-Cookie: accessToken=...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900
Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh-token; Max-Age=2592000
```

---

### 3. Email Verification
**Screen:** `RegisterScreen.tsx`  
**Endpoint:** `POST /auth/verify-email`  
**Auth Required:** Yes (accessToken cookie required)

**Request Body:**
```json
{
  "verificationCode": "123456"
}
```

**Backend Logic:**
```
if (isStudent === true) {
  // Verify against studentEmail
  sendVerificationEmailTo(studentEmail);
} else {
  // Verify against regular email
  sendVerificationEmailTo(email);
}

// Upon verification:
isVerified = true;
// If student, optionally mark for KYC verification
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "isVerified": true,
    "isStudent": true,
    "nextStep": "kyc_required | account_ready"
  }
}
```

---

### 4. Resend Verification Email
**Screen:** `RegisterScreen.tsx`  
**Endpoint:** `POST /auth/resend-verification`  
**Auth Required:** Yes

**Backend Logic:**
```
if (user.isStudent && !user.isVerified) {
  // Resend to studentEmail
  sendVerificationEmailTo(user.studentEmail);
} else if (!user.isStudent && !user.isVerified) {
  // Resend to regular email
  sendVerificationEmailTo(user.email);
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent to your email address"
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
**Auth Required:** No (refreshToken HTTP-only cookie required)

**Request Body:** Empty (refreshToken comes from cookie)

**Backend Logic:**
```
// Extract refreshToken from HTTP-Only cookie
const refreshToken = req.cookies.refreshToken;

// Validate and issue new tokens
if (validateRefreshToken(refreshToken)) {
  // Generate new accessToken
  const accessToken = generateAccessToken(user);
  
  // Generate new refreshToken (optional rotation)
  const newRefreshToken = generateRefreshToken(user);
  
  // Set as HTTP-Only cookies
  setSecureCookie('accessToken', accessToken, 15min);
  setSecureCookie('refreshToken', newRefreshToken, 30days);
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully"
}
```

**Set-Cookie Headers:**
```
Set-Cookie: accessToken=new_token; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900
Set-Cookie: refreshToken=new_refresh_token; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh-token; Max-Age=2592000
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

**Clear Cookies:**
```
Set-Cookie: accessToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0
Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh-token; Max-Age=0
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
    "email": "john.doe@gmail.com",
    "studentEmail": "john.doe@university.edu.gh",
    "phone": "+233XXXXXXXXX",
    "avatar": "👤",
    "isVerified": true,
    "isStudent": true,
    "campus": "Main Campus",
    "kycStatus": "verified",
    "role": "buyer",
    "rating": 4.8,
    "totalReviews": 23,
    "memberSince": "2024-01-15T00:00:00Z",
    "hasStore": false,
    "hasRestaurant": false,
    "foodServices": [
      {
        "id": "fs_123",
        "name": "John's Diner",
        "type": "restaurant",
        "status": "active"
      }
    ]
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

**Validation Requirements:**
- User must have `isStudent === true`
- User must have valid `studentEmail`
- Email verification required before KYC submission

**Request Body:**
```
FormData: {
  studentIdImage: File,
  selfieImage: File,
  studentEmail: "john.doe@university.edu.gh",
  university: "University of Ghana"
}
```

**Backend Logic:**
```
// Verify user.isStudent === true
if (!user.isStudent) {
  throw new Error("User is not registered as student");
}

// Use studentEmail for verification
if (formData.studentEmail !== user.studentEmail) {
  throw new Error("Student email does not match registered email");
}

// Mark user as verified (isVerified = true)
user.isVerified = true;
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

## Food Services

### Overview
Food services have two types: **restaurant** and **foodstall**. The CRUD operations are handled dynamically based on the `type` field, allowing flexible management of different food service models.

---

### 32. Create Food Service
**Screen:** `CreateFoodServiceScreen.tsx`  
**Endpoint:** `POST /food-services`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
FormData: {
  name: "John's Diner",
  type: "restaurant | foodstall",
  description: "Traditional Ghanaian cuisine",
  logo: File,
  coverImage: File,
  location: "KNUST Main Campus",
  latitude: 6.6753,
  longitude: -0.1838,
  phone: "+233XXXXXXXXX",
  operatingHours: {
    monday: { open: "08:00", close: "22:00" },
    tuesday: { open: "08:00", close: "22:00" },
    ...
    sunday: { open: "12:00", close: "21:00" }
  },
  cuisineType: "Ghanaian, Local, African",
  averageDeliveryTime: 30,
  minOrderAmount: 10,
  deliveryFee: 5,
  restaurantOnly: {
    seatingCapacity: 50,
    diningType: "dine-in | delivery | both",
    parkingAvailable: true
  },
  foodstallOnly: {
    marketName: "Central Market",
    stallNumber: "A12",
    speciality: "Fried Rice, Waakye"
  }
}
```

**Backend Logic:**
```typescript
class FoodService {
  id: string;
  userId: string;
  name: string;
  type: "restaurant" | "foodstall";
  description: string;
  logo: string;
  coverImage: string;
  location: string;
  coordinates: { latitude: number; longitude: number };
  phone: string;
  operatingHours: OperatingHours;
  cuisineType: string[];
  averageDeliveryTime: number;
  minOrderAmount: number;
  deliveryFee: number;
  
  // Conditional fields
  ...(type === "restaurant" && {
    seatingCapacity: number;
    diningType: "dine-in" | "delivery" | "both";
    parkingAvailable: boolean;
  });
  
  ...(type === "foodstall" && {
    marketName: string;
    stallNumber: string;
    speciality: string[];
  });
  
  status: "active" | "inactive" | "suspended";
  rating: number;
  totalOrders: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Response:**
```json
{
  "success": true,
  "message": "Food service created successfully",
  "data": {
    "id": "fs_123456",
    "name": "John's Diner",
    "type": "restaurant",
    "status": "active",
    "logoUrl": "https://cdn.varsitymart.com/logos/fs_123456.jpg",
    "createdAt": "2024-12-02T10:30:00Z"
  }
}
```

---

### 33. Get Food Service by ID
**Screen:** `FoodServiceDetailScreen.tsx`  
**Endpoint:** `GET /food-services/:foodServiceId`  
**Auth Required:** No

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "fs_123456",
    "name": "John's Diner",
    "type": "restaurant",
    "description": "Traditional Ghanaian cuisine",
    "logo": "https://cdn.varsitymart.com/logos/fs_123456.jpg",
    "coverImage": "https://cdn.varsitymart.com/covers/fs_123456.jpg",
    "location": "KNUST Main Campus",
    "coordinates": { "latitude": 6.6753, "longitude": -0.1838 },
    "phone": "+233XXXXXXXXX",
    "operatingHours": {
      "monday": { "open": "08:00", "close": "22:00" },
      "isOpen": true,
      "opensIn": "45 minutes"
    },
    "cuisineType": ["Ghanaian", "Local", "African"],
    "averageDeliveryTime": 30,
    "minOrderAmount": 10,
    "deliveryFee": 5,
    "rating": 4.7,
    "totalOrders": 342,
    "restaurantSpecific": {
      "seatingCapacity": 50,
      "diningType": "dine-in | delivery | both",
      "parkingAvailable": true
    },
    "foodstallSpecific": null,
    "owner": {
      "id": "user_123456",
      "name": "John Doe",
      "avatar": "https://cdn.varsitymart.com/avatars/user_123456.jpg",
      "isVerified": true
    }
  }
}
```

---

### 34. Update Food Service
**Screen:** `EditFoodServiceScreen.tsx`  
**Endpoint:** `PUT /food-services/:foodServiceId`  
**Auth Required:** Yes  
**Authorization:** Owner or Admin

**Request Body:**
```json
{
  "name": "John's Diner Updated",
  "description": "Traditional Ghanaian cuisine - Now with more options",
  "operatingHours": {
    "monday": { "open": "08:00", "close": "23:00" }
  },
  "minOrderAmount": 15,
  "deliveryFee": 6,
  "cuisineType": ["Ghanaian", "Local", "African", "Continental"],
  "restaurantOnly": {
    "seatingCapacity": 60,
    "parkingAvailable": true
  },
  "foodstallOnly": {
    "speciality": ["Fried Rice", "Waakye", "Jollof"]
  }
}
```

**Backend Logic:**
```
// Validate ownership
if (foodService.userId !== currentUser.id && currentUser.role !== "admin") {
  throw new Error("Unauthorized");
}

// Update base fields (all food services)
foodService.name = newData.name || foodService.name;
foodService.operatingHours = merge(foodService.operatingHours, newData.operatingHours);

// Update type-specific fields
if (foodService.type === "restaurant") {
  foodService.seatingCapacity = newData.restaurantOnly?.seatingCapacity;
  foodService.parkingAvailable = newData.restaurantOnly?.parkingAvailable;
}

if (foodService.type === "foodstall") {
  foodService.speciality = newData.foodstallOnly?.speciality;
  foodService.stallNumber = newData.foodstallOnly?.stallNumber;
}
```

**Response:**
```json
{
  "success": true,
  "message": "Food service updated successfully",
  "data": {
    "id": "fs_123456",
    "name": "John's Diner Updated",
    "type": "restaurant",
    "updatedAt": "2024-12-02T11:30:00Z"
  }
}
```

---

### 35. List Food Services
**Screen:** `FoodPageScreen.tsx`  
**Endpoint:** `GET /food-services`  
**Auth Required:** No

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `type` (string, optional: "restaurant" | "foodstall" | "all")
- `search` (string, optional: search by name)
- `campus` (string, optional: filter by campus)
- `sortBy` (string, optional: "rating" | "newest" | "nearest")

**Response:**
```json
{
  "success": true,
  "data": {
    "foodServices": [
      {
        "id": "fs_123456",
        "name": "John's Diner",
        "type": "restaurant",
        "logo": "https://cdn.varsitymart.com/logos/fs_123456.jpg",
        "location": "KNUST Main Campus",
        "cuisineType": ["Ghanaian", "Local"],
        "averageDeliveryTime": 30,
        "minOrderAmount": 10,
        "deliveryFee": 5,
        "rating": 4.7,
        "totalOrders": 342,
        "isOpen": true,
        "opensIn": "in 45 minutes",
        "serviceType": "restaurant"
      },
      {
        "id": "fs_789012",
        "name": "Mary's Waakye Stall",
        "type": "foodstall",
        "logo": "https://cdn.varsitymart.com/logos/fs_789012.jpg",
        "location": "Central Market",
        "cuisineType": ["Waakye", "Local"],
        "averageDeliveryTime": 15,
        "minOrderAmount": 5,
        "deliveryFee": 2,
        "rating": 4.9,
        "totalOrders": 521,
        "isOpen": true,
        "serviceType": "foodstall"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 98,
      "hasMore": true
    },
    "filters": {
      "types": {
        "restaurant": 45,
        "foodstall": 53
      }
    }
  }
}
```

---

### 36. Delete Food Service
**Screen:** `FoodServiceSettingsScreen.tsx`  
**Endpoint:** `DELETE /food-services/:foodServiceId`  
**Auth Required:** Yes  
**Authorization:** Owner or Admin

**Response:**
```json
{
  "success": true,
  "message": "Food service deleted successfully"
}
```

---

### 37. Get Food Service Menu
**Screen:** `FoodServiceDetailScreen.tsx`  
**Endpoint:** `GET /food-services/:foodServiceId/menu`  
**Auth Required:** No

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_123",
        "name": "Main Courses",
        "items": [
          {
            "id": "item_456",
            "name": "Jollof Rice",
            "description": "Spicy jollof rice with vegetables",
            "price": 12.99,
            "image": "https://cdn.varsitymart.com/menu/item_456.jpg",
            "available": true,
            "servingSize": "Regular",
            "calories": 450,
            "vegetarian": false,
            "spiceLevel": "medium"
          }
        ]
      }
    ]
  }
}
```

---

### 38. Create Menu Item
**Screen:** `AddMenuItemScreen.tsx`  
**Endpoint:** `POST /food-services/:foodServiceId/menu-items`  
**Auth Required:** Yes  
**Authorization:** Owner of food service
**Content-Type:** `multipart/form-data`

**Request Body:**
```
FormData: {
  name: "Jollof Rice",
  description: "Spicy jollof rice with vegetables",
  price: 12.99,
  categoryId: "cat_123",
  image: File,
  servingSize: "Regular | Large | Small",
  calories: 450,
  vegetarian: false,
  spiceLevel: "low | medium | high",
  isAvailable: true,
  preparationTime: 20,
  availability: {
    mondayToFriday: { start: "08:00", end: "22:00" },
    weekend: { start: "12:00", end: "23:00" }
  }
}
```

**Backend Logic:**
```
// Verify user owns this food service
const foodService = await FoodService.findById(foodServiceId);
if (foodService.userId !== currentUser.id) {
  throw new Error("Unauthorized");
}

// Create menu item regardless of type (restaurant or foodstall)
const menuItem = await MenuItem.create({
  foodServiceId,
  ...itemData,
  createdAt: new Date()
});
```

**Response:**
```json
{
  "success": true,
  "message": "Menu item created successfully",
  "data": {
    "id": "item_789",
    "name": "Jollof Rice",
    "price": 12.99,
    "categoryId": "cat_123",
    "imageUrl": "https://cdn.varsitymart.com/menu/item_789.jpg",
    "createdAt": "2024-12-02T10:30:00Z"
  }
}
```

---

### 39. Update Menu Item
**Screen:** `EditMenuItemScreen.tsx`  
**Endpoint:** `PUT /food-services/:foodServiceId/menu-items/:itemId`  
**Auth Required:** Yes  
**Authorization:** Owner of food service

**Request Body:**
```json
{
  "name": "Jollof Rice",
  "description": "Spicy jollof rice with fresh vegetables",
  "price": 13.99,
  "isAvailable": true,
  "spiceLevel": "high"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Menu item updated successfully",
  "data": {
    "id": "item_789",
    "name": "Jollof Rice",
    "price": 13.99,
    "updatedAt": "2024-12-02T11:30:00Z"
  }
}
```

---

### 40. Delete Menu Item
**Screen:** `EditMenuItemScreen.tsx`  
**Endpoint:** `DELETE /food-services/:foodServiceId/menu-items/:itemId`  
**Auth Required:** Yes  
**Authorization:** Owner of food service

**Response:**
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

---

### 41. Get Food Service Dashboard Stats
**Screen:** `FoodServiceDashboardScreen.tsx`  
**Endpoint:** `GET /food-services/:foodServiceId/dashboard`  
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
    "serviceType": "restaurant",
    "topSellingItems": [
      {
        "itemId": "item_456",
        "name": "Jollof Rice",
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

### 42. Create Order (Marketplace Products)
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

### 43. Get Order by ID
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

### 44. Get User Orders
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

### 45. Update Order Status
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

### 46. Confirm Order Delivery
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

### 47. Cancel Order
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

### 48. Rate Order
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

### 49. Create Food Order
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

### 50. Get Food Order by ID
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

### 51. Get User Food Orders
**Screen:** `MyOrdersScreen.tsx`  
**Endpoint:** `GET /food-orders/my-orders`  
**Auth Required:** Yes

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string, optional)

**Response:** (Similar structure to Get User Orders)

---

### 52. Update Food Order Status
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

## Security Considerations

### HTTP-Only Cookies
- All authentication tokens (accessToken, refreshToken) are stored in HTTP-Only cookies
- JavaScript cannot access these cookies, preventing XSS attacks
- Cookies are only sent over HTTPS connections
- SameSite=Strict prevents CSRF attacks

### isVerified Field
- Used to track email verification status
- For students: verified against `studentEmail`
- For non-students: verified against regular `email`
- Required before accessing certain features (KYC submission, seller operations)

### studentEmail vs email
- `studentEmail`: University-provided email for student verification (e.g., john.doe@university.edu.gh)
- `email`: General email for account login and communication (can be gmail, etc.)

### Food Service Type Differentiation
- **restaurant**: Full food service with optional dine-in, delivery services, larger operations
- **foodstall**: Smaller food services, market stalls, usually delivery/pickup focused
- Type-specific fields prevent unnecessary data storage and allow business logic differentiation

---

## WebSocket Events (Real-time)

### Chat Messages
**Connection:** `wss://api.varsitymart.com/ws/chat`  
**Auth:** JWT token in cookie (automatically sent)

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
**Auth:** JWT token in cookie

**Events to Listen:**
- `order_status_update` - Order status changed
- `delivery_location_update` - Delivery person location update

---

### Food Order Updates
**Connection:** `wss://api.varsitymart.com/ws/food-orders`  
**Auth:** JWT token in cookie

**Events to Listen:**
- `food_order_status_update` - Food order status changed
- `restaurant_notification` - New order notification for restaurant
- `delivery_status_update` - Delivery status update

---

### Notifications
**Connection:** `wss://api.varsitymart.com/ws/notifications`  
**Auth:** JWT token in cookie

**Events to Listen:**
- `new_notification` - New notification received
- `order_update` - Real-time order update
- `food_service_update` - Food service status update

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
- `INVALID_FOOD_SERVICE_TYPE` - Invalid food service type provided
- `UNAUTHORIZED_FOOD_SERVICE_ACCESS` - User does not own this food service
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

1. **Authentication:** Use JWT tokens with refresh token mechanism, store as HTTP-Only cookies
2. **Cookies:** Set `HttpOnly: true, Secure: true, SameSite: Strict` on all auth cookies
3. **isVerified:** Implement email verification before allowing sensitive operations
4. **Student Verification:** Use `studentEmail` for KYC and student-specific features
5. **Food Services:** Use polymorphic approach with `type` field to handle different food service models
6. **CRUD Flexibility:** Design endpoints to handle conditional fields based on `type`
7. **File Storage:** Use CDN (e.g., Cloudinary, AWS S3) for images and documents
8. **Payment:** Integrate with Ghana MoMo providers (MTN, Vodafone, AirtelTigo)
9. **Escrow:** Implement secure escrow system with 5% platform commission
10. **Anti-Bypass:** Implement ML-based keyword detection for contact sharing in chat
11. **Real-time:** Use WebSockets for chat, notifications, and order tracking
12. **Search:** Implement full-text search with Elasticsearch or similar
13. **Caching:** Use Redis for caching frequently accessed data
14. **Queue:** Use message queue (RabbitMQ, Redis Queue) for background jobs
15. **Logging:** Implement comprehensive logging and monitoring
16. **Security:** Rate limiting, SQL injection prevention, XSS protection
17. **KYC:** Secure document encryption and storage with access logs
18. **Push Notifications:** Integrate FCM for push notifications
19. **SMS:** Integrate SMS provider for OTP and notifications
20. **Email:** Use transactional email service (SendGrid, Mailgun)

---

