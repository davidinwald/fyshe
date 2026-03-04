# fyshe

A fishing companion PWA for tracking catches, managing gear, discovering fly patterns, and planning trips.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TailwindCSS v4, shadcn/ui
- **Backend**: tRPC v11 via Next.js API routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Auth.js v5 (GitHub, Google OAuth)
- **Monorepo**: Turborepo + pnpm workspaces
- **CI/CD**: CircleCI
- **Deployment**: Vercel (app) + Railway (database)

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

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Project Structure

```
fyshe/
├── apps/web/           # Next.js frontend
├── packages/
│   ├── api/            # tRPC router definitions
│   ├── auth/           # Auth.js configuration
│   ├── config/         # Shared ESLint + TypeScript configs
│   ├── db/             # Prisma schema + client
│   ├── ui/             # Shared UI components
│   └── validators/     # Shared Zod schemas
├── content/            # MDX articles and guides
├── tooling/            # Build scripts and automation
└── .circleci/          # CI/CD pipeline
```

## Development

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # Lint all packages
pnpm typecheck    # Type-check all packages
pnpm test         # Run tests
pnpm format       # Format with Prettier
```

## Roadmap

See [ROADMAP.md](ROADMAP.md) for current progress and planned features.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT
