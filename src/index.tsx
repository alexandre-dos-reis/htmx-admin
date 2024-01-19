import { Elysia } from "elysia";
import { Layout } from "./components/*";
import { decorateRequest } from "./config/decorateRequest";
import { globals } from "./config/globals";
import { staticPlugin } from "@elysiajs/static";
import { html } from "@elysiajs/html";
import { ENV_VARS } from "./utils/envvars";
import { customers } from "./pages/customers";
import { fragments } from "./fragments";

export const app = new Elysia()
  .use(html())
  .use(staticPlugin({ assets: "public", prefix: "public" }))
  .use(decorateRequest)
  .use(globals)
  // Routes
  .use(fragments)
  .use(customers)
  .all("/", () => <Layout>Home</Layout>)
  .get("/shop", () => <Layout>Shop</Layout>)
  .get("/events", () => <Layout>Events</Layout>)
  .get("/companies", () => <Layout>Companies</Layout>)
  .listen(ENV_VARS.APP_PORT);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
