import { useEffect, useMemo, useRef, useState } from "react";
import subjectsIndex from "./data/subjects.json";
import Sidebar from "./components/Sidebar.jsx";
import NodeView from "./components/NodeView.jsx";
import StepView from "./components/StepView.jsx";
import { hashFor, parseHash } from "./lib/route.mjs";

// Lazy loaders — each subject's course JSON is code-split and fetched on demand.
const courseLoaders = import.meta.glob("./data/subjects/*.json");
const SUBJECTS = subjectsIndex.subjects;

function resolveSubjectId(id) {
  return id && SUBJECTS.some((s) => s.id === id) ? id : SUBJECTS[0]?.id;
}

function initialRoute() {
  const h = parseHash(window.location.hash);
  return {
    subjectId: resolveSubjectId(h?.subjectId),
    nodeId: h?.nodeId ?? null,
    stepId: h?.stepId ?? null,
  };
}

export default function App() {
  const [route, setRoute] = useState(initialRoute);
  const { subjectId, nodeId, stepId } = route;
  const [course, setCourse] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const step = useMemo(
    () => node?.steps.find((s) => s.id === stepId) || null,
    [node, stepId]
  );

  // Browser back/forward support
  useEffect(() => {
    const onHash = () => {
      const next = parseHash(window.location.hash);
      if (!next) return;
      setRoute({
        subjectId: resolveSubjectId(next.subjectId),
        nodeId: next.nodeId,
        stepId: next.stepId,
      });
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

  const replaceHash = (sid, nid, stid = null) => {
    const next = hashFor(sid, nid, stid);
    if (window.location.hash !== next) history.replaceState(null, "", next);
  };

  const pushHash = (sid, nid, stid = null) => {
    const next = hashFor(sid, nid, stid);
    if (window.location.hash !== next) history.pushState(null, "", next);
  };

  const selectNode = (id) => {
    setRoute((r) => ({ ...r, nodeId: id, stepId: null }));
    setSidebarOpen(false);
    pushHash(subjectId, id);
    window.scrollTo({ top: 0 });
  };

  const switchSubject = (sid) => {
    if (sid === subjectId || !SUBJECTS.some((s) => s.id === sid)) return;
    setRoute({ subjectId: sid, nodeId: null, stepId: null });
    setCourse(null);
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  };

  // Resolve incomplete or stale hashes once the course JSON is loaded.
  useEffect(() => {
    if (!course || course.nodes.length === 0) return;
    const resolved =
      course.nodes.find((n) => n.id === nodeId) || course.nodes[0];
    const resolvedStep = resolved.steps.some((s) => s.id === stepId)
      ? stepId
      : null;

    if (resolved.id !== nodeId || resolvedStep !== stepId) {
      setRoute({
        subjectId: course.subject,
        nodeId: resolved.id,
        stepId: resolvedStep,
      });
    }
    replaceHash(course.subject, resolved.id, resolvedStep);
  }, [course, nodeId, stepId]);

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
          <p className="truncate text-sm font-semibold">
            {step ? step.title : node.title}
          </p>
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
        {step ? (
          <StepView course={course} node={node} step={step} />
        ) : (
          <NodeView course={course} node={node} onSelect={selectNode} />
        )}
      </main>
    </div>
  );
}
