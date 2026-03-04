# Fyshe Roadmap

## Phase 0: Foundation
- [x] Monorepo setup (Turborepo + pnpm workspaces)
- [x] Shared config package (ESLint, TypeScript)
- [x] Database package (Prisma + PostgreSQL schema)
- [x] Auth package (Auth.js v5)
- [x] API package (tRPC v11 + health check router)
- [x] UI package (shadcn/ui + Tailwind)
- [x] Validators package (shared Zod schemas)
- [x] Next.js web app with App Router
- [x] tRPC client wiring (server + client callers)
- [x] Auth routes (login page, OAuth handlers)
- [x] App shell (sidebar, header, mobile nav)
- [x] Landing page
- [x] Dashboard page (placeholder)
- [x] CircleCI pipeline
- [x] CLAUDE.md + ROADMAP.md + README
- [ ] Deploy to Vercel + Railway PostgreSQL
- [ ] Verify OAuth login end-to-end

## Phase 1: User & Gear
- [ ] User profile page (edit name, bio, location, avatar)
- [ ] User preferences page (species, methods, units, visibility)
- [ ] GearItem model (schema migration)
- [ ] Gear tRPC router (CRUD)
- [ ] Gear list page with category/status filters
- [ ] Gear detail page
- [ ] Add gear form with validation
- [ ] Gear status management (owned, wishlist, retired)
- [ ] Vitest tests for user and gear routers

## Phase 2: Catch Logging & Trips
- [ ] Catch model + CatchPhoto + CatchGear (schema migration)
- [ ] Catch tRPC router (CRUD + stats)
- [ ] Catch logging form (species, measurements, method, notes)
- [ ] Photo upload integration (Uploadthing)
- [ ] Location picker with React Leaflet
- [ ] Catch detail page (photos, gear, map)
- [ ] Catch list with filters and sorting
- [ ] Trip model + TripMember + TripPhoto (schema migration)
- [ ] Trip tRPC router (CRUD + members)
- [ ] Trip detail page (map, catches, members, photos)
- [ ] Link catches to trips and gear
- [ ] Catch statistics page
- [ ] Playwright E2E test: log a catch flow

## Phase 3: Fly Fishing Features
- [ ] FlyPattern + FlyMaterial + FlyTyingStep models
- [ ] Seed 50-100 well-known fly patterns
- [ ] Fly pattern library page (browse, search, filter)
- [ ] Fly pattern detail page (materials, tying steps)
- [ ] Recommendation engine (rule-based)
- [ ] Recommendation UI
- [ ] MaterialInventory model and CRUD
- [ ] Material inventory page
- [ ] BaitType model and seed data
- [ ] Bait recommendations
- [ ] User-created fly patterns

## Phase 4: Content & Social
- [ ] MDX content pipeline (load from content/ directory)
- [ ] Article listing and detail pages
- [ ] Article model for user-generated content
- [ ] Follow system (follow/unfollow)
- [ ] Public profile pages at /angler/[username]
- [ ] Visibility controls on catches and trips
- [ ] Activity feed
- [ ] Like system
- [ ] Comment system with threaded replies
- [ ] OG metadata for social sharing
- [ ] Explore page (public catches feed)

## Phase 5: PWA & Polish
- [ ] Serwist integration (service worker, caching)
- [ ] PWA manifest and icons
- [ ] Install prompt UI
- [ ] Offline fallback page
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit
- [ ] Loading states and skeleton screens
- [ ] Error boundaries on all route segments
- [ ] README with screenshots and demo link
