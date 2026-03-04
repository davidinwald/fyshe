import { z } from "zod";

const flyCategories = [
  "DRY_FLY", "NYMPH", "STREAMER", "WET_FLY", "EMERGER",
  "TERRESTRIAL", "MIDGE", "SALMON_FLY", "BASS_BUG", "SALTWATER",
] as const;

const flyTypes = ["ATTRACTOR", "IMITATOR", "SEARCHING"] as const;
const flyDifficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as const;
const seasons = ["SPRING", "SUMMER", "FALL", "WINTER"] as const;
const waterTypes = ["RIVER", "STREAM", "LAKE", "POND", "RESERVOIR", "SALTWATER", "BRACKISH"] as const;

export const createFlyPatternSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional(),
  category: z.enum(flyCategories),
  type: z.enum(flyTypes).optional(),
  imageUrl: z.string().url().optional(),
  hookSize: z.string().max(50).optional(),
  hookType: z.string().max(100).optional(),
  threadColor: z.string().max(100).optional(),
  difficulty: z.enum(flyDifficulties).default("INTERMEDIATE"),
  seasons: z.array(z.enum(seasons)).default([]),
  waterTypes: z.array(z.enum(waterTypes)).default([]),
  targetSpecies: z.array(z.string().max(100)).default([]),
  regions: z.array(z.string().max(100)).default([]),
  materials: z.array(z.object({
    part: z.string().min(1).max(100),
    material: z.string().min(1).max(200),
    color: z.string().max(100).optional(),
    quantity: z.string().max(100).optional(),
    sortOrder: z.number().int().min(0).default(0),
  })).optional(),
  tyingSteps: z.array(z.object({
    stepNumber: z.number().int().min(1),
    instruction: z.string().min(1).max(2000),
    imageUrl: z.string().url().optional(),
    tip: z.string().max(500).optional(),
  })).optional(),
});

export type CreateFlyPatternInput = z.infer<typeof createFlyPatternSchema>;

export const updateFlyPatternSchema = createFlyPatternSchema.partial().omit({
  materials: true,
  tyingSteps: true,
}).extend({
  materials: z.array(z.object({
    part: z.string().min(1).max(100),
    material: z.string().min(1).max(200),
    color: z.string().max(100).optional(),
    quantity: z.string().max(100).optional(),
    sortOrder: z.number().int().min(0).default(0),
  })).optional(),
  tyingSteps: z.array(z.object({
    stepNumber: z.number().int().min(1),
    instruction: z.string().min(1).max(2000),
    imageUrl: z.string().url().optional(),
    tip: z.string().max(500).optional(),
  })).optional(),
});

export type UpdateFlyPatternInput = z.infer<typeof updateFlyPatternSchema>;

export const flyPatternListFiltersSchema = z.object({
  category: z.enum(flyCategories).optional(),
  type: z.enum(flyTypes).optional(),
  difficulty: z.enum(flyDifficulties).optional(),
  season: z.enum(seasons).optional(),
  waterType: z.enum(waterTypes).optional(),
  species: z.string().optional(),
  search: z.string().optional(),
  createdByMe: z.boolean().optional(),
});

export type FlyPatternListFilters = z.infer<typeof flyPatternListFiltersSchema>;

export const flyRecommendationInputSchema = z.object({
  season: z.enum(seasons).optional(),
  waterType: z.enum(waterTypes).optional(),
  targetSpecies: z.string().optional(),
  region: z.string().optional(),
});

export type FlyRecommendationInput = z.infer<typeof flyRecommendationInputSchema>;

// Material Inventory
export const createMaterialSchema = z.object({
  category: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  color: z.string().max(100).optional(),
  brand: z.string().max(200).optional(),
  quantity: z.string().max(100).optional(),
  inStock: z.boolean().default(true),
  notes: z.string().max(500).optional(),
});

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;

export const updateMaterialSchema = createMaterialSchema.partial();
export type UpdateMaterialInput = z.infer<typeof updateMaterialSchema>;

export const materialListFiltersSchema = z.object({
  category: z.string().optional(),
  inStock: z.boolean().optional(),
  search: z.string().optional(),
});

export type MaterialListFilters = z.infer<typeof materialListFiltersSchema>;

// Bait Types
const baitCategories = [
  "LIVE_BAIT", "CUT_BAIT", "ARTIFICIAL_BAIT", "DOUGH_BAIT", "PREPARED_BAIT",
] as const;

export const baitTypeListFiltersSchema = z.object({
  category: z.enum(baitCategories).optional(),
  season: z.enum(seasons).optional(),
  waterType: z.enum(waterTypes).optional(),
  species: z.string().optional(),
  search: z.string().optional(),
});

export type BaitTypeListFilters = z.infer<typeof baitTypeListFiltersSchema>;

export const baitRecommendationInputSchema = z.object({
  season: z.enum(seasons).optional(),
  waterType: z.enum(waterTypes).optional(),
  targetSpecies: z.string().optional(),
  region: z.string().optional(),
});

export type BaitRecommendationInput = z.infer<typeof baitRecommendationInputSchema>;

// Re-export enum values for UI usage
export const FLY_CATEGORIES = flyCategories;
export const FLY_TYPES = flyTypes;
export const FLY_DIFFICULTIES = flyDifficulties;
export const SEASONS = seasons;
export const WATER_TYPES = waterTypes;
export const BAIT_CATEGORIES = baitCategories;
