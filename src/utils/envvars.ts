import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const portSchema = (fallbackPort: number) => z.preprocess((v) => parseInt(String(v)), z.number().default(fallbackPort));

export const ENV_VARS = createEnv({
  server: {
    APP_ENV: z.enum(["development", "production"]),
    APP_PORT: portSchema(3100),
    VITE_PORT: portSchema(3200),
  },
  runtimeEnv: Bun.env,
});
