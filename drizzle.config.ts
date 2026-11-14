import { defineConfig } from "drizzle-kit";

const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: env?.["DATABASE_URL"] ?? "",
  },
});
