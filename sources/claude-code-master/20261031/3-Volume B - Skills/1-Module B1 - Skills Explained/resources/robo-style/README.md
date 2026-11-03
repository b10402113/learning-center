# Robo Style - a drop-in design skill for Claude Code

A small skill that teaches your agent one clean, opinionated visual style: **static, printed, infographic-heavy design** built on a dot-matrix (halftone) technique, a paper-white / black / orange palette, and just two fonts.

Drop it in, say "make this in robo style", and your agent builds slides, one-pagers, and simple web pages that all look like they came from the same studio.

## What's inside

```
robo-style/
└── .claude/
    └── skills/
        └── robo/
            ├── SKILL.md         # the style: palette, type, dot-matrix engine, cards, icons
            └── brand-book.html  # the style documenting itself - open it in a browser
```

## Install

1. Unzip this folder.
2. Copy the `.claude/skills/robo/` folder into your own project's `.claude/skills/` directory.
   (If you don't have one yet, just create `.claude/skills/` at the root of your project and drop `robo/` inside.)
3. Start Claude Code in that project. The skill loads automatically.

## Use it

Open `brand-book.html` in your browser first - it IS the style, shown in its own style. Then try:

- `make these slides in robo style`
- `/robo build a one-pager for [topic]`
- `redesign this page in the robo style`

The agent reads `SKILL.md`, matches the brand book, and builds.

## What you get

- **One locked palette** - paper white, near-black, ink, cream, and a single orange accent (with a rare yellow cameo). No color soup.
- **Two free fonts** - Outfit for everything, Doto (a pixel font) for 1-2 emphasis words. Both load from Google Fonts, nothing to install.
- **The dot-matrix engine** - a ~15-line canvas function that turns simple brightness formulas into halftone art. Eight ready shape recipes (sphere, hexagon, arrow, bars, wave, sunburst, hourglass, mountain) are live code inside the brand book - copy and tweak.
- **Cards + pixel icons** - hard 2px borders, solid offset shadows, and tiny pixel-sprite icons drawn on canvas.
- **Layout rules** - minimal text, centered by default, one idea per slide, static energy.

## License

**CC BY 4.0.** Free to use, adapt, and build on - for any purpose, including commercial - as long as you give appropriate credit. See the `LICENSE` file.
