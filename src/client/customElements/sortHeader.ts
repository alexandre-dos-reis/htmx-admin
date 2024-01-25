import { match } from "ts-pattern";

type State = "sorted-down" | "sorted-up" | "unsorted";

const stateAttr = "state";

export class SortableCell extends HTMLTableCellElement {
  static observedAttributes = [stateAttr];

  state: State;

  constructor() {
    super();
  }

  // console.log("Custom element added to page.");
  connectedCallback() {
    this.state = (this.getAttribute(stateAttr) as State) || "unsorted";
    this.render();

    this.querySelector(".sort")?.addEventListener("click", () => {
      match(this.state)
        .with("sorted-up", () => {
          this.setAttribute(stateAttr, "sorted-down");
        })
        .with("sorted-down", () => {
          this.setAttribute(stateAttr, "sorted-up");
        })
        .with("unsorted", () => {
          this.setAttribute(stateAttr, "sorted-up");
        });
    });

    this.querySelector(".do-unsort")?.addEventListener("click", () => {
      this.setAttribute(stateAttr, "unsorted");
    });
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name === stateAttr) {
      this.state = newValue;

      if (this.state !== "unsorted") {
        this.classList.add("bg-base-300");
      } else {
        this.classList.remove("bg-base-300");
      }
    }
  }

  render() {
    this.innerHTML = `
    <div class="flex justify-between">
      <div class="sort w-full">name</div>
      <div class="do-unsort z-[1]">X</div>
    </div>`;
  }
}
