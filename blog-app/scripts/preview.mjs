import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("out");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};
http
  .createServer((req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      let file = path.resolve(root, `.${pathname}`);
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory())
        file = path.join(file, "index.html");
      let status = 200;
      if (!fs.existsSync(file)) {
        file = path.join(root, "404.html");
        status = 404;
      }
      res.writeHead(status, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
      });
      fs.createReadStream(file).pipe(res);
    } catch {
      res.writeHead(400);
      res.end();
    }
  })
  .listen(3002, "127.0.0.1", () =>
    console.log("Static preview: http://127.0.0.1:3002"),
  );
