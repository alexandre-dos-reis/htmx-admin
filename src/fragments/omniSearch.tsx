import { Link } from "~/components/Link";
import { Handler } from "~/config/decorateRequest";

export const OmniSearch = () => {
  return (
    <div id="omnisearch" class="form-control relative indicator">
      <span
        id="omnisearch-loader"
        class="indicator-item indicator-bottom indicator-center loading loading-dots loading-lg htmx-indicator"
      ></span>
      <input
        type="text"
        id="omnisearch-input"
        placeholder="Search..."
        class="input input-bordered w-80"
        name="omnisearch"
        hx-get="/fragments/omnisearch"
        hx-target="#omnisearch-results"
        hx-trigger="input changed delay:500ms, search"
        hx-swap="outerHTML transition:true"
        hx-include="this"
        hx-indicator="#omnisearch-loader"
      />
      <div id="omnisearch-results"></div>
    </div>
  );
};

export const omniSearchHandler: Handler = async ({ db, query }) => {
  const search = query.omnisearch || "";

  let results: Array<JSX.Element> = [];

  if (search.length > 0) {
    const [customers] = await db.$transaction([
      db.customer.findMany({
        where: {
          name: {
            contains: search,
          },
        },
      }),
    ]);

    results = customers.map((c) => (
      <Link
        href={`/customers/${c.id}`}
        class="flex justify-start px-5 py-2 items-center gap-6 p-1 cursor-pointer hover:bg-base-200"
      >
        <div class="avatar">
          <div class="mask mask-squircle w-12 h-12">
            <img src={`https://i.pravatar.cc/50?u=${c.id}`} alt="Avatar Tailwind CSS Component" />
          </div>
        </div>
        <div class="flex flex-col">
          {c.name}
          <span class="badge badge-ghost badge-sm">Customer</span>
        </div>
      </Link>
    ));
  }

  return (
    <div
      id="omnisearch-results"
      class="absolute left-0 right-0 top-[55px] max-h-[calc(100vh-80px)] overflow-y-auto bg-base-300 flex flex-col rounded-xl border border-base-300 shadow-2xl"
      _="on click set #omnisearch-input.value to ''"
    >
      {results.length > 0 ? (
        results
      ) : (
        <div
          data-no-results="true"
          id="omnisearch-no-results"
          class="flex justify-start items-center gap-6 p-4 cursor-pointer hover:bg-base-200"
        >
          No result.
        </div>
      )}
    </div>
  );
};
