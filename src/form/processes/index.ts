import { match } from "ts-pattern";
import { FieldDef } from "../createForm";
import { arrayPreProcess } from "./preProcesses";
import { oneIsAllowedPostProcess, multipleValueAllowedPostProcess } from "./postProcesses";
import { z } from "zod";

export const appendSchemaProcess = ({ field }: { field: FieldDef }) => {
  return match(field)
    .with({ type: "radio" }, ({ props, schema }) => {
      return oneIsAllowedPostProcess({
        schema: schema as z.ZodString,
        choices: props.choices.map((c) => ({ value: c.value, label: c.labelError ?? c.value })),
      });
    })
    .with({ type: "select" }, ({ schema, props }) => {
      return oneIsAllowedPostProcess({
        schema: schema as z.ZodString,
        choices: props.options.map((o) => ({ value: o.value, label: o.label })),
      });
    })
    .with({ type: "dropdown" }, ({ schema, props }) => {
      return arrayPreProcess(
        multipleValueAllowedPostProcess({
          schema: schema as z.ZodArray<z.ZodString, "many">,
          choices: props.choices.map((c) => ({ value: c.value, label: c.errorLabel ?? c.value })),
        }),
      );
    })
    .otherwise(({ schema }) => schema);
};
