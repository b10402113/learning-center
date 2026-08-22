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
import type { FocusRequest, MapHandle, Step, SubjectGraph } from "../lib/types";
import { ROAD_NODE_WIDTH, RoadNode } from "./RoadNode";
import { TierLabel } from "./TierLabel";

const TIER_GAP_Y = 140;
const NODE_GAP_X = 20;
const TIER_START_Y = 40;
const PADDING_X = 120;
const TIER_LABEL_X = 16;

function buildRoadData(
  graph: SubjectGraph,
  selectedId: string | null,
  written: Set<string>,
  completedNodes: Set<string>,
  completedSteps: Set<string>,
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

  for (const tier of tierLevels) {
    const tierNodes = tiersByLevel.get(tier)!;
    const tierY = TIER_START_Y + (tier - 1) * TIER_GAP_Y;

    // Find tier title from graph.tiers
    const tierMeta = graph.tiers.find((t) => t.tier === tier);
    const tierTitle = tierMeta?.title ?? `Stage ${tier}`;

    // Tier label node — positioned to the left of the card row
    nodes.push({
      id: `tier-label-${tier}`,
      type: "tierLabel",
      position: { x: TIER_LABEL_X, y: tierY + 8 },
      data: {
        stage: tier,
        title: tierTitle,
        nodeCount: tierNodes.length,
      },
      draggable: false,
      selectable: false,
    });

    // Cards — left-aligned, with step data
    for (let i = 0; i < tierNodes.length; i++) {
      const p = tierNodes[i];
      const x = PADDING_X + i * (ROAD_NODE_WIDTH + NODE_GAP_X);
      const y = tierY;

      // Compute step completion for this node
      const nodeSteps: Step[] = Object.values(graph.steps).filter(
        (s) => s.nodeId === p.id,
      );
      const nodeCompletedSteps = nodeSteps.filter((s) =>
        completedSteps.has(s.id),
      ).length;
      const isNodeLocked = !isWritten(p.status);

      nodes.push({
        id: p.id,
        type: "roadNode",
        position: { x, y },
        data: {
          label: p.title,
          tier: p.tier,
          isWritten: written.has(p.id),
          isComplete: completedNodes.has(p.id),
          isSelected: p.id === selectedId,
          isLocked: isNodeLocked,
          nodeId: p.id,
          duration: p.duration ?? "",
          totalSteps: nodeSteps.length,
          completedSteps: nodeCompletedSteps,
        },
        draggable: true,
      });
    }
  }

  // Vertical spine: connect last node of each tier to first node of next tier
  // Only draw this teaching-order connection, no horizontal edges within tiers
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
        animated: false,
        markerEnd: {
          type: "arrowclosed",
          color: "rgba(160, 160, 165, 0.45)",
          width: 16,
          height: 16,
        },
        style: {
          stroke: "rgba(160, 160, 165, 0.3)",
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
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
  onSelectNode: (nodeId: string) => void;
  onHover: (id: string | null) => void;
}

const nodeTypes: NodeTypes = {
  roadNode: RoadNode,
  tierLabel: TierLabel,
};

export const RoadMap = forwardRef<MapHandle, RoadMapProps>(function RoadMap(
  {
    graph,
    selectedId,
    focusRequest,
    completedNodes,
    completedSteps,
    onSelectNode,
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
    () => buildRoadData(graph, selectedId, written, completedNodes, completedSteps),
    [graph, selectedId, written, completedNodes, completedSteps],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(rawNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rawEdges);

  useEffect(() => {
    setNodes(rawNodes);
    setEdges(rawEdges);
  }, [rawNodes, rawEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const nodeId = (node.data as { nodeId?: string }).nodeId;
      if (nodeId) {
        onSelectNode(nodeId);
      }
    },
    [onSelectNode],
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

  const reactFlowInstanceRef = useRef<any>(null);
  useEffect(() => {
    if (reactFlowInstanceRef.current) {
      reactFlowInstanceRef.current.fitView({ padding: 0.15, duration: 400 });
    }
  }, [graph]);

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
          color="#1e1e22"
        />
        <MiniMap
          nodeStrokeColor="#3a3a3e"
          nodeColor="#161618"
          nodeBorderRadius={8}
          maskColor="rgba(10, 10, 12, 0.7)"
          pannable
          zoomable
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            background: "var(--color-surface)",
          }}
        />
      </ReactFlow>
    </div>
  );
});
