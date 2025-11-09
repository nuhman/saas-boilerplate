import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { z } from "zod";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return {
      user: ctx.user,
      session: ctx.session,
    };
  }),

  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long"),
        name: z.string().min(2),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) throw new Error("User already exists!");

      return { success: true, message: "User creation payload validated!" };
    }),
});
