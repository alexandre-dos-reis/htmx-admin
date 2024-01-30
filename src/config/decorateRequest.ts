import { Context, Elysia } from "elysia";
import { ATTRIBUTES_CONSTANTS, HEADERS_CONSTANTS } from "./constants";
import { prisma } from "~/database/client";
import { MaybePromise } from "~/utils/types";
import { AppEvent, appEvent } from "~/isomorphic/event";

const decorateBase = ({ request: { headers, method }, set, path }: Context) => {
  // HTTP
  const isMethodPost = method === "POST";
  const isMethodGet = method === "GET";
  const contentType = headers.get("Content-Type");

  // HTMX
  const hxTargetId = headers.get("Hx-Target");
  const hxTriggerName = headers.get("Hx-Trigger-Name");
  const hxTriggerId = headers.get("Hx-Trigger");

  // APP
  const isFormValidationRequest = isMethodPost && headers.has(HEADERS_CONSTANTS["formValidation"]);
  const isFormSubmitted =
    !isFormValidationRequest &&
    isMethodPost &&
    (contentType === "multipart/form-data" || contentType === "application/x-www-form-urlencoded");

  const isFormSaveAndContinue = isFormSubmitted && headers.has(HEADERS_CONSTANTS["formSaveAndContinue"]);
  const inputNameRequest = hxTriggerName || hxTargetId?.replace(ATTRIBUTES_CONSTANTS.form["inputWrapperId"], "") || "";

  return {
    // HTTP
    isMethodPost,
    isMethodGet,

    // HTMX
    isHxRequest: headers.has("Hx-Request"),
    isHxBoost: headers.has("Hx-Boost"),
    hxTargetId,
    hxTriggerName,
    hxTriggerId,

    // APP
    renderFragment: headers.has(HEADERS_CONSTANTS.renderFragment),
    renderNavbar: headers.has(HEADERS_CONSTANTS.renderNavbar),
    isFormValidationRequest,
    isFormSaveAndContinue,
    inputNameRequest,
    isFormSubmitted,
    db: prisma,

    // RESPONSES
    redirectTo: (to: string) => {
      set.headers["HX-Location"] = JSON.stringify({
        path: isFormSaveAndContinue ? path : to,
        headers: {
          [HEADERS_CONSTANTS.renderNavbar]: true,
        },
        target: "#main",
        select: "#main",
      });
    },

    sendEvents: (events: Array<AppEvent>) => {
      set.headers["Hx-Trigger"] = JSON.stringify({
        [appEvent]: events,
      });
    },

    sendEvent: (event: AppEvent) => {
      set.headers["Hx-Trigger"] = JSON.stringify({
        [appEvent]: [event],
      });
    },

    get notifyAndRedirect() {
      return ({ message, to }: { to: string; message: string }) => {
        this.redirectTo(to);
        this.sendEvent({ message, name: "notify", level: "success" });
      };
    },

    get notifyAnError() {
      return (message?: string) => {
        this.sendEvent({
          message: message ?? "A problem occured, please try again later !",
          name: "notify",
          level: "error",
        });
      };
    },

    get notify() {
      return ({ message, level }: { message: string; level: Extract<AppEvent, { name: "notify" }>["level"] }) => {
        this.sendEvent({ message, name: "notify", level });
      };
    },
  };
};

export const decorateRequest = new Elysia({ name: "context-decorated" }).derive((ctx) => decorateBase(ctx));

export type ContextDecorated = ReturnType<typeof decorateBase> & Context;

export type Handler = (
  ctx: Omit<ContextDecorated, "params"> & { params: Record<string, string> }
) => MaybePromise<JSX.Element | void>;
