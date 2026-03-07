# VarsityMart — Project Summary

> **Campus marketplace** for buying, selling, and discovering deals across university campuses (targeting Ghanaian universities).

---

## Tech Stack

| Layer          | Technology                                                      |
| -------------- | --------------------------------------------------------------- |
| Framework      | **Next.js 16** (App Router, RSC)                                |
| Runtime        | **Bun**                                                         |
| Language       | **TypeScript** (strict mode)                                    |
| Styling        | **Tailwind CSS 4** + `tw-animate-css`                           |
| UI Components  | **shadcn/ui** (New York style) + **Aceternity UI** + **MagicUI** |
| State (server) | **TanStack React Query 5**                                      |
| State (client) | **Zustand 5** (UI store) + React Context (auth)                 |
| Forms          | **React Hook Form** + **Zod** validation                        |
| HTTP Client    | **Axios** (cookie-based auth, auto-refresh interceptor)         |
| Realtime       | **Socket.io** client                                            |
| 3D / Visuals   | **Three.js** / React Three Fiber + Drei                         |
| Animations     | **Framer Motion 12**                                            |
| Carousel       | **Swiper** + **Embla Carousel**                                 |
| Charts         | **Recharts**                                                    |
| Icons          | **Lucide** + **Tabler Icons**                                   |
| Linter         | **Biome** (tabs, double quotes, recommended rules)              |
| Analytics      | **Vercel Analytics**                                            |

---

## Scripts

```bash
bun run dev          # Start dev server
bun run build        # Production build
bun run start        # Start production server
bun run lint         # Biome lint
```

---

## Project Structure

```
website/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (ThemeProvider → QueryProvider → UniversityProvider → AuthGuard)
│   ├── page.tsx            # Homepage (hero, featured, restaurants, stores, categories, deals)
│   ├── auth/               # Login, Register, Forgot/Reset Password, Callback, Complete Profile
│   ├── products/           # Product listing + [id] detail
│   ├── stores/             # Store listing + [id] detail
│   ├── restaurants/        # Restaurant listing + [id] detail
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout + success page
│   ├── search/             # Search with loading state
│   ├── messages/           # Chat / messaging
│   ├── notifications/      # Notification center
│   ├── offers/             # Make-an-offer feature
│   ├── wishlist/           # Saved items
│   ├── deals/              # Deals & discounts
│   ├── sell/               # Sell product flow
│   ├── seller/dashboard/   # Seller dashboard
│   ├── account/            # Profile, Orders, Settings
│   ├── categories/         # Browse by category
│   ├── report/             # Report listing/user
│   ├── help/               # Help center (fees, safety, selling guides)
│   ├── about/              # About page
│   ├── careers/            # Careers page
│   ├── contact/            # Contact page
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms of service
│   └── cookies/            # Cookie policy
├── components/
│   ├── ui/                 # shadcn/ui primitives (Radix-based)
│   ├── layout/             # MainLayout, Header, Footer, Sidebar
│   ├── home/               # Hero slider, featured products, carousels
│   ├── auth/               # Auth forms & components
│   ├── products/           # Product-related components
│   ├── cart/               # Cart components
│   ├── checkout/           # Checkout flow components
│   ├── stores/             # Store components
│   ├── search/             # Search components
│   ├── messages/           # Chat UI components
│   ├── notifications/      # Notification components
│   ├── offers/             # Offer components
│   ├── wishlist/           # Wishlist components
│   ├── sell/               # Sell flow components
│   ├── account/            # Account/profile components
│   ├── food/               # Restaurant/food components
│   ├── deals/              # Deal components
│   ├── providers/          # QueryProvider, UniversityProvider
│   └── theme-provider.tsx  # next-themes dark/light/system
├── hooks/
│   ├── queries/            # TanStack Query hooks (auth, cart, chat, orders, products, etc.)
│   ├── use-auth.ts         # Auth hook
│   ├── use-cart.ts         # Cart hook
│   ├── use-chat.ts         # Chat hook
│   ├── use-products.ts     # Products hook
│   ├── use-stores.ts       # Stores hook
│   ├── use-restaurants.ts  # Restaurants hook
│   ├── use-orders.ts       # Orders hook
│   ├── use-websocket.ts    # WebSocket connection hook
│   └── use-mobile.ts       # Responsive breakpoint hook
├── lib/
│   ├── api/
│   │   ├── client.ts       # Axios instance (base URL, 401 refresh interceptor, withCredentials)
│   │   ├── endpoints.ts    # All API endpoint constants
│   │   ├── query-keys.ts   # React Query key factory
│   │   ├── auth-guard.tsx  # Route protection component
│   │   └── services/       # Service modules (auth, products, stores, orders, chat, etc.)
│   ├── stores/             # Zustand stores (auth, cart, notification, university)
│   ├── utils/              # Formatters, validators, WebSocket helper
│   ├── queryClient.ts      # React Query client config
│   └── utils.ts            # General utils (cn helper)
├── contexts/
│   └── auth-context.tsx    # Auth context (login, register, logout, user state)
├── store/
│   └── uiStore.ts          # Zustand UI store (modals, sidebar, tabs, global loading)
├── types/
│   ├── models.ts           # Domain models (User, Product, Store, Order, Restaurant, etc.)
│   └── api.ts              # API request/response types
├── constants/
│   └── config.ts           # App config (API URLs, pagination, upload limits, route paths)
├── data/                   # Mock/static data for all features
└── public/                 # Static assets
```

