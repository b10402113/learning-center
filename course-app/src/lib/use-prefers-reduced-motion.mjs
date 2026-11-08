import { useEffect, useState } from "react";
import {
  REDUCED_MOTION_QUERY,
  resolveMotionPreference,
  subscribeMotionPreference,
} from "./motion.mjs";

function currentPreference() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return resolveMotionPreference(window.matchMedia(REDUCED_MOTION_QUERY));
}

/**
 * The reader's current `prefers-reduced-motion` preference. Re-renders when
 * the OS setting changes, without a page reload.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(currentPreference);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }
    const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
    setReduced(resolveMotionPreference(mediaQueryList));
    return subscribeMotionPreference(mediaQueryList, setReduced);
  }, []);

  return reduced;
}
