# VarsityMart Web App - TanStack Start Integration Guide

Complete implementation guide for integrating VarsityMart API with TanStack Start web application.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Architecture & Folder Structure](#architecture--folder-structure)
3. [Dependencies](#dependencies)
4. [API Configuration](#api-configuration)
5. [Authentication & Session Management](#authentication--session-management)
6. [Routing with TanStack Router](#routing-with-tanstack-router)
7. [State Management](#state-management)
8. [TanStack Query Setup](#tanstack-query-setup)
9. [API Service Modules](#api-service-modules)
10. [Server-Side Rendering (SSR)](#server-side-rendering)
11. [Form Handling](#form-handling)
12. [File Upload](#file-upload)
13. [WebSocket Integration](#websocket-integration)
14. [SEO Optimization](#seo-optimization)
15. [Authentication Guards](#authentication-guards)
16. [Error Handling](#error-handling)
17. [Deployment](#deployment)

---

## 1. Project Setup

```bash
# Create TanStack Start project
npm create @tanstack/start@latest varsitymart-web

# Navigate to project
cd varsitymart-web

# Install dependencies (see section 3)
npm install
```

---

## 2. Architecture & Folder Structure

```
app/
├── routes/
│   ├── __root.tsx                   # Root layout with providers
│   ├── index.tsx                    # Home page
│   ├── login.tsx                    # Login page
│   ├── register.tsx                 # Registration page
│   ├── products/
│   │   ├── index.tsx                # Product listing
│   │   └── $productId.tsx           # Product detail
│   ├── stores/
│   │   ├── index.tsx                # All stores
│   │   └── $storeId.tsx             # Store detail
│   ├── restaurants/
│   │   ├── index.tsx                # Restaurant listing
│   │   └── $restaurantId.tsx        # Restaurant menu
│   ├── orders/
│   │   ├── index.tsx                # My orders
│   │   └── $orderId.tsx             # Order tracking
│   ├── cart.tsx                     # Shopping cart
│   ├── checkout.tsx                 # Checkout page
│   ├── chat/
│   │   ├── index.tsx                # Chat list
│   │   └── $conversationId.tsx      # Chat messages
│   ├── profile/
│   │   ├── index.tsx                # Profile page
│   │   ├── edit.tsx                 # Edit profile
│   │   └── settings.tsx             # Settings
│   ├── kyc/
│   │   ├── student.tsx              # Student KYC
│   │   └── business.tsx             # Business KYC
│   ├── seller/
│   │   ├── dashboard.tsx            # Seller dashboard
│   │   ├── products/
│   │   │   ├── new.tsx              # Create product
│   │   │   └── $productId/edit.tsx  # Edit product
│   │   └── store/
│   │       ├── create.tsx           # Create store
│   │       └── manage.tsx           # Manage store
│   ├── admin/
│   │   ├── dashboard.tsx            # Admin dashboard
│   │   ├── users.tsx                # User management
│   │   ├── listings.tsx             # Listing moderation
│   │   └── disputes.tsx             # Dispute resolution
│   └── nightshop.tsx                # Night shop page
│
├── api/
│   ├── client.ts                    # Axios instance
│   ├── endpoints.ts                 # API endpoint constants
│   └── services/
│       ├── auth.service.ts          # Authentication
│       ├── products.service.ts      # Products CRUD
│       ├── orders.service.ts        # Order management
│       ├── restaurants.service.ts   # Restaurant & food
│       ├── chat.service.ts          # Chat/messaging
│       ├── payments.service.ts      # Payments & escrow
│       ├── kyc.service.ts           # KYC verification
│       ├── stores.service.ts        # Store management
│       └── admin.service.ts         # Admin operations
│
├── stores/
│   ├── authStore.ts                 # Auth state (Zustand)
│   ├── cartStore.ts                 # Cart state
│   ├── notificationStore.ts         # Notifications
│   └── uiStore.ts                   # UI state (modals, toasts)
│
├── hooks/
│   ├── useAuth.ts                   # Auth hooks
│   ├── useProducts.ts               # Product queries
│   ├── useOrders.ts                 # Order hooks
│   ├── useCart.ts                   # Cart operations
│   ├── useChat.ts                   # Chat hooks
│   ├── useWebSocket.ts              # WebSocket connection
│   └── useInfiniteScroll.ts         # Infinite scroll pagination
│
├── components/
│   ├── layouts/
│   │   ├── AppLayout.tsx            # Main app layout
│   │   ├── AuthLayout.tsx           # Auth pages layout
│   │   ├── DashboardLayout.tsx      # Dashboard layout
│   │   └── AdminLayout.tsx          # Admin layout
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── SEO.tsx
│   │   └── Pagination.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   └── ProductGallery.tsx
│   ├── orders/
│   │   ├── OrderCard.tsx
│   │   └── OrderTimeline.tsx
│   ├── chat/
│   │   ├── ConversationList.tsx
│   │   ├── MessageList.tsx
│   │   └── MessageInput.tsx
│   └── cart/
│       ├── CartItem.tsx
│       └── CartSummary.tsx
│
├── utils/
│   ├── session.ts                   # Session management (cookies)
│   ├── websocket.ts                 # WebSocket client
│   ├── validators.ts                # Form validators
│   ├── formatters.ts                # Date/price formatters
│   └── seo.ts                       # SEO utilities
│
├── types/
│   ├── api.types.ts                 # API response types
│   ├── models.types.ts              # Data models
│   └── route.types.ts               # Route params
│
├── styles/
│   ├── globals.css                  # Global styles
│   └── themes/
│       ├── colors.ts
│       └── typography.ts
│
└── constants/
    ├── config.ts                    # App configuration
    └── routes.ts                    # Route paths
```

---

## 3. Dependencies

### Core Framework
- **@tanstack/start** - Full-stack React framework
- **@tanstack/react-router** - Type-safe routing
- **@tanstack/react-query** - Server state management
- **typescript** - Type safety
- **vinxi** - Build tool

### API & State
- **axios** - HTTP client
- **zustand** - Client state management
- **@tanstack/react-form** - Form management
- **zod** - Schema validation

### Real-time & WebSocket
- **socket.io-client** - WebSocket for chat
- **@tanstack/react-query-devtools** - Dev tools

### UI Components
- **@radix-ui/react-***  - Headless UI components
- **tailwindcss** - Utility-first CSS
- **framer-motion** - Animations
- **react-dropzone** - File upload
- **react-hot-toast** - Toast notifications

### SEO & Analytics
- **@tanstack/react-meta** - Meta tags
- **@vercel/analytics** - Analytics (optional)
- **next-seo** - SEO utilities

### Development
- **eslint** - Code linting
- **prettier** - Code formatting
- **@tanstack/router-devtools** - Router dev tools

---

## 4. API Configuration

### `api/client.ts` Summary
- Create Axios instance with base URL
- Server-side and client-side configurations
- Request interceptor for auth tokens
- Response interceptor for error handling
- Handle 401 errors (redirect to login)
- Token refresh mechanism
- Type-safe response wrappers

### `api/endpoints.ts` Summary
- Define all API endpoint constants
- Use functions for dynamic routes
- Export as ENDPOINTS object
- Group by feature (AUTH, PRODUCTS, ORDERS, etc.)
- Same structure as mobile app

---

## 5. Authentication & Session Management

### Session Storage Strategy
- Use HTTP-only cookies for tokens (secure)
- Store user data in Zustand store
- Server-side session validation
- Refresh token rotation

### Login Flow
1. User submits login form
2. Call `POST /auth/login` from server action
3. Set HTTP-only cookie with token
4. Set user data in Zustand store
5. Redirect to dashboard
6. Initialize WebSocket

### Registration Flow
1. User fills registration form
2. Call `POST /auth/register` from server action
3. Set session cookie
4. Redirect to email verification page
5. User enters verification code
6. Redirect to home

### Protected Routes
- Check session on server before rendering
- Redirect to login if not authenticated
- Use route context for user data
- Implement role-based access control

---

## 6. Routing with TanStack Router

### Route Configuration
- File-based routing in `routes/` directory
- Type-safe navigation with route params
- Loader functions for data fetching
- Before load guards for authentication
- SEO meta tags per route

### Dynamic Routes
- `$productId.tsx` - Product detail page
- `$storeId.tsx` - Store page
- `$orderId.tsx` - Order tracking
- `$conversationId.tsx` - Chat messages

### Route Loaders
- Fetch data on server before render
- Prefetch with React Query
- Handle loading states
- Error boundaries per route

### Navigation
- Type-safe `Link` component
- Programmatic navigation with `useNavigate`
- Search params with `useSearch`
- Route params with `useParams`

---

## 7. State Management

### Zustand Stores

#### `stores/authStore.ts`
- State: user, isAuthenticated, role
- Actions: setUser, logout, updateProfile
- Persist user data (not tokens)
- Sync with session cookie

#### `stores/cartStore.ts`
- State: items, totalItems, subtotal
- Actions: addItem, removeItem, updateQuantity, clearCart
- Persist to localStorage
- Sync with backend on checkout

#### `stores/notificationStore.ts`
- State: unreadCount, notifications
- Actions: addNotification, markAsRead, clearAll
- Real-time updates via WebSocket

#### `stores/uiStore.ts`
- State: isMenuOpen, activeModal, toast
- Actions: openModal, closeModal, showToast
- No persistence needed

---

## 8. TanStack Query Setup

### `__root.tsx` Provider Setup
- Wrap app with QueryClientProvider
- Configure default query options
- Set staleTime and cacheTime
- Enable SSR hydration
- Add React Query Devtools

### Query Key Factory
```typescript
// Organized query keys for cache management
export const queryKeys = {
  products: {
    all: ['products'],
    lists: () => [...queryKeys.products.all, 'list'],
    list: (filters: Filters) => [...queryKeys.products.lists(), filters],
    details: () => [...queryKeys.products.all, 'detail'],
    detail: (id: string) => [...queryKeys.products.details(), id],
  },
  // Similar for orders, restaurants, etc.
}
```

### Server-Side Prefetching
- Prefetch data in route loaders
- Dehydrate state for client
- Hydrate on client mount
- Avoid waterfall requests

---

## 9. API Service Modules

### `services/auth.service.ts`
- register(data) - User registration
- login(credentials) - Login
- verifyEmail(code) - Email verification
- logout() - Clear session
- refreshToken() - Token refresh
- forgotPassword(email) - Password reset request

### `services/products.service.ts`
- getProducts(filters) - Paginated product list
- getProductById(id) - Single product
- createProduct(data) - Create listing
- updateProduct(id, data) - Update product
- deleteProduct(id) - Delete product
- likeProduct(id) - Toggle like
- getCategories() - Product categories

### `services/orders.service.ts`
- createOrder(data) - Place order
- getOrderById(id) - Order details
- getMyOrders(filters) - User orders
- updateOrderStatus(id, status) - Update status
- confirmDelivery(id) - Confirm received
- cancelOrder(id, reason) - Cancel order
- rateOrder(id, rating) - Submit review

### `services/restaurants.service.ts`
- getRestaurants(filters) - Restaurant list
- getRestaurantById(id) - Restaurant details
- getMenu(restaurantId) - Menu items
- createFoodOrder(data) - Place food order
- getFoodOrderById(id) - Track food order

### `services/chat.service.ts`
- getConversations() - List conversations
- getMessages(conversationId, page) - Chat history
- sendMessage(conversationId, text) - Send message
- markAsRead(conversationId) - Mark read
- reportMessage(messageId, reason) - Report

### `services/payments.service.ts`
- initiatePayment(data) - Start payment
- verifyPayment(id) - Check status
- getPaymentMethods() - Saved methods
- addPaymentMethod(data) - Add method
- requestPayout(amount) - Withdraw funds

### `services/admin.service.ts`
- getDashboardStats() - Admin overview
- getUsers(filters) - User list
- suspendUser(userId, reason) - Ban user
- reviewListing(listingId, action) - Approve/reject
- resolveDispute(disputeId, resolution) - Handle dispute

---

## 10. Server-Side Rendering (SSR)

### Benefits
- SEO optimization for product pages
- Fast initial page load
- Social media preview cards
- Better perceived performance

### Implementation Strategy
- Fetch data in route loaders (server-side)
- Prefetch with React Query
- Dehydrate state for hydration
- Stream data for faster TTFB

### SEO-Critical Pages
- Home page (product listings)
- Product detail pages
- Store pages
- Restaurant pages
- Static content pages

### Data Fetching Pattern
```typescript
// In route loader
export const loader = async ({ params }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['product', params.productId],
    queryFn: () => getProductById(params.productId)
  })
  return { dehydratedState: dehydrate(queryClient) }
}
```

---

## 11. Form Handling

### TanStack Form Setup
- Type-safe form definitions
- Field-level validation with Zod
- Server-side validation
- Optimistic updates
- Error handling

### Form Examples

#### Login Form
- Fields: email, password
- Client validation (email format, required)
- Server action for submission
- Error display (field-level)
- Loading state

#### Product Creation Form
- Fields: title, description, price, category, images
- Multi-step wizard (optional)
- Image upload with preview
- Draft saving
- Server-side validation

#### Checkout Form
- Fields: delivery address, payment method
- Address autocomplete
- Payment method selection
- Terms acceptance
- Order summary

---

## 12. File Upload

### Image Upload Strategy
- Use react-dropzone for drag & drop
- Client-side image preview
- Image compression before upload
- Progress indicator
- Multiple file support

### Upload Flow
1. User selects/drops images
2. Validate file types and sizes
3. Generate preview thumbnails
4. Upload to `/uploads/product-images`
5. Get back CDN URLs
6. Display uploaded images

### Document Upload (KYC)
1. User selects documents
2. Validate file types (PDF, JPG, PNG)
3. Show file name and size
4. Upload to `/uploads/kyc-documents`
5. Show upload progress
6. Display success message

### Implementation Notes
- Max 5 images per product (2MB each)
- Support drag & drop and click to upload
- Show upload progress with percentage
- Handle network errors with retry
- Allow removing uploaded files

---

## 13. WebSocket Integration

### `utils/websocket.ts` Summary
- Create Socket.IO client instance
- Connect on user login
- Pass JWT token in auth header
- Listen for events: new_message, order_status_update, new_notification
- Emit events: typing, stop_typing
- Auto-reconnect on disconnect
- Handle connection errors

### Chat Real-time Updates
- New message received → update message list
- User typing → show typing indicator
- Message read → update read status
- Scroll to new messages

### Order Tracking Updates
- Status change → update order timeline
- Delivery location → update map
- Show toast notification

### Notification Updates
- New notification → update badge count
- Show toast with notification
- Update notification list

---

## 14. SEO Optimization

### Meta Tags
- Title per page
- Description per page
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URLs

### Product Page SEO
- Dynamic title with product name
- Rich product description
- Product images for Open Graph
- Structured data (JSON-LD)
- Breadcrumb navigation

### Restaurant Page SEO
- Restaurant name in title
- Menu items in description
- Location information
- Business hours
- Reviews and ratings

### Implementation
- Use TanStack Router meta tags
- Server-side render meta tags
- Generate sitemap.xml
- Create robots.txt
- Implement structured data

---

## 15. Authentication Guards

### Route Protection
- Check authentication in route beforeLoad
- Redirect to login if not authenticated
- Check user role for admin routes
- Verify KYC status for seller routes

### Role-Based Access
- Buyer routes - accessible to all users
- Seller routes - require seller role
- Admin routes - require admin role
- Redirect based on role

### Implementation Pattern
```typescript
// Protect route with beforeLoad
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' })
    }
    if (context.user.role !== 'seller') {
      throw redirect({ to: '/' })
    }
  }
})
```

---

## 16. Error Handling

### Global Error Boundary
- Catch React errors
- Display error UI
- Log errors to monitoring service (Sentry)
- Provide retry option
- Show contact support link

### API Error Handling
- Network errors → show toast with retry
- 400 errors → display validation errors
- 401 errors → logout and redirect to login
- 403 errors → show access denied message
- 404 errors → show not found page
- 500 errors → show generic error message

### Form Validation Errors
- Display errors inline below fields
- Highlight invalid fields
- Show error summary at top
- Clear errors on field change

### Route Error Boundaries
- Per-route error handling
- Custom error pages
- Log route errors
- Fallback UI

---

## 17. Deployment

### Build Configuration
- Configure environment variables
- Optimize bundle size
- Enable code splitting
- Compress assets
- Generate sitemap

### Hosting Options

#### Vercel (Recommended)
- Zero-config deployment
- Edge functions support
- Automatic HTTPS
- Preview deployments
- Built-in analytics

#### Netlify
- Continuous deployment
- Edge handlers
- Split testing
- Form handling

#### Self-Hosted (VPS/Docker)
- Build production bundle
- Set up Node.js server
- Configure Nginx reverse proxy
- Set up SSL certificates
- Configure PM2 for process management

### Environment Variables
```env
VITE_API_BASE_URL=https://api.varsitymart.com/v1
VITE_WS_BASE_URL=wss://api.varsitymart.com/ws
VITE_SENTRY_DSN=your_sentry_dsn
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

### Pre-Deployment Checklist
- [ ] Test all routes
- [ ] Verify API integration
- [ ] Check responsive design
- [ ] Test authentication flow
- [ ] Validate forms
- [ ] Test file uploads
- [ ] Check WebSocket connections
- [ ] Verify SEO meta tags
- [ ] Test error handling
- [ ] Enable error monitoring
- [ ] Configure analytics
- [ ] Set up CI/CD pipeline

---

## Performance Optimization

### Code Splitting
- Lazy load routes with React.lazy
- Split vendor bundles
- Dynamic imports for large components

### Caching Strategy
- Cache API responses with React Query
- Browser caching for static assets
- Service worker for offline support (optional)
- CDN caching for images

### Image Optimization
- Use next-gen formats (WebP, AVIF)
- Lazy load images below fold
- Responsive images with srcset
- Compress images on upload

### Bundle Optimization
- Tree shaking unused code
- Minify JavaScript and CSS
- Remove console logs in production
- Analyze bundle with Vite analyzer

---

## Testing Strategy

### Unit Tests (Vitest)
- Test API service functions
- Test custom hooks
- Test utility functions
- Test Zustand stores

### Integration Tests
- Test form submissions
- Test navigation flows
- Test authentication
- Test API integration

### E2E Tests (Playwright)
- Test critical user flows
- Test checkout process
- Test order placement
- Test chat functionality

---

## Monitoring & Analytics

### Error Monitoring
- Integrate Sentry for error tracking
- Track API errors
- Monitor performance issues
- Set up alerts

### Analytics
- Google Analytics 4
- Track page views
- Track user interactions
- Monitor conversion funnels
- A/B testing (optional)

### Performance Monitoring
- Track Core Web Vitals
- Monitor API response times
- Track bundle sizes
- Monitor memory usage

---

## Security Best Practices

### Authentication
- HTTP-only cookies for tokens
- Secure cookie flags
- CSRF protection
- XSS prevention

### API Security
- HTTPS only
- CORS configuration
- Rate limiting on client
- Input sanitization

### Data Protection
- Validate all user inputs
- Sanitize HTML content
- Secure file uploads
- Content Security Policy headers

---

**Note:** This guide provides structure and summaries for TanStack Start implementation. Adapt based on your specific requirements and best practices.
