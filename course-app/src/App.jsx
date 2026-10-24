import { useEffect, useMemo, useRef, useState } from "react";
import subjectsIndex from "./data/subjects.json";
import Sidebar from "./components/Sidebar.jsx";
import NodeView from "./components/NodeView.jsx";
import StepView from "./components/StepView.jsx";
import PixelMark from "./components/PixelMark.jsx";
import DotMatrix from "./components/DotMatrix.jsx";
import { hashFor, parseHash } from "./lib/route.mjs";

// Lazy loaders — each subject's course JSON is code-split and fetched on demand.
const courseLoaders = import.meta.glob("./data/subjects/*.json");
const SUBJECTS = subjectsIndex.subjects;
const SIDEBAR_KEY = "lc.sidebar";

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

function initialSidebarCollapsed() {
  try {
    return window.localStorage.getItem(SIDEBAR_KEY) === "collapsed";
  } catch {
    return false;
  }
}

function ReadingProgress({ routeKey }) {
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setRatio(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [routeKey]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-[3.625rem] z-30 h-1 bg-ink/10"
    >
      <div
        className="h-full origin-left bg-accent"
        style={{ transform: `scaleX(${ratio})` }}
      />
    </div>
  );
}

function PanelIcon({ expand = false }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M9 4v16" />
      {expand ? <path d="m13 9 3 3-3 3" /> : <path d="m16 9-3 3 3 3" />}
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export default function App() {
  const [route, setRoute] = useState(initialRoute);
  const { subjectId, nodeId, stepId } = route;
  const [course, setCourse] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(initialSidebarCollapsed);
  const cacheRef = useRef({});
  const routeKey = `${subjectId ?? ""}/${nodeId ?? ""}/${stepId ?? ""}`;

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

  // ⌘B / Ctrl+B toggles the sidebar (focus mode)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Remember the reader's sidebar preference
  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_KEY, collapsed ? "collapsed" : "open");
    } catch {
      /* private mode */
    }
  }, [collapsed]);

  // Every route change starts at the top of the article, not mid-scroll.
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    window.scrollTo(0, 0);
  }, [routeKey]);

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
  };

  const switchSubject = (sid) => {
    if (sid === subjectId || !SUBJECTS.some((s) => s.id === sid)) return;
    setRoute({ subjectId: sid, nodeId: null, stepId: null });
    setCourse(null);
    setSidebarOpen(false);
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper">
        <div className="h-32 w-32">
          <DotMatrix variant="hexagon" height={128} />
        </div>
        <p className="robo-kicker font-label text-xs text-ink-soft">
          Loading
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
        <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="開啟選單"
            className="p-2 text-ink-soft transition-colors hover:text-accent lg:hidden"
          >
            <HamburgerIcon />
          </button>

          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "展開側欄" : "收合側欄"}
            title={collapsed ? "展開側欄（⌘B）" : "收合側欄（⌘B）"}
            className="hidden p-2 text-ink-soft transition-colors hover:text-accent lg:inline-flex"
          >
            <PanelIcon expand={collapsed} />
          </button>

          <button
            type="button"
            onClick={() => selectNode(course.nodes[0].id)}
            className="flex min-w-0 items-center gap-3 py-1 pr-2 text-left"
          >
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center border-2 border-ink bg-surface"
            >
              <PixelMark size={24} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-label text-[0.95rem] font-medium tracking-[-0.4px] text-ink">
                Learning Center
              </span>
              <span className="hidden truncate font-label text-[11px] uppercase tracking-[0.16em] text-ink-soft sm:block">
                {course.title} · {node.title}
              </span>
            </span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="hidden items-center gap-2 border-2 border-ink bg-surface px-3 py-1.5 font-label text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent hover:text-accent lg:inline-flex"
            >
              <PanelIcon expand={collapsed} />
              {collapsed ? "顯示目錄" : "專注模式"}
            </button>
          </div>
        </div>
      </header>

      <ReadingProgress routeKey={routeKey} />

      <div className="lg:flex">
        <Sidebar
          subjects={SUBJECTS}
          course={course}
          currentId={node.id}
          onSelect={selectNode}
          onSwitchSubject={switchSubject}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1040px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="border-0 bg-transparent px-0 py-0 sm:border-2 sm:border-ink sm:bg-surface sm:px-8 sm:py-8 sm:shadow-[8px_8px_0_rgba(28,26,22,0.9)] lg:px-12 lg:py-11">
              {step ? (
                <StepView
                  key={step.id}
                  course={course}
                  node={node}
                  step={step}
                />
              ) : (
                <NodeView
                  key={node.id}
                  course={course}
                  node={node}
                  onSelect={selectNode}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
