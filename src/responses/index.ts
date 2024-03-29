import { HX_HEADERS_CONSTANTS } from "~/config/constants";
import { type AppEvent, appEventName } from "../isomorphic/event";

type Set = {
  headers: Record<string, string> & {
    "Set-Cookie"?: string | string[];
  };
  status?: number | string;
  redirect?: string;
};

export const redirectTo = (args: { to: string; set: Set }) => {
  args.set.headers["HX-Location"] = JSON.stringify({
    path: args.to,
    headers: {
      [HX_HEADERS_CONSTANTS.renderNavbar]: true,
    },
    target: "#main",
    select: "#main",
  });
};

export const sendEvents = ({ set, events }: { set: Set; events: Array<AppEvent> }) => {
  set.headers["Hx-Trigger"] = JSON.stringify({
    [appEventName]: events,
  });
};

export const sendEvent = ({ set, event }: { set: Set; event: AppEvent }) => {
  set.headers["Hx-Trigger"] = JSON.stringify({
    [appEventName]: [event],
  });
};

export const notifyAndRedirect = ({ message, to, set }: { to: string; set: Set; message: string }) => {
  sendEvent({ set, event: { message, name: "notify", level: "success" } });
  redirectTo({ set, to });
};

export const notifyAnError = ({ message, set }: { set: Set; message?: string }) => {
  sendEvent({
    set,
    event: { message: message ?? "A problem occured, please try again later !", name: "notify", level: "error" },
  });
};

export const notify = ({
  set,
  message,
  level,
}: {
  set: Set;
  message: string;
  level: Extract<AppEvent, { name: "notify" }>["level"];
}) => {
  sendEvent({ set, event: { message, name: "notify", level } });
};
