export type NodeStatus =
  | "draft"
  | "confirmed"
  | "nodes-written"
  | "content-written"
  | "edges-written";

export type ElementType = "article" | "video" | "question";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface Node {
  id: string;
  title: string;
  tier: number;
  order: number;
  duration: string;
  goal: string;
  status: NodeStatus;
  taughtElementIds: string[];
  relatedElementIds: string[];
  prerequisiteIds: string[];
  prerequisiteSources: Record<string, "frontmatter" | "derived">;
  contentHtml: string;
  fullArticleHtml: string;
  sources: string[];
  prepareHtml: string | null;
  hasPrepare: boolean;
}

export interface Element {
  id: string;
  title: string;
  tier: number;
  order: number;
  type: ElementType;
  taughtByNodes: string[];
  sources: string[];
  bodyHtml: string;
  connections: string[];
  prerequisiteIds: string[];
  videoUrl?: string;
  questions?: QuizQuestion[];
}

export type EdgeKind = "spine" | "shared-concept" | "explicit";

export interface Edge {
  from: string;
  to: string;
  kind: EdgeKind;
  label?: string;
}

export interface Tier {
  tier: number;
  title: string;
  nodeIds: string[];
}

export interface SubjectGraph {
  subject: string;
  tiers: Tier[];
  nodes: Node[];
  elements: Record<string, Element>;
  edges: Edge[];
}

// A request to seat the camera on one tile, e.g. from a deep-link. `tick` makes
// each request distinct so focusing the same node again re-seats the camera.
export interface FocusRequest {
  nodeId: string;
  tick: number;
}

// Imperative camera surface exposed by the map views to their owner (map
// controls, subject switches, deep-link seating).
export interface MapHandle {
  fit: () => void;
  seatOnNode: (nodeId: string) => void;
  zoomBy: (factor: number) => void;
}

// A detail-pane destination: a lesson path or a concept node.
export type View = { kind: "node"; id: string } | { kind: "element"; id: string };
