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

export const getDriverHistoryZodSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid driver ID").min(1, "Driver ID is required"),
  }),
});
