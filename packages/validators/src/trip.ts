import { z } from "zod";

export const createTripSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  locationName: z.string().max(300).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  waterBody: z.string().max(200).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  weather: z.string().max(200).optional(),
  waterConditions: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "FOLLOWERS_ONLY"]).default("PRIVATE"),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;

export const updateTripSchema = createTripSchema.partial();

export type UpdateTripInput = z.infer<typeof updateTripSchema>;

export const tripListFiltersSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  search: z.string().optional(),
});

export type TripListFilters = z.infer<typeof tripListFiltersSchema>;
