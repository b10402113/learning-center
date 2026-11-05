import { extname } from "node:path";

export const SOURCE_TYPES = ["article", "code", "formula"];

const CODE_LANGUAGES = new Map([
  [".bash", "bash"],
  [".c", "c"],
  [".cc", "cpp"],
  [".cpp", "cpp"],
  [".cs", "csharp"],
  [".css", "css"],
  [".cxx", "cpp"],
  [".dart", "dart"],
  [".ex", "elixir"],
  [".exs", "elixir"],
  [".go", "go"],
  [".h", "c"],
  [".hpp", "cpp"],
  [".hs", "haskell"],
  [".html", "html"],
  [".java", "java"],
  [".js", "javascript"],
  [".json", "json"],
  [".jsx", "jsx"],
  [".kt", "kotlin"],
  [".kts", "kotlin"],
  [".lua", "lua"],
  [".mjs", "javascript"],
  [".php", "php"],
  [".pl", "perl"],
  [".ps1", "powershell"],
  [".py", "python"],
  [".r", "r"],
  [".rb", "ruby"],
  [".rs", "rust"],
  [".scala", "scala"],
  [".scss", "scss"],
  [".sh", "bash"],
  [".sql", "sql"],
  [".swift", "swift"],
  [".toml", "toml"],
  [".ts", "typescript"],
  [".tsx", "tsx"],
  [".vue", "vue"],
  [".xml", "xml"],
  [".yaml", "yaml"],
  [".yml", "yaml"],
  [".zsh", "bash"],
]);

const PLACEHOLDER_LEFTOVER = /\{\{ARTICLE_(?:CODE|FORMULA)_\d+\}\}/;

export function inferSourceType(path) {
  return CODE_LANGUAGES.has(extname(String(path ?? "")).toLowerCase()) ? "code" : "article";
}

export function inferSourceLanguage(path) {
  return CODE_LANGUAGES.get(extname(String(path ?? "")).toLowerCase()) ?? "";
}

export function normalizeSourceType(value) {
  const type = String(value ?? "").trim().toLowerCase();
  if (!type) return "article";
  if (!SOURCE_TYPES.includes(type)) {
    throw new Error(`source type must be one of ${SOURCE_TYPES.join(", ")}: ${value}`);
  }
  return type;
}

