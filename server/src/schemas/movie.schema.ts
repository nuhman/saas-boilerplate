import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  year: z.number().min(1800).max(2100).optional(),
  genre: z.string().max(100).optional(),
  rating: z.number().int().min(1).max(10).optional(),
  watched: z.boolean().default(false).optional(),
  notes: z.string().max(1000).optional(),
});

// update movie - all fields optional except id
export const updateMovieSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required").max(200).optional(),
  year: z.number().min(1800).max(2100).optional(),
  genre: z.string().max(100).optional(),
  rating: z.number().int().min(1).max(10).optional(),
  watched: z.boolean().default(false).optional(),
  notes: z.string().max(1000).optional(),
});

// schema for getting a single movie
export const getMovieByIdSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// schema for filtering movies
export const filterMoviesSchema = z.object({
  year: z.number().min(1800).max(2100).optional(),
  genre: z.string().max(100).optional(),
  minRating: z.number().int().min(1).max(10).optional(),
  watched: z.boolean().default(false).optional(),
}).optional();

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
