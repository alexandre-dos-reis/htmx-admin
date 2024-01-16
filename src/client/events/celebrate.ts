import Confetti from "js-confetti";
import { AppEvent } from "../../isomorphic/event";

export default ({}: Extract<AppEvent, { name: "celebrate" }>) => {
  new Confetti().addConfetti();
};
