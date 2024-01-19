import { Layout } from "~/components/*";
import { Handler } from "~/config/decorateRequest";
import { CustomersTabs } from "../components/CustomersTabs";

export const editPictures: Handler = () => {
  return (
    <Layout>
      <CustomersTabs>Pictures</CustomersTabs>
    </Layout>
  );
};
