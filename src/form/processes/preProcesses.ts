import { z } from "zod";

export const arrayPreProcess = (
  schema: z.ZodArray<z.ZodString, "many"> | z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>,
) => {
  return z.preprocess((v) => (Array.isArray(v) ? v : [v]), schema);
};
