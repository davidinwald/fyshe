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
- [x] Avatar upload with Uploadthing

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
- [x] FlyPattern + FlyMaterial + FlyTyingStep models
- [x] Seed 50-100 well-known fly patterns (60 patterns + 22 bait types)
- [x] Fly pattern library page (browse, search, filter)
- [x] Fly pattern detail page (materials, tying steps)
- [x] Recommendation engine (rule-based scoring)
- [x] Recommendation UI
- [x] MaterialInventory model and CRUD
- [x] Material inventory page
- [x] BaitType model and seed data
- [x] Bait recommendations
- [x] User-created fly patterns (create/edit/delete)
- [x] Fly + bait validator tests (36 tests, 84 total)

## Phase 4: Content & Social
- [x] MDX content pipeline (load from content/ directory)
- [x] Article listing and detail pages
- [x] Article model for user-generated content (CRUD + slug generation)
- [x] Follow system (follow/unfollow/isFollowing)
- [x] Public profile pages at /angler/[id]
- [x] Visibility controls on catches and trips (existing from Phase 2)
- [x] Activity feed (followed users' catches + trips)
- [x] Like system (toggle, counts, polymorphic)
- [x] Comment system with threaded replies
- [x] OG metadata for social sharing (angler + article pages)
- [x] Explore page (public catches feed with cursor pagination)
- [x] Social + content validator tests (34 tests, 118 total)
- [x] Sample editorial content (4 MDX articles)

## Phase 5: PWA & Polish
- [x] Serwist integration (service worker, caching, navigation preload)
- [x] PWA manifest and icons (192px, 512px, maskable)
- [x] Install prompt UI (deferred prompt banner)
- [x] Offline fallback page (/offline)
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit
- [x] Loading states and skeleton screens (catches, gear, trips, flies)
- [x] Error boundaries on all route segments (app + public)
- [ ] README with screenshots and demo link
