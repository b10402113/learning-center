import { spawn } from "node:child_process";
import { createStudioServer } from "./studio-server.mjs";
const server = createStudioServer();
server.on("error", (error) => {
  console.error(`Studio server: ${error.message}`);
  process.exit(1);
});
server.listen(3211, "127.0.0.1", () => {
  const child = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "dev",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3001",
    ],
    { stdio: "inherit", env: { ...process.env, NODE_ENV: "development" } },
  );
  const stop = (signal) => {
    child.kill(signal);
    server.close();
  };
  process.on("SIGINT", () => stop("SIGINT"));
  process.on("SIGTERM", () => stop("SIGTERM"));
  child.on("exit", (code) => {
    server.close();
    process.exitCode = code || 0;
  });
  console.log("Markdown editor: http://127.0.0.1:3001/studio/");
});
