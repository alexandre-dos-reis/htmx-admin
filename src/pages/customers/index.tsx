import { Elysia } from "elysia";
import { form } from "./form";
import { decorateRequest } from "~/config/decorateRequest";
import { notifyAndRedirect } from "~/response";
import { Layout, Tabs } from "~/components/*";
import { globalContext } from "~/config/globalStorages";
import { createList } from "~/list/createList";

const { handleForm, renderForm } = form;

const CustomersTabs = (p: JSX.ElementChildrenAttribute) => {
  const context = globalContext.getStore();
  const basePath = `/customers/${context?.params["id"]}`;

  const tabs = [
    { href: basePath, label: "General" },
    { href: `${basePath}/pictures`, label: "Pictures" },
    { href: `${basePath}/infos`, label: "Infos" },
  ];

  return <Tabs tabs={tabs}>{p.children}</Tabs>;
};

export const customers = new Elysia({ prefix: "/customers" })
  .use(decorateRequest)
  .all("/", async () => {
    const { renderList } = await createList({
      loadData: ({ getCustomers }, { sort, pagination: { currentPage } }) => {
        // TODO: use a real data provider like prisma, grpahql, etc...
        const customers = getCustomers();
        const sliced = customers.slice(0 * currentPage, 9 * currentPage);

        return {
          data: sort
            ? sliced.sort((a, b) => {
                if (sort.byDirection === "desc") {
                  return a[sort.byName] > b[sort.byName] ? 1 : -1;
                } else {
                  return a[sort.byName] < b[sort.byName] ? 0 : -1;
                }
              })
            : sliced,
          totalRows: customers.length,
          currentPage: currentPage || 1,
        };
      },
      rowClickHref: (data) => `/customers/${data.name}`,
      columns: {
        name: {
          label: "Name",
          row: (d) => (
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="mask mask-squircle w-12 h-12">
                  <img
                    src={`https://daisyui.com/tailwind-css-component-profile-${d.img}@56w.png`}
                    alt="Avatar Tailwind CSS Component"
                  />
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

    return <Layout>{renderList()}</Layout>;
  })
  .group("/:id", (app) =>
    app
      .all("/", async ({ set, isFormSubmitted }) => {
        const { data, errors } = await handleForm();

        if (isFormSubmitted && data) {
          // Do something with the data...
          return notifyAndRedirect({
            set,
            to: "/customers",
            message: "Changes saved successfully !",
          });
        }

        return (
          <Layout>
            <CustomersTabs>
              {renderForm({
                formProps: {
                  renderAsFragmentRoute: true,
                },
                errors,
                defaultValues: () => ({
                  age: 23,
                  email: "alex@gmail.com",
                  name: "Alex",
                  toggle: true,
                  radio: "choice-3",
                  select: "",
                  dropdown: ["choice-1"],
                }),
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
      })
      .all("/infos", async () => {
        return (
          <Layout>
            <CustomersTabs>Infos</CustomersTabs>
          </Layout>
        );
      }),
  );
