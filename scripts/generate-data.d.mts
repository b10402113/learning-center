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

export type ElementType = "article" | "video" | "question";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface GraphNode {
  id: string;
  title: string;
  tier: number;
  order: number;
  duration: string;
  goal: string;
  status: string;
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

export interface GraphElement {
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

export interface SubjectGraphData {
  subject: string;
  tiers: { tier: number; title: string; nodeIds: string[] }[];
  nodes: GraphNode[];
  elements: Record<string, GraphElement>;
  edges: GraphEdge[];
}

export interface ScannedFiles {
  roadmap: string;
  nodeFiles: Record<string, string>;
  elementFiles: Record<string, string>;
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
  nodeFiles: Record<string, string>;
  elementFiles: Record<string, string>;
  edgeFiles: Record<string, string>;
  prepareFiles: Record<string, string>;
}): SubjectGraphData;
export function scanSubject(subject: string, learnRoot: string): ScannedFiles;
export function loadAllSubjects(learnRoot: string): SubjectGraphData[];