---

## Domain Models

| Model          | Key Fields                                                                 |
| -------------- | -------------------------------------------------------------------------- |
| **User**       | id, email, fullName, role (`buyer`/`seller`/`admin`), kycStatus            |
| **Product**    | id, title, price, compareAtPrice, condition, status, seller, store, images |
| **Store**      | id, name, owner, rating, isVerified, isOpen, operatingHours                |
| **Order**      | id, orderNumber, items, total, status, paymentStatus, timeline             |
| **Restaurant** | id, name, cuisine[], rating, deliveryTime, deliveryFee, menu               |
| **FoodOrder**  | id, restaurant, items, status, estimatedDeliveryTime                       |
| **Offer**      | id, product, buyer, amount, status, counterAmount, expiresAt               |
| **Conversation / Message** | participants, content, type (text/image/product/order)         |
| **Notification** | id, type, title, body, isRead                                            |
| **Wallet / Transaction** | balance, pendingBalance, credit/debit history                    |
| **KYCSubmission** | type (student/business), documents, status                              |

---

## API Integration

- **Base URL:** `NEXT_PUBLIC_API_BASE_URL` (default: `https://api.varsitymart.org/v1`)
- **Auth:** Cookie-based (httpOnly JWT). Axios interceptor auto-refreshes on 401.
- **WebSocket:** `NEXT_PUBLIC_WS_BASE_URL` via Socket.io for real-time chat/notifications.
- **Services layer:** Each domain has a dedicated service file (`auth.service.ts`, `products.service.ts`, etc.).
- **Backend doc:** See `Backend 1.md` for the full API routes specification.

### Key API Domains

| Domain         | Endpoints                                                    |
| -------------- | ------------------------------------------------------------ |
| Auth           | Register, Login, Logout, Refresh, Verify Email, Google OAuth |
| Users          | Profile CRUD, Avatar upload, Addresses                       |
| Products       | CRUD, Search, Like, Categories, Reviews, Image upload        |
| Stores         | CRUD, Store products, Categories, Reviews                    |
| Restaurants    | CRUD, Menu, Featured, Dashboard, Reviews                     |
| Orders         | Create, Status updates, Cancel, Confirm delivery, Rate       |
| Food Orders    | Create, Status updates, Cancel                               |
| Chat           | Conversations, Messages, Send, Mark read                     |
| Payments       | Initiate, Verify, Methods, Wallet, Payout                    |
| KYC            | Student/Business submission, Status check                    |
| Notifications  | List, Mark read, Settings                                    |
| Offers         | Create, Accept, Decline, Counter, Cancel                     |
| Admin          | Dashboard stats, User management, Listing review, Disputes   |
| Night Shop     | Late-night products & stores                                 |

---

## Architecture Patterns

