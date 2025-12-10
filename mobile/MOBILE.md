# VarsityMart Mobile App - React Native Integration Guide

Complete implementation guide for integrating VarsityMart API with React Native mobile app.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Architecture & Folder Structure](#architecture--folder-structure)
3. [Dependencies](#dependencies)
4. [API Configuration](#api-configuration)
5. [Authentication Flow](#authentication-flow)
6. [Storage Management](#storage-management)
7. [State Management with Zustand](#state-management-with-zustand)
8. [React Query Setup](#react-query-setup)
9. [API Service Modules](#api-service-modules)
10. [Custom Hooks](#custom-hooks)
11. [Navigation Setup](#navigation-setup)
12. [File Upload (Images & Documents)](#file-upload)
13. [Push Notifications](#push-notifications)
14. [WebSocket Integration](#websocket-integration)
15. [Offline Support](#offline-support)
16. [Error Handling](#error-handling)
17. [Security Best Practices](#security-best-practices)

---

## 1. Project Setup

```bash
# Initialize Expo project
bunx rn-new --nativewind 
### Depending on your OS  
rename the folder to mobile

# Install other dependencies (see section 3)
npm install @tanstack/react-query axios zustand react-native-mmkv
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install expo-image-picker expo-document-picker expo-file-system
npm install socket.io-client expo-notifications
```

### NativeWind Setup

**tailwind.config.js**
```js
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#EC4899',
        accent: '#F59E0B',
      }
    },
  },
  plugins: [],
}
```

**babel.config.js**
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
```

**app.json**
Add to expo config:
```json
{
  "expo": {
    "plugins": ["nativewind/expo"]
  }
}
```

---

## 2. Architecture & Folder Structure

```
src/
├── api/
│   ├── client.ts                    # Axios instance with interceptors
│   ├── endpoints.ts                 # API endpoint constants
│   └── services/
│       ├── auth.service.ts          # Authentication APIs
│       ├── products.service.ts      # Product CRUD operations
│       ├── orders.service.ts        # Order management
│       ├── restaurants.service.ts   # Restaurant & food APIs
│       ├── chat.service.ts          # Chat/messaging APIs
│       ├── payments.service.ts      # Payment & escrow
│       ├── kyc.service.ts           # KYC submission
│       └── notifications.service.ts # Notification APIs
│
├── stores/
│   ├── authStore.ts                 # Auth state (token, user)
│   ├── cartStore.ts                 # Shopping cart state
│   ├── notificationStore.ts         # Notification badge count
│   └── appStore.ts                  # Global app settings
│
├── hooks/
│   ├── useAuth.ts                   # Auth hooks (login, logout, register)
│   ├── useProducts.ts               # Product queries & mutations
│   ├── useOrders.ts                 # Order tracking hooks
│   ├── useChat.ts                   # Chat messaging hooks
│   ├── useCart.ts                   # Cart operations
│   └── useWebSocket.ts              # Real-time connection hook
│
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── ForgotPasswordScreen.tsx
│   ├── home/
│   │   ├── HomeScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   └── NightShopScreen.tsx
│   ├── orders/
│   │   ├── MyOrdersScreen.tsx
│   │   ├── OrderTrackingScreen.tsx
│   │   └── CheckoutScreen.tsx
│   ├── chat/
│   │   ├── ChatListScreen.tsx
│   │   └── ChatScreen.tsx
│   ├── profile/
│   │   ├── ProfileScreen.tsx
│   │   ├── EditProfileScreen.tsx
│   │   └── SettingsScreen.tsx
│   └── kyc/
│       ├── StudentKycScreen.tsx
│       └── BusinessKycScreen.tsx
│
├── components/
│   ├── common/
│   │   ├── Button.tsx               # Reusable button with NativeWind
│   │   ├── Input.tsx                # Form input with Tailwind classes
│   │   ├── LoadingSpinner.tsx       # Loading indicator
│   │   ├── ErrorMessage.tsx         # Error display component
│   │   └── Card.tsx                 # Card container component
│   ├── products/
│   │   ├── ProductCard.tsx          # Product card with Tailwind styling
│   │   └── ProductList.tsx          # FlatList with products
│   ├── orders/
│   │   └── OrderTimeline.tsx        # Order status timeline
│   └── chat/
│       └── MessageBubble.tsx        # Chat message with Tailwind
│
├── navigation/
│   ├── AppNavigator.tsx             # Root navigator
│   ├── AuthNavigator.tsx            # Auth stack
│   └── MainNavigator.tsx            # Main app tabs
│
├── utils/
│   ├── storage.ts                   # MMKV storage wrapper
│   ├── websocket.ts                 # WebSocket client
│   ├── imageUtils.ts                # Image picker & compression
│   ├── validation.ts                # Form validation helpers
│   └── formatters.ts                # Date/price formatters
│
├── types/
│   ├── api.types.ts                 # API response types
│   ├── navigation.types.ts          # Navigation param types
│   └── models.types.ts              # Data models
│
└── constants/
    ├── config.ts                    # App configuration
    └── theme.ts                     # Tailwind theme extensions (colors, fonts)
```

### NativeWind Styling Pattern

**Component Example Structure:**
```typescript
// Using className prop with Tailwind classes
<View className="flex-1 bg-gray-50 px-4">
  <Text className="text-2xl font-bold text-gray-900">
    Product Title
  </Text>
  <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg active:opacity-80">
    <Text className="text-white font-semibold text-center">
      Add to Cart
    </Text>
  </TouchableOpacity>
</View>
```

**Responsive Design:**
- Use Tailwind's responsive prefixes (sm:, md:, lg:)
- Platform-specific styles with Platform.OS checks
- Dark mode support with dark: prefix

**Custom Theme in constants/theme.ts:**
- Extend Tailwind colors
- Define app-specific fonts
- Custom spacing values
- Shadow presets

---

## 3. Dependencies

### Core Dependencies
- **expo** - React Native framework
- **typescript** - Type safety
- **@tanstack/react-query** - Server state management
- **axios** - HTTP client
- **zustand** - Client state management
- **react-native-mmkv** - Fast persistent storage

### Styling with NativeWind
- **nativewind** - Tailwind CSS for React Native
- **tailwindcss** - Tailwind CSS core
- **react-native-reanimated** - Required for NativeWind animations
- **react-native-safe-area-context** - Safe area handling

### Navigation
- **@react-navigation/native** - Navigation framework
- **@react-navigation/native-stack** - Stack navigator
- **@react-navigation/bottom-tabs** - Tab navigator
- **react-native-screens** - Native screen optimization

### File Handling
- **expo-image-picker** - Image selection from gallery/camera
- **expo-document-picker** - Document selection
- **expo-file-system** - File operations
- **react-native-image-crop-picker** - Image cropping

### Real-time & Notifications
- **socket.io-client** - WebSocket for real-time chat
- **expo-notifications** - Push notifications
- **@notifee/react-native** - Local notifications

### UI/UX
- **react-native-gesture-handler** - Touch gestures
- **react-native-svg** - SVG support
- **expo-haptics** - Haptic feedback
- **expo-linear-gradient** - Gradient backgrounds

---

## 4. API Configuration

### `api/client.ts` Summary
- Create Axios instance with base URL
- Add request interceptor to inject JWT token
- Add response interceptor for error handling
- Handle 401 errors (redirect to login)
- Implement token refresh logic
- Type-safe response handling

### `api/endpoints.ts` Summary
- Define all API endpoint constants
- Use functions for dynamic routes (e.g., `/products/:id`)
- Export as ENDPOINTS object
- Organize by feature (AUTH, PRODUCTS, ORDERS, etc.)

---

## 5. Authentication Flow

### Registration Process
1. User fills registration form
2. Call `POST /auth/register` with user data
3. Store token in secure storage (MMKV)
4. Navigate to email verification screen
5. User enters verification code
6. Call `POST /auth/verify-email`
7. Navigate to home screen

### Login Process
1. User enters email/password
2. Call `POST /auth/login`
3. Store token and user data
4. Update Zustand auth store
5. Navigate to main app
6. Initialize WebSocket connections

### Token Management
- Store access token and refresh token
- Implement auto-refresh before expiry
- Clear tokens on logout
- Handle token expiration globally

---

## 6. Storage Management

### `utils/storage.ts` Summary
- Use react-native-mmkv for fast storage
- Functions: `setItem`, `getItem`, `removeItem`, `clear`
- Store: auth tokens, user preferences, cart data
- Encrypt sensitive data (tokens, user info)
- Implement data migration for app updates

---

## 7. State Management with Zustand

### `stores/authStore.ts`
- Store: user, token, isAuthenticated
- Actions: login, logout, updateUser, setToken
- Persist to MMKV storage
- Rehydrate on app launch

### `stores/cartStore.ts`
- Store: items array, total count, subtotal
- Actions: addItem, removeItem, updateQuantity, clearCart
- Persist cart across sessions
- Sync with backend on checkout

### `stores/notificationStore.ts`
- Store: unreadCount, notifications array
- Actions: addNotification, markAsRead, clearAll
- Real-time updates via WebSocket

---

## 8. React Query Setup

### `App.tsx` Setup
- Wrap app with QueryClientProvider
- Configure default query options
- Set staleTime and cacheTime
- Enable retry logic
- Configure offline support

### Query Keys Structure
```typescript
// Example query key organization
export const queryKeys = {
  products: ['products'],
  productById: (id: string) => ['products', id],
  myOrders: ['orders', 'my'],
  conversations: ['chats', 'conversations'],
  // ... etc
}
```

---

## 9. API Service Modules

### `services/auth.service.ts`
- register(data) - User registration
- login(credentials) - User login
- verifyEmail(code) - Email verification
- forgotPassword(email) - Request password reset
- logout() - Clear session

### `services/products.service.ts`
- getProducts(filters) - List products with pagination
- getProductById(id) - Single product details
- createProduct(data) - Create new listing
- updateProduct(id, data) - Update product
- deleteProduct(id) - Remove product
- likeProduct(id) - Toggle like/unlike

### `services/orders.service.ts`
- createOrder(data) - Place new order
- getOrderById(id) - Track order status
- getMyOrders(type) - List user orders (buyer/seller)
- updateOrderStatus(id, status) - Update order
- confirmDelivery(id) - Confirm received
- cancelOrder(id, reason) - Cancel order
- rateOrder(id, rating) - Submit review

### `services/chat.service.ts`
- getConversations() - List all chats
- getMessages(conversationId) - Load chat history
- sendMessage(conversationId, text) - Send message
- markAsRead(conversationId) - Mark read

### `services/payments.service.ts`
- initiatePayment(data) - Start payment flow
- verifyPayment(id) - Check payment status
- getPaymentMethods() - List saved methods
- requestPayout(amount) - Withdraw funds

---

## 10. Custom Hooks

### `hooks/useAuth.ts`
- useLogin() - Login mutation
- useRegister() - Registration mutation
- useLogout() - Logout handler
- useCurrentUser() - Get logged-in user

### `hooks/useProducts.ts`
- useProducts(filters) - Query products list
- useProduct(id) - Query single product
- useCreateProduct() - Create product mutation
- useUpdateProduct() - Update mutation
- useLikeProduct() - Like toggle mutation

### `hooks/useOrders.ts`
- useMyOrders(type) - Query user orders
- useOrder(id) - Query single order
- useCreateOrder() - Checkout mutation
- useUpdateOrderStatus() - Status update
- useCancelOrder() - Cancel mutation

### `hooks/useWebSocket.ts`
- Manage WebSocket connection lifecycle
- Auto-reconnect on disconnect
- Handle incoming events
- Emit events to server
- Connection state management

---

## 11. Navigation Setup

### Stack Structure
```
Root Navigator
├── Auth Stack (not logged in)
│   ├── Login Screen
│   ├── Register Screen
│   └── Forgot Password Screen
│
└── Main Tab Navigator (logged in)
    ├── Home Tab → Home Stack
    │   ├── Home Screen
    │   ├── Product Detail Screen
    │   ├── Store Screen
    │   └── Night Shop Screen
    │
    ├── Orders Tab → Orders Stack
    │   ├── My Orders Screen
    │   └── Order Tracking Screen
    │
    ├── Sell Tab → Add Product Screen
    │
    ├── Chat Tab → Chat Stack
    │   ├── Chat List Screen
    │   └── Chat Screen
    │
    └── Profile Tab → Profile Stack
        ├── Profile Screen
        ├── Settings Screen
        ├── KYC Screens
        └── Payment Methods Screen
```

### Navigation Types
- Define param types for type-safe navigation
- Use `useNavigation` and `useRoute` hooks
- Implement deep linking for notifications
- Handle back button on Android

---

## 12. File Upload

### Image Upload Flow
1. Use expo-image-picker to select image
2. Compress image to reduce size
3. Convert to FormData
4. Upload to `/uploads/product-images`
5. Get back image URL
6. Display preview

### Document Upload (KYC)
1. Use expo-document-picker for documents
2. Validate file type and size
3. Upload to `/uploads/kyc-documents`
4. Show upload progress
5. Handle encryption on backend

### Implementation Notes
- Max 5 images per product
- Support JPEG, PNG formats
- Compress images to < 2MB each
- Show upload progress indicator
- Handle network errors gracefully

---

## 13. Push Notifications

### Setup Process
1. Request notification permissions
2. Get device push token (FCM/APNs)
3. Send token to backend
4. Handle incoming notifications
5. Navigate to relevant screen on tap

### Notification Types
- Order updates (status changes)
- New messages (chat)
- Payment confirmations
- Price drop alerts
- Promotional messages

### Local Notifications
- Use @notifee/react-native for rich notifications
- Show notification when app is in foreground
- Play sound/vibration
- Custom notification actions

---

## 14. WebSocket Integration

### `utils/websocket.ts` Summary
- Connect to WebSocket on login
- Listen for: new_message, order_status_update, new_notification
- Emit: typing, stop_typing
- Auto-reconnect on disconnect
- Pass JWT token in connection query

### Chat Real-time
- Listen for new messages
- Show typing indicators
- Update unread count badge
- Play notification sound

### Order Tracking
- Real-time status updates
- Delivery location tracking
- Show live updates in UI

---

## 15. Offline Support

### Strategy
- Queue mutations when offline
- Retry on reconnect
- Cache query data
- Show offline indicator
- Optimistic updates for better UX

### Implementation
- Use React Query's offline support
- Persist query cache to storage
- Sync on app foreground/network change
- Handle conflicts gracefully

---

## 16. Error Handling

### Global Error Boundary
- Catch React errors
- Show friendly error UI
- Log errors to monitoring service
- Provide retry option

### API Error Handling
- Show toast for network errors
- Display validation errors inline
- Handle 401 (logout and redirect)
- Handle 403 (show permission denied)
- Retry failed requests automatically

### Form Validation
- Client-side validation before API call
- Show field-level errors
- Use react-hook-form for forms
- Match backend validation rules

---

## 17. Security Best Practices

### Token Security
- Store tokens in MMKV (encrypted)
- Never log tokens
- Clear tokens on logout
- Implement token rotation

### API Security
- Always use HTTPS
- Validate SSL certificates
- Don't hardcode API keys
- Use environment variables

### Data Protection
- Encrypt sensitive local data
- Implement biometric authentication
- Clear cache on logout
- Secure file uploads

### Input Validation
- Sanitize user inputs
- Validate file uploads
- Prevent XSS attacks
- Implement rate limiting on client

---

## Quick Start Checklist

- [ ] Install all dependencies including NativeWind
- [ ] Configure tailwind.config.js with custom theme
- [ ] Set up babel.config.js with NativeWind plugin
- [ ] Configure API base URL
- [ ] Set up Axios client with interceptors
- [ ] Create Zustand stores
- [ ] Set up React Query provider
- [ ] Implement authentication flow
- [ ] Create navigation structure
- [ ] Build reusable components with Tailwind classes
- [ ] Create theme.ts with custom Tailwind extensions
- [ ] Implement file upload utilities
- [ ] Set up push notifications
- [ ] Connect WebSocket for real-time
- [ ] Add error boundaries
- [ ] Test offline functionality
- [ ] Implement analytics tracking
- [ ] Test NativeWind styles on both iOS and Android

---

## NativeWind Best Practices

### Styling Guidelines
- Use Tailwind utility classes for all styling
- Avoid inline styles unless necessary
- Create reusable component variants with className
- Use custom theme for brand colors
- Leverage Tailwind's responsive utilities
- Use dark mode classes for theme switching

### Performance Tips
- NativeWind compiles to native styles (no runtime overhead)
- Use className instead of inline styles
- Avoid complex nested Tailwind classes
- Use memo for styled components that don't change
- Optimize FlatList rendering with proper keys

### Common Tailwind Patterns for Mobile

**Layout:**
```typescript
// Container with padding and safe area
<SafeAreaView className="flex-1 bg-white">
  <View className="px-4 py-6">
    {/* Content */}
  </View>
</SafeAreaView>

// Flex layouts
<View className="flex-row justify-between items-center">
  <View className="flex-1" />
</View>
```

**Typography:**
```typescript
// Headings
<Text className="text-3xl font-bold text-gray-900">Title</Text>
<Text className="text-xl font-semibold text-gray-800">Subtitle</Text>

// Body text
<Text className="text-base text-gray-600">Description</Text>
<Text className="text-sm text-gray-500">Caption</Text>
```

**Buttons:**
```typescript
// Primary button
<TouchableOpacity className="bg-primary py-4 px-6 rounded-xl active:opacity-80">
  <Text className="text-white font-bold text-center">Button</Text>
</TouchableOpacity>

// Outline button
<TouchableOpacity className="border-2 border-primary py-4 px-6 rounded-xl active:bg-gray-50">
  <Text className="text-primary font-bold text-center">Button</Text>
</TouchableOpacity>
```

**Cards:**
```typescript
<View className="bg-white rounded-2xl shadow-lg p-4 mb-4">
  <Image className="w-full h-48 rounded-xl" />
  <Text className="text-lg font-bold mt-3">Product Name</Text>
  <Text className="text-primary text-xl font-bold mt-2">$99.99</Text>
</View>
```

**Forms:**
```typescript
<View className="mb-4">
  <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
  <TextInput 
    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
    placeholder="Enter email"
  />
</View>
```

**Lists:**
```typescript
<FlatList
  data={products}
  renderItem={({ item }) => (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      {/* Product content */}
    </View>
  )}
  contentContainerClassName="px-4 py-6"
/>
```

### Dark Mode Support
```typescript
// Enable dark mode in tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  // ...
}

// Use dark: prefix in components
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">Content</Text>
</View>

// Toggle dark mode with Zustand store
const { isDarkMode, toggleDarkMode } = useThemeStore()
```

---

## Environment Variables (.env)

```env
API_BASE_URL=https://api.varsitymart.com/v1
WS_BASE_URL=wss://api.varsitymart.com/ws
SENTRY_DSN=your_sentry_dsn
ANALYTICS_KEY=your_analytics_key
```

---

## Testing Strategy

### Unit Tests
- Test API service functions
- Test custom hooks
- Test utility functions
- Test state stores

### Integration Tests
- Test navigation flows
- Test API integration
- Test WebSocket connections
- Test offline behavior

### E2E Tests (Detox)
- Test authentication flow
- Test product listing/creation
- Test order placement
- Test chat messaging

---

## Performance Optimization

- Implement list virtualization (FlashList)
- Lazy load images with caching
- Debounce search inputs
- Optimize re-renders with React.memo
- Use useMemo/useCallback appropriately
- Implement pagination for lists
- Compress images before upload
- Cache API responses effectively
- NativeWind compiles styles at build time (zero runtime overhead)
- Use Tailwind classes instead of inline styles for better performance
- Avoid complex Tailwind class combinations in frequently rendered components

---

## Deployment

### iOS
- Configure app signing
- Set up push notification certificates
- Submit to App Store
- Configure TestFlight for beta

### Android
- Generate signed APK/AAB
- Configure Firebase for push
- Submit to Google Play
- Set up internal testing track


