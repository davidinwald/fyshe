# CLAUDE.md — Agent Instructions for Fyshe

## Project Overview

Fyshe is a fishing companion PWA built with Next.js 15, tRPC v11, Prisma, and
PostgreSQL in a Turborepo monorepo. It tracks gear, catches, trips, and provides
fly fishing recommendations.

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js 15 (App Router), TailwindCSS v4, shadcn/ui
- **Backend**: tRPC v11 via Next.js API routes (`@fyshe/api` package)
- **Database**: PostgreSQL + Prisma ORM (`@fyshe/db` package)
- **Auth**: Auth.js v5 (`@fyshe/auth` package)
- **Validation**: Zod schemas in `@fyshe/validators`
- **Testing**: Vitest (unit), Playwright (e2e)
- **CI**: CircleCI

## Development Commands

```bash
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all packages and apps
pnpm lint             # Lint all packages
pnpm typecheck        # Type-check all packages
pnpm test             # Run Vitest tests
pnpm format           # Format all files with Prettier
pnpm format:check     # Check formatting
pnpm db:generate      # Regenerate Prisma client
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Run database seed
```

## Package Architecture

Internal packages use the `@fyshe/` namespace:

| Package | Purpose |
|---------|---------|
| `@fyshe/api` | tRPC routers (no HTTP server, just router definitions) |
| `@fyshe/db` | Prisma client, multi-file schema, migrations, seed |
| `@fyshe/auth` | Auth.js v5 configuration and helpers |
| `@fyshe/ui` | Shared UI components (shadcn/ui + custom) |
| `@fyshe/validators` | Shared Zod schemas for inputs/forms |
| `@fyshe/config` | Shared ESLint and TypeScript configs |

## Coding Conventions

### File Naming

- Components: `kebab-case.tsx` (e.g., `catch-card.tsx`)
- Utilities: `kebab-case.ts` (e.g., `format-date.ts`)
- Types: export with PascalCase names from `kebab-case.ts` files
- Tests: `*.test.ts` or `*.test.tsx` co-located with source

### Component Patterns

- Use `"use client"` only when necessary (state, effects, browser APIs)
- Prefer Server Components by default
- Co-locate `loading.tsx` and `error.tsx` with route segments
- Use React Suspense boundaries for data-dependent UI

### tRPC Patterns

- Input validation always uses Zod schemas from `@fyshe/validators`
- Use `protectedProcedure` for any mutation or user-specific query
- Use `publicProcedure` only for truly public data
- Prefer server-side tRPC callers in Server Components (`@/trpc/server`)
- Use client-side tRPC hooks in interactive Client Components (`@/trpc/client`)

### Database Patterns

- Never import `PrismaClient` directly; always use `@fyshe/db`
- Add indexes for any field used in WHERE or ORDER BY
- Use `onDelete: Cascade` for owned relationships
- Use `onDelete: SetNull` for reference relationships
- Schema files are split by domain in `packages/db/prisma/schema/`

### Styling

- Use Tailwind utility classes, not custom CSS
- Use `cn()` helper from `@fyshe/ui` for conditional classes
- Follow shadcn/ui patterns for component composition
- Mobile-first responsive design (`sm:`, `md:`, `lg:` breakpoints)

## Common Tasks

### Adding a new tRPC router

1. Create Zod schemas in `packages/validators/src/[domain].ts`
2. Export them from `packages/validators/src/index.ts`
3. Create router in `packages/api/src/routers/[domain].ts`
4. Add router to `packages/api/src/root.ts`
5. Types propagate automatically to the client

### Adding a new database model

1. Add model to appropriate `.prisma` file in `packages/db/prisma/schema/`
2. Run `pnpm db:generate` to update the Prisma client
3. Run `pnpm db:push` to apply changes (dev) or create migration (prod)
4. Add corresponding Zod schemas in `@fyshe/validators`

### Adding a new page

1. Create route segment in `apps/web/src/app/(app)/[feature]/page.tsx`
2. Create feature-specific components in `apps/web/src/components/[feature]/`
3. Use `createCaller()` from `@/trpc/server` for initial data in Server Components
4. Add `loading.tsx` for Suspense fallback

### Adding a shadcn/ui component

```bash
pnpm --filter @fyshe/ui dlx shadcn@latest add [component]
```

## Docker

```bash
docker compose up -d          # Start dev + test databases
docker compose up db-test -d  # Start only the test database
docker compose down           # Stop all services
```

- `db` service: Dev PostgreSQL on port 5432 (user: fyshe/fyshe)
- `db-test` service: Test PostgreSQL on port 5433 (user: fyshe_test/fyshe_test, tmpfs)

## Testing

```bash
pnpm --filter @fyshe/validators test  # Unit tests (no DB)
pnpm --filter @fyshe/api test         # Integration tests (needs db-test)
pnpm --filter @fyshe/web test:e2e     # E2E tests (needs dev server)
pnpm test                             # All Vitest tests via turbo
```

See `docs/TESTING.md` for the full testing guide.

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `DATABASE_URL` — PostgreSQL connection string (dev: `postgresql://fyshe:fyshe@localhost:5432/fyshe`)
- `DATABASE_URL_TEST` — Test DB connection (default: `postgresql://fyshe_test:fyshe_test@localhost:5433/fyshe_test`)
- `AUTH_SECRET` — Auth.js secret (`openssl rand -hex 32`)
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — GitHub OAuth
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth
- `UPLOADTHING_TOKEN` — Uploadthing API token

## System Documentation

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Agent instructions (this file) |
| `docs/ARCHITECTURE.md` | System architecture, package graph, data flow, key decisions |
| `docs/DATA-MODEL.md` | All database models, enums, and relations |
| `docs/TESTING.md` | Testing strategy, how to write and run tests |
| `ROADMAP.md` | Phase-based feature progress tracker |
| `FUTURE.md` | Ideas and future features not yet scheduled |

**Start here when picking up the project.** Read this file first, then `docs/ARCHITECTURE.md` for deeper context.

## Claude Code Skills

| Skill | Description |
|-------|-------------|
| `/add-router [domain]` | Scaffold a new tRPC router end-to-end |
| `/add-page [feature]` | Scaffold a new page with components |
| `/add-model [name]` | Add a new Prisma model with validators |
| `/test` | Run the test suite with guidance |
| `/verify` | Run full verification (typecheck, lint, test, build) |
| `/docker-up` | Start Docker dev environment |

## Roadmap

See `ROADMAP.md` for current project progress. Check the relevant phase
before starting work to understand what has been completed.

## PR Guidelines

- Reference the `ROADMAP.md` task being addressed
- Include before/after screenshots for UI changes
- Ensure `pnpm lint && pnpm typecheck && pnpm test` pass
- Keep PRs focused on a single feature or fix
