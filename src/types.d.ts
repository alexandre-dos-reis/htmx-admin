type HxSwap =
  | (string & {})
  | "innerHTML"
  | "outerHTML"
  | "beforebegin"
  | "afterbegin"
  | "beforeend"
  | "afterend"
  | "delete"
  | "none";

declare namespace JSX {
  interface HtmlTag {
    _?: string;
    "hx-swap"?: HxSwap;
    preload?: (string & {}) | boolean | "mouseover";
    "hx-select"?: (string & {}) | "#main";
    "hx-target"?: (string & {}) | "#main";
    "hx-headers"?: string;
    "hx-replace-url"?: "true";
  }
}
