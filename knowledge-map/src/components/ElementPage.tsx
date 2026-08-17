import type { SubjectGraph } from "../lib/types";
import { ReaderPage, type ReaderCommonProps } from "./ReaderPage";

type ElementPageProps = ReaderCommonProps & {
  graph: SubjectGraph;
  elementId: string;
  from: string | null;
};

/**
 * The standalone element page — the shared docs page in element mode. The
 * `?from=<node-id>` origin (ADR-0003) lets the breadcrumb jump back to the
 * teaching lesson; without one it falls back to the first taught-by node.
 */
export function ElementPage({
  graph,
  elementId,
  from,
  completedSteps,
  onToggleStep,
  onNavigateNode,
  onNavigateElement,
  onBackToMap,
}: ElementPageProps) {
  return (
    <ReaderPage
      graph={graph}
      mode="element"
      elementId={elementId}
      from={from}
      completedSteps={completedSteps}
      onToggleStep={onToggleStep}
      onNavigateNode={onNavigateNode}
      onNavigateElement={onNavigateElement}
      onBackToMap={onBackToMap}
    />
  );
}