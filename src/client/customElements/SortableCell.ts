import { match } from "ts-pattern";
import { HEADERS_CONSTANTS } from "../../isomorphic";

type Direction = "sorted-down" | "sorted-up" | "unsorted";

const directionAttr = "direction";

customElements.define(
  "sortable-cell",
  class SortableCell extends HTMLTableCellElement {
    static observedAttributes = [directionAttr];

    direction: Direction = "unsorted";

    constructor() {
      super();
    }

    connectedCallback() {
      this.direction = this.getAttribute(directionAttr) as Direction;
      this.render();
    }

    callHtmx(direction?: Direction) {
      const localDir = direction ?? this.direction;
      const url = this.getAttribute(`htmx-${localDir}-path`);

      window.htmx
        .ajax("GET", url as string, {
          target: "#table-body",
          select: "#table-body",
          swap: "outerHTML",
          headers: { [HEADERS_CONSTANTS.renderFragment]: true },
        })
        .then(() => {
          // update url
          history.pushState({}, "", url);
        });
    }

    resetOtherSortableCells() {
      Array.from(document.querySelectorAll('th[is="sortable-cell"]')).forEach((c) => {
        if (c.id !== this.id) {
          c.setAttribute("direction", "unsorted");
        }
      });
    }

    onDirectionChanges(_: Direction, newValue: Direction) {
      this.direction = newValue;

      if (newValue !== "unsorted") {
        this.classList.add("bg-base-300");
      } else {
        this.classList.remove("bg-base-300");
      }

      this.render();
    }

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
      if (name === directionAttr) {
        this.onDirectionChanges(oldValue, newValue);
      }
    }

    render() {
      this.innerHTML = `
        <div class="flex justify-between">
          <div class="sort w-full flex gap-5">${this.handleSvg()} <span>${this.getAttribute("label")}</span></div>
          <div class="do-unsort z-[1] ${this.direction === "unsorted" && "hidden"}">X</div>
        </div>`;

      this.querySelector(".sort")?.addEventListener("click", () => {
        match(this.direction)
          .with("sorted-up", () => {
            this.setAttribute(directionAttr, "sorted-down");
          })
          .with("sorted-down", () => {
            this.setAttribute(directionAttr, "sorted-up");
          })
          .with("unsorted", () => {
            this.setAttribute(directionAttr, "sorted-up");
          });
        this.resetOtherSortableCells();
        this.callHtmx();
      });

      this.querySelector(".do-unsort")?.addEventListener("click", () => {
        this.setAttribute(directionAttr, "unsorted");
        this.callHtmx("unsorted");
      });
    }

    handleSvg() {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512" class="fill-neutral-500">
          ${match(this.direction)
            .with("sorted-up", () => this.SortUpSvg())
            .with("sorted-down", () => this.SortDownSvg())
            .with("unsorted", () => this.SortSvg())
            .run()}
        </svg>`;
    }

    SortSvg() {
      return `<path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />`;
    }

    SortUpSvg() {
      return `<path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />`;
    }

    SortDownSvg() {
      return `<path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" />`;
    }
  },
  { extends: "th" },
);
