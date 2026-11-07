import { useEffect, useMemo, useRef, useState } from "react";
import subjectsIndex from "./data/subjects.json";
import Sidebar from "./components/Sidebar.jsx";
import NodeView from "./components/NodeView.jsx";
import StepView from "./components/StepView.jsx";
import SubjectsView from "./components/SubjectsView.jsx";
import SubjectOverview from "./components/SubjectOverview.jsx";
import BlockView from "./components/BlockView.jsx";
import BlocksIndex from "./components/BlocksIndex.jsx";
import PixelMark from "./components/PixelMark.jsx";
import { KnowledgeGlyph, OrbitMark } from "./components/Glyphs.jsx";
import { railBlocks } from "./lib/blocks.mjs";
import {
  indexRoute,
  parsePath,
  pathFor,
  pathForBlock,
  pathForBlocks,
} from "./lib/route.mjs";

// Lazy loaders — each subject's course JSON is code-split and fetched on demand.
const courseLoaders = import.meta.glob("./data/subjects/*.json");
const blockLoaders = import.meta.glob("./data/blocks/*/*.json");
const SUBJECTS = subjectsIndex.subjects;
const SIDEBAR_KEY = "lc.sidebar";
const RAIL_KEY = "lc.rail";
const THEME_KEY = "lc.theme";

function initialRailOpen() {
  try {
    return window.localStorage.getItem(RAIL_KEY) !== "hidden";
  } catch {
    return true;
  }
}

