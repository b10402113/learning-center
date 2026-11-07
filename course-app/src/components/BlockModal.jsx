import { useEffect, useRef, useState } from "react";
import BlockView from "./BlockView.jsx";
import { loadBlock } from "../lib/block-data.mjs";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ExpandIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 4h6v6M20 4l-9 9M10 5H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-5" />
    </svg>
  );
}

function CloseIcon() {  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/**
 * One knowledge point shown over the current step. Closing it returns the
 * reader to the article they were already reading, with no history entry.
 */
export default function BlockModal({
  course,
  blockId,
  onClose,
  onExpand = null,
  onNavigate = null,
}) {
  const [block, setBlock] = useState(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const restoreRef = useRef(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    let alive = true;
    setBlock(null);
    loadBlock(course.subject, blockId).then((next) => {
      if (alive) setBlock(next);
    });
    return () => {
      alive = false;
    };
  }, [course.subject, blockId]);

  useEffect(() => {
    restoreRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (items.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !panel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !panel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = previousOverflow;
      if (restoreRef.current instanceof HTMLElement) {
        restoreRef.current.focus();
      }
    };
  }, []);

  const onBackdrop = (event) => {
    if (event.target === event.currentTarget) onCloseRef.current?.();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-dark/50 px-3 py-6 backdrop-blur-sm sm:px-6 sm:py-10"
      onMouseDown={onBackdrop}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={block?.title || "知識點"}
        tabIndex={-1}
        className="relative flex max-h-[calc(100dvh-3rem)] w-full max-w-[900px] flex-col overflow-hidden rounded-3xl bg-paper shadow-lift ring-1 ring-hairline"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-hairline bg-paper/95 px-4 py-3 backdrop-blur sm:px-6">
          <p className="robo-kicker font-label text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
            知識點
          </p>
          <div className="flex items-center gap-2">
            {onExpand && (
              <button
                type="button"
                onClick={onExpand}
                aria-label="在完整知識點頁面開啟"
                title="在完整知識點頁面開啟"
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.1em] text-ink ring-1 ring-hairline transition-colors hover:text-accent hover:ring-accent/40"
              >
                <ExpandIcon />
                展開
              </button>
            )}
            <button
              ref={closeRef}
              type="button"
              onClick={() => onCloseRef.current?.()}
              aria-label="關閉知識點"
              title="關閉（Esc）"
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.1em] text-ink ring-1 ring-hairline transition-colors hover:text-accent hover:ring-accent/40"
            >
              <CloseIcon />
              關閉
            </button>
          </div>
        </header>

        <div className="scroll-slim min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-7 sm:py-8">
          <BlockView
            course={course}
            block={block}
            onNavigate={onNavigate}
            embedded
          />
        </div>
      </div>
    </div>
  );
}
