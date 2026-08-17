import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FixtureQuiz from "./fixtures/quiz.mdx";
import FixtureVideo from "./fixtures/video.mdx";
import { QuizBlock } from "../components/QuizBlock";
import { VideoEmbed } from "../components/VideoEmbed";

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