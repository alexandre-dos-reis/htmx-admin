import { z } from "zod";
import { FieldsDefinition, createForm } from "~/form/createForm";

export const form = createForm({
  fields: {
    dropdown: {
      type: "dropdown",
      schema: z.preprocess(
        (v) => {
          if (typeof v === "string") {
            v = [v];
          }
          return (v as Array<string>).filter(Boolean);
        },
        z.array(z.string()).min(1, "This selection can't be empty !"),
      ),
      props: {
        label: "Choices",
        choices: [
          { children: "Choice 1", value: "choice-1" },
          { children: "Choice 2", value: "choice-2" },
          { children: "Choice 3", value: "choice-3" },
          { children: "Choice 4", value: "choice-4" },
          { children: "Choice 5", value: "choice-5" },
          { children: "Choice 6", value: "choice-6" },
        ],
      },
    },
    email: {
      schema: z
        .string()
        .email()
        .max(255)
        .refine(async (email) => email !== "john@doe.com", {
          message: "Email is already taken",
        }),
      props: {
        autocomplete: "email",
        label: "Email",
        hxValidation: {
          triggerOn: "blur",
        },
      },
    },
    name: {
      schema: z.string().min(3).max(255),
      props: {
        autocomplete: "name",
        label: "Name",
        hxValidation: {
          triggerOn: "blur",
        },
      },
    },
    age: {
      schema: z
        .string()
        .min(1)
        .max(3)
        .transform((v) => parseInt(v, 10)),
      props: {
        type: "number",
        label: "Age",
        hxValidation: {
          triggerOn: "blur",
        },
      },
    },
    select: {
      type: "select",
      schema: z.string().min(1, "Please, select a choice !"),
      props: {
        label: "Select",
        options: [
          { label: "Choice 1", value: "choice-1" },
          { label: "Choice 2", value: "choice-2" },
          { label: "Choice 3", value: "choice-3" },
        ],
      },
    },
    toggle: {
      type: "toggle",
      schema: z.coerce.boolean(),
      props: {
        label: "Do you agree ?",
      },
    },
    radio: {
      type: "radio",
      schema: z.string(),
      props: {
        choices: [
          { children: "Choice 1", value: "choice-1" },
          { children: "Choice 2", value: "choice-2" },
          { children: "Choice 3", value: "choice-3" },
        ],
        label: "Choices",
      },
    },
  } satisfies FieldsDefinition,
});
