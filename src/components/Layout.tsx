import { getContext } from "~/config/globalStorages";
import { cn } from "../utils";
import { ENV_VARS } from "../utils/envvars";
import { Header } from "./Header";
import { Navbar } from "./Navbar";
import { defaultTheme } from "../../tailwind.config";

const Main = (p: JSX.ElementChildrenAttribute) => (
  <main
    id="main"
    hx-swap="outerHTML"
    hx-swap-oob="true"
    class={cn("relative mx-5 sm:mx-10 md:mx-15 lg:mx-20 pt-10 pb-20")}
  >
    {p.children}
  </main>
);

export const Layout = ({ children, ...p }: JSX.HtmlBodyTag) => {
  const ctx = getContext();

  if (ctx?.renderFragment || ctx?.isFormValidationRequest) {
    return <>{children}</>;
  }

  if (ctx?.isHxRequest) {
    return (
      <>
        {ctx?.renderNavbar ? <Navbar /> : null}
        <Main>{children}</Main>
      </>
    );
  }

  return (
    <html lang="en" id="html" _={`on load set @data-theme to localStorage.theme or '${defaultTheme}'`}>
      <head>
        <link href="/public/assets/css/index.css" rel="stylesheet" />
        {Bun.env.APP_ENV === "development" ? (
          <>
            <script type="module" src={`http://localhost:${ENV_VARS.VITE_PORT}/index.ts`}></script>
            <script type="module" src={`http://localhost:${ENV_VARS.VITE_PORT}/@vite/client`}></script>
          </>
        ) : (
          <>
            <link href="/public/assets/js/index.css" rel="stylesheet" />
          </>
        )}
        <script type="text/hyperscript">
          {`
          def copySelectorToClipboard(selector)
            get the innerHTML of selector
            call navigator.clipboard.writeText(the result)
          end
          `}
        </script>
        <title>Input validation</title>
      </head>
      <body
        hx-ext="head-support, preload"
        class={cn("relative min-h-screen flex flex-col overflow-y-scroll")}
        {...p}
        _="on click hide #omnisearch-results"
      >
        <Header />
        <div class={cn("grid grid-cols-[min-content_auto]")}>
          <Navbar />
          <Main>{children}</Main>
        </div>
        {/* <Footer /> */}
      </body>
    </html>
  );
};
