import { globalContext } from "~/config/globalStorages";
import { cn } from "../utils";
import { HX_HEADERS_CONSTANTS } from "~/config/constants";

interface Props extends JSX.HtmlFormTag {
  submitBtnlabel?: string;
  hxHeaders?: Record<string, string>;
  renderAsFragmentRoute?: boolean;
}

export const Form = ({ children, submitBtnlabel, hxHeaders, renderAsFragmentRoute, ...otherProps }: Props) => {
  const context = globalContext.getStore();
  return (
    <form
      id="form"
      novalidate
      autocomplete="off"
      hx-post={context?.path}
      hx-swap="outerHTML"
      hx-headers={
        hxHeaders || renderAsFragmentRoute
          ? JSON.stringify({
              ...hxHeaders,
              ...(renderAsFragmentRoute ? { [HX_HEADERS_CONSTANTS.renderFragmentRoute]: "true" } : {}),
            })
          : undefined
      }
      {...otherProps}
    >
      <div class={cn("grid grid-cols-12 lg:gap-x-20 gap-y-3 mb-20")}>{children}</div>
      <div class={cn("flex justify-center")}>
        <button
          type="submit"
          // This will block the user submitting the form if javascript is disabled...
          // disabled={!isValid}
          class={cn("btn btn-outline btn-neutral mb-10")}
        >
          {submitBtnlabel ?? "Submit"}
        </button>
      </div>
    </form>
  );
};
