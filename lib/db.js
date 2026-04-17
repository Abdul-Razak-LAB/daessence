import { Pool } from "pg";

let pool;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      ssl:
        process.env.NODE_ENV === "production"
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
    throw new Error("DATABASE_URL is not configured.");
  }
  return db.query(text, params);
}
