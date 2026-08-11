export type PathStatus =
  | "draft"
  | "confirmed"
  | "nodes-written"
  | "content-written"
  | "edges-written";

export interface PathNode {
  id: string;
  title: string;
  tier: number;
  order: number;
  duration: string;
  goal: string;
  status: PathStatus;
  taughtNodeIds: string[];
  relatedNodeIds: string[];
  contentHtml: string;
  fullArticleHtml: string;
  sources: string[];
}

export interface NodeRecord {
  id: string;
  title: string;
  tier: number;
  order: number;
  taughtBy: string[];
  sources: string[];
  bodyHtml: string;
  connections: string[];
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
  pathIds: string[];
}

export interface SubjectGraph {
  subject: string;
  tiers: Tier[];
  paths: PathNode[];
  nodes: Record<string, NodeRecord>;
  edges: Edge[];
}

// A request to seat the camera on one tile, e.g. from a deep-link. `tick` makes
// each request distinct so focusing the same path again re-seats the camera.
export interface FocusRequest {
  pathId: string;
  tick: number;
}
