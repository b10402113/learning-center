import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { isWritten } from "../lib/colors";
import { stepsOfNode } from "../lib/completion";
import type { FocusRequest, MapHandle, Step, SubjectGraph } from "../lib/types";
import {
  ROAD_NODE_HEIGHT,
  ROAD_NODE_WIDTH,
  RoadNode,
  expandedCardHeight,
  type RoadStepData,
} from "./RoadNode";

const NODE_WIDTH = ROAD_NODE_WIDTH;
const TIER_GAP_Y = 120;
const NODE_GAP_X = 40;
const TIER_START_Y = 40;
const PADDING_X = 60;

function buildRoadData(
  graph: SubjectGraph,
  selectedId: string | null,
  written: Set<string>,
  completed: Set<string>,
  completedSteps: Set<string>,
  expandedNodeId: string | null,
  onSelectStep: (nodeId: string, stepId: string) => void,
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Group nodes by tier
  const tiersByLevel = new Map<number, typeof graph.nodes>();
  for (const p of graph.nodes) {
    if (!tiersByLevel.has(p.tier)) tiersByLevel.set(p.tier, []);
    tiersByLevel.get(p.tier)!.push(p);
  }

  const tierLevels = Array.from(tiersByLevel.keys()).sort((a, b) => a - b);

  const stepById = graph.steps;

  const toRoadStep = (s: Step): RoadStepData => ({
    id: s.id,
    stepId: s.stepId,
    title: s.title,
    order: s.order,
    done: completedSteps.has(s.id),
    depIds: s.deps,
    depTitles: s.deps
      .map((d) => stepById[d]?.title)
      .filter((t): t is string => Boolean(t)),
    teachesTitles: s.teaches
      .map((e) => graph.elements[e]?.title)
      .filter((t): t is string => Boolean(t)),
  });

  // Walk tiers top-down, pushing later tiers down by however much an expanded
  // card in the tier above grows past the baseline card height.
  let yOffset = 0;
  for (const tier of tierLevels) {
    const tierNodes = tiersByLevel.get(tier)!;
    const tierY = TIER_START_Y + (tier - 1) * TIER_GAP_Y + yOffset;
    let tierExtra = 0;

    for (let i = 0; i < tierNodes.length; i++) {
      const p = tierNodes[i];
      const x = PADDING_X + i * (NODE_WIDTH + NODE_GAP_X);
      const y = tierY;
      const isWritten = written.has(p.id);
      const isComplete = completed.has(p.id);
      const isSelected = p.id === selectedId;
      const expanded = p.id === expandedNodeId;
      const steps = stepsOfNode(graph.steps, p.id);

      nodes.push({
        id: p.id,
        type: "roadNode",
        position: { x, y },
        data: {
          label: p.title,
          tier: p.tier,
          isWritten,
          isComplete,
          isSelected,
          nodeId: p.id,
          expanded,
          lesson: p.goal,
          steps: steps.map(toRoadStep),
          onSelectStep,
        },
        draggable: true,
      });

      if (expanded) {
        tierExtra = Math.max(tierExtra, expandedCardHeight(steps.length) - ROAD_NODE_HEIGHT);
      }
    }

    // Connect nodes within the same tier horizontally (spine)
    for (let i = 0; i < tierNodes.length - 1; i++) {
      edges.push({
        id: `${tierNodes[i].id}-${tierNodes[i + 1].id}`,
        source: tierNodes[i].id,
        target: tierNodes[i + 1].id,
        type: "smoothstep",
        animated: false,
        style: {
          stroke: "#c40058",
          strokeWidth: 1.5,
        },
      });
    }

    yOffset += tierExtra;
  }

  // Connect last node of each tier to first node of next tier (vertical spine)
  for (let t = 0; t < tierLevels.length - 1; t++) {
    const currentTier = tierLevels[t];
    const nextTier = tierLevels[t + 1];
    const currentNodes = tiersByLevel.get(currentTier)!;
    const nextNodes = tiersByLevel.get(nextTier)!;

    if (currentNodes.length > 0 && nextNodes.length > 0) {
      const lastOfCurrent = currentNodes[currentNodes.length - 1];
      const firstOfNext = nextNodes[0];

      edges.push({
        id: `tier-${currentTier}-to-${nextTier}`,
        source: lastOfCurrent.id,
        target: firstOfNext.id,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "#a0a0a5",
          strokeWidth: 2,
        },
      });
    }
  }

  return { nodes, edges };
}