1. **Provider chain:** `ThemeProvider → QueryProvider → UniversityProvider → AuthGuard → children`
2. **Data fetching:** TanStack Query hooks in `hooks/queries/` wrap service calls; mock data in `data/` used as fallback.
3. **State split:** Server state via React Query, client UI state via Zustand, auth state via React Context.
4. **Path aliases:** `@/*` maps to project root (e.g., `@/components`, `@/lib`, `@/hooks`).
5. **Styling:** Tailwind CSS with CSS variables for theming; `cn()` utility for conditional classes.
6. **Component library:** shadcn/ui (Radix primitives) extended with Aceternity UI and MagicUI registry components.

---

## Environment Variables

| Variable                     | Purpose                      |
| ---------------------------- | ---------------------------- |
| `NEXT_PUBLIC_APP_URL`        | App URL                      |
| `NEXT_PUBLIC_API_BASE_URL`   | Backend API base URL         |
| `NEXT_PUBLIC_WS_BASE_URL`    | WebSocket server URL         |

---

## Current Website Flow

### 1. Authentication Flow (`/auth/*`)

**Sign Up** (`/auth/register`) — Multi-step form:
1. **Account Type** — Select Buyer or Seller
2. **Personal Info** — Name, avatar, email, phone
3. **University** — University, campus, student status, student ID
4. **Security** — Password, confirm, agree to terms → email verification sent

**Login** (`/auth/login`) — Email + password, "Remember Me", Google Sign-In. On success → home (or `?redirect` target).

**Forgot Password** (`/auth/forgot-password`) — Enter email → reset link sent.

**Reset Password** (`/auth/reset-password?token=`) — New password + confirmation using token from email.

**Complete Profile** (`/auth/complete-profile`) — Post-OAuth flow: role selection → university info → KYC confirmation → redirect to dashboard.

**OAuth Callback** (`/auth/callback`) — Handles Google OAuth redirect.

**Route Protection** (`lib/api/auth-guard.tsx`) — Protected routes: `/account/*`, `/orders`, `/sell`, `/seller`, `/chat`, `/wishlist`, `/kyc`. Unauthenticated users → `/auth/login?redirect=...`. Currently disabled (`DISABLE_AUTH_GUARD = true`) for testing.

---

### 2. Homepage Flow (`/`)

Wrapped in `MainLayout` (Header + Footer). Sections top-to-bottom:

1. **Hero Slider** (`CampusMarketSlider`) — Promotional banners with CTAs
2. **Featured Products** (`FeaturedProducts`) — Curated product highlights
3. **Restaurants Carousel** (`RestaurantsCarousel`) — "Hungry? Order Now" — first 10 restaurants with banners, logos, ratings
4. **New Arrivals** (`ProductsCarousel`) — First 12 products, "Just In" badge → `/products?sort=newest`
5. **Campus Stores** (`StoresCarousel`) — First 10 stores → verified student-run businesses
6. **Categories Carousel** (`CategoriesCarousel`) — Browsable product categories
7. **Hot Deals** (`ProductsCarousel`) — Discounted products (items with `compareAtPrice`), "🔥 On Sale" badge → `/deals`

---

### 3. Product Browsing Flow (`/products/*`)

**Listing** (`/products`) — Hero banner, breadcrumb, "All Products" title with count. Grid layout (`sm:2 md:3 lg:6`). Each `ProductCard` shows: image, title, price (current + compare), seller, wishlist toggle, "Add to Cart".

**Detail** (`/products/[id]`) — Two-column layout:
- **Left (2/3):** Image gallery (main + thumbnails, arrows, zoom), title, rating, price, condition badge, availability, description
- **Right (1/3):** Seller card (avatar, name, verification, rating, "Message Seller", "View More from Seller"), product badges (verified seller, free delivery)
- **Actions:** Quantity +/-, Add to Cart, Wishlist toggle, Make Offer (opens `MakeOfferModal`), Message Seller, Share
- **Below:** Related Products, More from Seller, Recently Viewed (localStorage-tracked)

---

### 4. Store Flow (`/stores/*`)

**Listing** (`/stores`) — Hero banner, breadcrumb, grid of `StoreCard`s. Each card: banner (hover zoom), logo overlay, open/closed badge, product count, name + verification, description, rating.

