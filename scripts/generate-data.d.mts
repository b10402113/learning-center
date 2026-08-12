export interface FrontmatterResult {
  data: Record<string, unknown>;
  body: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  kind: string;
  label?: string;
}

export interface GraphPath {
  id: string;
  title: string;
  tier: number;
  order: number;
  duration: string;
  goal: string;
  status: string;
  taughtNodeIds: string[];
  relatedNodeIds: string[];
  contentHtml: string;
  fullArticleHtml: string;
  sources: string[];
  prepareHtml: string | null;
  hasPrepare: boolean;
}

export interface GraphNode {
  id: string;
  title: string;
  tier: number;
  order: number;
  taughtBy: string[];
  sources: string[];
  bodyHtml: string;
  connections: string[];
}

export interface SubjectGraphData {
  subject: string;
  tiers: { tier: number; title: string; pathIds: string[] }[];
  paths: GraphPath[];
  nodes: Record<string, GraphNode>;
  edges: GraphEdge[];
}

export interface ScannedFiles {
  roadmap: string;
  pathFiles: Record<string, string>;
  nodeFiles: Record<string, string>;
  edgeFiles: Record<string, string>;
  prepareFiles: Record<string, string>;
}

export function coerce(value: string): string | number;
export function unquote(value: string): string;
export function parseFrontmatter(md: string): FrontmatterResult;
export function escapeHtml(value: string): string;
export function renderMarkdown(md: string): string;
export function buildSubjectGraph(args: {
  subject: string;
  roadmap: string;
  pathFiles: Record<string, string>;
  nodeFiles: Record<string, string>;
  edgeFiles: Record<string, string>;
  prepareFiles: Record<string, string>;
}): SubjectGraphData;
export function scanSubject(subject: string, learnRoot: string): ScannedFiles;
export function loadAllSubjects(learnRoot: string): SubjectGraphData[];
