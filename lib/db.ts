import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/drizzle/schema";

function getDatabaseUrl() {
  let url = process.env.DATABASE_URL?.trim();

  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DATABASE_URL is missing. Set it to the raw Neon PostgreSQL URL, without the DATABASE_URL= prefix.");
    }

    return "postgresql://user:password@localhost:5432/sourcing_app";
  }

  if (url.startsWith("DATABASE_URL=")) {
    url = url.slice("DATABASE_URL=".length).trim();
  }

  url = url.replace(/^['"]|['"]$/g, "");

  try {
    const parsed = new URL(url);
    if (!["postgres:", "postgresql:"].includes(parsed.protocol)) {
      throw new Error(`Unsupported protocol: ${parsed.protocol}`);
    }
  } catch (error) {
    throw new Error("DATABASE_URL is not a valid PostgreSQL connection string.", { cause: error });
  }

  return url;
}

const sql = neon(getDatabaseUrl());
export const db = drizzle(sql, { schema });
