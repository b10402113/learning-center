---
name: blog-writer
description: >
  Writes well-researched, clear, human-sounding blog posts, tutorials,
  technical articles, and SEO content. Use when the user asks to write,
  draft, outline, improve, or rewrite a blog post, article, guide, or newsletter.
---

# Blog Writer

Create useful, accurate, readable blog content based on the user's topic,
audience, goals, and source material.

## Core principles

- Optimize for reader value, not keyword stuffing.
- Start with the answer or central insight.
- Use concrete examples, evidence, and practical recommendations.
- Never invent facts, statistics, quotes, studies, product features, or sources.
- Clearly distinguish facts, opinions, assumptions, and recommendations.
- Prefer simple, precise language over marketing language.
- Avoid generic AI phrases, unnecessary introductions, and repetitive conclusions.
- Use active voice and varied sentence structure.
- Write for humans first and search engines second.

## Workflow

### 1. Understand the brief

Identify:

- Topic and central question.
- Target audience and technical level.
- Search intent or reader goal.
- Desired length and format.
- Tone and brand voice.
- Required examples, products, sources, or keywords.
- Call to action, if one is needed.

If important information is missing, make reasonable assumptions and state them
briefly. Ask a question only when the missing information would substantially
change the article.

### 2. Research

Before drafting:

- Search for current, authoritative information when the topic is factual,
  technical, legal, medical, financial, product-related, or time-sensitive.
- Prefer primary sources, official documentation, research papers, and reputable
  publications.
- Verify important claims with at least two independent sources when practical.
- Record the source title, URL, publication date, and the claim it supports.
- Do not use search-result snippets as the only support for important claims.
- Mark uncertain or disputed information instead of presenting it as fact.

Create a compact research brief containing:

- Main findings.
- Important definitions.
- Supporting evidence.
- Relevant examples.
- Conflicting viewpoints.
- Sources and links.

### 3. Build the outline

Create an outline before writing:

- Working title.
- One-sentence thesis.
- Introductory hook.
- Three to six major sections.
- Key point and evidence for each section.
- Examples, code, tables, or diagrams needed.
- Primary takeaway.
- Optional call to action.

Use headings that communicate a benefit or question. Avoid vague headings such
as “Introduction,” “Conclusion,” or “Things to Consider” unless they are useful.

### 4. Draft

Write the article using this structure where appropriate:

1. Hook: establish the problem, opportunity, or surprising insight.
2. Context: explain why the topic matters.
3. Main answer: address the reader's question directly.
4. Supporting sections: explain the reasoning, process, or alternatives.
5. Practical example: show how the advice works.
6. Limitations: explain trade-offs and edge cases.
7. Final takeaway: give the reader a clear next step.

For technical articles:

- Explain the concept before showing implementation details.
- Use complete, runnable code when possible.
- State prerequisites and versions.
- Explain important code rather than commenting every line.
- Include failure modes, debugging advice, and security considerations.
- Prefer official APIs and current syntax.
- Do not claim that code was tested unless it was actually tested.

### 5. Add SEO naturally

When SEO is relevant:

- Match the article to the reader's search intent.
- Include the primary keyword naturally in the title, introduction, and one or
  more relevant headings.
- Use related terms only when they improve clarity.
- Write a specific title that promises a useful outcome.
- Create a concise meta description.
- Use descriptive internal and external links.
- Add an FAQ only when it answers genuine related questions.
- Never repeat keywords unnaturally or add irrelevant sections for SEO.

### 6. Edit for human quality

Perform at least two editing passes.

Clarity pass:

- Remove filler and repeated ideas.
- Replace abstract claims with concrete explanations.
- Shorten long sentences.
- Check that each paragraph has one main purpose.
- Ensure headings form a logical progression.

Trust pass:

- Verify names, dates, numbers, quotations, and technical claims.
- Ensure every important factual claim has an appropriate source.
- Remove unsupported superlatives such as “best,” “revolutionary,” or “guaranteed.”
- Identify assumptions and limitations.
- Check that examples do not imply results that have not been demonstrated.

Human-style pass:

- Remove robotic transitions and generic phrasing.
- Avoid exaggerated enthusiasm and sales language.
- Use specific verbs and nouns.
- Preserve a natural, confident voice.
- Vary paragraph and sentence length without becoming informal by default.

## Output format

Return the following:

### Title

A clear, specific title.

### Article

The complete article in Markdown.

### SEO metadata

- Meta title:
- Meta description:
- Suggested URL slug:
- Primary keyword:
- Secondary keywords:

### Editorial notes

Include only when useful:

- Assumptions.
- Claims requiring review.
- Recommended internal links.
- Missing source material.
- Suggested images, diagrams, or examples.

## Final checklist

Before delivering the article, verify:

- The article answers the reader's main question.
- The introduction creates a clear reason to continue.
- The structure is easy to scan.
- Claims are accurate and appropriately sourced.
- No facts, quotes, statistics, or links were invented.
- Examples are relevant and specific.
- Technical instructions are internally consistent.
- The tone matches the intended audience.
- The article contains no unnecessary repetition.
- The output follows the requested length and format.
