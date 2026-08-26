import { useEffect, useMemo, useRef, useState } from "react";
import subjectsIndex from "./data/subjects.json";
import Sidebar from "./components/Sidebar.jsx";
import NodeView from "./components/NodeView.jsx";

// Lazy loaders — each subject's course JSON is code-split and fetched on demand.
const courseLoaders = import.meta.glob("./data/subjects/*.json");
const SUBJECTS = subjectsIndex.subjects;

function parseHash() {
  const m = window.location.hash.match(/^#\/([^/]+)\/(.+)$/);
  if (m) {
    return { subjectId: decodeURIComponent(m[1]), nodeId: decodeURIComponent(m[2]) };
  }
  // legacy single-subject scheme: #/node/<id>
  const legacy = window.location.hash.match(/^#\/node\/(.+)$/);
  if (legacy) return { subjectId: null, nodeId: decodeURIComponent(legacy[1]) };
  return null;
}

export default function App() {
  const [{ subjectId, nodeId }, setRoute] = useState(() => {
    const h = parseHash();
    const sid =
      h?.subjectId && SUBJECTS.some((s) => s.id === h.subjectId)
        ? h.subjectId
        : SUBJECTS[0]?.id;
    return { subjectId: sid, nodeId: h?.nodeId ?? null };
  });
  const [course, setCourse] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Set of "nodeId/stepId" — which step cards are expanded
  const [expanded, setExpanded] = useState(() => new Set());
  const cacheRef = useRef({});

  // Load the selected subject's data (async, cached)
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!subjectId) return;
      if (!cacheRef.current[subjectId]) {
        const loader = courseLoaders[`./data/subjects/${subjectId}.json`];
        if (!loader) return;
        const mod = await loader();
        cacheRef.current[subjectId] = mod.default;
      }
      if (alive) setCourse(cacheRef.current[subjectId]);
    })();
    return () => {
      alive = false;
    };
  }, [subjectId]);

  const node = useMemo(
    () =>
      (course && course.nodes.find((n) => n.id === nodeId)) ||
      course?.nodes[0] ||
      null,
    [course, nodeId]
  );

  // Browser back/forward support
  useEffect(() => {
    const onHash = () => {
      const h = parseHash();
      if (h?.subjectId && h?.nodeId) setRoute(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Esc closes the mobile drawer; lock body scroll while open
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const pushHash = (sid, nid) => {
    const next = `#/${encodeURIComponent(sid)}/${encodeURIComponent(nid)}`;
    if (window.location.hash !== next) history.pushState(null, "", next);
  };

  const selectNode = (id) => {
    setRoute((r) => ({ ...r, nodeId: id }));
    setExpanded(new Set());
    setSidebarOpen(false);
    pushHash(subjectId, id);
    window.scrollTo({ top: 0 });
  };

  const switchSubject = (sid) => {
    if (sid === subjectId || !SUBJECTS.some((s) => s.id === sid)) return;
    setRoute({ subjectId: sid, nodeId: null }); // node resolves after load
    setCourse(null);
    setExpanded(new Set());
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  };

  // After a subject loads, sync its first node into the hash if none selected
  useEffect(() => {
    if (course && !course.nodes.some((n) => n.id === nodeId) && course.nodes[0]) {
      setRoute((r) => ({ ...r, nodeId: course.nodes[0].id }));
      history.replaceState(null, "", `#/${encodeURIComponent(course.subject)}/${encodeURIComponent(course.nodes[0].id)}`);
    }
  }, [course, nodeId]);

  const toggleStep = (key) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  if (!course || !node) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-label animate-pulse text-sm tracking-wide text-ink-soft">
          載入中…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:flex">
      {/* Mobile top bar */}
      <header className="font-label sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-shade/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="開啟選單"
          className="rounded-md p-1.5 text-ink transition-colors hover:bg-accent-soft"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.12em] text-ink-soft">
            {course.title} · Tier {node.tier}
          </p>
          <p className="truncate text-sm font-semibold">{node.title}</p>
        </div>
      </header>

      <Sidebar
        subjects={SUBJECTS}
        course={course}
        currentId={node.id}
        onSelect={selectNode}
        onSwitchSubject={switchSubject}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-w-0 flex-1 px-4 pb-20 pt-6 sm:px-8 sm:pt-8 lg:max-w-[900px] xl:px-12">
        <NodeView
          course={course}
          node={node}
          expanded={expanded}
          onToggleStep={toggleStep}
          onSelect={selectNode}
        />
      </main>
    </div>
  );
}
