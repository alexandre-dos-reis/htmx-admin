import { cn } from "../utils";

interface Props extends JSX.HtmlDetailsTag {
  label: JSX.Element;
  labelWhenOpen?: JSX.Element;
  contentClass?: string;
}

export const DropDown = ({ class: classname, label, labelWhenOpen, children, contentClass, ...otherProps }: Props) => (
  <details class={cn("dropdown", classname)} {...otherProps}>
    <summary class="btn m-1">
      <span class="[[open]>*>&]:hidden">{label}</span>
      <span class="hidden [[open]>*>&]:inline">{labelWhenOpen ?? label}</span>
    </summary>
    <div class={cn("dropdown-content menu z-[1] w-52 rounded-box", contentClass ?? "bg-base-300 p-2 shadow")}>
      {children}
    </div>
  </details>
);
