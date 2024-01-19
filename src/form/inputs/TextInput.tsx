import { cn } from "~/utils";
import { formFieldBuilder, BaseInputComponent, HxValidation } from "~/form/*";

export interface TextInputProps extends Omit<JSX.HtmlInputTag, "name" | "type">, BaseInputComponent, HxValidation {
  type?: JSX.HtmlInputTag["type"] | "textarea";
  _?: string;
}

export const TextInput = (props: TextInputProps) => {
  let {
    error: { Errors, isError },
    Label,
    inputProps: { type, value, ...inputProps },
    wrapperProps,
  } = formFieldBuilder(props);

  return (
    <label {...wrapperProps}>
      {Label}
      {type === "textarea" ? (
        <textarea class={cn("textarea textarea-bordered textarea-primary w-full h-24")} {...inputProps}>
          {value}
        </textarea>
      ) : (
        <input
          class={cn("input input-bordered input-primary w-full", isError && "input-error")}
          type={type}
          value={value}
          {...inputProps}
        />
      )}
      {Errors}
    </label>
  );
};
