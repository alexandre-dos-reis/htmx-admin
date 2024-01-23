import { z } from "zod";

export type SchemaArray =
  | z.ZodArray<z.ZodString, "many">
  | z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
