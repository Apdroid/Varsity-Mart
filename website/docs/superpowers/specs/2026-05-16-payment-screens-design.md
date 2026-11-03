# Payment Screens — Design Spec

**Date:** 2026-05-16  
**Status:** Approved  
**Pages covered:** `/cart`, `/account/payments`, `/payments/verify`, `/seller/dashboard/payouts`

---

## Overview

Four payment-related pages. `/cart` replaces a RouteSkeleton. The other three are new routes that expose payment-method management, Paystack verification, and seller escrow/payouts — all backed by existing API endpoints that have no frontend yet.

---

## New API Client Required

Create `lib/api/payments.ts` with `paymentsApi`:

```ts
paymentsApi.methods.list()                         // GET /v1/payments/methods/
paymentsApi.methods.add(data)                      // POST /v1/payments/methods/  (MoMo)
paymentsApi.methods.remove(methodId)               // DELETE /v1/payments/methods/{methodId}/
paymentsApi.methods.setDefault(methodId)           // PATCH /v1/payments/methods/{methodId}/
paymentsApi.verify(reference)                      // GET /v1/payments/{reference}/verify/
paymentsApi.escrowBalance()                        // GET /v1/payments/escrow/balance/
paymentsApi.banks()                                // GET /v1/payments/banks/
paymentsApi.requestPayout(data: PayoutRequest)     // POST /v1/payments/payout/
```

New query hooks in `hooks/queries/use-payments.ts`:
- `usePaymentMethods()` / `useAddPaymentMethod()` / `useRemovePaymentMethod()` / `useSetDefaultPaymentMethod()`
- `useVerifyPayment(reference)` — enabled only when reference is present
- `useEscrowBalance()`
- `useBanks()`
- `useRequestPayout()`

---

## Page 1 — Cart (`/cart`)

### Auth
- Auth-loading → full-page spinner
- Unauthenticated → centered card with lock icon, "Sign in to view your cart", link to `/login?redirect=/cart`

### Empty state
- Cart icon, "Your cart is empty", "Browse Products" CTA → `/products`

### Cart list (authenticated, has items)
Two-column layout on desktop (list left, summary right sticky):

**Left — Item list:**
Each item row:
- Product thumbnail (64×64, fallback `ImageIcon`)
- Product name (linked to `/products/[id]`) — truncated to 2 lines
- Unit price in GHS
- Quantity control: `−` button / number display / `+` button
  - `−` at quantity 1 → shows "Remove?" confirmation popover or just removes
  - Uses `useUpdateCartItem` (optimistic) for quantity changes
  - Uses `useRemoveFromCart` (optimistic) for removal
- Line subtotal (right-aligned)
- "Remove" button (trash icon, subtle)

"Clear cart" text link below the list (uses `useClearCart`, confirms with a dialog).

**Right — Order summary:**
- Subtotal
- Delivery fee: "Calculated at checkout"
- Service fee: "2% applied at checkout"
- **Total**: subtotal only (delivery/service shown at checkout)
- "Proceed to Checkout" button → `/checkout`
- "Continue Shopping" text link → `/products`

### Quantity edge cases
- If item `inStock: false` → dim the row, show "Out of stock" badge, disable `+`
- Max quantity not enforced client-side (server validates)

### Loading state
- Skeleton rows (3) while cart fetches

---

## Page 2 — Payment Methods (`/account/payments`)

**New route.** Add to `app/(pages)/account/payments/page.tsx`.

### Layout
Standard account sub-page: back link to `/account`, title "Payment Methods", settings gear icon linking to future `/account/payments/settings`.

### Method list
Each row:
- Left: icon (Smartphone for MoMo, CreditCard for card, Building2 for bank)
- Provider label + masked identifier (e.g., "MTN MoMo · ••• 4567")
- "Default" badge if `isDefault: true`
- Right actions: "Set default" (hidden if already default) | "Remove"

Set default → `useSetDefaultPaymentMethod` mutation, optimistic update.  
Remove → confirmation dialog → `useRemovePaymentMethod`.

### Add method dialog
Trigger: "Add payment method" button (top-right or bottom of list).

Dialog has two tabs: **Mobile Money** | **Card**

**MoMo tab:**
- Network selector (MTN / Vodafone / AirtelTigo — pill toggles)
- Phone number field with +233 prefix
- "Add" button → `useAddPaymentMethod`

**Card tab:**
- Informational text: "Card payments are processed securely via Paystack. You'll be redirected to add your card."
- "Continue to Paystack" button → initiates a zero-amount card-save flow (or notes this for future implementation)

### Empty state
Wallet icon, "No payment methods saved", "Add your first method" CTA opens dialog.

---

## Page 3 — Payment Verify (`/payments/verify`)

**New route.** Add to `app/(pages)/payments/verify/page.tsx`.

### Entry
Paystack redirects here with `?reference=xxx&trxref=xxx` query params.

### States

**Verifying (loading):**
- Centered spinner + "Verifying your payment…"
- `useVerifyPayment(reference)` fires automatically

**Success:**
- Green check circle
- "Payment confirmed!"
- Order details: order ID, amount paid (from verify response)
- "View your order" → `/orders/[orderId]`
- "Continue shopping" → `/products`

**Failed:**
- Red X circle
- "Payment could not be verified"
- Error message from API response
- "Try again" → back to `/checkout`
- "Contact support" → `/contact`

**No reference (direct navigation):**
- Redirect to `/` immediately

### Data
Verify response should include `{ success, orderId, amount, status }`. If the API doesn't return orderId directly, the page links to `/orders` (all orders).

---

## Page 4 — Seller Payouts (`/seller/dashboard/payouts`)

**New route.** Add to `app/(pages)/seller/dashboard/payouts/page.tsx`.

### Auth/role guard
Redirect non-sellers to `/seller/status`.

### Escrow balance section
Three stat cards in a row:
| Label | Field | Color |
|---|---|---|
| Available to withdraw | `available` | Green |
| Pending (in escrow) | `pending` | Amber |
| Total earned | `total` | Default |

Amounts formatted as GHS.

### Payout request form
Below the balance cards. Shown only if `available > 0`; otherwise "No funds available to withdraw" notice.

Fields:
1. **Amount** — number input, max = `available`, min = GHS 10 (platform minimum)
2. **Bank** — searchable select from `useBanks()`, displays bank name
3. **Account number** — text input (10–13 digits)
4. **Account name** — text input (recipient's full name)

Submit → `useRequestPayout`. On success: toast "Payout request submitted. Processing takes 1–3 business days." and reset form.

### Payout history
Deferred — no list endpoint identified yet. Placeholder "Payout history coming soon" below the form.

---

## Error handling

| Scenario | Handling |
|---|---|
| Cart update fails | Optimistic rollback (already in hooks) |
| Remove payment method fails | Toast error, revert list |
| Payment verify returns failure | Failure state UI (not error boundary) |
| Escrow fetch fails | Retry button + error message |
| Payout request fails | Toast with API error message |

---

## Out of scope
- Card tokenization via Paystack (future)
- Payout history list (no API endpoint)
- Split payments / multiple payment methods per order
