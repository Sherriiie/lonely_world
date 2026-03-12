import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
dotenv.config();

const c = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const r = await c.execute("SELECT name FROM sqlite_master WHERE type='table'");
console.log("Tables in Turso:", r.rows.map((row: {name?: unknown}) => row.name).join(", "));
await c.close();
