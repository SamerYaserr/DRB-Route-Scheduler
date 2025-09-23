import { z } from "zod";

export const createDriverZodSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, "name is required"),

      licenseType: z.string().min(1, "licenseType is required"),

      availability: z.boolean().optional().default(true),

      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .strict(),
});
