import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isObjectEmpty = (obj: Record<string, any> | undefined) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

export type ComponentProps<T extends (props: any) => JSX.Element> = Parameters<T>[number];
