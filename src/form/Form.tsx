import { getContext } from "~/config/globalStorages";
import { cn } from "../utils";

interface Props extends JSX.HtmlFormTag {
  submitBtnlabel?: string;
  // TODO: implement : submitAndContinueBtnlabel?: string;
  hxHeaders?: Record<string, string>;
  // renderAsFragmentRoute?: boolean;
}

export const Form = ({ children, submitBtnlabel, hxHeaders, ...otherProps }: Props) => {
  const ctx = getContext();
  return (
    <form
      id="form"
      novalidate
      autocomplete="off"
      hx-post={ctx?.path}
      hx-swap="outerHTML"
      hx-replace-url="true"
      hx-headers={hxHeaders ? JSON.stringify(hxHeaders) : undefined}
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
