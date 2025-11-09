import { router, publicProcedure } from "./lib/trpc";
import { authRouter } from "./routers/auth.router";
import { movieRouter } from "./routers/movie.router";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: true };
  }),
  movie: movieRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
