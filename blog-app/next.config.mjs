import path from "node:path";
import { fileURLToPath } from "node:url";
const development = process.env.NODE_ENV === "development";
export default {
  ...(development ? {} : { output: "export" }),
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
  env: { NEXT_PUBLIC_LOCAL_STUDIO: development ? "true" : "false" },
  ...(development
    ? {
        async rewrites() {
          return [
            {
              source: "/__studio/:path*",
              destination: "http://127.0.0.1:3211/:path*",
            },
          ];
        },
      }
    : {}),
};
