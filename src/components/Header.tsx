import { cn } from "~/utils";
import { ThemeController } from "./ThemeController";
import { Link } from "./Link";
import { HEADERS_CONSTANTS } from "~/config/constants";
import { OmniSearch } from "~/fragments/omniSearch";

export const Header = () => {
  return (
    <header class={cn("sticky top-0 z-[2] flex items-center bg-base-300 bg-opacity-90 backdrop-blur h-[70px] px-10")}>
      <div class="flex-1">
        <Link
          class="btn btn-ghost text-xl"
          href="/"
          hx-target="#main"
          hxHeaders={{ [HEADERS_CONSTANTS.renderNavbar]: "true" }}
        >
          <span class="italic text-primary">htmx</span> Admin
        </Link>
      </div>
      <div class="gap-x-5 flex items-center">
        <OmniSearch />
        <ThemeController />
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              />
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <a class="justify-between">
                Profile
                <span class="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
