import { button } from "../lib/buttonVariants";
import { cn } from "../lib/cn";
import { Crosshair } from "./icons/Crosshair";
import { Minus } from "./icons/Minus";
import { Navigate } from "./icons/Navigate";
import { Plus } from "./icons/Plus";
import { Reset } from "./icons/Reset";
import { Tooltip } from "./ui/Tooltip";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onResetProgress: () => void;
  onNextUp: () => void;
  canResetProgress: boolean;
  hasNextUp: boolean;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onResetProgress,
  onNextUp,
  canResetProgress,
  hasNextUp,
}: MapControlsProps) {
  return (
    <div className="pointer-events-none absolute bottom-5 right-5 flex flex-col items-end gap-2">
      {hasNextUp ? (
        <button
          onClick={onNextUp}
          className={cn(button({ variant: "surface", size: "md" }), "pointer-events-auto border-beacon/40 text-beacon")}
          aria-label="跳到下一課"
        >
          <Navigate size={14} />
          下一課
        </button>
      ) : null}

      <div className="pointer-events-auto flex flex-col overflow-hidden rounded-lg border border-border bg-surface/80 backdrop-blur-md">
        <Tooltip
          trigger={(props) => (
            <button
              {...props}
              onClick={onZoomIn}
              aria-label="放大"
              className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-beacon"
            >
              <Plus size={16} />
            </button>
          )}
        >
          放大
        </Tooltip>
        <div className="h-px bg-border"></div>
        <Tooltip
          trigger={(props) => (
            <button
              {...props}
              onClick={onZoomOut}
              aria-label="縮小"
              className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-beacon"
            >
              <Minus size={16} />
            </button>
          )}
        >
          縮小
        </Tooltip>
        <div className="h-px bg-border"></div>
        <Tooltip
          trigger={(props) => (
            <button
              {...props}
              onClick={onReset}
              aria-label="重置視角"
              className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-beacon"
            >
              <Crosshair size={16} />
            </button>
          )}
        >
          重置視角
        </Tooltip>
      </div>

      <button
        onClick={onResetProgress}
        disabled={!canResetProgress}
        className={cn(button({ variant: "surface", size: "md" }), "pointer-events-auto")}
        aria-label="重置手動進度"
      >
        <Reset size={14} />
        重置進度
      </button>
    </div>
  );
}
