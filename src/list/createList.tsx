import { List } from "~/components/List";
import { ContextDecorated } from "~/config/decorateRequest";
import { globalContext } from "~/config/globalStorages";
import { cn, isObjectEmpty } from "~/utils";
import { z } from "zod";
import { MaybePromise } from "~/utils/types";

type ColumnDef<T> = {
  label?: string;
  row?: (data: T) => JSX.Element;
  disableSorting?: boolean;
};

const orderByDirectionSchema = z.union([z.literal("asc"), z.literal("desc")]);
type SortByDirection = z.infer<typeof orderByDirectionSchema>;

type LoadDataConfig<T extends Array<Record<string, any>>> = { data: T; totalRows: number };

export const createList = async <
  TDatas extends Array<Record<string | number | symbol, any>>,
  TRow extends TDatas[number],
  TColumnsKeys extends keyof TRow,
>({
  columns,
  loadData,
  rowClickHref,
  config,
}: {
  columns: Partial<Record<keyof TRow, ColumnDef<TRow>>>;
  loadData: (
    ctx: ContextDecorated,
    state: {
      sort?: { byName: TColumnsKeys; byDirection: SortByDirection };
      pagination: { currentPage: number; rowsPerPage: number };
    },
  ) => MaybePromise<LoadDataConfig<TDatas>>;
  config?: {
    rowsPerPage?: number;
    defaultSorting?: {
      byName: TColumnsKeys;
      byDirection: SortByDirection;
    };
  };
  rowClickHref?: (arg: TRow) => string;
}) => {
  let dataConfig: LoadDataConfig<TDatas>;
  const context = globalContext.getStore() as NonNullable<ContextDecorated>;
  let currentPage = 1;
  const rowsPerPage = config?.rowsPerPage ?? 10;

  if (!isObjectEmpty(context.query)) {
    const parsed = z
      .object({
        byName: z
          .string()
          .refine((v) => Object.keys(columns).includes(v))
          .optional(),
        byDirection: orderByDirectionSchema.optional(),
        page: z.preprocess((v) => parseInt(String(v), 10), z.number()).optional(),
      })
      .safeParse({
        byName: context.query["orderByName"],
        byDirection: context.query["orderByDir"],
        page: context.query["page"],
      });

    currentPage = parsed.success ? parsed.data.page ?? 1 : 1;

    dataConfig = await Promise.resolve(
      loadData(
        context,
        parsed.success
          ? {
              sort:
                parsed.data.byDirection && parsed.data.byName
                  ? { byDirection: parsed.data.byDirection, byName: parsed.data.byName as TColumnsKeys }
                  : undefined,
              pagination: { currentPage, rowsPerPage },
            }
          : { sort: undefined, pagination: { currentPage, rowsPerPage } },
      ),
    );
  } else {
    dataConfig = await Promise.resolve(
      loadData(context, { sort: config?.defaultSorting, pagination: { currentPage, rowsPerPage } }),
    );
  }

  const totalPages = Math.ceil(dataConfig.totalRows / rowsPerPage);

  return {
    renderList: () => (
      <List
        totalPages={totalPages}
        currentPage={currentPage}
        headers={Object.keys(columns).map((keyofCol) => ({
          queryName: keyofCol,
          // @ts-ignore
          label: columns[keyofCol as TColumnsKeys].label ?? keyofCol,
          disabledSorting: columns?.[keyofCol as TColumnsKeys]?.disableSorting,
        }))}
        rows={dataConfig.data.map((d) => (
          <tr
            class={cn(rowClickHref && "hover:bg-base-200 cursor-pointer")}
            hx-get={rowClickHref ? rowClickHref(d) : undefined}
            hx-replace-url={rowClickHref ? "true" : undefined}
          >
            {Object.keys(columns).map((keyofCol) => {
              // @ts-ignore
              return <th>{columns[keyofCol as TColumnsKeys].row?.(d) ?? d[keyofCol]}</th>;
            })}
          </tr>
        ))}
      />
    ),
  };
};
