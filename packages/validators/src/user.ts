import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  isPublic: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updatePreferencesSchema = z.object({
  preferredSpecies: z.array(z.string()).optional(),
  preferredMethods: z
    .array(z.enum(["FLY", "SPIN", "BAIT", "TROLLING", "ICE", "SURF", "OTHER"]))
    .optional(),
  unitSystem: z.enum(["IMPERIAL", "METRIC"]).optional(),
  defaultVisibility: z.enum(["PUBLIC", "PRIVATE", "FOLLOWERS_ONLY"]).optional(),
});

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
