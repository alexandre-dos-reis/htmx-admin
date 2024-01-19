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
      schema: () => z.string().min(3).max(255),
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
        options: () => [
          { label: "Google", value: "google" },
          { label: "Facebook", value: "fb" },
          { label: "Amazon", value: "amazon" },
        ],
      },
    },
    job: {
      type: "select",
      schema: () => z.string().min(1, "Please, select a job !"),
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
      schema: () => z.string().min(1, "Please, select a color !"),
      props: {
        label: "Color",
        options: () => [
          { label: "Red", value: "red" },
          { label: "Blue", value: "blue" },
          { label: "Black", value: "black" },
        ],
      },
    },
    // selection: {
    //   type: "dropdown",
    //   schema: () =>
    //     z.preprocess(
    //       (v) => {
    //         console.log(v);
    //         if (typeof v === "string") {
    //           v = [v];
    //         }
    //         return (v as Array<string>).filter(Boolean);
    //       },
    //       z.array(z.string()).min(1, "This selection can't be empty !"),
    //     ),
    //   props: {
    //     label: "test",
    //     choices: () => [
    //       { value: "1", children: "One" },
    //       { value: "2", children: "Two" },
    //       { value: "3", children: "Tree" },
    //     ],
    //   },
    // },
  } satisfies FieldsDefinition,
});
