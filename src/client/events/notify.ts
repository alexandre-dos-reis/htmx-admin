import Toastify from "toastify-js";
import { AppEvent } from "../../isomorphic/event";

export default ({ message, level }: Extract<AppEvent, { name: "notify" }>) => {
  const bg: Record<typeof level, string> = {
    // Daisy ui vars
    error: "oklch(var(--er))",
    info: "oklch(var(--in))",
    success: "oklch(var(--su))",
  };

  Toastify({
    text: message,
    duration: 3000,
    newWindow: false,
    style: {
      "background-color": bg[level],
    },
    offset: { y: 30, x: 0 },
    gravity: "bottom", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    onClick: function () {}, // Callback after click
  }).showToast();
};
