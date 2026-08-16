import { ChevronDown, Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { Subject } from "@/types"
import type { ProgressMap } from "@/lib/progress"
import { subjectStat } from "@/lib/selectors"

interface TopBarProps {
  subjects: Subject[]
  current: Subject
  progress: ProgressMap
  onSwitch: (id: string) => void
}

export function TopBar({ subjects, current, progress, onSwitch }: TopBarProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  const stat = subjectStat(current, progress)

  return (
    <header className="relative z-40 flex items-center justify-between gap-4 border-b border-border bg-surface/70 px-5 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brass/15 ring-1 ring-brass/40">
          <Sparkles size={18} className="text-brass" />
        </div>
        <div className="leading-tight">
          <h1 className="font-serif text-xl text-foreground">知識星雲</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Knowledge Nebula
          </p>
        </div>
      </div>

      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-4 py-2 text-left transition-colors hover:border-brass-dim focus:outline-none focus-visible:ring-2 focus-visible:ring-beacon"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">
              {current.title}
            </div>
            <div className="font-mono text-[11px] text-muted">
              {stat.plates} plates · {stat.charted} charted
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/50"
          >
            {subjects.map((s) => {
              const st = subjectStat(s, progress)
              const active = s.id === current.id
              return (
                <li key={s.id} role="option" aria-selected={active}>
                  <button
                    onClick={() => {
                      onSwitch(s.id)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2 ${
                      active ? "bg-surface-2" : ""
                    }`}
                  >
                    <div className="leading-tight">
                      <div className="text-sm font-medium text-foreground">
                        {s.title}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-wide text-muted">
                        {s.subtitle}
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-muted">
                      {st.charted}/{st.plates}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </header>
  )
}
