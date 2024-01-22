import { Layout } from "~/components/*";
import { Handler } from "~/config/decorateRequest";
import { notifyAndRedirect } from "~/responses";
import { form } from "../forms/generalForm";
import { notifyAnError } from "~/responses";

const { handleForm, renderForm } = form;

export const create: Handler = async ({ isFormSubmitted, db, set, body }) => {
  const { data, errors } = await handleForm();

  console.log({ errors, body });

  if (isFormSubmitted && data) {
    try {
      const c = await db.customer.create({
        data,
        select: { id: true },
      });

      return notifyAndRedirect({
        set,
        to: `/customers/${c.id}`,
        message: "Creation saved successfully !",
      });
    } catch (e) {
      console.log(e);
      notifyAnError({
        set,
      });
    }
    return;
  }

  return (
    <Layout>
      {renderForm({
        errors,
      })}
    </Layout>
  );
};
