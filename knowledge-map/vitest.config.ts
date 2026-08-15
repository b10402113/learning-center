import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { remarkWikiLinks } from "./src/lib/remark-wikilinks.ts";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const reactJsxRuntime = fileURLToPath(new URL("./node_modules/react/jsx-runtime.js", import.meta.url));

export default defineConfig({
  plugins: [
    { enforce: "pre", ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkWikiLinks] }) },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
  resolve: {
    alias: {
      "react/jsx-runtime": reactJsxRuntime,
      "@learn": `${repoRoot}/learn`,
    },
  },
  test: {
    include: ["src/__tests__/**/*.test.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
  },
});
