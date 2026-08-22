import { defineConfig } from "vitest/config";
import path from "node:path";

// Mirrors the "@/*" -> "./src/*" alias from tsconfig.json.
// Vitest does not read tsconfig paths automatically, so it's declared
// here explicitly rather than pulling in an extra plugin dependency.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
