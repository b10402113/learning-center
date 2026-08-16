import { Crosshair, Minus, Plus, RotateCcw, Navigation } from "lucide-react"

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onResetProgress: () => void
  onNextUp: () => void
  canResetProgress: boolean
  hasNextUp: boolean
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
      {hasNextUp && (
        <button
          onClick={onNextUp}
          className="pointer-events-auto flex items-center gap-2 rounded-lg border border-beacon/40 bg-surface/80 px-3 py-2 font-mono text-xs text-beacon backdrop-blur-md transition-colors hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-beacon"
          aria-label="跳到下一課"
        >
          <Navigation size={14} />
          下一課
        </button>
      )}

      <div className="pointer-events-auto flex flex-col overflow-hidden rounded-lg border border-border bg-surface/80 backdrop-blur-md">
        <ControlBtn label="放大" onClick={onZoomIn}>
          <Plus size={16} />
        </ControlBtn>
        <div className="h-px bg-border" />
        <ControlBtn label="縮小" onClick={onZoomOut}>
          <Minus size={16} />
        </ControlBtn>
        <div className="h-px bg-border" />
        <ControlBtn label="重置視角" onClick={onReset}>
          <Crosshair size={16} />
        </ControlBtn>
      </div>

      <button
        onClick={onResetProgress}
        disabled={!canResetProgress}
        className="pointer-events-auto flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-3 py-2 font-mono text-xs text-muted backdrop-blur-md transition-colors enabled:hover:border-brass-dim enabled:hover:text-foreground disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-beacon"
        aria-label="重置手動進度"
      >
        <RotateCcw size={14} />
        重置進度
      </button>
    </div>
  )
}

function ControlBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-beacon"
    >
      {children}
    </button>
  )
}
