import { getContext } from "~/config/globalStorages";
import { cn } from "../utils";
import { HEADERS_CONSTANTS } from "~/config/constants";

interface Props extends JSX.HtmlFormTag {
  submitBtnlabel?: string;
  submitAndContinueBtnlabel?: string;
  deleteBtnLabel?: string;
  hxHeaders?: Record<string, string>;
  mode?: "edit" | "create";
}

export const Form = ({
  children,
  submitBtnlabel,
  hxHeaders,
  submitAndContinueBtnlabel,
  deleteBtnLabel,
  mode,
  ...otherProps
}: Props) => {
  const ctx = getContext();
  mode = mode ?? "create";
  return (
    <form
      id="form"
      novalidate
      autocomplete="off"
      hx-post={ctx?.path}
      hx-swap="outerHTML"
      hx-replace-url="true"
      hx-headers={hxHeaders ? JSON.stringify(hxHeaders) : undefined}
      class={cn("grid grid-cols-12 lg:gap-x-20 gap-y-3 mb-20")}
      {...otherProps}
    >
      {children}
      <div class={cn("col-span-12 flex mt-5")}>
        <div class="w-full flex justify-center gap-x-8">
          <button type="submit" class={cn("btn btn-outline btn-neutral mb-10")}>
            {submitBtnlabel ?? "Save"}
          </button>
          {mode === "edit" ? (
            <button
              type="button"
              class={cn("btn btn-outline btn-neutral mb-10")}
              hx-post={ctx?.path}
              hx-swap="none"
              hx-headers={JSON.stringify({
                ...hxHeaders,
                [HEADERS_CONSTANTS.formSaveAndContinue]: true,
              })}
              hx-include="#form"
            >
              {submitAndContinueBtnlabel ?? "Save and continue"}
            </button>
          ) : null}
        </div>
        {mode === "edit" ? (
          <button
            type="button"
            class={cn("btn btn-outline btn-error btn-neutral mb-10")}
            hx-delete={`/api/ressources${ctx?.path}`}
            hx-swap="none"
          >
            {deleteBtnLabel ?? "Delete"}
          </button>
        ) : null}
      </div>
    </form>
  );
};
