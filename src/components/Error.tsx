import { Layout } from "./Layout";

type Code = "NOT_FOUND" | "INTERNAL_SERVER_ERROR";

const errorMessage: Record<Code, JSX.Element> = {
  INTERNAL_SERVER_ERROR: "An error occured, please try again later...",
  NOT_FOUND: "Oups, the url requested was not found...!",
};

export const Error = (props: { code: Code }) => (
  <Layout>
    <div class="text-center text-2xl text-primary">{errorMessage[props.code]}</div>
  </Layout>
);
