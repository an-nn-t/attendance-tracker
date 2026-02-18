import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// ここを修正：接続先URLを明示的に渡す
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
    datasourceUrl: process.env.DATABASE_URL ?? "file:./dev.db",
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
