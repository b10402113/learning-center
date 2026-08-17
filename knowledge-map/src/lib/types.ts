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
  sources: string[];
}

export interface Step {
  // Node-qualified id (`nodeId/stepId`), the map's address for a step.
  id: string;
  stepId: string;
  nodeId: string;
  title: string;
  order: number;
  // Node-qualified step ids this step depends on in its node's DAG.
  deps: string[];
  // Element ids this step teaches.
  teaches: string[];
  sources: string[];
}

export interface Element {
  id: string;
  title: string;
  tier: number;
  order: number;
  type: ElementType;
  taughtByNodes: string[];
  // Step ids (node-qualified) that teach this element.
  taughtBySteps: string[];
  // True for retired element types (question) that keep rendering a page but
  // are no longer part of the active teaching contract.
  deprecated: boolean;
  sources: string[];
  connections: string[];
  prerequisiteIds: string[];
  videoUrl?: string;
  questions?: QuizQuestion[];
}

export type EdgeKind = "spine" | "shared-concept" | "explicit" | "step-dep";

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
  // Step articles keyed by node-qualified id (`nodeId/stepId`). Empty for a
  // legacy subject with no steps.
  steps: Record<string, Step>;
  // Node-qualified step ids seeded complete from `learn/<subject>/mastery.md`
  // at generate time (ADR-0005). Read-only — the learner's manual progress
  // overrides a seed in the UI, never this list.
  seededSteps: string[];
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

// A reader-modal destination (ADR-0003): the transient overlay content, either a
// lesson, a step, or a concept. `from` records the teaching lesson an element
// came from so the breadcrumb can jump back. Transient — never written to the URL.
export type ReaderModalTarget =
  | { kind: "node"; subject: string; nodeId: string }
  | { kind: "element"; subject: string; elementId: string; from: string | null }
  | { kind: "step"; subject: string; nodeId: string; stepId: string };
