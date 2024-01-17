import { globalContext } from "~/config/globalStorages";
import { Link } from "./Link";
import { cn } from "~/utils";
import { HX_HEADERS_CONSTANTS } from "~/config/constants";

export const Tabs = (p: JSX.ElementChildrenAttribute & { tabs: Array<{ href: string; label: string }> }) => {
  const context = globalContext.getStore();

  if (context?.isFormValidationRequest) {
    return <>{p.children}</>;
  }

  return (
    <>
      {!context?.renderFragmentRoute ? (
        <div role="tablist" class="tabs tabs-boxed mb-16">
          {p.tabs.map((t) => {
            const isActive = context?.path === t.href;
            return (
              <Link
                href={t.href}
                role="tab"
                class={cn("tab", isActive && "tab-active cursor-default")}
                hxHeaders={{ [HX_HEADERS_CONSTANTS.renderFragmentRoute]: "true" }}
                hx-swap="outerHTML"
                hx-target="#tab-fragment"
                hx-select="#tab-fragment"
                // preload="mouseover"
                _="on click take .tab-active from .tab for me then toggle .cursor-default on .tab"
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      ) : null}
      <div id="tab-fragment">{p.children}</div>
    </>
  );
};
