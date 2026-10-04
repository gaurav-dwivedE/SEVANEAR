# SevaNear

A home-services marketplace: customers book verified local partners (plumbers,
electricians, cleaners, etc.); partners apply to join; admins run the whole
operation from one dashboard.

## Structure

```
Backend/    Express + MongoDB API (Node, JWT auth, Mongoose)
Frontend/   React + Vite + Tailwind CSS, cinematic scroll/motion (GSAP + Lenis)
```

## Running it

### 1. Backend

```bash
cd Backend
npm install
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm run seed              # populates starter services + sample partners
npm run dev               # http://localhost:3000
```

To get an admin account: register normally through the app, then in your
database set that user's `role` field to `"admin"` (there's no bootstrap admin
seed on purpose — don't ship a default admin password).

### 2. Frontend

```bash
cd Frontend
npm install
cp .env.example .env       # VITE_API_URL defaults to http://localhost:3000/api/v1
npm run dev                # http://localhost:5173
```

## What I changed on the backend

Your original backend covered auth, services, addresses, bookings
("applications") and a read-only partner directory, but had no way for an
admin to actually run the marketplace. I added, following the existing file
structure/conventions:

- **`PartnerApplication` model/controller/routes** — public "Become a
  Partner" intake form (`POST /api/v1/partner-applications`), plus admin
  review (`GET` list, `PATCH :id` approve/reject). Approving one
  upserts a real `Partner` record.
- **Admin booking management** — `GET /api/v1/applications/all` (every
  booking, populated) and `PATCH /api/v1/applications/:id` (change status
  and/or assign a partner).
- **`GET /api/v1/auth/users`** — admin-only user list.
- **`POST /api/v1/partners`** — admin can add a partner directly, not only
  via an approved application.
- **`PATCH`/`DELETE /api/v1/services/:id`** — admin can edit/remove a
  service, and `startingPrice` is now settable on create.

All new routes reuse the existing `authMiddleware` / `requireAdmin`
middleware — no changes to how auth or tokens work.

## Frontend pages

Public: Home, Services (live catalog + booking modal), How It Works, Become a
Partner (posts to the new intake endpoint), About, Login, Signup.

Authenticated: User Dashboard (overview, book a service, my bookings,
addresses, profile) and Admin Dashboard (overview, bookings — status +
partner assignment, services CRUD, partners, partner applications review,
users list) — gated by JWT role.

## Known gaps / next steps

- There's no `PATCH /api/v1/auth/me` yet, so the Profile tab is read-only —
  the dashboard says so inline.
- Partner login/dashboard doesn't exist in the backend (partners aren't
  User accounts) — out of scope here, flagged if you want it next.
- No image/file uploads (avatars, job photos) — everything is text data.


## v2 changes (UI redesign + production hardening)

**Frontend**
- New design system (forest green + saffron) applied through the Tailwind tokens, so every page, including admin, picks it up.
- Redesigned Home, Services (search, category filter, sort, URL-synced), new Service detail page (`/services/:id`), 3-in-1 booking form (date, time slot, address, price breakdown), and a bookings dashboard (timeline, cancel, rate).
- Mobile bottom tab bar, skeleton loaders, error boundary, lazy-loaded routes, code-split bundles, 401 auto-logout, request timeout.
- Removed the page-curtain transition and smooth-scroll hijack (slower, less accessible).

**Backend**
- helmet, compression, rate limiting (stricter on login/register), CORS allow-list, body size limits, central error handler, env validation, graceful shutdown.
- Services: category, image, duration, inclusions, rating aggregate, `isActive`.
- Bookings: date and time slot, price estimate, statuses (pending, approved, in_progress, completed, rejected, cancelled), user cancel and review endpoints.

## Deploying
1. Backend: set `NODE_ENV=production`, `MONGO_URI`, a 32+ char `JWT_SECRET`, and `CORS_ORIGINS=https://your-frontend`. Run `npm start`.
2. Frontend: set `VITE_API_URL`, run `npm run build`, serve `dist/` with SPA fallback to `index.html`.
3. Re-run `npm run seed` once to load the new service fields.

## Not yet included (recommended next)
Real payments (Razorpay), SMS/email notifications, partner login and dashboard, automated tests, CI.


## v3 changes

**Customer site**
- Home is one long page (Home, Services, How it works, Become a Partner, About) with a scroll-aware navbar: an animated underline follows the section you are reading.
- Search has two modes: search services, or check availability by PIN code (validated with the India Post API).
- After login, customers are asked for their PIN code once; services are then filtered to what is available there. Bookings are blocked for PIN codes with no covering partner.
- Calendar date picker, mandatory mobile number, richer addresses (label, contact name, house no., landmark, city/state auto-filled from the PIN code).
- Profile button with My bookings, Saved addresses (add / edit / delete), Change PIN code and Log out.
- New fonts: DM Serif Display and DM Sans.

**Admin** (separate dashboard at /admin, never shows the customer site; admins cannot book)
- Pages: Overview, Bookings (filters by status, service, dates and search; updates in place, no redirects), Services (category, Cloudinary image, edit, delete), Categories (create, edit, delete), Partners (compact form, optional photo, service-area PIN codes, edit, delete), Applications (approve / reject), Users (block, unblock, delete).

**Backend**
- New: categories API, PIN code lookup, Cloudinary image upload, address update, partner update/delete, user block/delete. Auth now re-checks the user in the database on every request, so blocking takes effect immediately.
- Partners are admin-only (they contain phone numbers). A service is "available" at a PIN code when an active partner offering it covers that PIN code.

## Upgrading from v2
1. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `Backend/.env`.
2. Run `npm install` in Backend and Frontend.
3. Service categories are now real records. Run `npm run seed` again (it creates the categories and links services). Old services that stored a text category should be re-seeded or edited in the admin.
4. Existing addresses without a valid 10-digit mobile must be re-saved by customers.
5. Seeded partners cover Lonavla (410401, 410403) and Pune (411001, 411038). Add partners for your own areas in Admin > Partners.


## v3.3 changes
- Admin requests are never rate limited; failed logins only count towards the login limit; general limit raised to 1500 requests / 15 min per IP.
- Completed bookings stay in My bookings with a "Job completed" bar. Filters: All, Active, Completed, Cancelled.
- Reviews: rating and written review after completion; reviews and a rating breakdown appear at the end of each service page (names shown as "Rahul S.").
- Invoices: price breakdown is stored when the booking is made (so later price changes don't alter it). Admin can add extra charges and mark payment in Bookings > details. Customers open /bookings/:id/invoice and can print or save it as PDF.
- Cleaner, simpler home page and card styling.


## v3.4 changes
- Customers can delete finished bookings (completed, cancelled, declined) from their list; admin records and public reviews are kept.
- Cancelling asks for a reason (radio options; "Other" opens a text box). Admin sees "Cancelled by customer" with the reason, can filter for it, and the row is highlighted.
- Reviews can be edited; the service rating average is corrected.
- Ratings always show five stars, filled according to the rating (including decimals on service cards).
- Home hero shows three service photos with labels again.

## v3.5 changes
- Services can have up to 5 photos (first is the cover; "Make cover" reorders). Service pages show a gallery with thumbnails.
- Services without photos show a neutral SevaNear placeholder instead of a service-specific photo.
