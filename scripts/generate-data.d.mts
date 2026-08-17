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

export interface GraphNode {
  id: string;
  title: string;
  tier: number;
  order: number;
  duration: string;
  goal: string;
  status: string;
  taughtElementIds: string[];
  prerequisiteIds: string[];
  prerequisiteSources: Record<string, "frontmatter" | "derived">;
  relatedElementIds: string[];
  sources: string[];
}

export interface GraphStep {
  id: string;
  stepId: string;
  nodeId: string;
  title: string;
  order: number;
  deps: string[];
  teaches: string[];
  sources: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface GraphElement {
  id: string;
  title: string;
  tier: number;
  order: number;
  type: "article" | "video" | "question";
  taughtByNodes: string[];
  taughtBySteps: string[];
  deprecated: boolean;
  sources: string[];
  connections: string[];
  prerequisiteIds: string[];
  videoUrl?: string;
  questions?: QuizQuestion[];
}

export interface SubjectGraphData {
  subject: string;
  tiers: { tier: number; title: string; nodeIds: string[] }[];
  nodes: GraphNode[];
  steps: Record<string, GraphStep>;
  seededSteps: string[];
  elements: Record<string, GraphElement>;
  edges: GraphEdge[];
}

export interface ScannedFiles {
  roadmap: string;
  nodeFiles: Record<string, string>;
  elementFiles: Record<string, string>;
  edgeFiles: Record<string, string>;
  stepFiles: Record<string, string>;
  mastery: string;
}

export interface MasteryStrand {
  name: string;
  rating: "unknown" | "partial" | "solid";
}

export interface MasteryNode {
  strands: MasteryStrand[];
  sources: string[];
}

export function coerce(value: string): string | number;
export function unquote(value: string): string;
export function parseFrontmatter(md: string): FrontmatterResult;
export function parseMastery(mastery: string | null | undefined): Map<string, MasteryNode>;
export function buildSubjectGraph(args: {
  subject: string;
  roadmap: string;
  nodeFiles: Record<string, string>;
  elementFiles: Record<string, string>;
  edgeFiles: Record<string, string>;
  stepFiles?: Record<string, string>;
  mastery?: string;
}): SubjectGraphData;
export function scanSubject(subject: string, learnRoot: string): ScannedFiles;
export function loadAllSubjects(learnRoot: string): SubjectGraphData[];
