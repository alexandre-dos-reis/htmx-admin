import { ContextDecorated } from "~/config/decorateRequest";
import { PrismaModelName } from "./client";
import { Prisma } from "@prisma/client";

type PrismaFindManyArgs<T extends PrismaModelName> = T extends "customer" ? Prisma.CustomerFindManyArgs : never;

export const listStateMapperToDb = async <
  TFindManyArgs extends PrismaFindManyArgs<TModeName>,
  TModeName extends PrismaModelName,
>({
  modelName,
  state: {
    pagination: { rowsPerPage, currentPage },
    sort,
  },
  ctx: { db },
  select,
}: {
  ctx: ContextDecorated;
  state: {
    pagination: { currentPage: number; rowsPerPage: number };
    sort?: { byName: string; byDirection: string };
  };
  modelName: TModeName;
  select?: TFindManyArgs["select"];
}) => {
  const orderBy = sort ? { [sort?.byName]: sort?.byDirection } : undefined;

  const [data, totalRows] = await db.$transaction([
    db[modelName].findMany({
      take: rowsPerPage,
      skip: rowsPerPage * (currentPage - 1),
      orderBy,
      select,
    }),
    db[modelName].count({
      orderBy,
    }),
  ]);
  return { data, totalRows };
};
