import { getContext } from "~/config/globalStorages";
import { cn } from "~/utils";

const NavLink = ({ href, children, class: classname, icon, ...props }: JSX.HtmlAnchorTag & { icon?: JSX.Element }) => {
  const path = getContext().path || "";
  const isCurrent = href === "/" ? path === href : path.startsWith(href || "");

  return (
    <a
      hx-get={href}
      {...props}
      class={
        classname
          ? cn(classname)
          : cn(
              "w-full text-center nav-link link no-underline px-7 py-2 mb-2 rounded",
              isCurrent ? "text-primary-content bg-primary" : "text-neutral-content bg-neutral-700",
              icon ? "flex justify-center items-center gap-3" : "italic",
            )
      }
      preload="mouseover"
      // hx-swap="outerHTML" this is causing a conflict with elements that have oob enabled
      hx-select="#main"
      hx-target="#main"
      hx-push-url="true"
      hx-replace-url="true"
      _="on click
          add .bg-neutral-700 to .nav-link then
          add .text-neutral-content to .nav-link then
          remove .bg-neutral-700 from me then
          remove .text-neutral-content from me then
          take .bg-primary from .nav-link for me then
          take .text-primary-content from .nav-link for me
        "
    >
      {icon ? (
        <>
          <span>{icon}</span>
          <span class="italic">{children}</span>
        </>
      ) : (
        children
      )}
    </a>
  );
};

export const Navbar = () => (
  <nav
    id="navbar"
    hx-swap-oob="true"
    class={cn("sticky top-[70px] bg-base-300 bg-opacity-90 backdrop-blur h-[calc(100vh-70px)] py-5")}
  >
    <div class="px-10 flex flex-col">
      <NavLink href="/" icon={"🏠"}>
        Home
      </NavLink>
      <NavLink href="/customers">Customers</NavLink>
      <NavLink href="/shop">Shop</NavLink>
      <NavLink href="/events">Events</NavLink>
      <NavLink href="/companies">Companies</NavLink>
    </div>
  </nav>
);
