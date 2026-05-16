# Wishlist & Categories — Design Spec

**Date:** 2026-05-16  
**Status:** Approved  
**Pages covered:** `/account/wishlist`, `/categories`

---

## Page 1 — Wishlist (`/account/wishlist`)

### Background — API Gap

The API exposes `POST /v1/products/{id}/like/` and `DELETE /v1/products/{id}/like/` to toggle likes, and `isLiked` on single product detail responses. There is **no "get all liked products" list endpoint**.

**Backend endpoint needed (spec for backend team):**
```
GET /v1/products/liked/
```
Response: `PaginatedList<Product>` — same shape as the products list endpoint, filtered to the authenticated user's liked products. Requires auth.

**Frontend approach until the endpoint ships:**
Use a Zustand store (persisted to localStorage) that stores liked product card data. When a user likes a product (from any card or detail page), the product's card data is saved to the store. Unliking removes it. This is already partially in place via `useLikeProduct` / `useUnlikeProduct` — extend those mutations to update the Zustand store as a side effect.

When the backend endpoint ships, replace the Zustand source with a `useWishlist()` React Query hook — the page component stays unchanged because it will consume the same data shape.

### Auth
- Auth-loading → spinner
- Unauthenticated → redirect to `/login?redirect=/account/wishlist`

### Empty state
Heart icon, "Nothing saved yet", "Browse products to save items you love" copy, "Browse Products" CTA → `/products`.

### Wishlist grid
Same grid layout as the products page: responsive 2–4 column grid.

Each item: standard `<ProductCard>` component (already exists). The unlike button on each card removes it from the store immediately (optimistic). Call `useUnlikeProduct` in the background.

### Sort / filter
Deferred — wishlist is small enough that sorting is low value now.

### Header
Back link to `/account`. Title "Wishlist". Item count subtitle ("12 saved items").

---

## Page 2 — Categories (`/categories`)

### Layout
Full-width page. Header: "Browse Categories". Three tabs below: **Products** | **Stores** | **Food**.

### Tab content — Products
Fetches `useProductCategories()`. Grid of category cards (2 cols mobile, 3 tablet, 4 desktop).

Each card:
- Category icon or image (if available from API, else a placeholder icon per category)
- Category name
- Subtle hover effect (scale-up or border highlight)
- Click → `/products?category=[id]`

### Tab content — Stores
Fetches `useStoreCategories()`. Same grid layout.
Click → `/stores?category=[id]`

### Tab content — Food
Fetches `useRestaurantCategories()`. Same grid layout.
Click → `/restaurants?category=[id]`

### Loading state
Skeleton grid (8 placeholder cards) while fetching.

### Empty state (unlikely but handled)
"No categories found" with a refresh button.

### Navigation
Tab state kept in URL: `/categories?tab=stores` so the browser back button and direct links work.

---

## New Zustand Store (for wishlist)

Add `store/wishlist-store.ts`:

```ts
interface WishlistStore {
  items: ProductCard[]           // ProductCard = minimal product shape for display
  addItem: (product: ProductCard) => void
  removeItem: (productId: string) => void
  hasItem: (productId: string) => boolean
  clear: () => void
}
```

Persisted to localStorage via `zustand/middleware` `persist`. Key: `vm-wishlist`.

Integrate into `useLikeProduct` and `useUnlikeProduct` mutations' `onSuccess` callbacks.

---

## Error handling

| Scenario | Handling |
|---|---|
| Categories fetch fails | Error message + retry button |
| Unlike fails | Wishlist store item stays removed (optimistic); toast error if server unlike fails |
| localStorage unavailable | Wishlist store falls back to in-memory (no crash) |
