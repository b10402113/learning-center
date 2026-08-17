import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NodeDetailView } from "../components/NodeDetailView";
import type { Node as GraphNode, Step, SubjectGraph } from "../lib/types";

function makeGraph(stepCount: 0 | 2 = 2): { graph: SubjectGraph; node: GraphNode } {
  const node: GraphNode = {
    id: "n1",
    title: "Node 1",
    tier: 1,
    order: 1,
    duration: "20m",
    goal: "goal",
    status: "content-written",
    taughtElementIds: [],
    relatedElementIds: [],
    prerequisiteIds: ["e1"],
    prerequisiteSources: { e1: "frontmatter" },
    sources: [],
  };
  const steps: Record<string, Step> = {
    "n1/s1": {
      id: "n1/s1",
      stepId: "s1",
      nodeId: "n1",
      title: "Step 1",
      order: 1,
      deps: [],
      teaches: [],
      sources: [],
    },
    "n1/s2": {
      id: "n1/s2",
      stepId: "s2",
      nodeId: "n1",
      title: "Step 2",
      order: 2,
      deps: ["n1/s1"],
      teaches: [],
      sources: [],
    },
  };
  const graph: SubjectGraph = {
    subject: "test",
    tiers: [],
    nodes: [node],
    steps: stepCount === 0 ? {} : steps,
    seededSteps: [],
    elements: {
      e1: {
        id: "e1",
        title: "Element 1",
        tier: 1,
        order: 1,
        type: "article",
        taughtByNodes: [],
        taughtBySteps: [],
        deprecated: false,
        sources: [],
        connections: [],
        prerequisiteIds: [],
      },
    },
    edges: [],
  };
  return { graph, node };
}

function renderView(
  props: Partial<React.ComponentProps<typeof NodeDetailView>> = {},
  stepCount: 0 | 2 = 2,
) {
  const { graph, node } = makeGraph(stepCount);
  const handlers = {
    onSelectStep: vi.fn(),
    onNavigateElement: vi.fn(),
    onNavigateNode: vi.fn(),
    onClose: vi.fn(),
  };
  render(
    <NodeDetailView
      graph={graph}
      node={node}
      completedSteps={new Set(["n1/s1"])}
      {...handlers}
      {...props}
    />,
  );
  return handlers;
}

describe("NodeDetailView", () => {
  it("lists a node's steps in reading order", () => {
    renderView();
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("Step 1");
    expect(dialog).toHaveTextContent("Step 2");
    const text = dialog.textContent ?? "";
    expect(text.indexOf("Step 1")).toBeLessThan(text.indexOf("Step 2"));
  });

  it("shows the step x / y counter from the completed steps", () => {
    renderView();
    expect(screen.getByText("step 1 / 2")).toBeInTheDocument();
  });

  it("marks completed steps and resolves dependency titles", () => {
    renderView();
    expect(screen.getAllByLabelText("已完成")).toHaveLength(1);
    expect(screen.getByText("↖ Step 1")).toBeInTheDocument();
  });

  it("opens the step's reader modal when a step row is clicked", async () => {
    const user = userEvent.setup();
    const handlers = renderView();
    await user.click(screen.getByText("Step 2"));
    expect(handlers.onSelectStep).toHaveBeenCalledWith("n1", "s2");
  });

  it("closes via the close button", async () => {
    const user = userEvent.setup();
    const handlers = renderView();
    await user.click(screen.getByRole("button", { name: "關閉" }));
    expect(handlers.onClose).toHaveBeenCalledTimes(1);
  });

  it("closes via backdrop click", async () => {
    const user = userEvent.setup();
    const handlers = renderView();
    const overlay = document.querySelector(".path-detail-overlay")!;
    await user.click(overlay);
    expect(handlers.onClose).toHaveBeenCalledTimes(1);
  });

  it("closes via Escape when no reader modal sits on top", () => {
    const handlers = renderView();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handlers.onClose).toHaveBeenCalledTimes(1);
  });

  it("lets Escape fall through to the reader modal when one is open", () => {
    const handlers = renderView({ escDisabled: true });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handlers.onClose).not.toHaveBeenCalled();
  });

  it("shows an empty state for a legacy node with no steps", () => {
    renderView({}, 0);
    expect(screen.getByText("此課文沒有 step（舊式單文章 node）。")).toBeInTheDocument();
    expect(screen.queryByText(/^step /)).not.toBeInTheDocument();
  });

  it("renders prerequisite cards and navigates on click", async () => {
    const user = userEvent.setup();
    const handlers = renderView();
    await user.click(screen.getByRole("button", { name: /Element 1/ }));
    expect(handlers.onNavigateElement).toHaveBeenCalledWith("e1");
  });
});