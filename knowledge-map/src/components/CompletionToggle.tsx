import { cn } from "../lib/cn";
import { Check } from "./icons/Check";
import { Circle } from "./icons/Circle";

interface CompletionToggleProps {
  active: boolean;
  onClick: () => void;
  activeLabel: string;
  idleLabel: string;
}

export function CompletionToggle({ active, onClick, activeLabel, idleLabel }: CompletionToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-beacon",
        active
          ? "border-brass-dim/60 bg-brass/10 text-brass"
          : "border-input text-faint hover:border-brass hover:text-brass",
      )}
    >
      {active ? <Check size={14} /> : <Circle size={14} />}
      {active ? activeLabel : idleLabel}
    </button>
  );
}
