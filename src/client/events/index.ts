import { match } from "ts-pattern";
import { appEvent, type AppEvent } from "../../isomorphic/event";

declare global {
  interface Event {
    // Comes from htmx
    detail: {
      value: Array<AppEvent>; // Custom app event
      elt: Element;
      target: HTMLElement;
      requestConfig: { path: string };
    };
  }
}

const appendSkeletonFrame = (target: HTMLElement) => {
  target.innerHTML = `
    <div class="flex flex-col gap-4 justify-center items-center w-full h-full animate-fade-in">
      <div class="skeleton bg-opacity-100 h-4 w-full"></div>
      <div class="skeleton bg-opacity-90 h-4 w-full"></div>
      <div class="skeleton bg-opacity-70 h-4 w-full"></div>
      <div class="skeleton bg-opacity-60 h-4 w-full"></div>
      <div class="skeleton bg-opacity-55 h-4 w-full"></div>
      <div class="skeleton bg-opacity-50 h-4 w-full"></div>
      <div class="skeleton bg-opacity-45 h-4 w-full"></div>
      <div class="skeleton bg-opacity-35 h-4 w-full"></div>
      <div class="skeleton bg-opacity-30 h-4 w-full"></div>
      <div class="skeleton bg-opacity-20 h-4 w-full"></div>
      <div class="skeleton bg-opacity-25 h-4 w-full"></div>
      <div class="skeleton bg-opacity-10 h-4 w-full"></div>
      <div class="skeleton bg-opacity-15 h-4 w-full"></div>
      <div class="skeleton bg-opacity-0 h-4 w-full"></div>
    </div>
  `;
};

//  TODO: Maybe put the server table into a isomorphic component to share style ?
const appendSkeletonTable = (target: HTMLElement) => {
  const rowsArray = Array(10).fill(0);
  const cellElements = Array.from(target.getElementsByTagName("tr")[0].getElementsByTagName("th"));
  const cellsDimensions = cellElements.map((c) => ({
    height: c.offsetHeight,
    width: c.offsetWidth,
    classFirstChild: c.firstChild?.nodeName === "DIV" ? c.children[0].className : undefined,
  }));

  target.innerHTML = `
    <tbody class="">
      ${rowsArray
        .map(
          (_, i) =>
            `<tr class="bg-opacity-50 animate-fade-in ">${cellsDimensions
              .map(
                (c) =>
                  `<th class="h-[${c.height}px] w-[${c.width}px]">
                      <div class="skeleton bg-opacity-${100 - i * 10} w-[${c.width}px]">c</div>
                  </th>`,
              )
              .join("")}</tr>`,
        )
        .join("")}</tbody>
  `;
};

window.onload = () => {
  document.body.addEventListener(appEvent, (e) => {
    e.detail.value.forEach((event) => {
      match(event)
        .with({ name: "notify" }, (appEvent) => import("./notify").then(({ default: call }) => call(appEvent)))
        .with({ name: "celebrate" }, (appEvent) => import("./celebrate").then(({ default: call }) => call(appEvent)));
    });
  });

  document.body.addEventListener("htmx:beforeRequest", (e) => {
    const isPreloadLink = !!e.detail.elt.attributes.getNamedItem("preload");

    if (isPreloadLink) {
      return;
    }
    // working but table flickers on sort, because skeleton don't preserve cell width. For now disabling skeleton for table"
    // if (e.detail.target.tagName === "TBODY") {
    //   appendSkeletonTable(e.detail.target);
    //   return;
    // }

    const currentPath = window.location.pathname;
    const pathRequested = e.detail.requestConfig.path.split("?")[0];

    if (pathRequested !== currentPath) {
      const target = (e?.detail.target.id ? e.detail.target : document.getElementById("main")) as HTMLElement;
      appendSkeletonFrame(target);
      return;
    }
  });

  document.getElementById("navbar")?.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).tagName === "A") {
      appendSkeletonFrame(document.getElementById("main") as HTMLElement);
    }
  });
};
