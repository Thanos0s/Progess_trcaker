import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// In production (serverless) we don't cache on globalThis to avoid
// connection pool exhaustion across warm lambda instances.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
