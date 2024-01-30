import { HEADERS_CONSTANTS } from "./constants";

type Args = Partial<Record<keyof typeof HEADERS_CONSTANTS, string | boolean>>;

export const getHeaders = (args: Args) => {
  return JSON.stringify(args);
};

export const getHxHeaders = (args: Args & Record<string, string | boolean>) => {
  return { "hx-headers": getHeaders(args) };
};
