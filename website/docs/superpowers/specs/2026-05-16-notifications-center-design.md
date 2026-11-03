# Notifications Center — Design Spec

**Date:** 2026-05-16  
**Status:** Approved  
**Approach:** Option A — Targeted additions (no new providers)

---

## Overview

Three self-contained improvements to the existing notifications infrastructure:

1. **Header bell** — Unread-count badge in the global header linking to `/account/notifications`
2. **Notifications page** — All/Unread tabs + deep-link navigation on click
3. **Notification settings** — Replace the `RouteSkeleton` with real per-type toggles

---

## Architecture

No new providers or context. React Query's shared cache handles cross-component state: when the notifications page marks items as read, it calls `invalidateQueries({ queryKey: notificationKeys.all })`, which automatically re-fetches the header's unread count query — no wiring required.

### Files affected

| File | Change |
|---|---|
| `components/global/header.tsx` | Add Bell icon + unread badge (auth-gated) |
| `app/(pages)/account/notifications/page.tsx` | Add All/Unread tabs + deep-link logic |
| `app/(pages)/account/notifications/settings/page.tsx` | Replace RouteSkeleton with settings form |
| `hooks/queries/use-user.ts` | Add `useNotificationSettings` + `useUpdateNotificationSettings` hooks |

---

## Section 1 — Header Bell

### Behaviour
- Visible only when `isAuthenticated` is true
- Renders a `Bell` icon wrapped in `<Link href="/account/notifications">`
- Shows a red badge with the unread count if `count > 0`
- Badge text: exact count up to 9; "9+" for 10 or more
- Badge is a small absolutely-positioned circle on the top-right of the icon

### Data fetching
- Calls `useNotifications(1, 1, true)` — page 1, limit 1, unreadOnly = true
- Uses `notificationsData?.count` for the total unread count (not `results.length`)
- `staleTime` inherited from the existing hook; no separate polling

### Badge clears automatically
When the user marks notifications as read (on the page), `invalidateQueries` on `notificationKeys.all` re-fetches this query. No additional logic needed.

---

## Section 2 — Notifications Page

### Tab UI
- Two tabs at the top of the list: **All** and **Unread**
- Local `useState<"all" | "unread">` drives the active tab
- Active tab calls `useNotifications(1, 20, tab === "unread")`
- Switching tabs resets to first page

### Deep-link logic

| Notification type | Navigation target | Source field |
|---|---|---|
| `order_update` | `/orders/${id}` | `data?.orderId ?? data?.order_id` |
| `new_message` / `message` | `/messages/${id}` | `data?.conversationId ?? data?.conversation_id` |
| All others | No navigation — mark as read only | — |

### Click behaviour
- If a deep-link target exists: mark as read (fire mutation) then `router.push(target)`
- If no target: mark as read only (same as current behaviour)
- Unread items get `bg-primary/5` highlight; clears once marked read
- No visual change to already-read items on click

### Unread tab empty state
A distinct empty state for the Unread tab: "You're all caught up" with a check-circle icon, separate from the general "No notifications yet" empty state shown on the All tab.

### Out of scope
Pagination / infinite scroll — deferred. The API supports it but is not needed for initial build.

---

## Section 3 — Notification Settings

### Page structure
- Fetches settings on mount via `useNotificationSettings`
- Skeleton rows shown while loading (matching the toggle layout)
- Five toggle rows, each with a label + short description + `Switch` component

| Label | Description | API field |
|---|---|---|
| Order updates | Get notified when your order status changes | `orderUpdates` |
| Messages | Get notified when you receive a new message | `newMessages` |
| Promotions | Receive promotional offers and deals | `promotions` |
| Price drops | Be alerted when saved items drop in price | `priceDrops` |
| New followers | Know when someone starts following your store | `newFollowers` |

### Save behaviour
- Individual save on toggle change — no "Save" button
- Optimistic update: switch flips immediately; reverts on error
- Error: revert the toggled field to its previous value (no toast needed — the revert is self-explanatory)

### Channel controls
Email, push, and SMS toggles are deferred — not shown in this build.

### New hooks (in `hooks/queries/use-user.ts`)

```ts
useNotificationSettings()   // GET /notifications/settings/
useUpdateNotificationSettings()  // PUT /notifications/settings/ with Partial<NotificationSettings>
```

`useUpdateNotificationSettings` uses `onMutate` for optimistic update and `onError` to rollback via `queryClient.setQueryData`.

---

## Error handling

| Scenario | Handling |
|---|---|
| Settings fetch fails | Show error message with retry button |
| Settings update fails | Revert toggle to previous state (optimistic rollback) |
| Notifications fetch fails | Existing error boundary / React Query default |
| Mark-as-read fails | Silent fail — already caught by existing mutation handlers |

---

## Out of scope

- Notification bell dropdown panel (user chose link-only)
- Channel toggles (email/push/SMS) in settings
- Pagination / infinite scroll on the list
- Real-time/push notifications (WebSocket or SSE)
