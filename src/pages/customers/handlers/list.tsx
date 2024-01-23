import { Link, Layout } from "~/components/*";
import { HEADERS_CONSTANTS } from "~/config/constants";
import { Handler } from "~/config/decorateRequest";
import { getContext } from "~/config/globalStorages";
import { listStateMapperToDb } from "~/database/helpers";
import { TextInput } from "~/form/inputs/*";
import { createList } from "~/list/createList";

export const list: Handler = async () => {
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

  const ctx = getContext();
  return (
    <Layout>
      {ctx?.renderFragment ? null : (
        <div class="flex items-center justify-center mb-6 gap-10">
          <TextInput
            label="Search by name"
            name="search"
            hx-trigger="input changed delay:500ms, search"
            hx-target="#list"
            hx-headers={JSON.stringify({ [HEADERS_CONSTANTS.renderFragment]: true })}
            hx-get={ctx?.path}
            _="on input call setParam('filterByName', event.target.value)"
          />
          <div class="flex justify-end">
            <Link href="/customers/create" class="btn btn-primary">
              Create a customer
            </Link>
          </div>
        </div>
      )}
      {renderList()}
    </Layout>
  );
};
