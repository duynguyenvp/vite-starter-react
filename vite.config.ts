import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  return {
    plugins: [
      react({
        babel: {
          plugins: isProduction
            ? [["react-remove-properties", { properties: ["data-testid"] }]]
            : [],
        },
      }),
      tailwindcss(),
    ],
    base: "/",
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
        "@components": fileURLToPath(
          new URL("./src/components", import.meta.url)
        ),
        "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      },
    },
    build: {
      chunkSizeWarningLimit: 3000,
    },
  };
});
