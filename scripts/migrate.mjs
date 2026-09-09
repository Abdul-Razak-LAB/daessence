import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  "";

if (!connectionString) {
  console.log("No database URL configured; skipping database migration.");
  process.exit(0);
}

const pool = new Pool({
  connectionString,
  ssl: /neon\.tech/i.test(connectionString) || process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

try {
  const schema = await readFile(join(rootDir, "db", "migrations", "001_init_ecommerce.sql"), "utf8");
  const seed = await readFile(join(rootDir, "db", "seeds", "001_seed_products.sql"), "utf8");
  const client = await pool.connect();

  try {
    await client.query("begin");
    await client.query(schema);
    await client.query(seed);
    await client.query("commit");
    console.log("Database schema and seed applied.");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
} finally {
  await pool.end();
}
