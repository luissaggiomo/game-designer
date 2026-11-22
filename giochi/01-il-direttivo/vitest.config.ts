import { defineConfig } from "vitest/config";

// Test di tutti i pacchetti, lanciati dalla cartella del gioco con `pnpm test`.
export default defineConfig({
  test: {
    include: ["packages/*/test/**/*.test.ts"],
  },
});
