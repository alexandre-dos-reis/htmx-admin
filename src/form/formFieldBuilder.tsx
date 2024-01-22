import { cn } from "~/utils";
import { ATTRIBUTES_CONSTANTS, HX_HEADERS_CONSTANTS } from "../config/constants";
import { HxValidation } from "./interfaces";
import {
  TextInputProps,
  RadioInputProps,
  ToggleInputProps,
  DropdownInputProps,
  SelectInputProps,
} from "~/form/inputs/*";
import { getContext } from "~/config/globalStorages";

type InputProps = HxValidation &
  (TextInputProps | RadioInputProps | ToggleInputProps | DropdownInputProps | SelectInputProps);

export const formFieldBuilder = <TInputProps extends InputProps>(props: TInputProps) => {
  const wrapperId = `${props.name}${ATTRIBUTES_CONSTANTS.form["inputWrapperId"]}`;
  const ctx = getContext();
  const errors = props.errors;
  const errorId = `${props.name}${ATTRIBUTES_CONSTANTS.form["inputErrorId"]}`;

  return {
    inputProps: {
      ...props,
      id: `${props.name}${ATTRIBUTES_CONSTANTS.form["inputId"]}`,
      value: (ctx?.body ? (ctx?.body as Record<string, string>)?.[props.name] : props.value) as TInputProps["value"],
      ...(props.hxValidation
        ? {
            "hx-sync": "closest form:abort",
          }
        : undefined),
    },
    wrapperProps: {
      class: cn(
        "form-control w-full h-fit relative pb-7",
        props.colspanClass ?? "col-span-12 lg:col-span-6 xl:col-span-4",
      ),
      id: wrapperId,
      ...(props.hxValidation
        ? {
            "hx-post": ctx?.path,
            "hx-select": `#${wrapperId}`,
            // "hx-target": "this",
            "hx-trigger":
              props.hxValidation.triggerOn === "keyup"
                ? "keyup changed delay:1s from:find input"
                : "change from:find input",
            "hx-ext": "morph",
            "hx-swap": "morph:outerHTML",
            "hx-include": `closest form`,
            "hx-headers": JSON.stringify({
              [HX_HEADERS_CONSTANTS.formValidation]: true,
            }),
          }
        : {}),
    },
    Label: props.label ? <Label>{props.label}</Label> : null,
    error: {
      errorId,
      isError: !!errors,
      Errors: errors ? <Error id={errorId}>{errors[0]}</Error> : null,
    },
  };
};

const Label = (p: JSX.ElementChildrenAttribute) => (
  <div class="label">
    <span class="label-text">{p.children}</span>
  </div>
);

const Error = (p: JSX.ElementChildrenAttribute & { id: string }) => (
  <div id={p.id} class={cn("label absolute bottom-0")}>
    <span class="label-text-alt text-error whitespace-nowrap">{p.children}</span>
  </div>
);
