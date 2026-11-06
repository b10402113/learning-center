/** True when the click should keep the browser's default navigation. */
export function isPlainLeftClick(event) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/**
 * Send an in-app link through `onNavigate`. Returns true when the handler
 * consumed the click, so the caller can call `event.preventDefault()`.
 */
export function followInternalLink(event, href, onNavigate) {
  if (
    !onNavigate ||
    !href ||
    href.startsWith("#") ||
    event.defaultPrevented ||
    !isPlainLeftClick(event)
  ) {
    return false;
  }
  return Boolean(onNavigate(href));
}
