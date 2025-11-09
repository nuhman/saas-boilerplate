import { CreateFastifyContextOptions } from "@trpc/server/dist/adapters/fastify/index.cjs";
import { PrismaClient } from "@prisma/client";
import { auth } from "./auth";

const prisma = new PrismaClient();

export async function createContext({ req, res }: CreateFastifyContextOptions) {

  const session = await auth.api.getSession({
    headers: req.headers as any,
  });

  return {
    prisma,
    req,
    res,
    user: session?.user ?? null,
    session: session?.session ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
