import { Check } from "~/components/svg/Check";
import { XMark } from "~/components/svg/XMark";
import { cn } from "~/utils";
import { formFieldBuilder, BaseInputComponent } from "~/form/*";
import { ContextDecorated } from "~/config/decorateRequest";
import { getContext } from "~/config/globalStorages";

export interface DropdownInputProps extends Omit<JSX.HtmlInputTag, "name" | "value">, BaseInputComponent {
  choices: (ctx?: ContextDecorated) => Array<{ value: string; children: string }>;
  value?: Array<string>;
  label: string;
  noSelectionLabel?: string;
}

const bgColors = ["bg-primary", "bg-secondary", "bg-accent", "bg-info", "bg-success", "bg-warning", "bg-error"];

export const DropdownInput = (props: DropdownInputProps) => {
  const {
    inputProps: { id, value, name, choices: _choices, noSelectionLabel, ...inputProps },
    wrapperProps,
    Label,
    error: { Errors, isError, errorId },
  } = formFieldBuilder(props);

  const ctx = getContext();
  const choices = _choices(ctx).map((c) => ({
    ...c,
    isSelected: value?.includes(c.value) || false,
    checkedId: `${id}-${c.value}-checked-value`,
  }));
  const valueDisplayId = `${name}-value-display`;
  const optionId = `${name}-option`;
  const noSelectionId = `${name}-no-selection`;
  const borderErrorId = `${name}-border`;

  return (
    <label {...wrapperProps}>
      {Label}
      {/* hidden input */}
      <select class="hidden" id={id} name={name} multiple="multiple">
        <option selected="selected" value=""></option>
        {choices.map((c) => {
          return (
            <option
              class={`${name}-options`}
              id={`${optionId}-${c.value}`}
              value={c.value}
              selected={c.isSelected ? "selected" : undefined}
            >
              {c.children}
            </option>
          );
        })}
      </select>

      {/* display selected choices */}
      <div class={cn("dropdown dropdown-hover w-full mb-0 min-h-12 relative")}>
        <div
          tabindex="0"
          role="button"
          class={cn(
            "btn btn-primary btn-outline justify-start w-full h-full p-2 group/wrapper",
            isError && "border-error",
          )}
          id={borderErrorId}
        >
          <span
            class={cn(
              "block p-1 text-neutral-content group-hover/wrapper:text-primary-content",
              value && value?.length !== 0 && "hidden",
            )}
            id={noSelectionId}
          >
            {noSelectionLabel ?? "No selection"}
          </span>
          {choices.map((c, i) => {
            return (
              <div
                class={cn(
                  "text-primary-content rounded",
                  bgColors[i % bgColors.length],
                  c.isSelected ? "flex" : "hidden",
                  "items-center justify-center flex-nowrap",
                )}
                id={`${valueDisplayId}-${c.value}`}
              >
                <span class={cn("p-1")}>{c.children}</span>
                <span
                  class={cn("hover:bg-neutral-content p-1 group/close")}
                  _={`on click toggle @selected=selected on #${optionId}-${c.value} 
                      then remove .border-error from #${borderErrorId} 
                      then toggle .invisible on #${c.checkedId} 
                      then toggle between .hidden and .flex on #${valueDisplayId}-${c.value}
                      then if #${errorId} exists remove #${errorId} end
                      then if (<option.${name}-options[selected]/>).length is 0 
                          remove .hidden from #${noSelectionId}
                        else
                          add .hidden to #${noSelectionId}
                        end
                  `}
                >
                  <XMark class="fill-primary-content group-hover/close:fill-warning-content" />
                </span>
              </div>
            );
          })}
        </div>

        {/* choices */}
        <ul tabindex="0" class="dropdown-content z-[1] menu shadow bg-base-300 rounded-box w-full">
          {choices.map((c) => {
            return (
              <li
                _={`on click toggle @selected=selected on #${optionId}-${c.value} 
                      then toggle .invisible on #${c.checkedId} 
                      then remove .border-error from #${borderErrorId} 
                      then toggle between .hidden and .flex on #${valueDisplayId}-${c.value}
                      then if #${errorId} exists remove #${errorId} end
                      then if (<option.${name}-options[selected]/>).length is 0 
                          remove .hidden from #${noSelectionId}
                        else
                          add .hidden to #${noSelectionId}
                        end
                  `}
              >
                <a class={cn("flex justify-between")}>
                  <span>{c.children}</span>
                  <span id={c.checkedId} class={cn(!c.isSelected && "invisible")}>
                    <Check class={cn("fill-green-500")} />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      {Errors}
    </label>
  );
};
