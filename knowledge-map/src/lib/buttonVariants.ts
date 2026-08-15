import { tv } from "tailwind-variants";

/** Shared button recipe — the Nebula cockpit control chrome. */
export const button = tv({
  base: "inline-flex items-center justify-center gap-1.5 font-mono transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-beacon disabled:pointer-events-none disabled:opacity-40",
  variants: {
    variant: {
      ghost: "text-faint hover:bg-secondary hover:text-brass",
      outline: "border border-input text-faint hover:border-brass hover:text-brass",
      surface:
        "border border-border bg-surface/80 text-muted backdrop-blur-md enabled:hover:border-brass-dim enabled:hover:text-foreground",
      brass:
        "border border-brass-dim/70 bg-brass/10 text-brass enabled:hover:bg-brass/20",
    },
    size: {
      sm: "h-6 gap-1 rounded-sm px-2 text-[0.65rem]",
      md: "h-8 gap-1.5 rounded-md px-3 text-xs",
      icon: "size-7 shrink-0 rounded-sm",
    },
  },
  defaultVariants: {
    variant: "surface",
    size: "md",
  },
});
