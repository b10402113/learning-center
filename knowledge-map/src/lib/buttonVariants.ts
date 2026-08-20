import { tv } from "tailwind-variants";

/** Shared button recipe — the developer-docs control chrome. */
export const button = tv({
  base: "inline-flex items-center justify-center gap-1.5 font-mono transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-40",
  variants: {
    variant: {
      ghost: "text-faint hover:bg-secondary hover:text-brand-primary",
      outline: "border border-input text-faint hover:border-brand-primary hover:text-brand-primary",
      surface:
        "border border-border bg-surface/80 text-muted backdrop-blur-md enabled:hover:border-brand-primary-dim enabled:hover:text-foreground",
      brass:
        "border border-brand-primary-dim/70 bg-brand-primary/10 text-brand-primary enabled:hover:bg-brand-primary/20",
      primary:
        "rounded-full bg-gradient-to-r from-brand-primary to-[#ff4d94] text-white shadow-[0_0_16px_rgba(255,0,113,0.35)] enabled:hover:brightness-110",
    },
    size: {
      sm: "h-6 gap-1 rounded-md px-2 text-[0.65rem]",
      md: "h-8 gap-1.5 rounded-md px-3 text-xs",
      icon: "size-7 shrink-0 rounded-md",
    },
  },
  defaultVariants: {
    variant: "surface",
    size: "md",
  },
});