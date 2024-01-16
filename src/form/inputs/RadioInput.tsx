import { cn } from "~/utils";
import { formFieldBuilder, BaseFormComponent } from "~/form/*";

export interface RadioInputProps extends Omit<JSX.HtmlInputTag, "name">, BaseFormComponent {
  label?: string;
  choices: Array<{ value: string; children: JSX.Element }>;
}

const colors = [
  "radio-primary",
  "radio-secondary",
  "radio-accent",
  "radio-success",
  "radio-warning",
  "radio-info",
  "radio-error",
];

export const RadioInput = (props: RadioInputProps) => {
  const {
    error: { Errors },
    inputProps: { choices, value, id, ...inputProps },
    wrapperProps,
    Label,
  } = formFieldBuilder(props);

  return (
    <label {...wrapperProps}>
      {Label}
      {choices.map((choice, i) => {
        const isSelected = choice.value === value;
        return (
          <label class="label cursor-pointer flex justify-start gap-6">
            <input
              class={cn("radio", colors[i % colors.length])}
              {...inputProps}
              id={`${id}-${choice.value}`}
              value={choice.value}
              checked={isSelected ? true : undefined}
              type="radio"
              _={`on click take .font-bold from .label-text for the next <span/>`}
            />
            <span class={cn("label-text", isSelected && "font-bold")}>{choice.children}</span>
          </label>
        );
      })}
      {Errors}
    </label>
  );
};