function initialTheme() {
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function resolveSubjectId(id) {
  return id && SUBJECTS.some((s) => s.id === id) ? id : null;
}

function initialRoute() {
  const parsed = parsePath(window.location.pathname);
  if (!parsed) return indexRoute();
  return {
    ...parsed,
    subjectId: resolveSubjectId(parsed.subjectId),
  };
}

function initialSidebarCollapsed() {
  try {
    return window.localStorage.getItem(SIDEBAR_KEY) === "collapsed";
  } catch {
    return false;
  }
}

function FocusExit({ onExit }) {
  const [quiet, setQuiet] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setQuiet(true), 10000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <button
      type="button"
      onClick={onExit}
      aria-label="退出專注模式"
      title="退出專注模式（Esc / ⌘B）"
      className={`fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/90 shadow-soft backdrop-blur transition-opacity duration-500 hover:border-accent/40 hover:text-accent ${
        quiet ? "opacity-45" : "opacity-100"
      }`}
    >
      <span
        className={`inline-flex ${
          quiet ? "p-2.5" : "py-2 pl-3.5"
        }`}
      >
        <PanelIcon expand />
      </span>
      {!quiet && (
        <span className="pr-3.5 font-label text-[10px] uppercase tracking-[0.12em]">
          退出專注
        </span>
      )}
    </button>
  );
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
      className="pointer-events-none fixed inset-x-0 top-16 z-30 h-[3px] bg-ink/5"
    >
      <div
        className="h-full origin-left rounded-r-full bg-accent"
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

function SunIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export default function App() {
  const [route, setRoute] = useState(initialRoute);
  const { subjectId, nodeId, stepId, blockId, blockRoute, blocksRoute } = route;
  const [course, setCourse] = useState(null);
  const [block, setBlock] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(initialSidebarCollapsed);
  const [railOpen, setRailOpen] = useState(() =>
    initialSidebarCollapsed() ? false : initialRailOpen()
  );
  const [theme, setTheme] = useState(initialTheme);
  const cacheRef = useRef({});
  const blockCacheRef = useRef({});
  const railBeforeFocus = useRef(initialRailOpen());
  const wasCollapsed = useRef(collapsed);
  const routeKey = `${subjectId ?? ""}/${nodeId ?? ""}/${stepId ?? ""}/${blockId ?? ""}${
    blocksRoute ? "/blocks" : ""
  }`;

  // Load the selected subject's data (async, cached). The index has no course.
  useEffect(() => {
    if (!subjectId) {
      setCourse(null);
      return;
    }
    if (cacheRef.current[subjectId]) {
      setCourse(cacheRef.current[subjectId]);
      return;
    }
    setCourse(null);
    let alive = true;
    (async () => {
      const loader = courseLoaders[`./data/subjects/${subjectId}.json`];
      if (!loader) return;
      const mod = await loader();
      cacheRef.current[subjectId] = mod.default;
      if (alive) setCourse(cacheRef.current[subjectId]);
    })();
    return () => {
      alive = false;
    };
  }, [subjectId]);

  // Load one block's full JSON only when its page is open.
  useEffect(() => {
    if (!subjectId || !blockId) {
      setBlock(null);
      return;
    }
    const key = `${subjectId}/${blockId}`;
    if (blockCacheRef.current[key]) {
      setBlock(blockCacheRef.current[key]);
      return;
    }
    setBlock(null);
    const loader = blockLoaders[`./data/blocks/${subjectId}/${blockId}.json`];
    if (!loader) {
      setBlock({ id: blockId, missing: true });
      return;
    }
    let alive = true;
    (async () => {
      const mod = await loader();
      blockCacheRef.current[key] = mod.default;
      if (alive) setBlock(mod.default);
    })();
    return () => {
      alive = false;
    };
  }, [subjectId, blockId]);

  // Unknown subject ids fall back to the index; keep the address bar honest.
  useEffect(() => {
    if (subjectId) return;
    if (window.location.pathname !== pathFor(null, null)) {
      history.replaceState(null, "", pathFor(null, null));
    }
  }, [subjectId]);

  const node = useMemo(
    () => (course && course.nodes.find((n) => n.id === nodeId)) || null,
    [course, nodeId]
  );

  const step = useMemo(
    () => node?.steps.find((s) => s.id === stepId) || null,
    [node, stepId]
  );

  const hasStepRail = useMemo(
    () =>
      Boolean(
        course &&
          step &&
          (railBlocks(course, step).length > 0 ||
            (Array.isArray(step.headings) && step.headings.length >= 2))
      ),
    [course, step]
  );

  // Browser back/forward support
  useEffect(() => {
    const onPop = () => {
      const next = parsePath(window.location.pathname);
      if (!next) return;
      setRoute({
        ...next,
        subjectId: resolveSubjectId(next.subjectId),
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Esc closes the mobile drawer, then leaves focus mode.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (sidebarOpen) {
        setSidebarOpen(false);
        return;
      }
      if (collapsed) setCollapsed(false);
    };
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen, collapsed]);

  // ⌘B / Ctrl+B toggles focus mode (both side columns)
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

  // ⌘\ / Ctrl+\ toggles the context rail on its own
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        setRailOpen((value) => !value);
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

  // Focus mode collapses both side columns; toggling the rail stays possible.
  useEffect(() => {
    if (collapsed === wasCollapsed.current) return;
    wasCollapsed.current = collapsed;
    if (collapsed) {
      railBeforeFocus.current = railOpen;
      setRailOpen(false);
    } else {
      setRailOpen(railBeforeFocus.current);
    }
    // `railOpen` is read only when entering focus mode.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed]);

  // Remember the reader's rail preference, but not the temporary focus state.
  useEffect(() => {
    if (collapsed) return;
    try {
      window.localStorage.setItem(RAIL_KEY, railOpen ? "open" : "hidden");
    } catch {
      /* private mode */
    }
  }, [railOpen, collapsed]);

  // Apply and remember the reader's light/dark preference.
  useEffect(() => {
    const dark = theme === "dark";
    document.documentElement.classList.toggle("dark", dark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? "#141311" : "#f2efe8");
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* private mode */
    }
  }, [theme]);

  // Every route change starts at the top of the article, not mid-scroll.
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    window.scrollTo(0, 0);
  }, [routeKey]);

  const replacePath = (sid, nid, stid = null) => {
    const next = pathFor(sid, nid, stid);
    if (window.location.pathname !== next) history.replaceState(null, "", next);
  };

  const pushPath = (sid, nid, stid = null) => {
    const next = pathFor(sid, nid, stid);
    if (window.location.pathname !== next) history.pushState(null, "", next);
  };

  const pushBlockPath = (sid, bid) => {
    const next = pathForBlock(sid, bid);
    if (window.location.pathname !== next) history.pushState(null, "", next);
  };

  const pushBlocksPath = (sid) => {
    const next = pathForBlocks(sid);
    if (window.location.pathname !== next) history.pushState(null, "", next);
  };

  // Markdown and card links stay inside the app: parse the href, swap state,
  // push history, and return true so the caller can cancel the full reload.
  const navigateHref = (href) => {
    let url;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return false;
    }
    if (url.origin !== window.location.origin) return false;
    const parsed = parsePath(url.pathname);
    if (!parsed) return false;
    const nextSubject = resolveSubjectId(parsed.subjectId);
    if (!nextSubject) return false;

    setRoute({ ...parsed, subjectId: nextSubject });
    setSidebarOpen(false);
    if (parsed.blocksRoute) pushBlocksPath(nextSubject);
    else if (parsed.blockRoute) pushBlockPath(nextSubject, parsed.blockId);
    else pushPath(nextSubject, parsed.nodeId, parsed.stepId);
    return true;
  };

  const selectNode = (id) => {
    setRoute({
      subjectId,
      nodeId: id,
      stepId: null,
      blockId: null,
      blockRoute: false,
    });
    setSidebarOpen(false);
    pushPath(subjectId, id);
  };

  const selectStep = (nid, stid) => {
    setRoute({ subjectId, nodeId: nid, stepId: stid });
    setSidebarOpen(false);
    pushPath(subjectId, nid, stid);
  };

  const selectSubject = () => {
    setRoute({ subjectId, nodeId: null, stepId: null });
    setSidebarOpen(false);
    pushPath(subjectId, null);
  };

  const goHome = () => {
    setRoute(indexRoute());
    setCourse(null);
    setSidebarOpen(false);
    pushPath(null, null);
  };

  // Resolve incomplete or stale paths once the course JSON is loaded.
  useEffect(() => {
    if (!course || course.nodes.length === 0) return;
    if (course.subject !== subjectId) return;
    if (!nodeId) {
      if (stepId) {
        setRoute({ subjectId: course.subject, nodeId: null, stepId: null });
        replacePath(course.subject, null, null);
      }
      return;
    }

    const resolved = course.nodes.find((n) => n.id === nodeId);
    if (!resolved) {
      setRoute({ subjectId: course.subject, nodeId: null, stepId: null });
      replacePath(course.subject, null, null);
      return;
    }
    const resolvedStep = resolved.steps.some((s) => s.id === stepId)
      ? stepId
      : null;
    if (resolvedStep !== stepId) {
      setRoute({
        subjectId: course.subject,
        nodeId: resolved.id,
        stepId: resolvedStep,
      });
    }
    replacePath(course.subject, resolved.id, resolvedStep);
  }, [course, subjectId, nodeId, stepId]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-hairline bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1408px] items-center gap-1.5 px-3 sm:gap-2 sm:px-5 lg:px-8">
          {subjectId && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="開啟選單"
              className="rounded-xl p-2 text-ink-soft transition-colors hover:bg-surface hover:text-accent lg:hidden"
            >
              <HamburgerIcon />
            </button>
          )}


          <button
            type="button"
            onClick={goHome}
            className="group flex min-w-0 items-center gap-3 rounded-xl py-1 pr-2 text-left"
          >
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-2xl bg-surface shadow-soft ring-1 ring-hairline transition-colors group-hover:ring-accent/40"
            >
              <PixelMark size={24} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-label text-[0.98rem] font-semibold tracking-[-0.2px] text-ink">
                Learning Center
              </span>
              <span className="hidden truncate font-label text-[10.5px] uppercase tracking-[0.14em] text-ink-soft sm:block">
                {course
                  ? node
                    ? `${course.title} · ${node.title}`
                    : course.title
                  : "課程清單"}
              </span>
            </span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            {subjectId && course && (
              <button
                type="button"
                onClick={() => setCollapsed((value) => !value)}
                aria-label={collapsed ? "展開側欄" : "收合側欄"}
                title={collapsed ? "展開側欄（⌘B）" : "收合側欄（⌘B）"}
                className="hidden items-center gap-2 rounded-full border border-hairline bg-surface/70 px-3 py-1.5 font-label text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent/40 hover:text-accent lg:inline-flex"
              >
                <PanelIcon expand={collapsed} />
                {collapsed ? "顯示目錄" : "專注模式"}
              </button>
            )}
            {hasStepRail && (
              <button
                type="button"
                onClick={() => setRailOpen((value) => !value)}
                aria-pressed={railOpen}
                aria-label={railOpen ? "收合右欄" : "展開右欄"}
                title={railOpen ? "收合右欄（⌘\\）" : "展開右欄（⌘\\）"}
                className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 font-label text-[11px] uppercase tracking-[0.12em] transition-colors xl:inline-flex ${
                  railOpen
                    ? "border-accent/40 bg-accent-tint text-accent"
                    : "border-hairline bg-surface/70 text-ink hover:border-accent/40 hover:text-accent"
                }`}
              >
                <KnowledgeGlyph size={16} />
                {railOpen ? "收合右欄" : "展開右欄"}
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                setTheme((value) => (value === "dark" ? "light" : "dark"))
              }
              aria-label={theme === "dark" ? "切換淺色模式" : "切換深色模式"}
              aria-pressed={theme === "dark"}
              title={theme === "dark" ? "切換淺色模式" : "切換深色模式"}
              className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/70 px-3 py-1.5 font-label text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent/40 hover:text-accent"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              <span className="hidden sm:inline">
                {theme === "dark" ? "淺色" : "深色"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {subjectId && <ReadingProgress routeKey={routeKey} />}
      {collapsed && subjectId && (
        <FocusExit onExit={() => setCollapsed(false)} />
      )}

      {!subjectId ? (
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
            <SubjectsView subjects={SUBJECTS} />
          </div>
        </main>
      ) : !course ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5">
          <OrbitMark className="h-32 w-40 text-ink" />
          <p className="robo-kicker font-label text-[10px] text-ink-soft">
            Loading
          </p>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[1408px] px-4 sm:px-6 lg:px-8">
          <div className="lg:flex">
            <Sidebar
              course={course}
              currentId={node?.id ?? null}
              currentStepId={stepId}
              onSelect={selectNode}
              onSelectStep={selectStep}
              onSubject={selectSubject}
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              collapsed={collapsed}
              onToggle={() => setCollapsed((value) => !value)}
            />

            <main className="min-w-0 flex-1">
              <div
                className={`w-full py-7 sm:py-9 lg:py-12 ${
                  step
                    ? ""
                    : node
                      ? "mx-auto max-w-[1100px]"
                      : "mx-auto max-w-[1240px]"
                }`}
              >
                <div
                  className={
                    step
                      ? ""
                      : "rounded-[22px] bg-transparent px-0 py-0 sm:rounded-[26px] sm:bg-surface/65 sm:p-8 sm:ring-1 sm:ring-hairline sm:shadow-soft lg:p-8 min-[1440px]:p-11"
                  }
                >
                {blockRoute ? (
                  <BlockView
                    key={`${subjectId}/${blockId}`}
                    course={course}
                    block={block?.id === blockId ? block : null}
                    onNavigate={navigateHref}
                  />
                ) : blocksRoute ? (
                  <BlocksIndex
                    key={`${subjectId}/blocks`}
                    course={course}
                    onNavigate={navigateHref}
                  />
                ) : step ? (
                  <StepView
                    key={step.id}
                    course={course}
                    node={node}
                    step={step}
                    onNavigate={navigateHref}
                    railOpen={railOpen}
                    onCloseRail={() => setRailOpen(false)}
                  />
                ) : node ? (
                  <NodeView
                    key={node.id}
                    course={course}
                    node={node}
                    onSelect={selectNode}
                    onSubject={selectSubject}
                  />
                ) : (
                  <SubjectOverview
                    key={course.subject}
                    course={course}
                    onNavigate={navigateHref}
                  />
                )}
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
