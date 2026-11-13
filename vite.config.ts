import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      // Custom SSR wrapper at src/server.ts. Default router entry is src/router.tsx.
      server: { entry: "server" },
    }),
    viteReact(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
  },
});