**Detail** (`/stores/[id]`) — Full-width store header (banner, logo, name, verification, rating, "Follow Store", "Message Seller", hours, contact). Stats: active listings, response rate, response time, reviews. Product grid with sort/pagination. Related stores carousel.

---

### 5. Restaurant & Food Ordering Flow (`/restaurants/*`)

**Listing** (`/restaurants`) — Hero, search/filter, restaurant cards showing: banner, logo, name, cuisines, rating, delivery time, delivery fee, min order, open/closed status.

**Detail & Ordering** (`/restaurants/[id]`) — Two-column:
- **Left:** Restaurant header (banner, logo, name, hours, delivery info, call/share/like), menu section with search + category tabs, menu items with "+" to add
- **Right (sticky):** Order summary — cart items, subtotal, delivery fee, service fee, total, min order warning, "Proceed to Checkout"
- **Add flow:** Click "+" → modal for quantity, options, special instructions → confirm add

---

### 6. Cart & Checkout Flow (`/cart`, `/checkout/*`)

**Cart** (`/cart`) — Two-column:
- **Left:** Cart items (image, title, seller, quantity +/-, price, remove)
- **Right (sticky):** Order summary (subtotal, delivery GH₵25, service 2%, total), "Proceed to Checkout", "Continue Shopping"

**Checkout** (`/checkout`) — 3-step process with progress indicator:
1. **Delivery Address** — Select saved address or add new (full address, landmark, save as default)
2. **Payment Method** — Mobile Money (MoMo number + provider), Card (number, CVV, expiry), Bank Transfer, Pay on Delivery
3. **Review & Confirm** — Summary of address, payment, items, fees, total, order notes textarea → "Place Order" (2s processing animation)

**Success** (`/checkout/success`) — Green checkmark, "Order Confirmed!", order number (e.g. VM-2024-005), "Track Your Order" → `/account/orders`, "Continue Shopping" → `/products`.

---

### 7. Selling Flow (`/sell`, `/seller/*`)

**Start Selling** (`/sell`) — Hero + 3 seller type cards:
1. **Sell Products** — Unlimited listings, own pricing, in-app chat, escrow payments
2. **Open a Store** — Custom store page, inventory management, analytics, promotions
3. **Sell Food** — Menu management, order notifications, delivery tracking, reviews

Benefits section: Verified Marketplace, Secure Payments, Campus Community.

**Seller Dashboard** (`/seller/dashboard`) — Stats grid (Active Listings, Total Sales, Total Views, Messages), active listings section (empty state → "Create Your First Listing"), recent activity feed, performance sidebar (response rate, avg response time, rating), quick links (seller guide, fees, safety, messages), selling tips.

---

### 8. Offers Flow (`/offers`)

**Tabs:** Offers Sent (buyer view) / Offers Received (seller view). Requires login.

**Each offer card:** Buyer avatar/name, product info (image, name, original price, offered amount, discount %), status badge (Pending/Countered/Accepted/Declined/Expired), time remaining, message.

**Seller actions on received offers:** Accept, Counter (opens `CounterOfferModal` — counter amount + message), Decline.

**Making an offer:** From product detail → "Make Offer" → `MakeOfferModal` (current price display, offer amount input, discount calc, optional message). Offers expire in 24–48 hours.

---

### 9. Messaging Flow (`/messages`)

**Two-column chat UI:**
- **Left — Conversations list:** Search bar, conversation items with avatar, online indicator (green dot), name, last message preview, timestamp, unread count badge
- **Right — Chat thread:** Sticky header (avatar, name, online status, 3-dot menu: block/report/delete), product context card (if discussing a product), message bubbles (right-aligned blue for sent with checkmarks, left-aligned gray for received), sticky input area (text field, emoji, attach image, send on Enter)

---

### 10. Account Flow (`/account/*`)

**Dashboard** (`/account`) — User header (avatar, name, email, verification badge), two buttons (Edit Profile, Start Selling). Menu grid: My Orders, Wishlist, Messages (unread count), Notifications (unread count), Settings, Seller Dashboard (if seller). Recent orders sidebar (last 3).

