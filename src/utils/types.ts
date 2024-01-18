export type MaybePromise<T> = T | Promise<T>;

export type PartialExtended<T extends Record<string, any>> = {
  [P in keyof T]: T[P] | null | undefined;
};
