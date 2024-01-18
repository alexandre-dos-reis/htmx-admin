import { Elysia } from "elysia";
import { form } from "./form";
import { decorateRequest } from "~/config/decorateRequest";
import { notify, notifyAndRedirect } from "~/response";
import { Layout, Link, Tabs } from "~/components/*";
import { globalContext } from "~/config/globalStorages";
import { createList } from "~/list/createList";
import { listStateMapperToDb } from "~/database/helpers";

const { handleForm, renderForm } = form;

const CustomersTabs = (p: JSX.ElementChildrenAttribute) => {
  const context = globalContext.getStore();
  const basePath = `/customers/${context?.params["id"]}`;

  const tabs = [
    { href: basePath, label: "General" },
    { href: `${basePath}/pictures`, label: "Pictures" },
  ];

  return <Tabs tabs={tabs}>{p.children}</Tabs>;
};

export const customers = new Elysia({ prefix: "/customers" })
  .use(decorateRequest)
  .all("/", async () => {
    const { renderList } = await createList({
      config: { defaultSorting: { byDirection: "asc", byName: "name" } },
      loadData: (ctx, state) => listStateMapperToDb({ ctx, state, modelName: "customer" }),
      rowClickHref: (data) => `/customers/${data.id}`,
      columns: {
        name: {
          label: "Name",
          row: (d) => (
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="mask mask-squircle w-12 h-12">
                  <img src={`https://i.pravatar.cc/100?u=${d.id}`} alt="Avatar Tailwind CSS Component" />
                </div>
              </div>
              <div>
                <div class="font-bold">{d.name}</div>
                <div class="text-sm opacity-50">{d.location}</div>
              </div>
            </div>
          ),
        },
        company: {},
        job: {
          label: "Company / Job",
          row: (d) => (
            <>
              {d.company}
              <br />
              <span class="badge badge-ghost badge-sm">{d.job}</span>
            </>
          ),
        },
        color: {
          disableSorting: true,
          label: "Favorite Color",
        },
      },
    });

    const ctx = globalContext.getStore();
    return (
      <Layout>
        {ctx?.renderFragment ? null : (
          <div class="flex justify-end mb-6">
            <Link href="/customers/create" class="btn btn-primary">
              Create a customer
            </Link>
          </div>
        )}
        {renderList()}
      </Layout>
    );
  })

  .all("/create", async ({ set, isFormSubmitted, db }) => {
    const { data, errors } = await handleForm();

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
      } catch (error) {
        notify({
          set,
          level: "error",
          message: "A problem occured, please try again later !",
        });
      }
      return;
    }

    return (
      <Layout>
        {await renderForm({
          errors,
        })}
      </Layout>
    );
  })
  .group("/:id", (app) =>
    app
      .all("/", async ({ set, isFormSubmitted, db, params }) => {
        const { data, errors } = await handleForm({ currentRecordId: params.id });

        if (isFormSubmitted && data) {
          try {
            await db.customer.update({
              data,
              where: { id: params.id },
              select: { id: true },
            });

            return notifyAndRedirect({
              set,
              to: "/customers",
              message: "Changes saved successfully !",
            });
          } catch (error) {
            notify({
              set,
              level: "error",
              message: "A problem occured, please try again later !",
            });
          }
        }

        return (
          <Layout>
            <CustomersTabs>
              <div class="avatar flex justify-center">
                <div class="mask mask-squircle w-20 h-20">
                  <img src={`https://i.pravatar.cc/100?u=${params.id}`} alt="Avatar Tailwind CSS Component" />
                </div>
              </div>
              {renderForm({
                errors,
                loadDefaultValues: async ({ db }) => {
                  return await db.customer.findFirst({
                    where: {
                      id: params.id,
                    },
                  });
                },
              })}
            </CustomersTabs>
          </Layout>
        );
      })
      .all("/pictures", async () => {
        return (
          <Layout>
            <CustomersTabs>Pictures</CustomersTabs>
          </Layout>
        );
      }),
  );
