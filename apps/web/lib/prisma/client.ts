import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { Pool } from "pg";
import dns from "node:dns/promises";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const url = new URL(connectionString);

const resolved = await dns.lookup(url.hostname, {
  family: 4,
});

const pool =
  globalForPrisma.pool ??
  new Pool({
    host: resolved.address,
    port: Number(url.port || 5432),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),

    max: 5,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,

    ssl: {
      rejectUnauthorized: true,
      servername: url.hostname,
    },
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
