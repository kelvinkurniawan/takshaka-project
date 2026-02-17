import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/schema.ts",
  out: "./drizzle",
  driver: "d1-http",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.D1_URL || "",
  },
} satisfies Config;
