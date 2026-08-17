import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import FixtureQuiz from "./fixtures/quiz.mdx";
import FixtureVideo from "./fixtures/video.mdx";
import { ElementMdxView } from "../components/ElementMdxView";
import { QuizBlock } from "../components/QuizBlock";
import { VideoEmbed } from "../components/VideoEmbed";
import { PrereqSection } from "../components/PrereqSection";
import type { Element, Node, SubjectGraph } from "../lib/types";

const QUESTIONS = [
  { question: "Which loop decides when to stop?", options: ["SPAL", "Task loop"], answer: 0 },
];

function questionElement(overrides: Partial<Element> = {}): Element {
  return {
    id: "nq",
    title: "N Question",
    tier: 1,
    order: 1,
    type: "question",
    taughtByNodes: [],
    taughtBySteps: [],
    deprecated: true,
    sources: [],
    connections: [],
    prerequisiteIds: [],
    questions: QUESTIONS,
    ...overrides,
  };
}

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

describe("QuizBlock completion gating", () => {
  it("does not allow checking while unanswered or wrong; allows it after a correct answer", async () => {
    const user = userEvent.setup();
    const onQuizSolved = vi.fn();

    render(
      <ElementMdxView
        element={questionElement()}
        content={FixtureQuiz}
        checked={false}
        quizSolved={false}
        onToggle={vi.fn()}
        onQuizSolved={onQuizSolved}
      />,
    );

    const toggle = screen.getByRole("button", { name: /先答對測驗即可標記/ });
    expect(toggle).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "Task loop" }));
    expect(onQuizSolved).not.toHaveBeenCalled();
    expect(toggle).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "SPAL" }));
    expect(onQuizSolved).toHaveBeenCalledTimes(1);
    expect(screen.getByText("答對了。")).toBeInTheDocument();
  });

  it("re-enables checking once the quiz is solved", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ElementMdxView
        element={questionElement()}
        content={FixtureQuiz}
        checked={false}
        quizSolved={false}
        onToggle={vi.fn()}
        onQuizSolved={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("radio", { name: "SPAL" }));
    rerender(
      <ElementMdxView
        element={questionElement()}
        content={FixtureQuiz}
        checked={false}
        quizSolved
        onToggle={vi.fn()}
        onQuizSolved={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /標記元素完成/ })).toBeEnabled();
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

describe("TYPE badge and prerequisite colors", () => {
  const graph: SubjectGraph = {
    subject: "fixture-subject",
    tiers: [{ tier: 1, title: "基礎", nodeIds: ["p1"] }],
    nodes: [
      {
        id: "p1",
        title: "P One",
        tier: 1,
        order: 1,
        duration: "10-15 minutes",
        goal: "First.",
        status: "content-written",
        taughtElementIds: ["n1"],
        relatedElementIds: ["n2"],
        prerequisiteIds: ["n2", "p2"],
        prerequisiteSources: { n2: "derived", p2: "frontmatter" },
        sources: [],
      } as Node,
      {
        id: "p2",
        title: "P Two",
        tier: 2,
        order: 2,
        duration: "10-15 minutes",
        goal: "Second.",
        status: "draft",
        taughtElementIds: [],
        relatedElementIds: [],
        prerequisiteIds: [],
        prerequisiteSources: {},
        sources: [],
      } as Node,
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
        connections: ["n2"],
        prerequisiteIds: ["n2"],
      },
      n2: {
        id: "n2",
        title: "N Two",
        tier: 1,
        order: 2,
        type: "video",
        videoUrl: "https://example.com/v.mp4",
        taughtByNodes: [],
        taughtBySteps: [],
        deprecated: false,
        sources: [],
        connections: [],
        prerequisiteIds: [],
      },
    },
    steps: {},
    edges: [],
  };

  it("colors element prerequisites and node prerequisites differently", () => {
    const { container } = render(
      <PrereqSection
        graph={graph}
        prerequisiteIds={["n2", "p2"]}
        manualElements={new Set()}
        quizSolved={new Set()}
        onToggleCompletion={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );
    const elementCard = container.querySelector(".prereq-element");
    const nodeCard = container.querySelector(".prereq-node");
    expect(elementCard).not.toBeNull();
    expect(nodeCard).not.toBeNull();
    expect(elementCard!.className).not.toContain("prereq-node");
    expect(nodeCard!.className).toContain("prereq-node");
  });

  it("does not let a question prerequisite be checked before its quiz is solved", async () => {
    const user = userEvent.setup();
    const questionGraph: SubjectGraph = {
      ...graph,
      elements: {
        ...graph.elements,
        nq: {
          id: "nq",
          title: "N Question",
          tier: 1,
          order: 3,
          type: "question",
          taughtByNodes: [],
          taughtBySteps: [],
          deprecated: true,
          sources: [],
          connections: [],
          prerequisiteIds: [],
          questions: [{ question: "Q", options: ["A", "B"], answer: 0 }],
        },
      },
    };
    const onToggle = vi.fn();
    const { rerender } = render(
      <PrereqSection
        graph={questionGraph}
        prerequisiteIds={["nq"]}
        manualElements={new Set()}
        quizSolved={new Set()}
        onToggleCompletion={onToggle}
        onNavigate={vi.fn()}
      />,
    );
    const check = screen.getByRole("checkbox");
    expect(check).toHaveAttribute("aria-disabled", "true");
    await user.click(check);
    expect(onToggle).not.toHaveBeenCalled();

    rerender(
      <PrereqSection
        graph={questionGraph}
        prerequisiteIds={["nq"]}
        manualElements={new Set()}
        quizSolved={new Set(["nq"])}
        onToggleCompletion={onToggle}
        onNavigate={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
