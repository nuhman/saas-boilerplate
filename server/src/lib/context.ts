import { CreateFastifyContextOptions } from "@trpc/server/dist/adapters/fastify/index.cjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  return {
    prisma,
    req,
    res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
