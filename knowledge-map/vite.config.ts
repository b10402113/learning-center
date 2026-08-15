import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { remarkWikiLinks } from "./src/lib/remark-wikilinks.ts";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const reactJsxRuntime = fileURLToPath(new URL("./node_modules/react/jsx-runtime.js", import.meta.url));

export default defineConfig({
  plugins: [
    { enforce: "pre", ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkWikiLinks] }) },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // The MDX pipeline compiles lessons straight from ../learn (outside the
      // Vite root), so bare imports inside those files cannot walk up to this
      // project's node_modules. Pin React's runtime to the local copy.
      "react/jsx-runtime": reactJsxRuntime,
      "@learn": `${repoRoot}/learn`,
    },
  },
  server: {
    port: 5173,
    fs: {
      // The MDX pipeline reads lesson content straight from ../learn (outside
      // the Vite root), so that directory must be inside the allowed set.
      allow: [repoRoot],
    },
  },
});
