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
  "hx-on-click": "handleSort(this)",
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
            <th
              is="sortable-cell"
              state="unsorted"
              class={cn(!h.disabledSorting && "cursor-pointer hover:bg-base-300")}
            ></th>
            {/* <th class={cn(!h.disabledSorting && "cursor-pointer hover:bg-base-300", isSort && "bg-base-300")}> */}
            {/*   <div data-sort-group={h.queryName} class={cn("flex justify-between", !h.disabledSorting && "sort-group")}> */}
            {/*     {h.disabledSorting ? ( */}
            {/*       <span>{h.label}</span> */}
            {/*     ) : ( */}
            {/*       <> */}
            {/*         <div */}
            {/*           class={cn("unsorted flex justify-between gap-3 w-full", isSort && "hidden")} */}
            {/*           {...hxProps} */}
            {/*           hx-get={`${ctx?.path}?${qs.stringify({ */}
            {/*             ...query, */}
            {/*             orderByName: h.queryName, */}
            {/*             orderByDir: "asc", */}
            {/*           })}`} */}
            {/*         > */}
            {/*           <Sort class={cn("fill-neutral-500")} /> */}
            {/*           <span class="w-full">{h.label}</span> */}
            {/*         </div> */}
            {/*         <div */}
            {/*           class={cn( */}
            {/*             "sorted-up flex justify-between gap-3 w-full", */}
            {/*             (!isSort || (isSort && query.orderByDir === "desc")) && "hidden", */}
            {/*           )} */}
            {/*           {...hxProps} */}
            {/*           hx-get={`${ctx?.path}?${qs.stringify({ */}
            {/*             ...query, */}
            {/*             orderByName: h.queryName, */}
            {/*             orderByDir: "desc", */}
            {/*           })}`} */}
            {/*         > */}
            {/*           <SortUp class={cn("fill-neutral-500")} /> */}
            {/*           <span class="w-full">{h.label}</span> */}
            {/*         </div> */}
            {/*         <div */}
            {/*           class={cn( */}
            {/*             "sorted-down flex justify-between gap-3 w-full", */}
            {/*             (!isSort || (isSort && query.orderByDir === "asc")) && "hidden", */}
            {/*           )} */}
            {/*           {...hxProps} */}
            {/*           hx-get={`${ctx?.path}?${qs.stringify({ */}
            {/*             ...query, */}
            {/*             orderByName: h.queryName, */}
            {/*             orderByDir: "asc", */}
            {/*           })}`} */}
            {/*         > */}
            {/*           <SortDown class={cn("fill-neutral-500")} /> */}
            {/*           <span class="w-full">{h.label}</span> */}
            {/*         </div> */}
            {/*         <div {...hxProps} class={cn("reset-sort z-[1]", !isSort && "hidden")} hx-get={ctx?.path}> */}
            {/*           <XMark class={cn("fill-neutral-500")} /> */}
            {/*         </div> */}
            {/*       </> */}
            {/*     )} */}
            {/*   </div> */}
            {/* </th> */}
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
          >
            {px}
          </button>
        ))}
      </div>
    </div>
  );
};
