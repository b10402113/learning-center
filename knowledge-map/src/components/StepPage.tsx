import type { SubjectGraph } from "../lib/types";
import { ReaderPage, type ReaderCommonProps } from "./ReaderPage";

type StepPageProps = ReaderCommonProps & {
  graph: SubjectGraph;
  nodeId: string;
  stepId: string;
};

/**
 * The standalone step page — the shared docs page in step mode. The step is the
 * smallest addressable lesson (ADR-0004); its breadcrumb returns to the owning
 * node, and prev/next walk the node's step-DAG reading order.
 */
export function StepPage({
  graph,
  nodeId,
  stepId,
  completedSteps,
  onToggleStep,
  onNavigateNode,
  onNavigateStep,
  onNavigateElement,
  onBackToMap,
}: StepPageProps) {
  return (
    <ReaderPage
      graph={graph}
      mode="step"
      nodeId={nodeId}
      stepId={stepId}
      completedSteps={completedSteps}
      onToggleStep={onToggleStep}
      onNavigateNode={onNavigateNode}
      onNavigateStep={onNavigateStep}
      onNavigateElement={onNavigateElement}
      onBackToMap={onBackToMap}
    />
  );
}