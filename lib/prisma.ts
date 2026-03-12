import { PrismaClient } from "./generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> };

function createPrisma() {
  const url = process.env.TURSO_DATABASE_URL || `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
  const adapter = new PrismaLibSql({ url, authToken });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma || createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;



