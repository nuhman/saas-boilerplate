import { router } from "./lib/trpc";
import { movieRouter } from "./routers/movie.router";

export const appRouter = router({
  movie: movieRouter,
});

export type AppRouter = typeof appRouter;
