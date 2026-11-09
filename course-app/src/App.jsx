import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import subjectsIndex from "./data/subjects.json";
import Sidebar, { SidebarDrawer } from "./components/Sidebar.jsx";
import ContextRail from "./components/ContextRail.jsx";
import NodeView from "./components/NodeView.jsx";
import StepView from "./components/StepView.jsx";
import SubjectsView from "./components/SubjectsView.jsx";
import SubjectOverview from "./components/SubjectOverview.jsx";
import BlockView from "./components/BlockView.jsx";
import BlockModal from "./components/BlockModal.jsx";
import BlocksIndex from "./components/BlocksIndex.jsx";
import PixelMark from "./components/PixelMark.jsx";
import { railBlocks } from "./lib/blocks.mjs";
import { MIN_LOADING_MS, remainingDisplayMs } from "./lib/motion.mjs";
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

function FocusIcon({ active = false }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {active ? (
        <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" />
      ) : (
        <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
      )}
    </svg>
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

  // The track is only useful mid-article; it fades away at both ends.
  const idle = ratio === 0 || ratio === 1;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-16 z-30 h-[3px] bg-ink/5 transition-opacity duration-150 ${
        idle ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="h-full origin-left rounded-r-full bg-accent transition-transform duration-[90ms] ease-linear"
        style={{ transform: `scaleX(${ratio})` }}
      />
    </div>
  );
}

/**
 * Keep the skeleton on screen for at least `minMs` so a fast cached load does
 * not flash a half-frame of placeholder before the article.
 */
