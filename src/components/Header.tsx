import { cn } from "~/utils";
import { DropDown } from "./Dropdown";
import { ThemeController } from "./ThemeController";
import { Link } from "./Link";
import { HX_HEADERS_CONSTANTS } from "~/config/constants";

export const Header = () => {
  return (
    <header class={cn("sticky top-0 z-[2] flex items-center bg-base-300 bg-opacity-90 backdrop-blur h-[70px] px-10")}>
      <div class="flex-1">
        <Link
          class="btn btn-ghost text-xl"
          href="/"
          hx-target="#main"
          hxHeaders={{ [HX_HEADERS_CONSTANTS.renderNavbar]: "true" }}
        >
          <span class="italic text-primary">htmx</span> Admin
        </Link>
      </div>
      <div class="gap-x-3 flex items-center">
        <div>
          <ThemeController />
        </div>
        <DropDown
          class="dropdown-end"
          label={
            <div class="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span class="badge badge-sm indicator-item">8</span>
            </div>
          }
        >
          <div class="card-body">
            <span class="font-bold text-lg">8 Items</span>
            <span class="text-info">Subtotal: $999</span>
            <div class="card-actions">
              <button class="btn btn-primary btn-block">
                <a href="/form-completed">view cart</a>
              </button>
            </div>
          </div>
        </DropDown>
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
