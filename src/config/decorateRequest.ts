import { Context, Elysia } from "elysia";
import { ATTRIBUTES_CONSTANTS, HEADERS_CONSTANTS } from "./constants";
import { prisma } from "~/database/client";
import { MaybePromise } from "~/utils/types";

const decorate = ({ request }: Context) => {
  // HTTP
  const isMethodPost = request.method === "POST";
  const isMethodGet = request.method === "GET";
  const contentType = request.headers.get("Content-Type");

  // HTMX
  const hxTargetId = request.headers.get("Hx-Target");
  const hxTriggerName = request.headers.get("Hx-Trigger-Name");
  const hxTriggerId = request.headers.get("Hx-Trigger");

  // APP
  const isFormValidationRequest = isMethodPost && request.headers.has(HEADERS_CONSTANTS["formValidation"]);
  const isFormSubmitted =
    !isFormValidationRequest &&
    isMethodPost &&
    (contentType === "multipart/form-data" || contentType === "application/x-www-form-urlencoded");

  const isFormSaveAndContinue = isFormSubmitted && request.headers.has(HEADERS_CONSTANTS["formSaveAndContinue"]);
  const inputNameRequest = hxTriggerName || hxTargetId?.replace(ATTRIBUTES_CONSTANTS.form["inputWrapperId"], "") || "";

  return {
    // HTTP
    isMethodPost,
    isMethodGet,

    // HTMX
    isHxRequest: request.headers.has("Hx-Request"),
    isHxBoost: request.headers.has("Hx-Boost"),
    hxTargetId,
    hxTriggerName,
    hxTriggerId,

    // APP
    renderFragment: request.headers.has(HEADERS_CONSTANTS.renderFragment),
    renderNavbar: request.headers.has(HEADERS_CONSTANTS.renderNavbar),
    isFormValidationRequest,
    isFormSaveAndContinue,
    inputNameRequest,
    isFormSubmitted,
    db: prisma,
  };
};

export const decorateRequest = new Elysia({ name: "context-decorated" }).derive((ctx) => decorate(ctx));

export type ContextDecorated = ReturnType<typeof decorate> & Context;

export type Handler = (
  ctx: Omit<ContextDecorated, "params"> & { params: Record<string, string> },
) => MaybePromise<JSX.Element | void>;