function useMinimumLoading(loading, minMs = MIN_LOADING_MS) {
  const [visible, setVisible] = useState(loading);
  const startedAtRef = useRef(loading ? Date.now() : 0);

  useEffect(() => {
    if (loading) {
      startedAtRef.current = Date.now();
      setVisible(true);
      return undefined;
    }
    const remaining = remainingDisplayMs(startedAtRef.current, Date.now(), minMs);
    if (!remaining) {
      setVisible(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setVisible(false), remaining);
    return () => window.clearTimeout(timer);
  }, [loading, minMs]);

  return visible;
}

/**
 * A layout column that stays mounted but fades out and leaves the Tab order
 * when `hidden` is true, so focus mode never shifts the article.
 */
function FadingColumn({ hidden, className = "", children }) {
  return (
    <div
      className={`hidden transition-opacity duration-[160ms] ease-[var(--mo-ease)] ${className} ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      inert={hidden ? "" : undefined}
      aria-hidden={hidden || undefined}
    >
      {children}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <main className="min-w-0 flex-1" aria-busy="true">
      <div className="mx-auto w-full max-w-[816px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="loading-breathe space-y-4" aria-hidden="true">
          <div className="h-9 w-3/5 rounded-xl bg-shade" />
          <div className="h-4 w-full rounded-full bg-shade" />
          <div className="h-4 w-11/12 rounded-full bg-shade" />
          <div className="h-4 w-4/5 rounded-full bg-shade" />
          <div className="mt-8 h-4 w-full rounded-full bg-shade" />
          <div className="h-4 w-10/12 rounded-full bg-shade" />
        </div>
        <p className="sr-only">課程載入中</p>
      </div>
    </main>
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
  const [railOpen, setRailOpen] = useState(initialRailOpen);
  const [focusMode, setFocusMode] = useState(false);
  const [theme, setTheme] = useState(initialTheme);
  const [modalBlockId, setModalBlockId] = useState(null);
  const cacheRef = useRef({});
  const blockCacheRef = useRef({});
  const routeKey = `${subjectId ?? ""}/${nodeId ?? ""}/${stepId ?? ""}/${blockId ?? ""}${
    blocksRoute ? "/blocks" : ""
  }`;
  const loadingCourse = Boolean(subjectId) && !course;
  const showLoading = useMinimumLoading(loadingCourse);
  const contentReady = Boolean(course) && !showLoading;

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
      if (focusMode) setFocusMode(false);
    };
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen, focusMode]);

  // ⌘B / Ctrl+B toggles focus mode (both side columns, article unmoved)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setFocusMode((value) => !value);
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

  // Leaving focus mode always brings the right outline back.
  const wasFocusRef = useRef(false);
  useEffect(() => {
    if (wasFocusRef.current && !focusMode) setRailOpen(true);
    wasFocusRef.current = focusMode;
  }, [focusMode]);

  // Remember the reader's sidebar preference
  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_KEY, collapsed ? "collapsed" : "open");
    } catch {
      /* private mode */
    }
  }, [collapsed]);

  // Remember the reader's rail preference independently of focus mode.
  useEffect(() => {
    try {
      window.localStorage.setItem(RAIL_KEY, railOpen ? "open" : "hidden");
    } catch {
      /* private mode */
    }
  }, [railOpen]);

  // Apply and remember the reader's light/dark preference.
  useEffect(() => {
    const dark = theme === "dark";
    document.documentElement.classList.toggle("dark", dark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? "#141311" : "#faf8f5");
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

  // The block modal belongs to the step that opened it.
  useEffect(() => {
    setModalBlockId(null);
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

  const openBlockModal = useCallback((id) => setModalBlockId(id), []);
  const closeBlockModal = useCallback(() => setModalBlockId(null), []);

  const expandBlockModal = () => {
    if (!modalBlockId) return;
    const href = pathForBlock(subjectId, modalBlockId);
    setModalBlockId(null);
    navigateHref(href);
  };

  const navigateModalHref = (href) => {
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

    // A related block swaps the modal's content; a step or node closes it.
    if (parsed.blockRoute) {
      setModalBlockId(parsed.blockId);
      return true;
    }
    setModalBlockId(null);
    return navigateHref(href);
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
        <div className="mx-auto flex h-16 max-w-[1536px] items-center gap-1.5 px-3 sm:gap-2 sm:px-5 lg:pl-8 lg:pr-12">
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
            className="group flex min-w-0 items-center gap-3 rounded-xl py-1 pr-2 text-left lg:ml-4"
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
                onClick={() => setFocusMode((value) => !value)}
                aria-pressed={focusMode}
                aria-label={focusMode ? "退出專注模式" : "進入專注模式"}
                title={focusMode ? "退出專注模式（Esc / ⌘B）" : "進入專注模式（⌘B）"}
                className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 font-label text-[11px] uppercase tracking-[0.12em] transition-colors lg:inline-flex ${
                  focusMode
                    ? "border-accent/40 bg-accent-tint text-accent"
                    : "border-hairline bg-surface/70 text-ink hover:border-accent/40 hover:text-accent"
                }`}
              >
                <FocusIcon active={focusMode} />
                {focusMode ? "退出專注" : "專注模式"}
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
              <span className="theme-icon" aria-hidden="true">
                <span
                  className={`theme-icon__glyph ${
                    theme === "dark" ? "is-active" : ""
                  }`}
                >
                  <SunIcon />
                </span>
                <span
                  className={`theme-icon__glyph ${
                    theme === "dark" ? "" : "is-active"
                  }`}
                >
                  <MoonIcon />
                </span>
              </span>
              <span className="hidden sm:inline">
                {theme === "dark" ? "淺色" : "深色"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {subjectId && <ReadingProgress routeKey={routeKey} />}

      {!subjectId ? (
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
            <SubjectsView subjects={SUBJECTS} />
          </div>
        </main>
      ) : !contentReady ? (
        <LoadingSkeleton />
      ) : (
        <>
          <SidebarDrawer
            course={course}
            currentId={node?.id ?? null}
            currentStepId={stepId}
            onSelect={selectNode}
            onSelectStep={selectStep}
            onSubject={selectSubject}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:pl-8 lg:pr-12">
            <div className="lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)_20rem]">
              <FadingColumn hidden={focusMode} className="lg:block">
                <Sidebar
                  course={course}
                  currentId={node?.id ?? null}
                  currentStepId={stepId}
                  onSelect={selectNode}
                  onSelectStep={selectStep}
                  onSubject={selectSubject}
                  collapsed={collapsed}
                  onToggle={() => setCollapsed((value) => !value)}
                />
              </FadingColumn>

              <main className="min-w-0">
                <div key={routeKey} className="lc-enter w-full py-7 sm:py-9 lg:py-12">
                  <div
                    className={
                      step
                        ? ""
                        : "mx-auto w-full max-w-[816px] px-0 lg:px-8 xl:px-12"
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
                      onOpenBlock={openBlockModal}
                    />
                  ) : node ? (
                    <NodeView
                      key={node.id}
                      course={course}
                      node={node}
                      onSelect={selectNode}
                      onSubject={selectSubject}
                      onNavigate={navigateHref}
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

              {step && hasStepRail && railOpen && (
                <FadingColumn hidden={focusMode} className="xl:block">
                  <ContextRail
                    course={course}
                    step={step}
                    onNavigate={navigateHref}
                    onOpenBlock={openBlockModal}
                    onClose={() => setRailOpen(false)}
                  />
                </FadingColumn>
              )}
            </div>
          </div>
        </>
      )}

      {modalBlockId && course && (
        <BlockModal
          course={course}
          blockId={modalBlockId}
          onClose={closeBlockModal}
          onExpand={expandBlockModal}
          onNavigate={navigateModalHref}
        />
      )}
    </div>
  );
}
