import { router, publicProcedure } from "../lib/trpc";
import {
  createMovieSchema,
  updateMovieSchema,
  getMovieByIdSchema,
  filterMoviesSchema,
} from "../schemas/movie.schema";

export const movieRouter = router({
  getAll: publicProcedure
    .input(filterMoviesSchema)
    .query(async ({ ctx, input }) => {
      const { watched, year, genre, minRating } = input || {};
      const where = {
        ...(watched !== undefined && { watched }),
        ...(year && { year }),
        ...(genre && { genre }),
        ...(minRating && { rating: { gte: minRating } }),
      };

      return ctx.prisma.movie.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getById: publicProcedure
    .input(getMovieByIdSchema)
    .query(async ({ ctx, input }) => {
      const movie = await ctx.prisma.movie.findUnique({
        where: { id: input.id },
      });

      if (!movie) throw new Error("Movie not found");
      return movie;
    }),

  create: publicProcedure
    .input(createMovieSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.movie.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(updateMovieSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...inputData } = input;

      const exists = await ctx.prisma.movie.findUnique({
        where: { id },
      });

      if (!exists) throw new Error("Movie not found - update failed");

      return ctx.prisma.movie.update({
        where: { id },
        data: inputData,
      });
    }),

  delete: publicProcedure
    .input(getMovieByIdSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.movie.delete({
        where: { id: input.id },
      });
    }),

  toggleWatched: publicProcedure
    .input(getMovieByIdSchema)
    .mutation(async ({ ctx, input }) => {
      const movie = await ctx.prisma.movie.findUnique({
        where: { id: input.id },
      });

      if (!movie) throw new Error("movie not found - toggling failed");

      return ctx.prisma.movie.update({
        where: { id: input.id },
        data: { watched: !movie.watched },
      });
    }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const [total, watched] = await Promise.all([
      ctx.prisma.movie.count(),
      ctx.prisma.movie.count({ where: { watched: true } }),
    ]);

    const avgRating = await ctx.prisma.movie.aggregate({
      _avg: { rating: true },
      where: { rating: { not: null } },
    });

    return {
      total,
      watched,
      unwatched: total - watched,
      averageRating: avgRating._avg.rating,
    };
  }),
});
