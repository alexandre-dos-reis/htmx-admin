import Idiomorph from "idiomorph";
/// <reference types="vite/client" />

declare global {
  interface Window {
    Idiomorph: typeof Idiomorph;
  }
}
