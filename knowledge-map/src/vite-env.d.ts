/// <reference types="vite/client" />

declare module "*.mdx" {
  import type { ComponentType } from "react";
  const Component: ComponentType<{ components?: Record<string, ComponentType | string> }>;
  export default Component;
}
