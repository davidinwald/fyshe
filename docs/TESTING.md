# Testing Guide

## Test Pyramid

```
        ┌─────────┐
        │   E2E   │  Playwright (apps/web/e2e/)
        │  tests  │  Full browser, real server
        ├─────────┤
        │ Integr. │  Vitest (packages/api/src/__tests__/)
        │  tests  │  Real DB, tRPC caller, no HTTP
        ├─────────┤
        │  Unit   │  Vitest (packages/validators/src/__tests__/)
        │  tests  │  Pure logic, no DB, no network
        └─────────┘
```

## Running Tests

### Prerequisites
```bash
# Start test database for integration tests
docker compose up db-test -d
```

### Commands
```bash
# Unit tests only (fast, no DB)
pnpm --filter @fyshe/validators test

# Integration tests (needs test DB)
pnpm --filter @fyshe/api test

# All Vitest tests
pnpm test

# E2E tests (needs running dev server)
pnpm --filter @fyshe/web test:e2e

# Watch mode
pnpm --filter @fyshe/validators test:watch
pnpm --filter @fyshe/api test:watch
```

## Writing Tests

### Unit Tests (validators)
Location: `packages/validators/src/__tests__/*.test.ts`

Test Zod schema validation — valid inputs, invalid inputs, edge cases, defaults.

```typescript
import { describe, it, expect } from "vitest";
import { createGearSchema } from "../gear";

describe("createGearSchema", () => {
  it("accepts valid input", () => {
    const result = createGearSchema.safeParse({ name: "Rod", category: "ROD" });
    expect(result.success).toBe(true);
  });
});
```

### Integration Tests (API routers)
Location: `packages/api/src/__tests__/*.test.ts`

Tests use a real Postgres database. The test setup:
- Pushes schema before all tests (`beforeAll`)
- Truncates all tables between tests (`beforeEach`)
- Disconnects after all tests (`afterAll`)

Use the helpers:
```typescript
import { createAuthenticatedCaller, createTestUser } from "./helpers";

it("creates a gear item", async () => {
  const user = await createTestUser();
  const caller = createAuthenticatedCaller(user.id);
  const item = await caller.gear.create({ name: "Rod", category: "ROD" });
  expect(item.name).toBe("Rod");
});
```

**What to test:**
- Auth (protected procedures reject unauthenticated calls)
- CRUD operations (create, read, update, delete)
- Ownership isolation (user A can't access user B's data)
- Input validation (invalid inputs are rejected)
- Edge cases (not found, duplicate, etc.)

### E2E Tests (Playwright)
Location: `apps/web/e2e/*.spec.ts`

Test real user flows through the browser.

```typescript
import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Fyshe");
});
```

## CI Pipeline

Tests run in CircleCI:
- **test-unit**: Validator tests (no DB needed)
- **test-integration**: API tests with Postgres sidecar container
- **test-e2e**: Playwright tests (only on main/release branches)

## Test Database

The `db-test` service in `docker-compose.yml` runs on port 5433 with `tmpfs` (data doesn't persist between container restarts — fast and clean).

Connection: `postgresql://fyshe_test:fyshe_test@localhost:5433/fyshe_test`
