import { Context, Elysia } from "elysia";
import { HX_HEADERS_CONSTANTS } from "./constants";
import { getCustomers } from "~/pages/customers/customers";
import { prisma } from "~/database/db";

const decorate = ({ request }: Context) => {
  const isMethodPost = request.method === "POST";
  const isMethodGet = request.method === "GET";
  const contentType = request.headers.get("Content-Type");
  const isFormValidationRequest = request.headers.has(HX_HEADERS_CONSTANTS["formValidation"]);

  return {
    // HTTP
    isMethodPost,
    isMethodGet,
    // HTMX
    isHxRequest: request.headers.has("Hx-Request"),
    isHxBoost: request.headers.has("Hx-Boost"),
    hxTargetId: request.headers.get("Hx-Target"),
    hxTriggerId: request.headers.get("Hx-Trigger"),
    hxTriggerName: request.headers.get("Hx-Trigger-Name"),
    // APP
    getCustomers,
    db: prisma,
    renderFragmentRoute: request.headers.has(HX_HEADERS_CONSTANTS.renderFragmentRoute),
    updateNavbar: request.headers.has(HX_HEADERS_CONSTANTS.updateNavbar),
    isFormValidationRequest,
    isFormSubmitted:
      !isFormValidationRequest &&
      isMethodPost &&
      (contentType === "multipart/form-data" || contentType === "application/x-www-form-urlencoded"),
  };
};

export const decorateRequest = new Elysia().derive((ctx) => decorate(ctx));

export type ContextDecorated = ReturnType<typeof decorate> & Context;
