import { z } from "zod";

export const createCatchSchema = z.object({
  species: z.string().min(1, "Species is required").max(200),
  tripId: z.string().optional(),
  length: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  method: z
    .enum(["FLY", "SPIN", "BAIT", "TROLLING", "ICE", "SURF", "OTHER"])
    .optional(),
  locationName: z.string().max(300).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  waterTemp: z.number().optional(),
  weather: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  released: z.boolean().default(true),
  visibility: z.enum(["PUBLIC", "PRIVATE", "FOLLOWERS_ONLY"]).default("PRIVATE"),
  caughtAt: z.coerce.date().optional(),
  gearIds: z.array(z.string()).optional(),
});

export type CreateCatchInput = z.infer<typeof createCatchSchema>;

export const updateCatchSchema = createCatchSchema.partial().omit({ gearIds: true }).extend({
  gearIds: z.array(z.string()).optional(),
});

export type UpdateCatchInput = z.infer<typeof updateCatchSchema>;

export const catchListFiltersSchema = z.object({
  species: z.string().optional(),
  method: z
    .enum(["FLY", "SPIN", "BAIT", "TROLLING", "ICE", "SURF", "OTHER"])
    .optional(),
  tripId: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  search: z.string().optional(),
});

export type CatchListFilters = z.infer<typeof catchListFiltersSchema>;
