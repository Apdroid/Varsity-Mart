# VarsityMart — web app

Campus marketplace for tertiary students and vendors in Ghana: buy and sell products, order food from campus restaurants, chat with sellers, and manage a store or restaurant. This is the Next.js front end. The backend is a separate service (Django REST + Channels) at `https://api.varsitymart.org`.

## Quick start

Requirements: [Bun](https://bun.sh) 1.4+ (the package manager used here) and Node 20.9+.

```bash
bun install
cp .env.example .env     # then fill in the values (see below)
bun dev                  # http://localhost:3000
```

### Environment variables

All three are public (`NEXT_PUBLIC_*` values are shipped to the browser). Never put a secret in one.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL including `/v1`. The browser calls the API directly; there is no proxy. |
| `NEXT_PUBLIC_WS_URL` | WebSocket host for chat, without a path (the app appends `/ws/chat/{id}/`). |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client id for "Continue with Google". |

### Scripts

| Command | What it does |
|---|---|
| `bun dev` | Dev server (Turbopack) |
| `bun run build` / `bun start` | Production build / serve it |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | ESLint (v9; `eslint-plugin-react` does not support ESLint 10 yet) |
| `bun run test` | Vitest (`test:watch` for watch mode) |
| `bun run gen:api` | Regenerate `lib/api/schema.d.ts` from `openapi/varsitymart_api.json` |
| `bun run sync:api` | Download the latest schema from the backend, then regenerate types |

CI (`.github/workflows/ci.yml`, at the repository root) runs install, typecheck, lint, test and build on every push and pull request. Run the same four commands locally before opening a PR.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui (`components/ui`) · TanStack Query v5 · react-hook-form + zod · Zustand (food cart only) · `@react-oauth/google` · sonner · Vitest.

## Project layout

```
app/
  (auth)/         login, register, verify-email, forgot/reset-password, complete-profile
  (marketing)/    public site: (main) pages, (checkout), (static) help/terms/privacy
  (chat)/         messages
components/       feature folders (auth, cart, global, main, products, restaurants, search, stores, …)
  ui/             shadcn primitives + small shared pieces such as form-error
hooks/            use-chat-socket, use-campus-scope, small utilities
  queries/        one file per API area: query keys + useQuery/useMutation hooks
lib/
  api/            fetch client, one module per API area, hand-written types.ts, generated schema.d.ts
  auth/, validation/, user-location.ts
providers/        QueryProvider, AuthProvider, AuthGateProvider, CampusProvider
store/            cart-store.ts (Zustand, food cart)
openapi/          backend OpenAPI schema (source for generated types)
docs/             sitemap.md and design specs/plans
```

`docs/sitemap.md` lists every route. `.impeccable.md` holds the design brief (brand personality, principles).

## How things work

**API client** (`lib/api/client.ts`). A thin `fetch` wrapper with `credentials: "include"`. Auth is httpOnly JWT cookies set by the backend. On a 401 it calls `/auth/refresh-token/` once (concurrent calls share one refresh) and retries. **Endpoints must end with a trailing slash**: the backend redirects slash-less URLs with a 301, which turns a POST/PATCH into a bodyless GET.

**Data fetching.** Components never call `fetch` directly. Each API area has a module in `lib/api/` and a hook file in `hooks/queries/` that exports a query-key factory (`productKeys`, `storeKeys`, …) and hooks. Defaults live in `providers/query-provider.tsx` (5 min stale, no refetch on window focus). The home, products, stores and restaurants pages prefetch on the server and hydrate the client cache, so server prefetch keys must match the hook keys exactly.

**Auth and profile gate.** `AuthProvider` loads the session and exposes `useAuth()`. `ProfileGate` (in the root layout) redirects signed-in users with an incomplete profile (phone, institution or campus missing; logic in `lib/auth/profile.ts`) to `/complete-profile`, and keeps signed-in users off the login/register pages. The React Query cache is cleared on every login, register, Google sign-in and logout so one user never sees another's cached data.

**Campus scoping.** Listings (products, stores, restaurants, featured, search) are filtered by campus. `CampusProvider` holds the campus (the signed-in user's profile, or a guest's pick stored in `localStorage`). `useCampusScope()` returns `{ campus, ready }`; the listing hooks add `campus` to the request and to the query key, and wait for `ready`. Any new listing hook should do the same, or cached results will leak between campuses.

**Chat** (`hooks/use-chat-socket.ts`). WebSocket first (`/ws/chat/{conversationId}/`); if it cannot connect it falls back to HTTP polling through React Query. Connection flags are derived from whichever transport is active.

**Forms and errors.** Forms use react-hook-form + zod. Show submit/server errors inline with `components/ui/form-error` placed directly above the submit button, not in a toast; toasts are for confirmations. The global toaster is top-center.

**Styling.** Tailwind v4 with design tokens in `app/globals.css` (`--vm-tangerine`, `--vm-graphite`, `--vm-platinum`, …). Add shadcn components with `bunx shadcn@latest add <name>`.

**Types and the API schema.** `lib/api/types.ts` is hand-written; `lib/api/schema.d.ts` is generated from the backend OpenAPI schema (`bun run sync:api`). Prefer the generated types for new code. Do not edit `schema.d.ts`; it is excluded from lint.

## Testing

Vitest runs in a plain Node environment and covers pure logic (query-string building, campus scoping, profile-completeness, location helpers). There are no component or end-to-end tests yet; adding React Testing Library for the auth forms and Playwright for sign-in → browse → checkout would be the next step.

## Known issues and open work

Things the previous maintainer knows about and has not fixed:

- **Five client calls do not match the backend schema** and need a signed-in request or a word with the backend owner: `GET /auth/become-a-seller/` (schema has only POST), `GET /food-orders/restaurant-orders`, `GET /orders/seller-orders/`, `GET /restaurants/my-restaurant/dashboard/` (schema has `/restaurants/{id}/dashboard/`), and the `fields` query on `GET /users/{id}`.
- **`GET /users/me/` has no response schema** in the OpenAPI file, so the `User` type is hand-written and unverified.
- **`/products/trending/` returns a 500** on the backend (the client no longer calls it).
- **Lint warnings (10):** three `<img>` tags in order pages, three `exhaustive-deps`, plus two react-hook-form compiler notes. Unused code: `AnnouncementBar` in `components/global/header.tsx` and `handleAddToCart` in `components/main/product-card.tsx`.
- **Caching:** the home, products, stores and restaurants pages use `force-dynamic` and fetch uncached on the server; a short `revalidate` for public data would cut backend load.
- **Images:** about 19 `fill` images on seller, cart and detail pages have no `sizes` attribute.
- **`components/global/header.tsx` is over 1,000 lines** and mixes desktop, mobile, notifications and search; worth splitting.
- **Placeholders:** the hero uses Unsplash images, and some seller features show "coming soon" (payment methods, payouts, restaurant cart).
- **Deployment** is not described in this repository (no Vercel/Docker config). Confirm the hosting setup and environment variables with the previous maintainer.

## Accessibility notes

- Text on the tangerine background uses `--vm-tangerine-foreground` / `--primary-foreground` (graphite, about 6.8:1). Do not put white text on `bg-vm-tangerine` or `bg-primary`.
- Orange used as *text* on a white background (`text-vm-tangerine`) is about 2.9:1, below WCAG AA for body text; use it only for large or decorative text.
- Auto-advancing slideshows must stay pausable and must not autoplay when `prefers-reduced-motion` is set (see `AutoplayToggle` and `usePrefersReducedMotion`).
- Many icon buttons are 24-32px; prefer 44px tap targets for primary actions on mobile.

## Contributing

1. Branch from `super` (the default branch).
2. `bun run typecheck && bun run lint && bun run test && bun run build` should all pass.
3. Keep server prefetch keys, hook query keys and any new listing hook's campus scoping consistent (see above).
4. Commit messages: short imperative summary, with a body explaining why when it is not obvious.
