import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

if (!url || !authToken) {
  console.error("❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  console.log("🚀 Applying migrations to Turso...");

  const sqlFile = path.join(process.cwd(), "prisma/migrations/20260312081937_init/migration.sql");
  const sql = fs.readFileSync(sqlFile, "utf-8");

  const statements = sql
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith("--"));

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      console.log(`  ✓ ${stmt.slice(0, 60).replace(/\n/g, " ")}...`);
    } catch (e: unknown) {
      const msg = (e as Error).message;
      if (msg.includes("already exists")) {
        console.log(`  ⏭  Already exists, skipping`);
      } else {
        console.error(`  ✗ Error: ${msg}`);
      }
    }
  }

  console.log("\n✅ Migration complete!");
  await client.close();
}

main().catch(console.error);
