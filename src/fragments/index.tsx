import { Elysia } from "elysia";
import { omniSearchHandler } from "./omniSearch";
import { decorateRequest } from "~/config/decorateRequest";

export const fragments = new Elysia({ prefix: "/fragments" })
  .use(decorateRequest)
  .get("/omnisearch", omniSearchHandler);
