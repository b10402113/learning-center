import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, letting Tailwind-specific conflicts resolve. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
