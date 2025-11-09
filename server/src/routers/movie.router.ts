import { router, protectedProcedure } from "../lib/trpc";
import {
  createMovieSchema,
  updateMovieSchema,
  getMovieByIdSchema,
  filterMoviesSchema,
} from "../schemas/movie.schema";

export const movieRouter = router({
  getAll: protectedProcedure
    .input(filterMoviesSchema)
    .query(async ({ ctx, input }) => {
      const { watched, year, genre, minRating } = input || {};
      const where = {
        userId: ctx.user.id,
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

  getById: protectedProcedure
    .input(getMovieByIdSchema)
    .query(async ({ ctx, input }) => {
      const movie = await ctx.prisma.movie.findUnique({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!movie) throw new Error("Movie not found");
      return movie;
    }),

  create: protectedProcedure
    .input(createMovieSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.movie.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(updateMovieSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...inputData } = input;

      const exists = await ctx.prisma.movie.findUnique({
        where: { id, userId: ctx.user.id },
      });

      if (!exists) throw new Error("Movie not found - update failed");

      return ctx.prisma.movie.update({
        where: { id },
        data: inputData,
      });
    }),

  delete: protectedProcedure
    .input(getMovieByIdSchema)
    .mutation(async ({ ctx, input }) => {
      const movie = await ctx.prisma.movie.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!movie)
        throw new Error("Movie not found or you do not have permission");

      return ctx.prisma.movie.delete({
        where: { id: input.id },
      });
    }),

  toggleWatched: protectedProcedure
    .input(getMovieByIdSchema)
    .mutation(async ({ ctx, input }) => {
      const movie = await ctx.prisma.movie.findUnique({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!movie) throw new Error("movie not found - toggling failed");

      return ctx.prisma.movie.update({
        where: { id: input.id },
        data: { watched: !movie.watched },
      });
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [total, watched] = await Promise.all([
      ctx.prisma.movie.count({ where: { userId: ctx.user.id } }),
      ctx.prisma.movie.count({ where: { userId: ctx.user.id, watched: true } }),
    ]);

    const avgRating = await ctx.prisma.movie.aggregate({
      _avg: { rating: true },
      where: { rating: { not: null }, userId: ctx.user.id },
    });

    return {
      total,
      watched,
      unwatched: total - watched,
      averageRating: avgRating._avg.rating,
    };
  }),
});
