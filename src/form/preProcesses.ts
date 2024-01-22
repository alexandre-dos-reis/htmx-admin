import { ZodTypeAny, z } from "zod";
import { FieldsDefinition, Params } from "./createForm";

const ArrayPreProcess = (schema: z.ZodTypeAny) =>
  z.preprocess((v) => {
    const array = Array.isArray(v) ? v : [v];
    return array.filter(Boolean);
  }, schema);

export const wrapSchemaWithPreProcess = <TField extends FieldsDefinition<Params>[number]["type"]>({
  schema,
  type,
}: {
  schema: ZodTypeAny;
  type: TField;
}) => {
  switch (type) {
    case "dropdown":
      return ArrayPreProcess(schema);
    default:
      return schema;
  }
};
