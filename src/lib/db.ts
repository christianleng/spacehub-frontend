// import { PrismaClient } from "@/generated/prisma";
import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: ReturnType<typeof createPrismaClient> | undefined;
}

const db = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}

export default db;
