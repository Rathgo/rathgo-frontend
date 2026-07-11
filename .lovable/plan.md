# RATHGO — Real API Integration, Booking Flow Rebuild, and Admin Panel

This is a large three-part build. Before I start, a few clarifications so the result is right on the first pass.

## Questions I need answered

1. **API base URL for now.** For the env var `VITE_API_BASE_URL`, do you want me to default it to `https://api.rathgo.com` (production per your reference) or `http://localhost:4000` for dev? I'll add both to `.env.example` either way — I just need to know which to bake into the current preview so screens actually load data now vs. after you set a secret.
2. **Cashfree environment.** Cashfree's Drop-in SDK needs a mode (`"sandbox"` or `"production"`). I'll expose it as `VITE_CASHFREE_MODE` — should the current preview default to `sandbox`?
3. **Admin route protection.** The reference says admin auth is a short-lived Bearer + httpOnly refresh cookie. That cookie is cross-origin (your API on `api.rathgo.com` vs. the app domain), so the refresh call needs `credentials: 'include'` and the API must send `Access-Control-Allow-Credentials: true` + a specific origin. I'll assume your backend already does that — confirm if not, otherwise refresh will silently fail in the browser.
4. **Anything else on /admin's look?** You said "match the existing theme" — I'll reuse the current dark+light tokens, Barlow Condensed headings, brand blue, surface cards. Confirm you don't want a distinct admin skin.

If the answer to any of the above is "just pick sensible defaults", I'll go with prod URL + sandbox Cashfree + same theme and note it in the summary.

---

## Part 1 — Wire existing screens to real API

**New shared infrastructure**
- `.env.example` + `src/lib/env.ts` — reads `VITE_API_BASE_URL`, `VITE_CASHFREE_MODE`.
- `src/lib/api.ts` — one `apiFetch<T>()` helper that:
  - prefixes base URL, sets JSON headers, unwraps `{ success, data }` (throws `ApiError` with `error` + `details` on `success:false` or non-2xx),
  - accepts a `bearer` / `credentials` option for admin calls,
  - has a small `queryKey` convention (`['trips','featured']`, `['trips','all', filters]`, `['trip', slug]`, `['stories', category]`, `['team-members']`, …).
- All fetching switches to TanStack Query (`ensureQueryData` in loaders + `useSuspenseQuery` in components), per the project's data-loading conventions.

**Screens rewired**
- `routes/index.tsx` — featured trips from `GET /api/trips`.
- `routes/destinations.index.tsx` — `GET /api/trips?all=true` + filter UI wired to `state`, `travelType`, `minPrice`, `maxPrice` (URL search params via `validateSearch` so filters are shareable).
- `routes/destinations.$slug.tsx` — `GET /api/trips/:slug`; hero uses `images[0].imageUrl`, itinerary from `itineraryDays`, "included/excluded" split from `inclusions` by `kind`, sharing prices from `sharingTypes`, batches list from `batches`.
- `routes/stories.tsx` — `GET /api/stories` with `?category=` tabs (All/Solo/Couple/Group).
- Booking sidebar — "Referred By" select uses `GET /api/team-members`.

Loading skeletons + error states (using shared `<QueryError />`) on every screen; empty states where lists can be empty.

---

## Part 2 — Rebuild the 4-step booking flow

Move booking state out of local `useState` into a small state machine (`useBookingFlow(tripId)`) storing `bookingRef`, `members[]`, `couponCode`, `totals` — persisted to `sessionStorage` keyed by `bookingRef` so a refresh doesn't lose progress. `bookingRef` is also mirrored to a URL search param so refresh/back works.

- **Step 1 — Choose batch & sharing type**
  Select `batchId` + `sharingTypeId` + `travelMode` (+ `groupSize` when group) + `referredById` + `howHeard`. Continue → `POST /api/bookings`; on 200 store `bookingRef` and advance. On 400 (seat full etc.) show the API's `error` message inline and let them pick another batch. Continue button shows spinner and is disabled during the request.

- **Step 2/3 — Traveller details + Aadhar**
  Dynamic member forms (count = `groupSize`, exactly one `isPrimary`). Aadhar upload per member per side:
  1. `POST /api/bookings/:ref/uploads/aadhar { side, contentType }`
  2. `PUT` file bytes directly to `uploadUrl` (raw `fetch`, no auth headers, `Content-Type` matches).
  3. Store returned `key` in local member state as `aadharFrontKey` / `aadharBackKey`.
  Per-file progress + validation (≤5 MB, jpg/png). Continue → `PATCH /api/bookings/:ref/members { members: [...] }`, save returned `id`s back into state, advance.

