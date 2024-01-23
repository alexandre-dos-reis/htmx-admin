import { ZodTypeAny, z } from "zod";
import { LoadFieldsDefinition } from "./createForm";

const arrayPreProcess = (schema: z.ZodTypeAny) => {
  return z.preprocess((v) => {
    const array = Array.isArray(v) ? v : [v];
    return array.filter(Boolean);
  }, schema);
};

export const wrapSchemaWithPreProcess = ({
  schema,
  type,
}: {
  schema: ZodTypeAny;
  type: ReturnType<LoadFieldsDefinition>[number]["type"];
}) => {
  switch (type) {
    case "dropdown":
      return arrayPreProcess(schema);
    default:
      return schema;
  }
};
