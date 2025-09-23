import { z } from "zod";

const nullableNumberFromAny = z.preprocess((val) => {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return val;
  if (typeof val === "string" && val.trim() !== "") {
    const n = Number(val);
    return Number.isFinite(n) ? n : val;
  }
  return val;
}, z.number().nullable().optional());

export const createRouteZodSchema = z.object({
  body: z
    .object({
      startLocation: z.string().min(1, "startLocation is required"),

      endLocation: z.string().min(1, "endLocation is required"),

      distance: z.preprocess(
        (v) => (v === "" ? v : Number(v)),
        z.number().positive("distance must be > 0")
      ),

      estimatedTime: z.preprocess(
        (v) => (v === "" ? v : Number(v)),
        z.number().int().positive("estimatedTime must be > 0")
      ),

      requiredLicense: z.string().optional().nullable(),

      startLat: nullableNumberFromAny,
      startLng: nullableNumberFromAny,
    })
    .strict(),
});
