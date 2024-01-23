import { Handler } from "~/config/decorateRequest";
import { form } from "../forms/generalForm";
import { notifyAndRedirect } from "~/responses";
import { Layout } from "~/components/*";
import { CustomersTabs } from "../components/CustomersTabs";

const { handleForm, renderForm } = form;

export const edit: Handler = async ({ set, isFormSubmitted, db, params, isFormSaveAndContinue, path }) => {
  const { data } = await handleForm({ recordId: params["id"] });

  if (isFormSubmitted && data) {
    try {
      await db.customer.update({
        data,
        where: { id: params["id"] },
        select: { id: true },
      });

      return notifyAndRedirect({
        set,
        to: isFormSaveAndContinue ? path : "/customers",
        message: "Changes saved successfully !",
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Layout>
      <CustomersTabs>
        <div class="avatar flex justify-center">
          <div class="mask mask-squircle w-20 h-20">
            <img src={`https://i.pravatar.cc/100?u=${params["id"]}`} alt="Avatar Tailwind CSS Component" />
          </div>
        </div>
        {renderForm({
          loadDefaultValues: async ({ db }) => {
            return await db.customer.findFirst({
              where: {
                id: params["id"],
              },
            });
          },
        })}
      </CustomersTabs>
    </Layout>
  );
};
