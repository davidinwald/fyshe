Run the test suite for the project.

1. **Unit tests** (no DB needed):
   ```
   pnpm --filter @fyshe/validators test
   ```

2. **Integration tests** (requires test Postgres — `docker compose up db-test -d` first):
   ```
   pnpm --filter @fyshe/api test
   ```

3. **E2E tests** (requires running dev server):
   ```
   pnpm --filter @fyshe/web test:e2e
   ```

4. **All tests** (turbo):
   ```
   pnpm test
   ```

If integration tests fail with connection errors, ensure the test database is running:
```
docker compose up db-test -d
```

Report a summary of pass/fail counts and any failing test names.
