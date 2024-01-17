import { Elysia } from "elysia";
import { form } from "./form";
import { decorateRequest } from "~/config/decorateRequest";
import { notify, notifyAndRedirect } from "~/response";
import { Layout, Link, Tabs } from "~/components/*";
import { globalContext } from "~/config/globalStorages";
import { createList } from "~/list/createList";

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
      loadData: async ({ db }, { sort, pagination: { currentPage, rowsPerPage } }) => {
        const orderBy = sort ? { [sort?.byName]: sort?.byDirection } : undefined;
        const [data, totalRows] = await db.$transaction([
          db.customer.findMany({
            take: rowsPerPage,
            skip: rowsPerPage * (currentPage - 1),
            orderBy,
          }),
          db.customer.count({
            orderBy,
          }),
        ]);
        return { data, totalRows };
      },
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
              </div>
            </div>
          ),
        },
        company: {},
        job: {
          label: "Job",
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

    return (
      <Layout>
        <div class="flex justify-end mb-6">
          <Link href="/customers/create" class="btn btn-primary">
            Create a customer
          </Link>
        </div>
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
              {await renderForm({
                errors,
                loadDefaultValues: async ({ db }) => {
                  const c = await db.customer.findFirst({
                    where: {
                      id: params.id,
                    },
                  })!;

                  return {
                    color: c?.color || "",
                    job: c?.job || "",
                    company: c?.company || "",
                    location: c?.location || "",
                    name: c?.name || "",
                    email: c?.email || "",
                  };
                },
              })}
            </CustomersTabs>
          </Layout>
        );
      })
      .all("/pictures", async () => {
        return (
          <Layout>
            <CustomersTabs>pictures</CustomersTabs>
          </Layout>
        );
      }),
  );
