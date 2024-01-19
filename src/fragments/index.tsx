import { Elysia } from "elysia";
import { omniSearchHandler } from "./handlers/omniSearchHandler";
import { decorateRequest } from "~/config/decorateRequest";

export const fragments = new Elysia({ prefix: "/fragments" })
  .use(decorateRequest)
  .all("/omnisearch", omniSearchHandler);
