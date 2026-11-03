# Product-Attached Conversations & Discount Offers — Feature Spec

**Date:** 2026-05-16
**Status:** Draft — for backend review
**Requested by:** Eysteix

---

## Overview

Two related features:

1. **Product-attached conversations** — When a buyer messages a seller from a product page, the product (name, image, price) is embedded in the conversation thread so both parties always know what is being discussed.

2. **Discount offer flow** — The seller can propose a discounted price within the conversation. The buyer receives it and can accept or decline. If accepted, the offer is redeemed at checkout.

---

## Part 1 — Product-Attached Conversations

### Current state (frontend)

The frontend already:
- Passes `product_id` in `StartConversationRequest` when opening a conversation from a product page
- Has `product?: { id, title, price, image? }` on the `Conversation` type
- Has `product?: { id, title, price, firstImageUrl? }` on the `Message` type
- Shows the product card (image + title + price) inside the compose dialog before sending

The message thread UI (`/messages/[id]`) should render a pinned product card at the top of the thread (if the conversation has a linked product) showing thumbnail, title, and current listed price with a "View listing" link.

### Backend requirements

| Endpoint | Change needed |
|---|---|
| `GET /conversations/` | Return `product.image` (thumbnail URL) on each conversation item — currently may be missing |
| `GET /conversations/:id/messages/` | Return `product.firstImageUrl` on the first message if `product_id` was attached |
| `POST /conversations/start/` | Already accepts `product_id` — confirm it is saved and returned on subsequent GETs |

### Frontend work (already done)

- Compose dialog now shows product image, name, and price before the user sends
- `thumbnail_url` is used instead of full `url` for the image

---

## Part 2 — Discount Offer Flow

### User stories

**Seller:**
> I'm chatting with a buyer about my product. I want to offer them a lower price to close the sale. I tap "Make offer" inside the conversation, enter a discounted price, and send it. The buyer sees a special offer card in the thread.

**Buyer:**
> I see the seller's offer card — it shows the original price, the offered price, and an expiry time. I tap "Accept" and the discount is automatically applied when I go to checkout. Or I tap "Decline" to reject it.

---

### New message type: `offer`

Extend the `Message` model with an optional `offer` field. A message of type `offer` renders as a special card, not a text bubble.

```json
{
  "id": "msg_abc",
  "sender_id": "seller_xyz",
  "type": "offer",
  "text": "",
  "offer": {
    "id": "offer_123",
    "product_id": "prod_456",
    "product_title": "Maybe thought choose ability",
    "product_image": "https://...",
    "original_price": "9523.00",
    "offered_price": "7000.00",
    "currency": "GHS",
    "status": "pending",
    "expires_at": "2026-05-17T12:00:00Z"
  },
  "timestamp": "2026-05-16T10:00:00Z"
}
```

`offer.status` values: `pending` | `accepted` | `declined` | `expired`

---

### New API endpoints

#### Send an offer
```
POST /conversations/:conversationId/offer/
```
Request body:
```json
{
  "product_id": "prod_456",
  "offered_price": 7000.00,
  "expires_in_hours": 24
}
```
- Only the conversation's other-party seller can create an offer
- Returns the new `Message` object (with `type: "offer"` and `offer` populated)
- Creates a notification for the buyer

#### Respond to an offer
```
POST /offers/:offerId/respond/
```
Request body:
```json
{ "action": "accept" }
```
or
```json
{ "action": "decline" }
```
- Only the buyer (non-sender) can respond
- `accept` transitions `status` → `accepted` and creates a single-use discount code tied to the buyer + product
- `decline` transitions `status` → `declined`
- Returns the updated `offer` object

#### Get offer (for checkout redemption)
```
GET /offers/:offerId/
```
Returns the offer with current status. Used by the frontend at checkout to verify the offer is still `accepted` before applying it.

---

### Discount code / checkout integration

When a buyer accepts an offer:
1. Backend creates a short-lived discount record: `{ buyer_id, product_id, offered_price, single_use: true, expires_at }`
2. Frontend receives the `offer.id` from the accepted response
3. On the product detail page / cart, if an accepted offer exists for the product, the price shown to that buyer reflects the offered price
4. At checkout, the offer `id` is passed as `offer_id` in the order creation request — backend validates it (not expired, not already used, buyer matches) and applies the price

**Suggested addition to order creation request:**
```json
{
  "items": [...],
  "offer_id": "offer_123"
}
```

---

### Offer expiry

- Default expiry: 24 hours from creation (configurable per offer)
- A scheduled job (or lazy check on GET) transitions `pending` offers past `expires_at` to `expired`
- Expired offers cannot be accepted

---

### Notifications

| Event | Who gets it | Channel |
|---|---|---|
| Offer sent | Buyer | In-app notification + push |
| Offer accepted | Seller | In-app notification + push |
| Offer declined | Seller | In-app notification |
| Offer expired (unresponded) | Both | In-app notification |

---

### Frontend changes needed (post-backend)

| Component | Change |
|---|---|
| Message thread (`/messages/[id]`) | Render `OfferCard` for messages with `type: "offer"` — shows original price, offered price, expiry countdown, and Accept/Decline buttons (buyer only) |
| Message composer | Add "Make offer" button (seller only, when conversation has a linked product) — opens a price input sheet |
| Product detail page | Show "You have an accepted offer — GHS X" banner if an unredeeemed accepted offer exists |
| Cart / checkout | Pass `offer_id` when present; display discounted price |

---

### Constraints & edge cases

- A seller can only have **one active (pending/accepted) offer per conversation** at a time
- If the product is sold before the buyer accepts, the offer is invalidated
- The offered price must be lower than the current listed price (backend validation)
- Offers are scoped to a specific buyer — the discounted price is not visible to others
