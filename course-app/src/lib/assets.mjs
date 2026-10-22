/** Resolve a Markdown-relative asset against a base directory in the app. */
export function resolveSrc(src, base, origin = "http://localhost/") {
  if (!src || !base) return src;
  if (/^(?:[a-z]+:|\/|#)/i.test(src)) return src;
  try {
    return new URL(src, new URL(base, origin)).href;
  } catch {
    return src;
  }
}
