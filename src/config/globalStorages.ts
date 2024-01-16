import { AsyncLocalStorage } from "async_hooks";
import { type ContextDecorated } from "./decorateRequest";

export const globalContext = new AsyncLocalStorage<ContextDecorated>();
