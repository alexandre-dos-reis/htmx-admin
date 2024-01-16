import { cn } from "~/utils";
import { formFieldBuilder, BaseFormComponent } from "~/form/*";

export interface SelectInputProps extends Omit<JSX.HtmlSelectTag, "name" | "multiple">, BaseFormComponent {
  options: Array<{ value: string; label: string }>;
  value?: string;
  defaultOptionLabel?: string;
}

export const SelectInput = (props: SelectInputProps) => {
  const {
    inputProps: { value, options, defaultOptionLabel, ...inputProps },
    error: { errorId, isError, Errors },
    wrapperProps,
    Label,
  } = formFieldBuilder(props);

  const errorClass = "select-error";

  return (
    <label {...wrapperProps}>
      {Label}
      <select
        class={cn("select select-primary w-full", isError && errorClass)}
        {...inputProps}
        _={`on change if #${errorId} exists remove #${errorId} then remove .${errorClass}`}
      >
        <option disabled selected={value ? undefined : "selected"} value="">
          {defaultOptionLabel ?? "-Select a choice-"}
        </option>
        {options.map((o) => (
          <option value={o.value} selected={value === o.value ? "selected" : undefined}>
            {o.label}
          </option>
        ))}
      </select>
      {Errors}
    </label>
  );
};
