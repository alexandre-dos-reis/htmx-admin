import { Context, Elysia } from "elysia";
import { ATTRIBUTES_CONSTANTS, HX_HEADERS_CONSTANTS } from "./constants";
import { prisma } from "~/database/client";

const decorate = ({ request }: Context) => {
  const isMethodPost = request.method === "POST";
  const isMethodGet = request.method === "GET";
  const contentType = request.headers.get("Content-Type");
  const isFormValidationRequest = isMethodPost && request.headers.has(HX_HEADERS_CONSTANTS["formValidation"]);

  const hxTargetId = request.headers.get("Hx-Target");
  const hxTriggerName = request.headers.get("Hx-Trigger-Name");
  const hxTriggerId = request.headers.get("Hx-Trigger");

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
    db: prisma,
    renderFragmentRoute: request.headers.has(HX_HEADERS_CONSTANTS.renderFragmentRoute),
    updateNavbar: request.headers.has(HX_HEADERS_CONSTANTS.updateNavbar),
    isFormValidationRequest,
    inputNameRequest,
    isFormSubmitted:
      !isFormValidationRequest &&
      isMethodPost &&
      (contentType === "multipart/form-data" || contentType === "application/x-www-form-urlencoded"),
  };
};

export const decorateRequest = new Elysia().derive((ctx) => decorate(ctx));

export type ContextDecorated = ReturnType<typeof decorate> & Context;
