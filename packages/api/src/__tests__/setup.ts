import { PrismaClient } from "@fyshe/db";
import { beforeAll, afterAll, beforeEach } from "vitest";
import { execSync } from "child_process";

const TEST_DB_URL =
  process.env.DATABASE_URL_TEST ?? "postgresql://fyshe_test:fyshe_test@localhost:5433/fyshe_test";

export const testDb = new PrismaClient({
  datasources: {
    db: { url: TEST_DB_URL },
  },
});

beforeAll(async () => {
  execSync("pnpm --filter @fyshe/db db:push --force-reset --accept-data-loss", {
    env: { ...process.env, DATABASE_URL: TEST_DB_URL },
    stdio: "pipe",
  });
});

beforeEach(async () => {
  const tablenames = await testDb.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map((row: { tablename: string }) => row.tablename)
    .filter((name: string) => name !== "_prisma_migrations");

  if (tables.length > 0) {
    await testDb.$executeRawUnsafe(
      `TRUNCATE TABLE ${tables.map((t: string) => `"${t}"`).join(", ")} CASCADE`
    );
  }
});

afterAll(async () => {
  await testDb.$disconnect();
});
