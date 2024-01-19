import { Elysia } from "elysia";
import { decorateRequest } from "~/config/decorateRequest";
import { list } from "./handlers/list";
import { create } from "./handlers/create";
import { edit } from "./handlers/edit";
import { editPictures } from "./handlers/editPictures";

export const customers = new Elysia({ prefix: "/customers" })
  .use(decorateRequest)
  .all("/", list)
  .all("/create", create)
  .all("/:id", edit)
  .all("/:id/pictures", editPictures);
