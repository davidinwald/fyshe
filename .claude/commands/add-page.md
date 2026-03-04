Add a new page for the "$ARGUMENTS" feature.

Follow this exact sequence:

1. **Server Page** — Create `apps/web/src/app/(app)/$ARGUMENTS/page.tsx` as a Server Component. Use `createCaller()` from `@/trpc/server` to fetch initial data. Wrap in try/catch with `notFound()` fallback for detail pages.

2. **Client Components** — Create feature-specific components in `apps/web/src/components/$ARGUMENTS/`. Use `"use client"` directive. Use tRPC hooks from `@/trpc/client` for interactive data. Import UI primitives from `@fyshe/ui`.

3. **Sub-routes** — If needed, create:
   - `$ARGUMENTS/new/page.tsx` for creation form
   - `$ARGUMENTS/[id]/page.tsx` for detail view
   - `$ARGUMENTS/[id]/edit/page.tsx` for edit form

4. **Navigation** — Add link to `apps/web/src/components/layout/app-sidebar.tsx` and `apps/web/src/components/layout/app-header.tsx` (mobile nav).

5. **Verify** — Run `pnpm typecheck && pnpm build`.

Reference existing patterns: see `apps/web/src/app/(app)/gear/` and `apps/web/src/components/gear/`.
