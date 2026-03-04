# fyshe

A full-featured fishing companion PWA for tracking catches, managing gear, discovering fly patterns, planning trips, and connecting with fellow anglers.

## Features

**Catch Logging** - Record species, measurements, method, location (with map picker), photos, and gear used. View statistics by species, method, and time.

**Gear Management** - Track your rod, reel, line, and tackle inventory with status (owned, wishlist, retired) and category filtering.

**Trip Planning** - Create trips with date ranges, locations, members, and water conditions. Link catches to trips.

**Fly Pattern Library** - Browse 60+ pre-loaded fly patterns with detailed tying instructions, materials lists, and metadata. Search by category, difficulty, season, water type, and target species.

**Smart Recommendations** - Rule-based recommendation engine scores fly patterns and bait types based on season (30%), water type (25%), target species (25%), and region (10%).

**Material Inventory** - Track your fly tying materials with stock status, categories, and search.

**Articles & Guides** - MDX editorial content pipeline plus user-generated articles with rich editing.

**Social Features** - Follow anglers, like catches/trips/articles, threaded comments, activity feed, and public profiles.

**Explore** - Public feed of recent catches with photos and cursor-based pagination.

**PWA** - Installable with service worker caching, offline fallback, and mobile-first responsive design.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Monorepo | Turborepo + pnpm workspaces |
| Frontend | Next.js 15 (App Router), TailwindCSS v4, shadcn/ui |
| Backend API | tRPC v11 (via Next.js API routes) |
| Database | PostgreSQL + Prisma ORM (multi-file schema) |
| Auth | Auth.js v5 (GitHub + Google OAuth) |
| Validation | Zod (shared `@fyshe/validators` package) |
| File Uploads | Uploadthing |
| Maps | React Leaflet + OpenStreetMap |
| PWA | Serwist (`@serwist/next`) |
| Testing | Vitest (118 unit tests) + Playwright (E2E) |
| CI/CD | CircleCI |
| Deployment | Vercel (app) + Railway (PostgreSQL) |

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10
- PostgreSQL database (or [Railway](https://railway.app) account)

### Setup

```bash
# Clone the repo
git clone https://github.com/davidinwald/fyshe.git
cd fyshe

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Update .env with your database URL and OAuth credentials

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed fly patterns and bait types (optional)
pnpm --filter @fyshe/db db:seed-flies

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Project Structure

```
fyshe/
├── apps/web/               # Next.js 15 app (37 routes)
│   ├── src/app/            # App Router (route groups)
│   │   ├── (app)/          # Authenticated routes (dashboard, gear, catches, trips, flies, profile)
│   │   ├── (public)/       # Public routes (articles, explore, angler profiles)
│   │   ├── (auth)/         # Login page
│   │   └── api/            # tRPC, Auth.js, Uploadthing handlers
│   ├── src/components/     # React components by domain
│   ├── src/lib/            # Utilities (MDX loader, Uploadthing config)
│   ├── src/trpc/           # tRPC client + server caller
│   └── e2e/                # Playwright E2E tests
├── packages/
│   ├── api/                # tRPC router definitions (10 routers, 50+ procedures)
│   ├── auth/               # Auth.js v5 config
│   ├── config/             # Shared ESLint + TypeScript configs
│   ├── db/                 # Prisma multi-file schema + client
│   ├── ui/                 # shadcn/ui primitives + custom components
│   └── validators/         # Shared Zod schemas (7 domains, 118 tests)
├── content/                # MDX editorial articles + guides
├── tooling/scripts/        # Seed data, automation
└── .circleci/              # CI/CD pipeline
```

## Development

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # Lint all packages
pnpm typecheck        # Type-check all packages
pnpm test             # Run all tests
pnpm format           # Format with Prettier
```

### Database

```bash
pnpm db:generate      # Regenerate Prisma client
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Prisma Studio
pnpm --filter @fyshe/db db:seed-flies   # Seed fly patterns + bait types
```

### Docker

```bash
docker compose up -d          # Start PostgreSQL + app
docker compose down           # Stop everything
```

## Architecture

- **`@fyshe/api`** exports the `appRouter` type with zero HTTP dependencies - mountable in Next.js now, extractable to a standalone server later
- **`@fyshe/validators`** is the single source of truth for data shapes - used by both tRPC input validation and client-side forms
- **`@fyshe/db`** uses Prisma multi-file schema (one `.prisma` file per domain) for maintainability
- Server Components fetch data via `createCaller()`, Client Components use tRPC React Query hooks
- Internal packages consumed as raw TypeScript via `transpilePackages`

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for current progress and planned features.
See [FUTURE.md](FUTURE.md) for ideas not yet scheduled (gamification, marketplace, weather, offline-first).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.
See [CLAUDE.md](CLAUDE.md) for AI-assisted development instructions.

## License

MIT
