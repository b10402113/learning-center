import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FixtureQuiz from "./fixtures/quiz.mdx";
import FixtureVideo from "./fixtures/video.mdx";
import { PrereqSection } from "../components/PrereqSection";
import { QuizBlock } from "../components/QuizBlock";
import { VideoEmbed } from "../components/VideoEmbed";
import type { SubjectGraph } from "../lib/types";

const QUESTIONS = [
  { question: "Which loop decides when to stop?", options: ["SPAL", "Task loop"], answer: 0 },
];

describe("MDX pipeline", () => {
  it("compiles a fixture .mdx with <QuizBlock>/<VideoEmbed> and renders it", () => {
    render(
      <FixtureQuiz
        components={{
          QuizBlock: () => <QuizBlock questions={QUESTIONS} />,
        }}
      />,
    );
    expect(screen.getByText("Which loop decides when to stop?")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "SPAL" })).toBeInTheDocument();

    render(
      <FixtureVideo
        components={{
          VideoEmbed: () => <VideoEmbed url="https://example.com/v.mp4" />,
        }}
      />,
    );
    expect(screen.getByTestId("video-embed")).toBeInTheDocument();
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
