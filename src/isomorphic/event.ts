export const appEvent = "app-event";

export type AppEvent =
  | {
      name: "notify";
      level: "info" | "error" | "success";
      message: string;
    }
  | {
      name: "celebrate";
      some: string;
    };
