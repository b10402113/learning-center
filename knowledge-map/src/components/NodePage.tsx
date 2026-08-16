import type { SubjectGraph } from "../lib/types";
import { ReaderPage, type ReaderCommonProps } from "./ReaderPage";

type NodePageProps = ReaderCommonProps & {
  graph: SubjectGraph;
  nodeId: string;
};

/** The standalone node lesson page — the shared docs page in node mode. */
export function NodePage({
  graph,
  nodeId,
  manualElements,
  quizSolved,
  onQuizSolved,
  onToggleCompletion,
  onNavigateNode,
  onNavigateElement,
  onBackToMap,
}: NodePageProps) {
  return (
    <ReaderPage
      graph={graph}
      mode="node"
      nodeId={nodeId}
      manualElements={manualElements}
      quizSolved={quizSolved}
      onQuizSolved={onQuizSolved}
      onToggleCompletion={onToggleCompletion}
      onNavigateNode={onNavigateNode}
      onNavigateElement={onNavigateElement}
      onBackToMap={onBackToMap}
    />
  );
}
