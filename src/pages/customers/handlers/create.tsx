import { Layout } from "~/components/*";
import { Handler } from "~/config/decorateRequest";
import { form } from "../forms/generalForm";

const { handleForm, renderForm } = form;

export const create: Handler = async ({ isFormSubmitted, db, notifyAndRedirect }) => {
  const { data, errors } = await handleForm();

  if (isFormSubmitted && data) {
    try {
      const c = await db.customer.create({
        data,
        select: { id: true },
      });

      return notifyAndRedirect({
        to: `/customers/${c.id}`,
        message: "Creation saved successfully !",
      });
    } catch (e) {
      console.log(e);
    }
    return;
  }

  return <Layout>{renderForm({})}</Layout>;
};
