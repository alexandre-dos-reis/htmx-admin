// @ts-ignore
import { Idiomorph } from "idiomorph/dist/idiomorph.esm";
import "idiomorph/dist/idiomorph-htmx";
import "htmx.org/dist/ext/head-support";
import "htmx.org/dist/ext/debug";
import "htmx.org/dist/ext/preload";
// import "htmx.org/dist/ext/restored";

declare global {
  interface Window {
    Idiomorph: typeof Idiomorph;
  }
}

window.Idiomorph = Idiomorph;
