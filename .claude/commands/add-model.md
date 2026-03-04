Add a new Prisma model for "$ARGUMENTS".

Follow this exact sequence:

1. **Schema** — Create `packages/db/prisma/schema/$ARGUMENTS.prisma` with:
   - Model with `id`, `createdAt`, `updatedAt` fields
   - `userId` foreign key with `onDelete: Cascade`
   - Appropriate indexes (`@@index([userId])` at minimum)
   - Any related enums

2. **Relations** — Update the parent model (usually in `user.prisma`) to add the reverse relation field.

3. **Generate** — Run `pnpm db:generate` to update the Prisma client.

4. **Validators** — Create matching Zod schemas in `packages/validators/src/$ARGUMENTS.ts`. Export from `packages/validators/src/index.ts`.

5. **Verify** — Run `pnpm typecheck`.

Reference: See `packages/db/prisma/schema/gear.prisma` and `packages/validators/src/gear.ts` for patterns.
