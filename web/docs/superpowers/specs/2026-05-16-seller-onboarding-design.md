# Seller Onboarding — Design Spec

**Date:** 2026-05-16  
**Status:** Approved  
**Pages covered:** `/sell`, `/seller/become`, `/seller/status`

---

## Overview

Three pages that guide a user from "I want to sell" through KYC submission to approval tracking. The flow is linear: `/sell` → `/seller/become` → `/seller/status`. Existing API endpoints: `GET /auth/seller-status/`, `GET /auth/check-status/`, `POST /auth/become-a-seller/`.

---

## Data / Hooks Needed

No new API client needed — auth.ts likely already has `becomeASeller`. Confirm and add if missing:

```ts
authApi.sellerStatus()       // GET /v1/auth/seller-status/  → SellerStatus
authApi.checkStatus()        // GET /v1/auth/check-status/   → { kycStatus, ...}
authApi.becomeASeller(data)  // POST /v1/auth/become-a-seller/
```

New hooks in `hooks/queries/use-auth.ts` (or `use-seller.ts`):
- `useSellerStatus()` — fetches SellerStatus
- `useKycStatus()` — fetches user's `kycStatus` from `/auth/check-status/`
- `useBecomeASeller()` — mutation for KYC submission

---

## Page 1 — Sell Entry (`/sell`)

### Purpose
Smart gate: route the user to the right next step based on their current state.

### Logic (client component)

```
unauthenticated         → show pitch + "Sign in to sell" CTA
authenticated, seller   → redirect("/seller/dashboard")
authenticated, not seller, kycStatus = not_submitted → show pitch + "Apply to sell" CTA → /seller/become
authenticated, not seller, kycStatus = pending/approved/rejected → redirect("/seller/status")
```

### Pitch content (for unauthenticated or not-yet-applied users)
Three horizontal feature cards:
1. **List anything** — Products, food, or run a store. No listing fee.
2. **Secure payments** — Escrow holds funds until buyers confirm delivery.
3. **Campus reach** — Sell directly to students at KNUST and beyond.

Primary CTA button:
- Unauthenticated: "Sign in to start selling" → `/login?redirect=/sell`
- Not-applied: "Apply to become a seller" → `/seller/become`

---

## Page 2 — Become a Seller (`/seller/become`)

### Guard
If `kycStatus !== "not_submitted"` → redirect to `/seller/status`.

### Three-step wizard

Progress indicator at top: step dots or numbered pills (1 → 2 → 3).

**Step 1 — Identity**
- First name, last name (pre-filled from `useCurrentUser`, read-only)
- Email (pre-filled, read-only)
- Phone number — editable if missing from profile, required
- Short "Why we need this" explanation copy

**Step 2 — ID Document**
- Document type selector: `<Select>` with options:
  - Ghana National ID (NIA)
  - Passport
  - Driver's License
  - NHIS Card
- File upload area (drag-and-drop or click): front of selected document
  - Accepted: JPEG, PNG, PDF — max 5 MB
  - Preview thumbnail after selection
  - Error if file too large or wrong type

**Step 3 — Selfie**
- File upload (same constraints as Step 2)
- "Hold your ID next to your face" instruction copy
- Preview after selection

### Navigation
- "Back" button (except on Step 1)
- "Continue" button advances step (validates current step fields before proceeding)
- "Submit Application" button on Step 3

### Submission
`useBecomeASeller` mutation. Sends multipart form data: `{ documentType, documentFile, selfieFile, phone? }`.

On success → navigate to `/seller/status`.  
On error → show error toast, stay on Step 3.

### Loading state
Full-page spinner with "Submitting your application…" while mutation is pending.

---

## Page 3 — Seller Status (`/seller/status`)

### Guard
If `kycStatus === "not_submitted"` → redirect to `/seller/become`.

### Layout
Centered card, max-w-lg. Status shown as a vertical timeline with four nodes.

### State rendering

**`pending`**
- Timeline: ✓ Submitted → ⏳ Under review (pulsing) → ○ Approved → ○ Store setup
- Copy: "Your application is under review. This typically takes 1–2 business days."
- No CTA, just a "Questions? Contact support" link

**`approved`**
- Timeline: ✓ Submitted → ✓ Under review → ✓ Approved → → Store setup
- Copy: "You're approved! Create your store to start selling."
- Primary CTA: "Create your store" → `/seller/store/create`
- Secondary CTA (if `hasRestaurant` could apply): "Set up a restaurant" → `/seller/restaurant/create`

**`rejected`**
- Timeline: ✓ Submitted → ✗ Rejected
- Rejection reason card: `kycApplication.rejectionReason` text
- Copy: "Your application was not approved. Please review the reason above and resubmit."
- Primary CTA: "Resubmit application" → `/seller/become` (guard bypassed for resubmission)
- "Contact support" link

### Data
Fetch both `useSellerStatus()` and `useKycStatus()` in parallel. Show skeleton while loading.

---

## Error handling

| Scenario | Handling |
|---|---|
| KYC submit fails (network) | Toast error, stay on Step 3 |
| KYC submit fails (validation, e.g., document unreadable) | API error message shown below form |
| Status fetch fails | Error card with retry button |
| File too large / wrong type | Inline field error below upload area |

---

## Out of scope
- Re-upload individual documents (resubmission resets the whole flow)
- Seller tier / trust score display
- Email notifications for status changes (backend-triggered)
