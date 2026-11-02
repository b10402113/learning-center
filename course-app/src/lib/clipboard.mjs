import { resolveSrc } from "./assets.mjs";

/**
 * Build the Markdown a reader gets from "copy the whole article": the H1
 * followed by the article body, with step-relative image links resolved to
 * absolute URLs so the pasted copy still shows its figures.
 */
export function articleForClipboard(
  markdown,
  { title = "", assetBase = "", origin } = {}
) {
  const body = String(markdown ?? "")
    .replace(/^\s*#\s+.*(?:\r?\n)+/, "")
    .trim();

  const withAbsoluteImages = body.replace(
    /(!\[[^\]]*\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g,
    (_, open, src, close) => `${open}${resolveSrc(src, assetBase, origin)}${close}`
  );

  const heading = String(title ?? "").trim();
  if (!heading) return withAbsoluteImages;
  return withAbsoluteImages ? `# ${heading}\n\n${withAbsoluteImages}` : `# ${heading}`;
}

/** Copy text to the clipboard, falling back to a hidden textarea. */
export async function copyText(text) {
  const value = String(text ?? "");
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      /* insecure context or permission denied — try the fallback */
    }
  }
  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "-9999px";
  document.body.appendChild(field);
  field.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(field);
  }
}
