interface WikiLinkProps {
  href?: string;
  children?: React.ReactNode;
}

function parseKm(href: string): { kind: "learn" | "source"; target: string } | null {
  if (href.startsWith("km:sources/")) return { kind: "source", target: href.slice("km:".length) };
  if (href.startsWith("km:learn/")) return { kind: "learn", target: href.slice("km:learn/".length) };
  return null;
}

/**
 * MDX `a` override. The remark pipeline converts Obsidian wikilinks to `km:…`
 * URLs; this component turns them back into either an in-app navigation anchor
 * (learn/<subject>/<kind>/<id>, handled by the pane's delegation) or a styled
 * source reference. Non-`km:` links pass through untouched.
 */
export function WikiLink({ href, children }: WikiLinkProps) {
  if (!href) return <a href={href}>{children}</a>;
  const parsed = parseKm(href);
  if (!parsed) return <a href={href}>{children}</a>;
  if (parsed.kind === "source") {
    return <span className="source-ref">{parsed.target}</span>;
  }
  // `target` is `<subject>/<kind>/<id>`; expose the element id so the step
  // page's vocab chips can scroll to and highlight the first occurrence.
  const parts = parsed.target.split("/");
  const elementId = parts[1] === "elements" ? parts[2] : undefined;
  return (
    <a className="wikilink" data-target={`learn/${parsed.target}`} data-element-id={elementId}>
      {children}
    </a>
  );
}
