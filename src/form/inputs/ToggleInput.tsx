import { cn } from "~/utils";
import { formFieldBuilder, BaseFormComponent } from "~/form/*";

export interface ToggleInputProps extends Omit<JSX.HtmlInputTag, "name" | "value">, BaseFormComponent {
  value?: boolean;
  label?: string;
  noLabel?: string;
  yesLabel?: string;
}

export const ToggleInput = (props: ToggleInputProps) => {
  const {
    inputProps: { value, name, yesLabel, noLabel, ...inputProps },
    wrapperProps,
    error: { Errors },
    Label,
  } = formFieldBuilder(props);

  const yesNoClass = `${name}-choices`;

  return (
    <label {...wrapperProps}>
      {Label}
      <label class="label flex justify-start gap-6">
        <input
          type="checkbox"
          class={cn("toggle toggle-primary")}
          {...inputProps}
          name={name}
          value={value ? "true" : "false"}
          checked={value ? "checked" : undefined}
          _={`on change toggle .font-bold on .${yesNoClass}`}
        />
        <span class="label-text">
          <span class={cn(yesNoClass, !value && "font-bold")}>{noLabel ?? "No"}</span>
          <span> / </span>
          <span class={cn(yesNoClass, value && "font-bold")}>{yesLabel ?? "Yes"}</span>
        </span>
      </label>
      {Errors}
    </label>
  );
};
