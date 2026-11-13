import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// Local Google sign-in redirect URL stays stable.
const DEV_PORT = 5199;

export default defineConfig(({ command }) => ({
  server: { port: DEV_PORT, strictPort: true },
  preview: { port: DEV_PORT, strictPort: true },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      // src/server.ts SSR error wrapper
      server: { entry: "server" },
    }),
    // Nitro emits Vercel Functions so routes are not served as missing static files.
    ...(command === "build" ? [nitro()] : []),
    viteReact(),
    tailwindcss(),
  ],
}));
