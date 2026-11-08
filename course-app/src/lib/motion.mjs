/** Media query that carries the reader's reduced-motion preference. */
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Skeleton floor so a cached subject never flashes a placeholder. */
export const MIN_LOADING_MS = 150;

/**
 * Read a MediaQueryList (or any `{ matches }` object) as a boolean.
 * Pure, so the preference gate can be tested without a browser.
 */
export function resolveMotionPreference(mediaQueryList) {
  return Boolean(mediaQueryList && mediaQueryList.matches);
}

/**
 * Subscribe to a MediaQueryList and call `onChange` with the resolved
 * boolean whenever the preference changes. Returns a cleanup function.
 */
export function subscribeMotionPreference(mediaQueryList, onChange) {
  if (!mediaQueryList) return () => {};

  const emit = (event) => {
    const matches =
      event && typeof event.matches === "boolean"
        ? event.matches
        : mediaQueryList.matches;
    onChange(Boolean(matches));
  };

  if (typeof mediaQueryList.addEventListener !== "function") return () => {};
  mediaQueryList.addEventListener("change", emit);
  return () => mediaQueryList.removeEventListener("change", emit);
}

/**
 * Milliseconds still owed to a minimum display window. Returns 0 once the
 * window has passed or when there is no start time.
 */
export function remainingDisplayMs(startedAt, now, minMs = MIN_LOADING_MS) {
  if (!startedAt || !Number.isFinite(startedAt)) return 0;
  const remaining = minMs - (now - startedAt);
  return remaining > 0 ? remaining : 0;
}
