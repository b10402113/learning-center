import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  forwardRef,
} from "react"
import type { Subject } from "@/types"
import type { ProgressMap } from "@/lib/progress"
import { computeLayout, makeStars, type TileBox } from "@/lib/layout"
import { isLit } from "@/lib/selectors"
import { useCamera } from "@/lib/useCamera"
import { Tile } from "./Tile"
import { MapDefs } from "./MapDefs"
import { EdgeLayer } from "./EdgeLayer"
import { FloorLayer } from "./FloorLayer"

export interface TowerMapHandle {
  fit: (animate?: boolean) => void
  seatOnPath: (pathId: string, animate?: boolean) => void
  zoomBy: (factor: number) => void
}

interface TowerMapProps {
  subject: Subject
  progress: ProgressMap
  selectedId: string | null
  onSelect: (id: string) => void
  hoveredId: string | null
  onHover: (id: string | null) => void
}

export const TowerMap = forwardRef<TowerMapHandle, TowerMapProps>(
  function TowerMap(
    { subject, progress, selectedId, onSelect, hoveredId, onHover },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null)

    const layout = useMemo(() => computeLayout(subject), [subject])
    const stars = useMemo(
      () => makeStars(subject, layout.width, layout.height),
      [subject, layout.width, layout.height],
    )

    const world = useMemo(
      () => ({ width: layout.width, height: layout.height }),
      [layout.width, layout.height],
    )

    const { camera, view, fit, seatOn, zoomBy, panBy, stopAnim } = useCamera({
      world,
      containerRef,
    })

    // fit whenever subject changes and once the viewport is known
    const fittedFor = useRef<string | null>(null)
    useEffect(() => {
      if (view.width > 0 && fittedFor.current !== subject.id) {
        fittedFor.current = subject.id
        fit(false)
      }
    }, [subject.id, view.width, fit])

    const seatOnPath = useCallback(
      (pathId: string, animate = true) => {
        const box: TileBox | undefined = layout.tiles[pathId]
        if (!box) return
        seatOn({ x: box.cx, y: box.cy }, 1, animate)
      },
      [layout.tiles, seatOn],
    )

    useImperativeHandle(
      ref,
      () => ({
        fit,
        seatOnPath,
        zoomBy: (factor: number) => zoomBy(factor),
      }),
      [fit, seatOnPath, zoomBy],
    )

    // ---- wheel zoom / pan ----
    useEffect(() => {
      const el = containerRef.current
      if (!el) return
      const onWheel = (e: WheelEvent) => {
        e.preventDefault()
        const rect = el.getBoundingClientRect()
        const cursor = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        if (e.ctrlKey) {
          const factor = Math.exp(-e.deltaY * 0.01)
          zoomBy(factor, cursor)
        } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && !e.shiftKey) {
          panBy(-e.deltaX, -e.deltaY)
        } else {
          const factor = Math.exp(-e.deltaY * 0.0015)
          zoomBy(factor, cursor)
        }
      }
      el.addEventListener("wheel", onWheel, { passive: false })
      return () => el.removeEventListener("wheel", onWheel)
    }, [zoomBy, panBy])

    // ---- Safari gesture events ----
    useEffect(() => {
      const el = containerRef.current
      if (!el) return
      let base = 1
      const anyEl = el as unknown as {
        addEventListener: (t: string, fn: (e: GestureEvent) => void) => void
        removeEventListener: (t: string, fn: (e: GestureEvent) => void) => void
      }
      const start = (e: GestureEvent) => {
        e.preventDefault()
        base = e.scale
      }
      const change = (e: GestureEvent) => {
        e.preventDefault()
        const rect = el.getBoundingClientRect()
        const cursor = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        zoomBy(e.scale / base, cursor)
        base = e.scale
      }
      anyEl.addEventListener("gesturestart", start)
      anyEl.addEventListener("gesturechange", change)
      return () => {
        anyEl.removeEventListener("gesturestart", start)
        anyEl.removeEventListener("gesturechange", change)
      }
    }, [zoomBy])

    // ---- pointer drag pan (with click suppression) ----
    const drag = useRef({
      active: false,
      moved: false,
      captured: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      pointerId: -1,
    })

    const onPointerDown = (e: React.PointerEvent) => {
      if (e.button !== 0) return
      stopAnim()
      drag.current = {
        active: true,
        moved: false,
        captured: false,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        pointerId: e.pointerId,
      }
    }
    const onPointerMove = (e: React.PointerEvent) => {
      if (!drag.current.active) return
      const dx = e.clientX - drag.current.lastX
      const dy = e.clientY - drag.current.lastY
      const totalMove =
        Math.abs(e.clientX - drag.current.startX) +
        Math.abs(e.clientY - drag.current.startY)
      // only claim the pointer (and start panning) once past the threshold,
      // so a plain click still reaches the tile beneath the cursor
      if (totalMove > 4) {
        drag.current.moved = true
        if (!drag.current.captured) {
          drag.current.captured = true
          try {
            ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
          } catch {
            /* noop */
          }
        }
      }
      if (drag.current.moved) {
        drag.current.lastX = e.clientX
        drag.current.lastY = e.clientY
        panBy(dx, dy)
      }
    }
    const onPointerUp = (e: React.PointerEvent) => {
      drag.current.active = false
      if (drag.current.captured) {
        try {
          ;(e.currentTarget as Element).releasePointerCapture(e.pointerId)
        } catch {
          /* noop */
        }
      }
      // clear the moved flag on the next tick so the click handler (which
      // fires right after pointerup) can still read it
      requestAnimationFrame(() => {
        drag.current.moved = false
      })
    }

    // suppress tile click if we panned
    const guardedSelect = useCallback(
      (id: string) => {
        if (drag.current.moved) return
        onSelect(id)
      },
      [onSelect],
    )

    return (
      <div
        ref={containerRef}
        className="relative h-full w-full touch-none overflow-hidden"
        style={{ cursor: drag.current.active ? "grabbing" : "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label={`${subject.title} 塔圖`}
        role="application"
      >
        <svg
          className="absolute inset-0 h-full w-full select-none"
          aria-hidden={false}
        >
          <MapDefs subjectId={subject.id} />
          <rect width="100%" height="100%" fill="url(#skyGrad)" />

          <g
            transform={`translate(${camera.x} ${camera.y}) scale(${camera.scale})`}
          >
            {/* star-field */}
            <g aria-hidden>
              {stars.map((s, i) => (
                <circle
                  key={i}
                  cx={s.x}
                  cy={s.y}
                  r={s.r}
                  fill="var(--color-foreground)"
                  opacity={s.o}
                  style={{
                    animation: `nb-twinkle ${5 + (i % 5)}s ease-in-out ${s.delay}s infinite`,
                  }}
                />
              ))}
            </g>

            <FloorLayer floors={layout.floors} width={layout.width} />

            <EdgeLayer
              edges={layout.edges}
              hoveredId={hoveredId}
              subject={subject}
            />

            {subject.paths.map((p) => {
              const box = layout.tiles[p.id]
              if (!box) return null
              return (
                <Tile
                  key={p.id}
                  path={p}
                  box={box}
                  lit={isLit(p, subject.id, progress)}
                  selected={selectedId === p.id}
                  onSelect={guardedSelect}
                  onHover={onHover}
                />
              )
            })}
          </g>

          <rect
            width="100%"
            height="100%"
            fill="url(#vignette)"
            pointerEvents="none"
          />
        </svg>
      </div>
    )
  },
)

interface GestureEvent extends Event {
  scale: number
  clientX: number
  clientY: number
  preventDefault: () => void
}
