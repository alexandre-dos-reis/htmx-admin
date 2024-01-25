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
    is?: string; // custom elements
    _?: string;
    "hx-swap"?: HxSwap;
    preload?: (string & {}) | boolean | "mouseover";
    "hx-select"?: (string & {}) | "#main";
    "hx-target"?: (string & {}) | "#main";
    "hx-headers"?: string;
    "hx-replace-url"?: (string & {}) | "true";
    "hx-push-url"?: (string & {}) | "true";
  }
}
