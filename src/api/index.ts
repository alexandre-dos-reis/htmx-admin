import Elysia from "elysia";
import { decorateRequest } from "~/config/decorateRequest";
import { PrismaModelName } from "~/database/client";
import { z } from "zod";
import { notifyAndRedirect } from "~/responses";
import { upperFirst } from "~/utils/func";

const resourceToPrismaModelName = (modelName: string) => {
  const map = {
    customers: "customer",
  } satisfies Record<string, PrismaModelName>;

  if (modelName in map) {
    return map[modelName as keyof typeof map];
  }

  throw new Error("Wrong modelName !");
};

export const api = new Elysia({ name: "api", prefix: "/api" })
  .use(decorateRequest)
  .delete("/ressources/*", async ({ params, db, set }) => {
    try {
      const [resource, id] = params["*"].split("/");

      const uuid = z.string().uuid().parse(id);

      const prismaModelName = resourceToPrismaModelName(resource);

      await db[prismaModelName].delete({
        where: {
          id: uuid,
        },
      });

      return notifyAndRedirect({
        set,
        to: `/${resource}`,
        message: `${upperFirst(prismaModelName)} deleted successfully !`,
      });
    } catch (e) {
      console.log(e);
    }
  });
