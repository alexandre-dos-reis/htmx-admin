import { getContext } from "~/config/globalStorages";
import qs from "qs";
import { Sort, SortUp, SortDown, XMark } from "~/components/svg/*";
import { cn } from "~/utils";
import { HEADERS_CONSTANTS } from "~/config/constants";

export type TableQuery = { orderByName?: string; orderByDir?: "desc" | "asc"; page?: number } | undefined;

export interface ListProps extends JSX.HtmlTableTag {
  rows: Array<JSX.Element>;
  headers: Array<{ label: string; queryName: string; disabledSorting?: boolean }>;
  totalPages: number;
  currentPage: number;
  enableFooter?: boolean;
}

const hxProps = {
  "hx-headers": JSON.stringify({ [HEADERS_CONSTANTS.renderFragment]: "true" }),
  "hx-replace-url": "true",
  "hx-target": "#table-body",
  "hx-select": "#table-body",
};

export const List = ({ rows, headers, totalPages, currentPage, enableFooter, ...p }: ListProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div id="list">
      <table class={cn("relative table border-separate border-spacing-0")} {...p}>
        <thead class="overflow-hidden">
          <Headers headers={headers} />
        </thead>
        <tbody id="table-body">{rows}</tbody>
        {enableFooter ? (
          <tfoot>
            <Headers headers={headers} />
          </tfoot>
        ) : null}
      </table>
      {totalPages > 1 ? <Pagination currentPage={currentPage} pages={pages} /> : null}
    </div>
  );
};

interface HeaderProps {
  headers: Array<{ label: string; queryName: string; disabledSorting?: boolean }>;
}

const Headers = ({ headers }: HeaderProps) => {
  const ctx = getContext();
  const query = ctx?.query as TableQuery;
  // const script = "on click call handleSort(event.target)";

  return (
    <tr class="sticky top-[70px] z-[1] bg-base-200 border-b-2 border-b-black">
      {headers.map((h) => {
        const isSort = query?.orderByName === h.queryName;
        return (
          <>
            {h.disabledSorting ? (
              <th class={cn(!h.disabledSorting && "cursor-pointer hover:bg-base-300")}>{h.label}</th>
            ) : (
              <th
                is="sortable-cell"
                id={`sortable-cell-${h.queryName}`}
                label={h.label}
                class={cn("sortable-cell", !h.disabledSorting && "cursor-pointer hover:bg-base-300")}
                direction="unsorted"
                htmx-unsorted-path={ctx?.path}
                htmx-sorted-up-path={`${ctx?.path}?${qs.stringify({
                  ...query,
                  orderByName: h.queryName,
                  orderByDir: "asc",
                })}`}
                htmx-sorted-down-path={`${ctx?.path}?${qs.stringify({
                  ...query,
                  orderByName: h.queryName,
                  orderByDir: "desc",
                })}`}
              >
                {h.label}
              </th>
            )}
          </>
        );
      })}
    </tr>
  );
};

const Pagination = (p: { pages: number[]; currentPage: number }) => {
  const ctx = getContext();
  const query = ctx?.query as TableQuery;

  return (
    <div class="w-full flex justify-center my-6">
      <div class="join">
        {p.pages.map((px) => (
          <button
            class={cn("join-item btn", px === p.currentPage && "btn-primary")}
            {...hxProps}
            hx-get={`${ctx?.path}?${qs.stringify({ ...query, page: px })}`}
            // _="on click take .btn-primary from .join-item for me"
            // TODO:send over the pagination when sort is clicked, I don't want to handle this...
          >
            {px}
          </button>
        ))}
      </div>
    </div>
  );
};
