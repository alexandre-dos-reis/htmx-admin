import { getContext } from "~/config/globalStorages";
import qs from "qs";
import { Sort, SortUp, SortDown, XMark } from "~/components/svg/*";
import { cn } from "~/utils";
import { HX_HEADERS_CONSTANTS } from "~/config/constants";

export type TableQuery = { orderByName?: string; orderByDir?: "desc" | "asc"; page?: number } | undefined;

export interface ListProps extends JSX.HtmlTableTag {
  rows: Array<JSX.Element>;
  headers: Array<{ label: string; queryName: string; disabledSorting?: boolean }>;
  totalPages: number;
  currentPage: number;
  enableFooter?: boolean;
}

const hxProps = {
  "hx-headers": JSON.stringify({ [HX_HEADERS_CONSTANTS.renderFragment]: "true" }),
  "hx-replace-url": "true",
  "hx-target": "#list",
};

export const List = ({ rows, headers, totalPages, currentPage, enableFooter, ...p }: ListProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div id="list">
      <table class={cn("relative table border-separate border-spacing-0")} {...p}>
        <thead class="overflow-hidden">
          <ColumnsTitle headers={headers} />
        </thead>
        <tbody>{rows}</tbody>
        {enableFooter ? (
          <tfoot>
            <ColumnsTitle headers={headers} />
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

const ColumnsTitle = ({ headers }: HeaderProps) => {
  const ctx = getContext();
  const query = ctx?.query as TableQuery;

  return (
    <tr class="sticky top-[70px] z-[1] bg-base-200 border-b-2 border-b-black">
      {headers.map((h) => (
        <th
          class={cn(
            !h.disabledSorting && "cursor-pointer hover:bg-base-300",
            query?.orderByName === h.queryName && "bg-base-300",
          )}
        >
          <div class="flex justify-between">
            {h.disabledSorting ? (
              <span>{h.label}</span>
            ) : (
              <div
                class="flex gap-3 w-full"
                {...hxProps}
                hx-get={`${ctx?.path}?${qs.stringify({
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
              {...hxProps}
              hx-get={ctx?.path}
            />
          </div>
        </th>
      ))}
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
          >
            {px}
          </button>
        ))}
      </div>
    </div>
  );
};
