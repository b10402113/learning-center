import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import { readLibrary, contentRoot } from "../lib/content.mjs";
import {
  kinds,
  slugPattern,
  parseDocument,
  validateLibrary,
} from "../lib/schema.mjs";

export const revisionFor = (raw) =>
  crypto.createHash("sha256").update(raw).digest("hex");
export function saveImage(buffer, publicRoot = path.resolve("public")) {
  const fail = (message) => {
    const error = new Error(message);
    error.status = 422;
    throw error;
  };
  if (
    !Buffer.isBuffer(buffer) ||
    !buffer.length ||
    buffer.length > 8 * 1024 * 1024
  )
    fail("圖片必須小於 8 MB");
  const hex = buffer.subarray(0, 12).toString("hex");
  const extension = hex.startsWith("89504e470d0a1a0a")
    ? "png"
    : hex.startsWith("ffd8ff")
      ? "jpg"
      : buffer
            .subarray(0, 6)
            .toString()
            .match(/^GIF8[79]a$/)
        ? "gif"
        : buffer.subarray(0, 4).toString() === "RIFF" &&
            buffer.subarray(8, 12).toString() === "WEBP"
          ? "webp"
          : null;
  if (!extension) fail("請選擇 PNG、JPEG、WebP 或 GIF 圖片");
  const dir = path.join(publicRoot, "uploads");
  fs.mkdirSync(dir, { recursive: true });
  if (
    fs.realpathSync(dir) !== path.join(fs.realpathSync(publicRoot), "uploads")
  )
    fail("上傳目錄不可使用符號連結");
  const name = `${revisionFor(buffer).slice(0, 24)}.${extension}`;
  const file = path.join(dir, name);
  if (fs.existsSync(file) && fs.lstatSync(file).isSymbolicLink())
    fail("不可寫入符號連結");
  if (!fs.existsSync(file)) fs.writeFileSync(file, buffer, { flag: "wx" });
  return { url: `/uploads/${name}` };
}
export function saveDocument({
  root = contentRoot,
  kind,
  slug,
  raw,
  revision,
}) {
  function fail(message, status = 400) {
    const error = new Error(message);
    error.status = status;
    throw error;
  }
  if (!kinds.includes(kind) || !slugPattern.test(slug || ""))
    fail("無效的內容類型或檔名");
  if (typeof raw !== "string" || Buffer.byteLength(raw) > 1024 * 1024)
    fail("檔案必須小於 1 MB");
  const dir = path.join(root, kind),
    file = path.join(dir, `${slug}.md`);
  if (fs.realpathSync(dir) !== path.join(fs.realpathSync(root), kind))
    fail("內容目錄不可使用符號連結");
  const exists = fs.existsSync(file);
  if (exists && fs.lstatSync(file).isSymbolicLink()) fail("不可編輯符號連結");
  const current = exists ? fs.readFileSync(file, "utf8") : null;
  if ((current === null ? null : revisionFor(current)) !== revision)
    fail("檔案已被其他編輯器修改。請先重新載入，再儲存。", 409);
  let document;
  try {
    document = parseDocument(raw, slug, kind);
  } catch {
    fail("Markdown frontmatter 格式錯誤，請檢查 YAML");
  }
  const library = readLibrary(root);
  library[kind] = [...library[kind].filter((d) => d.slug !== slug), document];
  const errors = validateLibrary(library);
  if (errors.length) fail(errors.join("\n"), 422);
  const temporary = path.join(dir, `.${slug}.${crypto.randomUUID()}.tmp`);
  try {
    fs.writeFileSync(temporary, raw, { flag: "wx" });
    fs.renameSync(temporary, file);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
  return { ...document, revision: revisionFor(raw) };
}
export function createStudioServer({
  root = contentRoot,
  publicRoot = path.resolve("public"),
} = {}) {
  const allowedOrigins = new Set([
    "http://127.0.0.1:3001",
    "http://localhost:3001",
  ]);
  return http.createServer(async (req, res) => {
    const json = (status, data) => {
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(JSON.stringify(data));
    };
    if (!["127.0.0.1:3211", "localhost:3211"].includes(req.headers.host))
      return json(403, { error: "只接受本機編輯器請求" });
    if (req.headers.origin && !allowedOrigins.has(req.headers.origin))
      return json(403, { error: "不允許的請求來源" });
    if (req.method === "GET" && req.url === "/library") {
      try {
        const library = readLibrary(root);
        return json(
          200,
          Object.fromEntries(
            kinds.map((kind) => [
              kind,
              library[kind].map((d) => ({
                ...d,
                revision: revisionFor(d.raw),
              })),
            ]),
          ),
        );
      } catch (error) {
        return json(500, { error: error.message });
      }
    }
    if (req.method === "POST" && req.url === "/save") {
      if (
        !allowedOrigins.has(req.headers.origin) ||
        !req.headers["content-type"]?.startsWith("application/json")
      )
        return json(403, { error: "需要由本機編輯器送出 JSON 請求" });
      try {
        const chunks = [];
        let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 1100000) {
            return json(413, { error: "內容過大" });
          }
          chunks.push(chunk);
        }
        const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        const result = saveDocument({ ...input, root });
        return json(200, result);
      } catch (error) {
        return json(error.status || 400, { error: error.message });
      }
    }
    if (req.method === "POST" && req.url === "/upload") {
      if (!allowedOrigins.has(req.headers.origin))
        return json(403, { error: "需要由本機編輯器上傳圖片" });
      try {
        const chunks = [];
        let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 8 * 1024 * 1024)
            return json(413, { error: "圖片必須小於 8 MB" });
          chunks.push(chunk);
        }
        return json(200, saveImage(Buffer.concat(chunks), publicRoot));
      } catch (error) {
        return json(error.status || 400, { error: error.message });
      }
    }
    return json(404, { error: "找不到這個端點" });
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  createStudioServer().listen(3211, "127.0.0.1", () =>
    console.log("Local Markdown studio: http://127.0.0.1:3211"),
  );
}
