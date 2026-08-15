import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

interface TooltipProps {
  children?: ReactNode;
  /** Renders the trigger element; receives Radix trigger props to spread. */
  trigger: (props: Record<string, unknown>) => ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerProps?: Record<string, unknown>;
}

export function Tooltip({ children, trigger, open, onOpenChange, triggerProps = {} }: TooltipProps) {
  return (
    <TooltipPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <TooltipPrimitive.Trigger asChild>
        {trigger({ ...triggerProps })}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className="z-30 rounded-md border border-border bg-surface-2 px-2 py-1 font-mono text-[0.65rem] text-foreground shadow-lg shadow-black/40"
          sideOffset={6}
        >
          {children}
          <TooltipPrimitive.Arrow className="fill-surface-2" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
