import { ContextDecorated } from "~/config/decorateRequest";
import { PrismaModelName } from "./client";

export const listStateMapperToDb = async ({
  modelName,
  state: {
    pagination: { rowsPerPage, currentPage },
    sort,
  },
  ctx: { db },
}: {
  ctx: ContextDecorated;
  state: {
    pagination: { currentPage: number; rowsPerPage: number };
    sort?: { byName: string; byDirection: string };
  };
  modelName: PrismaModelName;
}) => {
  const orderBy = sort ? { [sort?.byName]: sort?.byDirection } : undefined;
  const [data, totalRows] = await db.$transaction([
    db[modelName].findMany({
      take: rowsPerPage,
      skip: rowsPerPage * (currentPage - 1),
      orderBy,
    }),
    db.customer.count({
      orderBy,
    }),
  ]);
  return { data, totalRows };
};
