export interface LinkState {
  subject: string | null
  pathId: string | null
}

function normalize(params: URLSearchParams): LinkState {
  const subject = params.get("s")
  const pathId = params.get("p")
  return {
    subject: subject && subject.length > 0 ? subject : null,
    pathId: pathId && pathId.length > 0 ? pathId : null,
  }
}

/**
 * Read deep-link state from the current URL.
 *
 * State lives in the query string (`?s=<subject>&p=<path-id>`) rather than the
 * hash: a hash like `#s=foo` is not a valid CSS selector, and anchor-scroll
 * helpers that call `document.querySelector(location.hash)` throw on it.
 * Legacy hash links are still accepted so older URLs keep working.
 */
export function parseLinkState(search: string, hash = ""): LinkState {
  const fromSearch = normalize(new URLSearchParams(search.replace(/^\?/, "")))
  if (fromSearch.subject || fromSearch.pathId) return fromSearch
  return normalize(new URLSearchParams(hash.replace(/^#/, "")))
}

/** Build the canonical query string. `p` omitted when nothing is selected. */
export function buildLinkState(subject: string, pathId: string | null): string {
  const params = new URLSearchParams()
  params.set("s", subject)
  if (pathId) params.set("p", pathId)
  return "?" + params.toString()
}

/** Mirror state to the URL without flooding history. */
export function replaceLinkState(subject: string, pathId: string | null): void {
  if (typeof history === "undefined") return
  const next = buildLinkState(subject, pathId)
  // any legacy `#s=…` hash is intentionally dropped here
  if (window.location.search === next && !window.location.hash) return
  history.replaceState(null, "", next)
}
