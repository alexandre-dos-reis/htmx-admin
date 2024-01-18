import { globalContext } from "~/config/globalStorages";
import qs from "qs";
import { Sort, SortUp, SortDown, XMark } from "~/components/svg/*";
import { cn } from "~/utils";

export type TableQuery = { orderByName?: string; orderByDir?: "desc" | "asc"; page?: number } | undefined;

export interface ListProps extends JSX.HtmlTableTag {
  rows: Array<JSX.Element>;
  headers: Array<{ label: string; queryName: string; disabledSorting?: boolean }>;
  totalPages: number;
  currentPage: number;
}

export const List = ({ rows, headers, totalPages, currentPage, ...p }: ListProps) => {
  const context = globalContext.getStore();

  const query = context?.query as TableQuery;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <div class="overflow-x-auto">
        <table class="table table-pin-rows" {...p}>
          <thead>
            <tr>
              {headers.map((h) => (
                <th class={cn(!h.disabledSorting && "cursor-pointer hover:bg-base-200")}>
                  <div class="flex justify-between">
                    {h.disabledSorting ? (
                      <span>{h.label}</span>
                    ) : (
                      <div
                        class="flex gap-3"
                        hx-replace-url="true"
                        hx-get={`${context?.path}?${qs.stringify({
                          ...query,
                          orderByName: h.queryName,
                          orderByDir: query?.orderByName === h.queryName && query.orderByDir === "asc" ? "desc" : "asc",
                        })}`}
                      >
                        <span>
                          {query?.orderByName !== h.queryName ? (
                            <Sort class="fill-neutral-500" />
                          ) : query?.orderByName === h.queryName && query.orderByDir === "desc" ? (
                            <SortDown class="fill-neutral-500" />
                          ) : (
                            <SortUp class="fill-neutral-500" />
                          )}
                        </span>
                        <span>{h.label}</span>
                      </div>
                    )}
                    <XMark
                      class={cn("z-[1] invisible fill-neutral-500", query?.orderByName === h.queryName && "visible")}
                      hx-get={context?.path}
                      hx-replace-url="true"
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
      {totalPages > 1 ? <Pagination currentPage={currentPage} pages={pages} /> : null}
    </>
  );
};

const Pagination = (p: { pages: number[]; currentPage: number }) => {
  const context = globalContext.getStore();
  const query = context?.query as TableQuery;

  return (
    <div class="w-full flex justify-center my-6">
      <div class="join">
        {p.pages.map((px) => (
          <button
            class={cn("join-item btn", px === p.currentPage && "btn-primary")}
            hx-get={`${context?.path}?${qs.stringify({ ...query, page: px })}`}
            hx-replace-url="true"
          >
            {px}
          </button>
        ))}
      </div>
    </div>
  );
};
