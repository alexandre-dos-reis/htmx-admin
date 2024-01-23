import { match } from "ts-pattern";
import { appEvent, type AppEvent } from "../../isomorphic/event";

declare global {
  interface Event {
    // Comes from htmx
    detail: {
      value: Array<AppEvent>;
    };
  }
}

window.onload = () => {
  document.body.addEventListener(appEvent, (e) => {
    e.detail.value.forEach((event) => {
      match(event)
        .with({ name: "notify" }, (appEvent) => import("./notify").then(({ default: call }) => call(appEvent)))
        .with({ name: "celebrate" }, (appEvent) => import("./celebrate").then(({ default: call }) => call(appEvent)));
    });
  });
};
