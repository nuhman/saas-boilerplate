import { publicProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  sayHello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? "world"}`,
      };
    }),

  getMessages: publicProcedure.query(async ({ ctx }) => {    
    return ctx.prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  createMessage: publicProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.message.create({
        data: { content: input.content },
      });
    }),
});

export type AppRouter = typeof appRouter;