**Edit Profile** (`/account/profile`) — Photo upload (JPG/PNG/GIF, 5MB), personal info (first/last name, bio), contact (email, phone), preferences toggles (email notifications, marketing emails, show profile publicly).

**My Orders** (`/account/orders`) — Filter by status (All/Processing/Shipped/Delivered/Cancelled), sort by date/price. Order cards: ID, date, items count, total, status badge, delivery address, "Track Order" / "View Details". Detail view: items, address, payment, status timeline, delivery estimate, contact seller, return item.

**Settings** (`/account/settings`) — Tabs:
1. **Profile** — Avatar, name, email, phone, address
2. **Notifications** — Toggle email/push/order updates/promotional
3. **Security** — Change password, active sessions, sign out devices
4. **Preferences** — Language, theme (light/dark/auto), timezone, currency
5. **Privacy** — Public profile, DM permissions, activity status, blocked users, delete account

---

### 11. Supporting Pages

**Wishlist** (`/wishlist`) — Grid of saved products, "Remove" and "Add to Cart" per item. Empty state links to products.

**Notifications** (`/notifications`) — List filtered by type (All/Orders/Offers/Messages/System). Each: icon, title, description, timestamp, read/unread toggle, delete. "Clear All" button.

**Deals** (`/deals`) — Grid of discounted products sorted by discount %, newest, or price. Cards show original price (strikethrough), sale price (red), discount badge, time remaining, "Add to Cart".

**Categories** (`/categories`) — Grid of category cards (icon, name, product count, colored bg). Click → `/search?category=...`. Categories: Textbooks, Electronics, Fashion, Room Essentials, Accessories, Food & Snacks, Phones & Tablets, Audio, Sports & Fitness, Art & Design, Music, Photography.

**Search** (`/search`) — Query params: `query`, `category`, `sort`, `minPrice`, `maxPrice`. Filters sidebar (category checkboxes, price range slider, rating, condition), results grid, pagination.

**Help Center** (`/help`) — FAQ accordion sections (General, Buying, Selling, Payment & Delivery, Safety). Search bar. Sub-pages: `/help/selling`, `/help/fees`, `/help/safety`.

**Report** (`/report`) — Report a listing or user.

**Static Pages** — About (`/about`), Careers (`/careers`), Contact (`/contact`), Privacy Policy (`/privacy`), Terms of Service (`/terms`), Cookie Policy (`/cookies`).

---

### 12. Navigation Structure

**Header** (fixed, hides on scroll down, shows on scroll up):
- **Promo banner** (desktop): "Free campus delivery on orders over GH₵100 • Use code CAMPUS10 for 10% off"
- **Left:** Logo → `/`, nav tabs (Products, Stores, Food)
- **Center:** Search bar with autocomplete (Ctrl+K / Cmd+K shortcut)
- **Right:** Theme toggler, university selector, notifications bell (count), wishlist heart (count), cart icon (count), profile dropdown (view/edit profile, seller dashboard, settings, logout)
- **Mobile:** Hamburger → sheet drawer with all links + logout

**Footer** (5 columns):
- **Brand:** Logo, tagline, social icons (Facebook, Twitter, Instagram, YouTube)
- **Marketplace:** Products, Stores, Food & Restaurants, Categories
- **Selling:** Start Selling, Seller Dashboard, Seller Guide, Fees & Pricing
  **Support:** Help Center, Contact Us, Safety Tips, Report Issue
- **Company:** About Us, Careers, Privacy Policy, Terms of Service

---

## Quick Reference for Development

- **Add a new page:** Create `app/<route>/page.tsx` — it's automatically routed.
- **Add a new component:** Place in `components/<domain>/` and import via `@/components/...`.
- **Add a new API call:** Add endpoint to `lib/api/endpoints.ts` → create/extend service in `lib/api/services/` → create React Query hook in `hooks/queries/`.
- **Add a new Zustand store:** Create in `lib/stores/` and re-export from `store/`.
- **Add a shadcn component:** `bunx shadcn@latest add <component>`.
- **Lint:** `bun run lint` (Biome with tab indentation, double quotes).