function normalizeLanguage(value) {
  return String(value ?? "")
    .trim()
    .replace(/[^A-Za-z0-9_+.#-]/g, "");
}

function placeholderFor(type, index) {
  return type === "code" ? `{{ARTICLE_CODE_${index}}}` : `{{ARTICLE_FORMULA_${index}}}`;
}

export function materialSources(material) {
  const course = Array.isArray(material?.course)
    ? material.course.map((source) => ({ ...source, role: "course" }))
    : [];
  const supplement = Array.isArray(material?.supplement)
    ? material.supplement.map((source) => ({ ...source, role: "supplement" }))
    : [];
  if (course.length > 0 || supplement.length > 0) return [...course, ...supplement];
  return Array.isArray(material?.sources) ? material.sources : [];
}

export function buildComposeSources(sources) {
  const prepared = sources.map((source, index) => {
    const type = normalizeSourceType(source?.type);
    const item = {
      path: String(source?.path ?? "").trim(),
      locator: String(source?.locator ?? "").trim(),
      type,
      text: String(source?.text ?? "").replace(/\r\n/g, "\n"),
    };
    if (["course", "supplement"].includes(String(source?.role ?? ""))) item.role = source.role;
    if (type === "code") {
      if (!item.path || !item.locator) {
        throw new Error(`code source ${index + 1} needs both path and locator`);
      }
      item.language = normalizeLanguage(source?.language ?? inferSourceLanguage(item.path));
      item.placeholder = placeholderFor(type, index + 1);
    } else if (type === "formula") {
      item.placeholder = placeholderFor(type, index + 1);
    }
    return item;
  });

  for (const item of prepared) {
    for (const other of prepared) {
      if (!other.placeholder) continue;
      if (item.text.includes(other.placeholder)) {
        throw new Error(`source text contains the reserved placeholder ${other.placeholder}`);
      }
    }
  }
  return prepared;
}

export function composeSourcePayload(sources) {
  return sources.map((source) => {
    const payload = {
      path: source.path,
      locator: source.locator,
      type: source.type,
    };
    if (source.role) payload.role = source.role;
    if (source.type === "code" && source.language) payload.language = source.language;
    payload.text = source.text;
    if (source.placeholder) payload.placeholder = source.placeholder;
    return payload;
  });
}

function longestRun(text, character) {
  let longest = 0;
  let current = 0;
  for (const value of text) {
    if (value === character) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

function codeMarkdown(source) {
  const text = source.text.replace(/\n+$/, "");
  const fence = "`".repeat(Math.max(3, longestRun(text, "`") + 1));
  const language = source.language ? source.language : "";
  return [
    `<!-- source: ${source.path}${source.locator} -->`,
    "",
    `${fence}${language}`,
    text,
    fence,
  ].join("\n");
}

function formulaMarkdown(source) {
  return `$$\n${source.text.trim()}\n$$`;
}

function isInFence(text, index) {
  const before = text.slice(0, index);
  const fences = (before.match(/^[ \t]*(?:`{3,}|~{3,})/gm) ?? []).length;
  return fences % 2 === 1;
}

function replaceLine(text, placeholder, replacement) {
  const pattern = new RegExp(`^[ \\t]*${escapeRegExp(placeholder)}[ \\t]*$`, "m");
  const matches = text.match(new RegExp(pattern.source, "gm")) ?? [];
  if (matches.length !== 1) {
    throw new Error(
      matches.length === 0
        ? `model did not use the placeholder ${placeholder}`
        : `model used the placeholder ${placeholder} more than once`,
    );
  }
  const found = text.search(pattern);
  if (isInFence(text, found)) {
    throw new Error(`model put the placeholder ${placeholder} inside a code fence`);
  }
  return text.replace(pattern, () => replacement);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function placeholderLinePattern(placeholder) {
  return new RegExp(`^[ \\t]*${escapeRegExp(placeholder)}[ \\t]*$`, "m");
}

export function missingPlaceholders(markdown, sources) {
  const text = String(markdown ?? "");
  return sources.filter(
    (source) => source.placeholder && !placeholderLinePattern(source.placeholder).test(text),
  );
}

/**
 * Best-effort restore used when the model never produced every placeholder.
 * It replaces the placeholders the model did use, reports the ones it dropped,
 * and strips any leftover token so the draft can still be read and repaired.
 */
export function salvageComposeSources(markdown, sources) {
  let text = String(markdown ?? "").replace(/\r\n/g, "\n");
  const missing = [];
  for (const source of sources) {
    if (!source.placeholder) continue;
    const pattern = placeholderLinePattern(source.placeholder);
    if (!pattern.test(text)) {
      missing.push({
        placeholder: source.placeholder,
        type: source.type,
        path: source.path,
        locator: source.locator,
      });
      continue;
    }
    text = text.replace(pattern, () =>
      source.type === "code" ? codeMarkdown(source) : formulaMarkdown(source),
    );
  }
  text = text
    .replace(/\{\{ARTICLE_(?:CODE|FORMULA)_\d+\}\}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
  return { text: text ? `${text}\n` : "", missing };
}

export function restoreComposeSources(markdown, sources) {
  let text = String(markdown).replace(/\r\n/g, "\n");
  for (const source of sources) {
    if (!source.placeholder) continue;
    text =
      source.type === "code"
        ? replaceLine(text, source.placeholder, codeMarkdown(source))
        : replaceLine(text, source.placeholder, formulaMarkdown(source));
  }
  if (PLACEHOLDER_LEFTOVER.test(text)) throw new Error("composed article left a source placeholder behind");
  return text;
}
