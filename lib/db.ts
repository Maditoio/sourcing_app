import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/drizzle/schema";

const databaseUrl = process.env.DATABASE_URL;


const sql = neon(databaseUrl || "postgresql://user:password@localhost:5432/sourcing_app");
export const db = drizzle(sql, { schema });