- **Step 4 — Coupon + Payment**
  - Apply coupon → `POST /api/bookings/:ref/apply-coupon`; totals in the summary are driven entirely by the response (`baseAmount`, `discountAmount`, `gstAmount`, `totalAmount`). Never compute discount client-side.
  - "Complete Booking" → `POST /api/bookings/:ref/checkout`; take `paymentSessionId`, lazy-load `@cashfreepayments/cashfree-js`, open Drop-in in the selected mode. On success/failure callback, `navigate` to `/booking/:ref/status`.

- **Status page (`/booking/:ref/status`)**
  Polls `GET /api/bookings/:ref` every 2.5 s, up to 30 s. When `paymentStatus === "paid"` → confirmation with booking details. Timeout → "we're confirming your payment" screen with a manual refresh button. `failed` → clear error + retry-payment link.

Error surface on every step reads `error.details` from the shared `ApiError` for field-level messages. Double-submit guard on all Continue buttons.

Adds `@cashfreepayments/cashfree-js` dependency.

---

## Part 3 — Admin Panel at `/admin`

New route group `src/routes/admin/…` using a pathless `_admin` layout for auth-gating and the admin shell (sidebar + top bar). Not wired into the public site nav.

**Admin API client (`src/lib/admin-api.ts`)**
- In-memory `accessToken` (survives navigation, not reload — matches 15 min TTL).
- Wraps `apiFetch` and on 401: single-flight `POST /api/admin/auth/refresh` with `credentials:'include'`, replaces token, retries the original request once. If refresh fails → clear token + redirect `/admin/login`.
- On mount, the admin layout attempts a silent refresh so a page reload can restore the session.

**Screens**
- `/admin/login` — email + password → `POST /api/admin/auth/login`.
- `/admin` (dashboard) — cards + upcoming-batches table from `GET /api/admin/dashboard/stats`.
- `/admin/trips` — list; row actions: edit, deactivate, delete (deletion shows 409 error + suggests toggling `isActive:false`).
- `/admin/trips/new` and `/admin/trips/:id` — main form (createTripSchema fields) + tabs for:
  - **Images** — 2-step upload (`upload-url` → PUT to R2 → save with `imageKey`), reorder via `sortOrder`, delete.
  - **Itinerary** — add/remove/reorder days; single PUT sends full list.
  - **Inclusions** — editable list w/ included/excluded toggle; single PUT full list.
  - **Sharing types** — double/triple/quad rows with price + description; single PUT.
  - **Featured** — toggle + order number → `PUT /featured`.
  - **Batches** — CRUD on `/api/admin/trips/:id/batches` + `/api/admin/batches/:id`.
- `/admin/coupons` — CRUD; discountKind flat/percent, optional cap/min/limit/date range; deactivate on 409.
- `/admin/stories` — CRUD; both cover + avatar use the 2-step upload with `kind`.
- `/admin/team-members` — simple CRUD list.
- `/admin/bookings` — filterable paginated table (`status`, `tripId`, `batchId`, `search`, `page`, `limit`); URL-synced.
- `/admin/bookings/:id` — detail view with members, payment status, totals; buttons:
  - "Confirm" / "Cancel" → `PUT .../status`.
  - "View Aadhar front/back" → fetches signed URL, opens in new tab.
  - "Invoice PDF" → same signed-URL pattern; button disabled unless `paymentStatus === "paid"`.

All admin screens: loading skeletons, error toasts using API's `error` message, empty states, and confirm dialogs on destructive actions. Uses existing `surface-card`, `btn-brand`, form styles so it feels native to the site — no separate dashboard theme.

---

## Technical notes

- **Env vars used at build time only** (`VITE_API_BASE_URL`, `VITE_CASHFREE_MODE`). No server functions needed — everything is a direct browser fetch to your API.
- **No SSR data fetching in loaders** for API-dependent pages (your API may not be reachable during prerender). I'll fetch client-side via TanStack Query so prerender still succeeds; loaders only prefetch when safe (or are skipped for API-backed routes).
- **Aadhar/image uploads** — the PUT to the presigned URL must NOT include `Authorization`; the `Content-Type` must match what was sent to `upload-url`.
- **Coupons** — the summary total on Step 4 is always whatever the last `/apply-coupon` (or booking) response said; no client math.
- **Access token storage** — kept in memory only (not localStorage) to avoid XSS token theft; the refresh cookie handles reload persistence.
- No changes to your existing visual design tokens, header, footer, or route names on the public site.

Reply with answers to the four questions (or "defaults are fine") and I'll build it.
