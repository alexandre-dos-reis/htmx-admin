import { Elysia } from "elysia";
import { globalContext } from "./globalStorages";
import { type ContextDecorated } from "./decorateRequest";

export const globals = new Elysia().onBeforeHandle((context) => {
  globalContext.enterWith(context as ContextDecorated);
});
