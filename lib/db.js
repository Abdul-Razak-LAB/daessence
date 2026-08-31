import { Pool } from "pg";

let pool;

function resolveDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    ""
  );
}

function needsSsl(connectionString) {
  return /neon\.tech/i.test(connectionString);
}

export function getDb() {
  const connectionString = resolveDatabaseUrl();
  if (!connectionString) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 10,
      ssl:
        process.env.NODE_ENV === "production" || needsSsl(connectionString)
          ? {
              rejectUnauthorized: false,
            }
          : undefined,
    });
  }

  return pool;
}

export async function query(text, params = []) {
  const db = getDb();
  if (!db) {
    throw new Error("Database connection string is not configured.");
  }
  return db.query(text, params);
}
