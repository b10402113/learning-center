import { useEffect, useRef } from "react"

interface ArticleBodyProps {
  html: string
  /** valid wikilink targets within this subject (node ids) */
  validTargets: Set<string>
  onNavigate: (nodeId: string) => void
  className?: string
}

export function ArticleBody({
  html,
  validTargets,
  onNavigate,
  className,
}: ArticleBodyProps) {
  const ref = useRef<HTMLDivElement>(null)

  // mark inert wikilinks (cross-subject / sources / unknown) so they don't act
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const links = root.querySelectorAll<HTMLElement>(".wikilink")
    links.forEach((el) => {
      const target = el.getAttribute("data-target") ?? ""
      const valid = validTargets.has(target)
      el.classList.toggle("wikilink-inert", !valid)
    })
  }, [html, validTargets])

  const onClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest<HTMLElement>(".wikilink")
    if (!link) return
    const id = link.getAttribute("data-target") ?? ""
    if (!validTargets.has(id)) return
    e.preventDefault()
    onNavigate(id)
  }

  return (
    <div
      ref={ref}
      className={`nb-prose ${className ?? ""}`}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
