import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// https://github.com/prisma/prisma/discussions/3087
// https://www.prisma.io/docs/orm/prisma-client/client-extensions/type-utilities

type Prisma = typeof prisma;

export type PrismaModelName<T extends keyof Prisma = keyof Prisma> = T extends `$${string}`
  ? never
  : T extends string
    ? T
    : never;
