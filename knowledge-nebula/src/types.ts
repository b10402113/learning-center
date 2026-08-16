export type Status =
  | "draft"
  | "confirmed"
  | "nodes-written"
  | "content-written"
  | "edges-written"

export interface Source {
  label: string
  url?: string
}

export interface PathNode {
  id: string
  /** 1-based order within its tier */
  order: number
  /** global order along the whole spine */
  spineOrder: number
  tierId: string
  title: string
  status: Status
  goal: string
  /** true if this is the final tile of its tier */
  boss: boolean
  articleHtml: string
  fullArticleHtml: string
  taughtNodeIds: string[]
  relatedNodeIds: string[]
  sources: Source[]
}

export interface ConceptNode {
  id: string
  title: string
  bodyHtml: string
  /** path ids that teach this concept */
  taughtByPathIds: string[]
  relatedNodeIds: string[]
}

export interface Tier {
  id: string
  /** Roman numeral, e.g. "I", "II" */
  numeral: string
  title: string
  subtitle?: string
}

export type EdgeKind = "spine" | "shared" | "explicit"

export interface Edge {
  id: string
  kind: EdgeKind
  from: string
  to: string
  label?: string
}

export interface Subject {
  id: string
  title: string
  subtitle: string
  tiers: Tier[]
  paths: PathNode[]
  nodes: ConceptNode[]
  edges: Edge[]
}

export interface Graph {
  version: string
  generatedAt: string
  subjects: Subject[]
}
