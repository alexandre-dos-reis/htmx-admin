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
      {headers.map((h) => {
        const isSorted = query?.orderByName === h.queryName;
        const isSortedUp = isSorted && query.orderByDir === "asc";
        const isSortedDown = isSorted && query.orderByDir === "desc";
        const sortedBg = "bg-base-300";

        const sortUpId = `${h.queryName}-sorted-up`;
        const sortDownId = `${h.queryName}-sorted-down`;
        const invisible = "invisible";

        return (
          <th class={cn(!h.disabledSorting && "cursor-pointer hover:bg-base-300", isSorted && sortedBg)}>
            <div class="flex">
              {h.disabledSorting ? (
                <div>{h.label}</div>
              ) : (
                <>
                  <div
                    class="flex gap-3 items-center w-full"
                    {...hxProps}
                    hx-get={`${ctx?.path}?${qs.stringify({
                      ...query,
                      orderByName: h.queryName,
                      orderByDir: isSortedUp ? "desc" : "asc",
                    })}`}
                    _={`on click 
                         ${
                           !isSorted
                             ? `add .${sortedBg} to the closest <th/> then add .${invisible} to #${sortDownId}`
                             : `toggle .${invisible} on #${sortDownId} then toggle .${invisible} on #${sortUpId}`
                         }
                      `}
                  >
                    <div class="flex flex-col justify-center items-center h-full">
                      <SortUp
                        id={sortUpId}
                        class={cn("fill-neutral-500 relative top-[8px]", isSortedDown && invisible)}
                      />
                      <SortDown
                        id={sortDownId}
                        class={cn("sorted-down fill-neutral-500 relative -top-[8px]", isSortedUp && invisible)}
                      />
                    </div>
                    <div class="w-full">{h.label}</div>
                  </div>
                  <XMark
                    class={cn("z-[1] m-3 fill-neutral-500", !isSorted && invisible)}
                    {...hxProps}
                    hx-get={ctx?.path}
                    _={`on click 
                          remove .${sortedBg} from the closest <th/> then 
                          remove .${invisible} from #${sortDownId} then 
                          remove .${invisible} from #${sortUpId} then
                          add .${invisible} to me
                      `}
                  />
                </>
              )}
            </div>
          </th>
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
          >
            {px}
          </button>
        ))}
      </div>
    </div>
  );
};
