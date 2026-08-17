import type { SubjectGraph } from "../lib/types";
import { ReaderPage, type ReaderCommonProps } from "./ReaderPage";

type NodePageProps = ReaderCommonProps & {
  graph: SubjectGraph;
  nodeId: string;
};

/** The standalone node container page — the shared docs page in node mode. */
export function NodePage({
  graph,
  nodeId,
  completedSteps,
  onToggleStep,
  onNavigateNode,
  onNavigateStep,
  onNavigateElement,
  onBackToMap,
}: NodePageProps) {
  return (
    <ReaderPage
      graph={graph}
      mode="node"
      nodeId={nodeId}
      completedSteps={completedSteps}
      onToggleStep={onToggleStep}
      onNavigateNode={onNavigateNode}
      onNavigateStep={onNavigateStep}
      onNavigateElement={onNavigateElement}
      onBackToMap={onBackToMap}
    />
  );
}
