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

  let results: Array<{ element: JSX.Element }> = [];

  if (search.length > 1) {
    const [customers] = await db.$transaction([
      db.customer.findMany({
        where: {
          name: {
            contains: search,
          },
        },
      }),
    ]);

    results = customers.map((c) => ({
      element: (
        <a
          hx-get={`/customers/${c.id}`}
          hx-push-url="true"
          hx-replace-url="true"
          class="flex justify-start items-center gap-6 p-1 cursor-pointer hover:bg-base-200"
        >
          <div class="avatar">
            <div class="mask mask-squircle w-12 h-12">
              <img src={`https://i.pravatar.cc/50?u=${c.id}`} alt="Avatar Tailwind CSS Component" />
            </div>
          </div>
          {c.name}
        </a>
      ),
    }));
  }

  return (
    <div
      id="omnisearch-results"
      class="absolute left-0 right-0 top-[60px] bg-base-300 w-60 flex flex-col rounded-xl border border-base-300 shadow-2xl"
      _="on click hide #omnisearch-results then set #omnisearch-input.value to ''"
    >
      {results.length !== 0 ? (
        results.map((r) => r.element)
      ) : (
        <div class="on intersection(intersecting) having threshold 0 hide #omnisearch-results">No result.</div>
      )}
    </div>
  );
};
