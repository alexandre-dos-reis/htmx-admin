import { z } from "zod";

type Choices = Array<{ value: string; label: string }>;

export const oneIsAllowedPostProcess = (args: { schema: z.ZodString; choices: Choices }) => {
  return args.schema.refine((v) => args.choices.map((a) => a.value).includes(v), {
    message: `Only one value is allowed among: ${args.choices.map((a) => a.label).join(", ")}.`,
  });
};

export const multipleValueAllowedPostProcess = (args: {
  schema: z.ZodArray<z.ZodString, "many">;
  choices: Choices;
}) => {
  return args.schema.refine((vx) => vx.some((v) => args.choices.map((a) => a.value).includes(v)), {
    message: `Only these values are allowed among: ${args.choices.map((a) => a.label).join(", ")}.`,
  });
};

// export const capValuesLengthPostProcess = (args: { schema: z.ZodArray<z.ZodString, "many">; choices: Choices }) => {
//   return args.schema.refine((v) => v);
// };

export const distinctValuesPostProcess = (args: { schema: z.ZodArray<z.ZodString, "many">; choices: Choices }) => {
  return args.schema.refine((vx) => vx.some((v) => args.choices.map((a) => a.value).includes(v)), {
    message: `Only these values are allowed among: ${args.choices.map((a) => a.label).join(", ")}.`,
  });
};
