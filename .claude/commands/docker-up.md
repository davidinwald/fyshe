Start the Docker development environment.

Run the following:

1. Start the databases:
   ```
   docker compose up -d
   ```

2. Wait for healthy status:
   ```
   docker compose ps
   ```

3. Push the schema to the dev database:
   ```
   pnpm db:generate && pnpm db:push
   ```

4. Optionally seed:
   ```
   pnpm db:seed
   ```

Report the status of all services.
