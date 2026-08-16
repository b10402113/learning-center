import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Graph, Subject } from "@/types"
import graphData from "@/data/graph.json"
import { loadProgress, resetSubject, saveProgress, toggleComplete } from "@/lib/progress"
import type { ProgressMap } from "@/lib/progress"
import { firstUnchartedInSpine } from "@/lib/selectors"
import { parseLinkState, replaceLinkState } from "@/lib/hashlink"
import { TopBar } from "@/components/TopBar"
import { TowerMap, type TowerMapHandle } from "@/components/TowerMap"
import { MapControls } from "@/components/MapControls"
import { Legend } from "@/components/Legend"
import { HoverCard } from "@/components/HoverCard"
import { DetailPane } from "@/components/DetailPane"

const graph = graphData as unknown as Graph

export default function App() {
  const subjects = graph.subjects
  const initial = parseLinkState(window.location.search, window.location.hash)

  const initialSubject =
    subjects.find((s) => s.id === initial.subject) ?? subjects[0]

  const [subjectId, setSubjectId] = useState(initialSubject.id)
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (!initial.pathId) return null
    return initialSubject.paths.some((p) => p.id === initial.pathId)
      ? initial.pathId
      : null
  })
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress())

  const mapRef = useRef<TowerMapHandle>(null)

  const subject: Subject = useMemo(
    () => subjects.find((s) => s.id === subjectId) ?? subjects[0],
    [subjects, subjectId],
  )

  // persist progress
  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  // mirror state to the URL query string
  useEffect(() => {
    replaceLinkState(subjectId, selectedId)
  }, [subjectId, selectedId])

  // respond to back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      const { subject: s, pathId } = parseLinkState(
        window.location.search,
        window.location.hash,
      )
      if (s && subjects.some((x) => x.id === s)) setSubjectId(s)
      setSelectedId(
        pathId && subjects.some((x) => x.paths.some((p) => p.id === pathId))
          ? pathId
          : null,
      )
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [subjects])

  // seat the camera on an incoming deep-link once the map mounts
  const deepLinked = useRef(false)
  useEffect(() => {
    if (deepLinked.current) return
    deepLinked.current = true
    if (selectedId) {
      // let the map fit first, then settle on the tile
      requestAnimationFrame(() => mapRef.current?.seatOnPath(selectedId, false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectPath = useCallback((id: string) => {
    setSelectedId(id)
    setHoveredId(null)
    mapRef.current?.seatOnPath(id, true)
  }, [])

  const switchSubject = useCallback(
    (id: string) => {
      if (id === subjectId) return
      setSubjectId(id)
      setSelectedId(null)
      setHoveredId(null)
    },
    [subjectId],
  )

  const onToggleComplete = useCallback(
    (pathId: string) => {
      setProgress((m) => toggleComplete(m, subject.id, pathId))
    },
    [subject.id],
  )

  const onResetProgress = useCallback(() => {
    setProgress((m) => resetSubject(m, subject.id))
  }, [subject.id])

  const nextUp = useMemo(
    () => firstUnchartedInSpine(subject, progress),
    [subject, progress],
  )

  const goNextUp = useCallback(() => {
    if (nextUp) selectPath(nextUp.id)
  }, [nextUp, selectPath])

  // track pointer for the hover card
  useEffect(() => {
    if (!hoveredId) return
    const onMove = (e: MouseEvent) => setPointer({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [hoveredId])

  const selectedPath = selectedId
    ? subject.paths.find((p) => p.id === selectedId) ?? null
    : null
  const hoveredPath =
    hoveredId && hoveredId !== selectedId
      ? subject.paths.find((p) => p.id === hoveredId) ?? null
      : null

  const manuallyComplete = selectedPath
    ? (progress[subject.id] ?? []).includes(selectedPath.id)
    : false

  const canResetProgress = (progress[subject.id] ?? []).length > 0

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <TopBar
        subjects={subjects}
        current={subject}
        progress={progress}
        onSwitch={switchSubject}
      />

      <main className="relative flex-1 overflow-hidden">
        <TowerMap
          ref={mapRef}
          subject={subject}
          progress={progress}
          selectedId={selectedId}
          onSelect={selectPath}
          hoveredId={hoveredId}
          onHover={setHoveredId}
        />

        <Legend />

        <MapControls
          onZoomIn={() => mapRef.current?.zoomBy(1.25)}
          onZoomOut={() => mapRef.current?.zoomBy(0.8)}
          onReset={() => mapRef.current?.fit(true)}
          onResetProgress={onResetProgress}
          onNextUp={goNextUp}
          canResetProgress={canResetProgress}
          hasNextUp={Boolean(nextUp)}
        />

        {hoveredPath && (
          <HoverCard path={hoveredPath} x={pointer.x} y={pointer.y} />
        )}

        {selectedPath && (
          <DetailPane
            subject={subject}
            rootPathId={selectedPath.id}
            manuallyComplete={manuallyComplete}
            onClose={() => setSelectedId(null)}
            onToggleComplete={onToggleComplete}
          />
        )}
      </main>
    </div>
  )
}
