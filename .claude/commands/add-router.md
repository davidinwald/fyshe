Add a new tRPC router for the "$ARGUMENTS" domain.

Follow this exact sequence:

1. **Validators** — Create `packages/validators/src/$ARGUMENTS.ts` with Zod schemas for create, update, list filters, and any relevant enums. Export from `packages/validators/src/index.ts`.

2. **Prisma Model** — Create `packages/db/prisma/schema/$ARGUMENTS.prisma` with the model, relevant enums, and indexes. Run `pnpm db:generate`.

3. **Router** — Create `packages/api/src/routers/$ARGUMENTS.ts` with CRUD procedures (list, getById, create, update, delete) using `protectedProcedure` and the validators from step 1. Register in `packages/api/src/root.ts`.

4. **Tests** — Create `packages/api/src/__tests__/$ARGUMENTS.test.ts` with integration tests covering auth, CRUD operations, and ownership checks. Create `packages/validators/src/__tests__/$ARGUMENTS.test.ts` with unit tests for all schemas.

5. **Verify** — Run `pnpm typecheck` and `pnpm --filter @fyshe/validators test`.

Reference existing patterns: see `packages/api/src/routers/gear.ts` and `packages/validators/src/gear.ts`.
