# Architecture

## Overview

Fyshe is a Turborepo monorepo with a single Next.js app (`apps/web`) consuming shared packages (`packages/*`). All data flows through tRPC — the API router is defined in `@fyshe/api` with zero HTTP dependencies and mounted in Next.js API routes.

## Package Dependency Graph

```
@fyshe/web (Next.js app)
├── @fyshe/api (tRPC routers)
│   ├── @fyshe/db (Prisma client + schema)
│   ├── @fyshe/auth (Auth.js config)
│   └── @fyshe/validators (Zod schemas)
├── @fyshe/ui (shadcn/ui components)
└── @fyshe/config (ESLint + TypeScript configs)
```

## Key Architectural Decisions

### Source TypeScript Consumption
Internal `@fyshe/*` packages are consumed as raw TypeScript source, NOT pre-built. This means:
- `transpilePackages` in `next.config.ts` handles compilation
- **No `.js` extensions** in imports between packages
- `"declaration": false` in base tsconfig (avoids TS2742 portability errors with pnpm symlinks)
- Package `exports` map point directly to `.ts` files

### tRPC Architecture
- `@fyshe/api` exports `appRouter` + `AppRouter` type with zero HTTP dependencies
- Mounted in Next.js at `apps/web/src/app/api/trpc/[trpc]/route.ts`
- Server Components use `createCaller()` from `apps/web/src/trpc/server.ts`
- Client Components use hooks from `apps/web/src/trpc/client.tsx`
- The explicit type annotation on the tRPC client export is **required** (fixes TS2742)

### Prisma Multi-File Schema
- Schema files live in `packages/db/prisma/schema/` (one file per domain)
- `base.prisma` contains the datasource and generator config
- `auth.prisma`, `user.prisma`, `gear.prisma`, etc. contain models
- This is now a stable Prisma feature (no preview flag needed)

### Auth.js v5
- Still in beta (`next-auth@5.0.0-beta.30`)
- Configured in `@fyshe/auth` with Prisma adapter
- Session callback adds `user.id` to the session object
- Protected routes redirect via the app layout's `auth()` check

### Validation
- `@fyshe/validators` is the single source of truth for data shapes
- Used by tRPC input validation (server) and can be used for client-side form validation
- Each domain has its own file (e.g., `gear.ts`, `user.ts`)

## Data Flow

### Server Component (read path)
```
Server Component → createCaller() → tRPC router → Prisma → PostgreSQL
```

### Client Component (interactive path)
```
Client Component → trpc.*.useQuery/useMutation → HTTP fetch → tRPC handler → router → Prisma → PostgreSQL
```

## Route Structure

```
(auth)/          → Login/register (centered card layout)
(app)/           → Authenticated app (sidebar + header + mobile bottom nav)
  dashboard/     → Overview stats
  gear/          → CRUD for gear items
  profile/       → User profile + settings
  catches/       → [Phase 2]
  trips/         → [Phase 2]
  flies/         → [Phase 3]
(public)/        → Public-facing (landing, explore, public profiles)
api/trpc/        → tRPC HTTP handler
api/auth/        → Auth.js handler
```

## Testing Strategy

| Type | Tool | Location | Needs DB? |
|------|------|----------|-----------|
| Unit | Vitest | `packages/validators/src/__tests__/` | No |
| Integration | Vitest | `packages/api/src/__tests__/` | Yes (docker-compose `db-test`) |
| E2E | Playwright | `apps/web/e2e/` | Yes |

Integration tests use a real Postgres database (via docker-compose `db-test` service on port 5433). The test setup pushes the schema and truncates all tables between tests.

## Docker

- `docker-compose.yml` — Dev databases: `db` (port 5432) for development, `db-test` (port 5433, tmpfs) for tests
- `Dockerfile` — Multi-stage production build with `output: "standalone"` from Next.js
