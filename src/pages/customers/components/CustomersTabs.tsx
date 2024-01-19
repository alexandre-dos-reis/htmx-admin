import { Tabs } from "~/components/*";
import { getContext } from "~/config/globalStorages";

export const CustomersTabs = (p: JSX.ElementChildrenAttribute) => {
  const ctx = getContext();
  const basePath = `/customers/${ctx?.params["id"]}`;

  const tabs = [
    { href: basePath, label: "General" },
    { href: `${basePath}/pictures`, label: "Pictures" },
  ];

  return <Tabs tabs={tabs}>{p.children}</Tabs>;
};
