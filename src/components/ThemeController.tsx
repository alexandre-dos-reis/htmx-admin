import { themes } from "../../tailwind.config";

export const ThemeController = () => (
  <div class="dropdown">
    <div tabindex="0" role="button" class="btn m-1">
      Theme
      <svg
        width="12px"
        height="12px"
        class="h-2 w-2 fill-current opacity-60 inline-block"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2048 2048"
      >
        <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
      </svg>
    </div>
    <ul
      tabindex="0"
      class="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52 max-h-[calc(100vh-80px)] overflow-y-auto"
    >
      {themes.map((t) => (
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label={t}
            value={t}
            _={`on click set localStorage.theme to my value
                on load 
                  if localStorage.theme exists
                    if localStorage.theme is '${t}' set @checked to true end
                  else 
                    if my value is '${themes[0]}' set @checked to true then set localStorage.theme to '${themes[0]}' end
                end
            `}
          />
        </li>
      ))}
    </ul>
  </div>
);
