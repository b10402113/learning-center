import { useCallback, useEffect, useRef, useState } from "react"
import {
  type Camera,
  type Viewport,
  type WorldSize,
  camerasClose,
  clampTranslation,
  fitCamera,
  lerpCamera,
  seatCamera,
  zoomAt,
} from "./camera"

interface UseCameraArgs {
  world: WorldSize
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function useCamera({ world, containerRef }: UseCameraArgs) {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 1 })
  const [view, setView] = useState<Viewport>({ width: 0, height: 0 })
  const worldRef = useRef(world)
  worldRef.current = world
  const viewRef = useRef(view)
  viewRef.current = view

  const animRef = useRef<number | null>(null)
  const targetRef = useRef<Camera | null>(null)

  const stopAnim = useCallback(() => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    }
    targetRef.current = null
  }, [])

  const animateTo = useCallback(
    (target: Camera) => {
      stopAnim()
      targetRef.current = target
      const step = () => {
        setCamera((cur) => {
          const t = targetRef.current
          if (!t) return cur
          const next = lerpCamera(cur, t, 0.18)
          if (camerasClose(next, t)) {
            targetRef.current = null
            animRef.current = null
            return t
          }
          animRef.current = requestAnimationFrame(step)
          return next
        })
      }
      animRef.current = requestAnimationFrame(step)
    },
    [stopAnim],
  )

  // observe container size
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      setView({ width: rect.width, height: rect.height })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [containerRef])

  const fit = useCallback(
    (animate = false) => {
      const v = viewRef.current
      const target = fitCamera(worldRef.current, v)
      if (animate) animateTo(target)
      else {
        stopAnim()
        setCamera(target)
      }
    },
    [animateTo, stopAnim],
  )

  const seatOn = useCallback(
    (point: { x: number; y: number }, scale = 0.9, animate = true) => {
      const target = clampTranslation(
        seatCamera(point, viewRef.current, scale),
        worldRef.current,
        viewRef.current,
      )
      if (animate) animateTo(target)
      else {
        stopAnim()
        setCamera(target)
      }
    },
    [animateTo, stopAnim],
  )

  const zoomBy = useCallback(
    (factor: number, cursor?: { x: number; y: number }) => {
      stopAnim()
      setCamera((cur) => {
        const v = viewRef.current
        const c = cursor ?? { x: v.width / 2, y: v.height / 2 }
        return clampTranslation(zoomAt(cur, c, factor), worldRef.current, v)
      })
    },
    [stopAnim],
  )

  const panBy = useCallback(
    (dx: number, dy: number) => {
      stopAnim()
      setCamera((cur) =>
        clampTranslation(
          { ...cur, x: cur.x + dx, y: cur.y + dy },
          worldRef.current,
          viewRef.current,
        ),
      )
    },
    [stopAnim],
  )

  useEffect(() => () => stopAnim(), [stopAnim])

  return { camera, view, fit, seatOn, zoomBy, panBy, stopAnim }
}
