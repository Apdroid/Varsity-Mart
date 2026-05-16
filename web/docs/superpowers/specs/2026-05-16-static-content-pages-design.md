# Static & Content Pages — Design Spec

**Date:** 2026-05-16  
**Status:** Approved  
**Pages covered:** `/about`, `/contact`, `/terms`, `/privacy`, `/cookies`, `/careers`, `/download`, `/help`, `/help/fees`, `/help/safety`, `/help/selling`, `/report`

---

## Overview

All static content pages. No API calls except `/contact` and `/report` (form submissions). All pages render as **Server Components** (no `"use client"`) unless a form requires interactivity.

Common layout: full-width hero/header section, centered `max-w-3xl` content body.

---

## Page 1 — About (`/about`)

### Sections
1. **Hero** — "The campus marketplace built for students" headline. One-line sub: "Buy, sell, and order food — all in one place at KNUST."
2. **How it works** — Three horizontal cards:
   - Shop: browse products and stores from fellow students
   - Sell: list your items and reach buyers on campus
   - Eat: order food from campus restaurants
3. **Our mission** — 2–3 short paragraphs on why VarsityMart exists (campus commerce, safety, convenience)
4. **By the numbers** — Simple stat row: "X sellers", "X products", "X orders" — static placeholder numbers until an analytics endpoint exists
5. **Footer CTA** — "Ready to join? Create an account" → `/register`

---

## Page 2 — Contact (`/contact`)

### Sections
1. **Header** — "Get in touch"
2. **Contact channels** (3 cards):
   - Email: support@varsitymart.com (or actual address)
   - Response time: "Usually within 24 hours"
   - Social links (Twitter/X, Instagram — if applicable)
3. **Contact form** (client component):
   - Name, Email, Subject (select: General, Order issue, Seller support, Bug report, Other), Message (textarea)
   - Submit → `mailto:support@varsitymart.com?subject=...&body=...` (simple, no backend needed)
   - On submit: show "Thanks, we'll be in touch!" confirmation state

---

## Page 3 — Terms of Service (`/terms`)

### Structure
- Last updated date at top
- Numbered sections (1–10ish):
  1. Acceptance of Terms
  2. User Accounts
  3. Marketplace Rules (buyer/seller obligations)
  4. Payments & Escrow
  5. Prohibited Items
  6. Intellectual Property
  7. Liability Limitations
  8. Dispute Resolution
  9. Termination
  10. Changes to Terms
- Short, plain-language paragraphs per section
- "Contact us" link at bottom → `/contact`

---

## Page 4 — Privacy Policy (`/privacy`)

### Structure
- Last updated date
- Sections:
  1. What data we collect (name, email, phone, payment info, usage data)
  2. How we use it (service delivery, fraud prevention, communications)
  3. Who we share it with (payment processors, delivery partners)
  4. Your rights (access, deletion, correction)
  5. Data retention
  6. Ghana Data Protection Commission compliance note
  7. Contact for privacy requests → `/contact`

---

## Page 5 — Cookie Policy (`/cookies`)

### Structure
- 4 sections:
  1. What are cookies
  2. Cookies we use (essential, analytics, preferences)
  3. How to manage cookies (browser settings)
  4. Contact → `/contact`
- Short page, minimal content

---

## Page 6 — Careers (`/careers`)

### Content
- Header: "Join the VarsityMart team"
- Brief company description: "We're a small, ambitious team building the future of campus commerce in Ghana"
- **If no open roles:** "We don't have open positions right now, but we're always looking for talented people. Send your CV to careers@varsitymart.com"
- **Roles section** (static list, updated manually when needed):
  - Role card: title, type (full-time/part-time/contract), location (Remote / Kumasi), brief description, "Apply" → mailto
- Footer: "We're student-friendly — internships and part-time roles available"

---

## Page 7 — Download (`/download`)

### Content
Centered layout:
- VarsityMart logo
- "Get the app" headline
- "Coming soon to iOS and Android" — if app not yet published
- Email waitlist form (name + email → `mailto:` or store in a simple form endpoint): "Be the first to know when the app launches"
- "In the meantime, use our web app" → `/`

If apps are published: replace with real App Store / Play Store badges and links.

---

## Page 8 — Help Hub (`/help`)

### Layout
- Search bar at top (client component — filters the help topics below, client-side only)
- Three category sections with link cards:

**Buying**
- How to place an order
- Delivery and pickup options
- Returns and refunds
- Payment methods

**Selling**
- How to become a seller → `/help/selling`
- Fees and commissions → `/help/fees`
- Managing your store
- Payouts

**Safety**
- Staying safe on VarsityMart → `/help/safety`
- Reporting an issue → `/report`
- Escrow explained

Each card: icon, title, one-line description, arrow → the relevant page.

---

## Page 9 — Fees Help (`/help/fees`)

### Content
| Fee | Amount | Notes |
|---|---|---|
| Listing fee | Free | No charge to list products |
| Platform / service fee | 2% of order value | Charged to buyer at checkout |
| Campus delivery fee | GHS 5.00 | Buyer pays; seller does not absorb |
| Pickup | Free | No delivery fee |
| Payout fee | None (yet) | Bank transfer fees may apply by your bank |

Explanatory paragraphs below the table:
- How escrow works (funds held until buyer confirms delivery)
- When sellers get paid
- "Questions about fees?" → `/contact`

---

## Page 10 — Safety Help (`/help/safety`)

### Sections
1. **For buyers**: Verify the seller's rating, use escrow (never pay outside VarsityMart), meet in safe campus locations for pickup, report suspicious listings
2. **For sellers**: Don't share personal bank details in chat, use the platform's built-in payment system, report unresponsive or abusive buyers
3. **Escrow explained**: How funds are held until delivery confirmation, what happens in disputes
4. **Report a problem** → `/report`

---

## Page 11 — Selling Guide (`/help/selling`)

### Sections — step-by-step numbered flow
1. Apply to become a seller → `/seller/become`
2. Wait for KYC approval (1–2 business days)
3. Create your store or restaurant → `/seller/store/create`
4. List your products with photos, descriptions, and prices
5. Receive orders and fulfill them (deliver or set pickup)
6. Buyer confirms delivery → funds released from escrow to your balance
7. Request a payout to your bank account

Each step: icon, bold title, 2–3 sentence description.

Footer CTA: "Ready? Apply now" → `/seller/become`

---

## Page 12 — Report Issue (`/report`)

### Client component (form)

Fields:
1. **Issue type** (Select):
   - Scam / fraud
   - Abusive content or user
   - Counterfeit or prohibited item
   - Order dispute
   - Technical bug
   - Other
2. **Description** — textarea (min 20 chars), "Please describe what happened"
3. **Your email** — pre-filled from auth if logged in, editable
4. **Order / listing ID** — optional text field, "Include if relevant"

Submit → `mailto:report@varsitymart.com?subject=Issue Report: [type]&body=[description]`

On submit: show confirmation state "Your report has been received. We'll review it within 24 hours."

### Note
If a dedicated report API endpoint exists in the future, swap the mailto for a real POST — the form shape doesn't change.

---

## Implementation Notes

- All pages are Server Components except `/contact` and `/report` (client, for forms)
- No new hooks needed
- Content is hardcoded — no CMS
- Use consistent heading hierarchy (`h1` → page title, `h2` → section, `h3` → sub-section)
- Prose content rendered with `prose` Tailwind class for consistent typography
