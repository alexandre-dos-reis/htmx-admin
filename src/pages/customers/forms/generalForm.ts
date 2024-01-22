import { FieldsDefinition, createForm } from "~/form/createForm";
import { zArray, zChoice, zEmail, zStringRequired } from "~/form/schemas";

// https://github.com/alexandre-dos-reis/htmx-form-validation/blob/vite/src/pages/customers/form.ts
export const form = createForm({
  fields: {
    email: {
      schema: ({ db }, params) => {
        return zEmail.refine(
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
      schema: () => zStringRequired,
      props: {
        autocomplete: "name",
        label: "Name",
        hxValidation: {
          triggerOn: "blur",
        },
      },
    },
    location: {
      schema: () => zStringRequired,
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
      schema: () => zChoice,
      props: {
        label: "Company",
        options: () => [
          { label: "Google", value: "google" },
          { label: "Facebook", value: "fb" },
          { label: "Amazon", value: "amazon" },
        ],
      },
    },
    job: {
      type: "select",
      schema: () => zChoice,
      props: {
        label: "Job",
        options: () => [
          { label: "Dev", value: "dev" },
          { label: "LeadDev", value: "lead-dev" },
          { label: "Devops", value: "devops" },
        ],
      },
    },
    color: {
      type: "select",
      schema: () => zChoice,
      props: {
        label: "Color",
        options: () => [
          { label: "Red", value: "red" },
          { label: "Blue", value: "blue" },
          { label: "Black", value: "black" },
        ],
      },
    },
  } satisfies FieldsDefinition,
});
