import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FixtureList from "./fixtures/list.mdx";
import FixtureQuiz from "./fixtures/quiz.mdx";
import FixtureVideo from "./fixtures/video.mdx";
import { PrereqSection } from "../components/PrereqSection";
import { VideoEmbed } from "../components/VideoEmbed";
import { getElementMdx, getNodeMdx, getStepMdx } from "../lib/mdxRegistry";
import type { SubjectGraph } from "../lib/types";

describe("MDX pipeline", () => {
  it("compiles a deprecated question-element fixture as a plain article with no quiz", () => {
    render(<FixtureQuiz components={{}} />);
    expect(screen.getByText("Answer the question below.")).toBeInTheDocument();
    expect(screen.queryByTestId("quiz-block")).not.toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  });

  it("compiles a fixture .mdx with <VideoEmbed> and renders it", () => {
    render(
      <FixtureVideo
        components={{
          VideoEmbed: () => <VideoEmbed url="https://example.com/v.mp4" />,
        }}
      />,
    );
    expect(screen.getByTestId("video-embed")).toBeInTheDocument();
  });

  it("compiles markdown lists into ul and ol structures", () => {
    const { container } = render(<FixtureList components={{}} />);
    const unordered = container.querySelector("ul");
    const ordered = container.querySelector("ol");
    expect(unordered).not.toBeNull();
    expect(ordered).not.toBeNull();
    expect(unordered?.querySelectorAll("li")).toHaveLength(2);
    expect(ordered?.querySelectorAll("li")).toHaveLength(2);
    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(screen.getByText("Ordered one")).toBeInTheDocument();
  });
});

describe("mdx registry — nested step glob (ADR-0004)", () => {
  it("resolves a real step article nested under a node directory", () => {
    const Step = getStepMdx("quant-resource", "backtesting-data-platforms", "platform-selection");
    expect(Step).not.toBeNull();
    if (!Step) return;
    render(<Step />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("回測平台怎麼選？");
  });

  it("resolves node and element articles while treating them separately from steps", () => {
    const Node = getNodeMdx("quant-resource", "backtesting-data-platforms");
    expect(Node).not.toBeNull();
    const Element = getElementMdx("quant-resource", "backtesting-platform-selection");
    expect(Element).not.toBeNull();
  });

  it("returns null for a step that does not exist", () => {
    expect(getStepMdx("quant-resource", "backtesting-data-platforms", "nope")).toBeNull();
    expect(getStepMdx("quant-resource", "ghost-node", "platform-selection")).toBeNull();
    expect(getStepMdx("ghost-subject", "backtesting-data-platforms", "platform-selection")).toBeNull();
  });
});

describe("VideoEmbed", () => {
  it("embeds the element's videoUrl in an iframe", () => {
    render(<VideoEmbed url="https://www.youtube.com/embed/abc123" title="N Video" />);
    const frame = screen.getByTitle("N Video") as HTMLIFrameElement;
    expect(frame.src).toBe("https://www.youtube.com/embed/abc123");
    expect(frame.getAttribute("allowFullScreen")).not.toBeNull();
  });

  it("renders nothing when no videoUrl is present", () => {
    const { container } = render(<VideoEmbed />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("PrereqSection colors", () => {
  const graph: SubjectGraph = {
    subject: "fixture-subject",
    tiers: [{ tier: 1, title: "基礎", nodeIds: ["p1", "p2"] }],
    nodes: [
      {
        id: "p1",
        title: "P One",
        tier: 1,
        order: 1,
        duration: "10-15 minutes",
        goal: "First.",
        status: "content-written",
        taughtElementIds: [],
        relatedElementIds: [],
        prerequisiteIds: [],
        prerequisiteSources: {},
        sources: [],
      },
      {
        id: "p2",
        title: "P Two",
        tier: 1,
        order: 2,
        duration: "10-15 minutes",
        goal: "Second.",
        status: "draft",
        taughtElementIds: [],
        relatedElementIds: [],
        prerequisiteIds: [],
        prerequisiteSources: {},
        sources: [],
      },
    ],
    elements: {
      n1: {
        id: "n1",
        title: "N One",
        tier: 1,
        order: 1,
        type: "article",
        taughtByNodes: ["p1"],
        taughtBySteps: [],
        deprecated: false,
        summary: "",
        sources: [],
        connections: [],
        prerequisiteIds: [],
      },
    },
    steps: {},
    seededSteps: [],
    edges: [],
  };

  it("colors element prerequisites and node prerequisites differently, without completion toggles", () => {
    const { container } = render(
      <PrereqSection
        graph={graph}
        prerequisiteIds={["n1", "p2"]}
        onNavigate={() => {}}
      />,
    );
    const elementCard = container.querySelector(".prereq-element");
    const nodeCard = container.querySelector(".prereq-node");
    expect(elementCard).not.toBeNull();
    expect(nodeCard).not.toBeNull();
    expect(elementCard!.className).not.toContain("prereq-node");
    expect(nodeCard!.className).toContain("prereq-node");
    // Elements are keywords (ADR-0005) — no checkbox rides on the card.
    expect(container.querySelector(".prereq-card-check")).toBeNull();
  });
});
