Run the full verification suite to ensure everything is green.

Execute in this order:

1. `pnpm typecheck` — Type-check all packages
2. `pnpm lint` — Lint all packages
3. `pnpm --filter @fyshe/validators test` — Unit tests
4. `pnpm build` — Production build
5. `pnpm format:check` — Formatting check

Report a summary with pass/fail for each step. If any step fails, stop and report the error.
