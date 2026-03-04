import { z } from "zod";

export const gearCategoryEnum = z.enum([
  "ROD",
  "REEL",
  "LINE",
  "LURE",
  "FLY",
  "TACKLE",
  "CLOTHING",
  "ELECTRONICS",
  "ACCESSORY",
  "OTHER",
]);

export const gearStatusEnum = z.enum(["OWNED", "WISHLIST", "RETIRED", "LOST"]);

export type GearCategory = z.infer<typeof gearCategoryEnum>;
export type GearStatus = z.infer<typeof gearStatusEnum>;

export const createGearSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  category: gearCategoryEnum,
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional(),
  status: gearStatusEnum.default("OWNED"),
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(2000).optional(),
  purchaseDate: z.coerce.date().optional(),
  purchasePrice: z.number().min(0).optional(),
});

export type CreateGearInput = z.infer<typeof createGearSchema>;

export const updateGearSchema = createGearSchema.partial();

export type UpdateGearInput = z.infer<typeof updateGearSchema>;

export const gearListFiltersSchema = z.object({
  category: gearCategoryEnum.optional(),
  status: gearStatusEnum.optional(),
  search: z.string().optional(),
});

export type GearListFilters = z.infer<typeof gearListFiltersSchema>;
