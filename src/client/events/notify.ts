import Toastify from "toastify-js";
import { AppEvent } from "../../isomorphic/event";

export default ({ message }: Extract<AppEvent, { name: "notify" }>) => {
  Toastify({
    text: message,
    duration: 3000,
    newWindow: false,
    // close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    onClick: function () {}, // Callback after click
  }).showToast();
};
