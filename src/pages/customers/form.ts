import { z } from "zod";
import { FieldsDefinition, createForm } from "~/form/createForm";

export const form = createForm({
  fields: {
    email: {
      schema: ({ db }, params) => {
        return z
          .string()
          .email()
          .max(255)
          .refine(
            async (email) =>
              !(await db.customer.count({
                where: params
                  ? {
                      AND: {
                        email,
                        NOT: { id: params?.currentRecordId },
                      },
                    }
                  : { email },
              })),
            {
              message: "Email is already taken",
            },
          );
      },
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
    location: {
      schema: () => z.string().min(3).max(255),
      props: {
        autocomplete: "name",
        label: "Location",
        hxValidation: {
          triggerOn: "blur",
        },
      },
    },
    company: {
      type: "select",
      schema: () => z.string().min(1, "Please, select a company !"),
      props: {
        label: "Company",
        options: [
          { label: "Google", value: "google" },
          { label: "Facebook", value: "fb" },
          { label: "Amazon", value: "amazon" },
        ],
      },
    },
    job: {
      type: "select",
      schema: () => z.string().min(1, "Please, select a company !"),
      props: {
        label: "Job",
        options: [
          { label: "Dev", value: "dev" },
          { label: "LeadDev", value: "lead-dev" },
          { label: "Devops", value: "devops" },
        ],
      },
    },
    color: {
      type: "select",
      schema: () => z.string().min(1, "Please, select a color !"),
      props: {
        label: "Color",
        options: [
          { label: "Red", value: "red" },
          { label: "Blue", value: "blue" },
          { label: "Black", value: "black" },
        ],
      },
    },
  } satisfies FieldsDefinition,
});
