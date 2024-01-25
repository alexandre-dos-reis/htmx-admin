declare interface Window {
  setParam: typeof setParam;
  handleSort: typeof handleSort;
}

const setParam = (param: string, value: string) => {
  let params = new URLSearchParams(window.location.search);

  if (value === "") {
    params.delete(param);
  } else {
    params.set(param, value);
  }

  if (window.history.replaceState) {
    const url =
      window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + params.toString();

    window.history.replaceState(
      {
        path: url,
      },
      "",
      url,
    );
  }
};

window.setParam = setParam;

const handleSort = (child: HTMLElement) => {
  const currentSortGroupEl = child.closest("div.sort-group") as HTMLElement;

  // first reset everyone !
  Array.from((child.closest("tr") as HTMLElement).querySelectorAll("div.sort-group")).forEach((sortedGroup) => {
    if ((sortedGroup as HTMLElement).dataset.sortGroup !== currentSortGroupEl.dataset.sortGroup) {
      Array.from(sortedGroup.children).forEach((el) => {
        if (el.classList.contains("unsorted")) {
          el.classList.remove("hidden");
        } else {
          el.classList.add("hidden");
        }
      });
    }
  });

  const sortElements = Array.from(currentSortGroupEl.children);
  const resetEl = sortElements.find((s) => s.classList.contains("reset-sort")) as HTMLElement & SVGElement;
  const unsortedEl = sortElements.find((s) => s.classList.contains("unsorted"))!;
  const sortedUpEl = sortElements.find((s) => s.classList.contains("sorted-up"))!;
  const sortDownEl = sortElements.find((s) => s.classList.contains("sorted-down"))!;

  resetEl.addEventListener("click", () => {
    if (!resetEl.classList.contains("hidden")) {
      resetEl.classList.toggle("hidden");
      unsortedEl.classList.toggle("hidden");
      sortedUpEl.classList.add("hidden");
      sortDownEl.classList.add("hidden");
    }
  });

  if (!sortedUpEl.classList.contains("hidden") || !sortDownEl.classList.contains("hidden")) {
    sortDownEl.classList.toggle("hidden");
    sortedUpEl.classList.toggle("hidden");
  } else {
    unsortedEl.classList.toggle("hidden");
    sortedUpEl.classList.toggle("hidden");
    resetEl.classList.toggle("hidden");
  }
};

window.handleSort = handleSort;
