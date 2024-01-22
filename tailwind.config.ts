import { Config } from "tailwindcss";

export const defaultTheme = "light";

export const themes = [
  defaultTheme,
  "dark",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "lofi",
  "black",
  "luxury",
  "coffee",
  "winter",
  "nord",
];

export default {
  content: ["./src/**/*.{tsx,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes,
  },
} as Config & {
  daisyui?: {
    themes?: boolean | Array<string>; // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme?: string; // name of one of the included themes for dark mode
    base?: boolean; // applies background color and foreground color for root element by default
    styled?: boolean; // include daisyUI colors and design decisions for all components
    utils?: boolean; // adds responsive and modifier utility classes
    prefix?: string; // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs?: boolean; // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot?: string;
  };
};
