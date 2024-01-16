import { List } from "~/components/List";
import { ContextDecorated } from "~/config/decorateRequest";
import { globalContext } from "~/config/globalStorages";
import { cn, isObjectEmpty } from "~/utils";
import { z } from "zod";

type ColumnDef<T> = {
  label?: string;
  row?: (data: T) => JSX.Element;
  disableSorting?: boolean;
};

const orderByDirectionSchema = z.union([z.literal("asc"), z.literal("desc")]);

type MaybePromise<T> = T | Promise<T>;

type DataConfig<T extends Array<Record<string, any>>> = { data: T; totalRows: number; currentPage?: number };

export const createList = async <
  TDatas extends Array<Record<string | number | symbol, any>>,
  TRow extends TDatas[number],
  TColumnsKeys extends keyof TRow,
>({
  columns,
  loadData,
  rowClickHref,
  pagination,
}: {
  columns: Partial<Record<keyof TRow, ColumnDef<TRow>>>;
  loadData: (
    ctx: ContextDecorated,
    state: {
      sort?: { byName: TColumnsKeys; byDirection: z.infer<typeof orderByDirectionSchema> };
      pagination: { currentPage: number };
    },
  ) => MaybePromise<DataConfig<TDatas>>;
  pagination?: {
    rowsPerPage?: number;
  };
  rowClickHref?: (arg: TRow) => string;
}) => {
  let dataConfig: DataConfig<TDatas>;
  const context = globalContext.getStore() as NonNullable<ContextDecorated>;

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

    dataConfig = await Promise.resolve(
      loadData(
        context,
        parsed.success
          ? {
              sort: { byDirection: parsed.data.byDirection, byName: parsed.data.byName as TColumnsKeys },
              pagination: { currentPage: parsed.data.page },
            }
          : { sort: undefined, pagination: 1 },
      ),
    ).then((v) => v);
  } else {
    dataConfig = await Promise.resolve(loadData(context, { pagination: { currentPage: 1 } })).then((v) => v);
  }

  const rowsPerPage = pagination?.rowsPerPage ?? 10;
  const totalPages = Math.ceil(dataConfig.totalRows / rowsPerPage);

  // console.log({ dataConfig, totalPages, rowsPerPage });

  return {
    renderList: () => (
      <List
        totalPages={totalPages}
        currentPage={dataConfig.currentPage || 1}
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
