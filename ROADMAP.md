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
- [x] Docker containerization (docker-compose + Dockerfile)
- [x] System documentation (docs/ARCHITECTURE.md, DATA-MODEL.md, TESTING.md)
- [x] Claude Code skills (add-router, add-page, add-model, test, verify, docker-up)
- [ ] Deploy to Vercel + Railway PostgreSQL
- [ ] Verify OAuth login end-to-end

## Phase 1: User & Gear
- [x] User profile page (edit name, bio, location, avatar)
- [x] User preferences page (species, methods, units, visibility)
- [x] GearItem model (schema migration)
- [x] Gear tRPC router (CRUD)
- [x] Gear list page with category/status filters
- [x] Gear detail page
- [x] Add gear form with validation
- [x] Gear status management (owned, wishlist, retired)
- [x] Vitest unit tests for validators (19 tests)
- [x] Vitest integration tests for user and gear routers (28 tests)
- [x] Playwright E2E test scaffolding (landing, auth)
- [ ] Avatar upload with Uploadthing

## Phase 2: Catch Logging & Trips
- [x] Catch model + CatchPhoto + CatchGear (schema migration)
- [x] Catch tRPC router (CRUD + stats)
- [x] Catch logging form (species, measurements, method, gear linking, notes)
- [x] Catch detail page (gear, method, measurements, location)
- [x] Catch list with filters and sorting
- [x] Trip model + TripMember + TripPhoto (schema migration)
- [x] Trip tRPC router (CRUD + members)
- [x] Trip detail page (catches, members)
- [x] Trip list with search and date filters
- [x] Link catches to trips and gear
- [x] Vitest unit tests for catch + trip validators (48 total)
- [x] Vitest integration tests for catch + trip routers
- [x] Photo upload integration (Uploadthing)
- [x] Location picker with React Leaflet
- [x] Catch statistics page (dedicated)
- [x] Playwright E2E test: log a catch flow

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