interface RoadMapProps {
  graph: SubjectGraph;
  selectedId: string | null;
  focusRequest: FocusRequest | null;
  completedNodes: Set<string>;
  completedSteps: Set<string>;
  expandedNodeId: string | null;
  onToggleExpand: (nodeId: string) => void;
  onSelectStep: (nodeId: string, stepId: string) => void;
  onHover: (id: string | null) => void;
}

const nodeTypes: NodeTypes = {
  roadNode: RoadNode,
};

export const RoadMap = forwardRef<MapHandle, RoadMapProps>(function RoadMap(
  {
    graph,
    selectedId,
    focusRequest,
    completedNodes,
    completedSteps,
    expandedNodeId,
    onToggleExpand,
    onSelectStep,
    onHover,
  }: RoadMapProps,
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const written = useMemo(
    () => new Set(graph.nodes.filter((p) => isWritten(p.status)).map((p) => p.id)),
    [graph],
  );

  const { nodes: rawNodes, edges: rawEdges } = useMemo(
    () =>
      buildRoadData(
        graph,
        selectedId,
        written,
        completedNodes,
        completedSteps,
        expandedNodeId,
        onSelectStep,
      ),
    [graph, selectedId, written, completedNodes, completedSteps, expandedNodeId, onSelectStep],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(rawNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rawEdges);

  // Sync raw data + positions into node state. Layout is deterministic in
  // buildRoadData (expanding a card reflows the tiers below it), so raw wins
  // wholesale — but only when the memo recomputes (expansion/completion/
  // selection changes), never on every App render, keeping drags stable between
  // those events.
  useEffect(() => {
    setNodes((nds) => {
      const rawMap = new Map(rawNodes.map((n) => [n.id, n]));
      return nds.map((nd) => {
        const raw = rawMap.get(nd.id);
        if (raw) {
          return { ...nd, ...raw };
        }
        return nd;
      });
    });
    setEdges(rawEdges);
  }, [rawNodes, rawEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const nodeId = (node.data as { nodeId?: string }).nodeId;
      if (nodeId) {
        onToggleExpand(nodeId);
      }
    },
    [onToggleExpand],
  );

  const onNodeMouseEnter = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const nodeId = (node.data as { nodeId?: string }).nodeId;
      if (nodeId) {
        onHover(nodeId);
      }
    },
    [onHover],
  );

  const onNodeMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  // Fit view on mount and subject change
  const reactFlowInstanceRef = useRef<any>(null);
  useEffect(() => {
    if (reactFlowInstanceRef.current) {
      reactFlowInstanceRef.current.fitView({ padding: 0.15, duration: 400 });
    }
  }, [graph]);

  // Focus request: center on specific path node, once per request.
  const lastFocusRef = useRef<string | null>(null);
  useEffect(() => {
    if (!focusRequest || !reactFlowInstanceRef.current) return;
    const key = `${focusRequest.nodeId}#${focusRequest.tick}`;
    if (lastFocusRef.current === key) return;
    const targetNode = nodes.find((n) => n.data.nodeId === focusRequest.nodeId);
    if (!targetNode) return;
    lastFocusRef.current = key;
    reactFlowInstanceRef.current.fitView({
      nodes: [targetNode],
      padding: 0.3,
      duration: 600,
    });
  }, [focusRequest, nodes]);

  useImperativeHandle(
    ref,
    () => ({
      fit: () => {
        reactFlowInstanceRef.current?.fitView({ padding: 0.15, duration: 400 });
      },
      zoomBy: (factor: number) => {
        const instance = reactFlowInstanceRef.current;
        if (instance) {
          instance.zoomTo(instance.getZoom() * factor, { duration: 200 });
        }
      },
      seatOnNode: (nodeId: string) => {
        const instance = reactFlowInstanceRef.current;
        if (instance) {
          const targetNode = nodes.find((n) => n.data.nodeId === nodeId);
          if (targetNode) {
            instance.fitView({ nodes: [targetNode], padding: 0.3, duration: 600 });
          }
        }
      },
    }),
    [nodes],
  );

  return (
    <div ref={containerRef} className="absolute inset-0 h-full w-full bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onInit={(instance) => {
          reactFlowInstanceRef.current = instance;
        }}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={2}
        attributionPosition="bottom-left"
        panOnDrag
        zoomOnScroll
        zoomOnDoubleClick
        selectionOnDrag
        className="roadmap-flow"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#2a2a2e"
        />
        <Controls />
        <MiniMap
          nodeStrokeColor="#3a3a3e"
          nodeColor="#161618"
          nodeBorderRadius={8}
          maskColor="rgba(10, 10, 12, 0.7)"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
});