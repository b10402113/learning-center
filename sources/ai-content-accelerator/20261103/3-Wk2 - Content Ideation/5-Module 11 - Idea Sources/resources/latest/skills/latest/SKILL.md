---
name: latest
description: Finds what is popping in a niche in the last 7 days and turns it into up to 10 ranked content ideas, each with an angle, why it helps the audience, the platform and a real source link, then opens them on a results page to search, filter and add to an idea cart. Researches social media, Reddit, YouTube, Hacker News, GitHub and the web through the last30days skill, plus the user's own go-to sources, and learns the user's taste from the picks they paste back. Use when the user says "/latest", "latest on [topic]", "what's new in [topic]", "what's popping in my niche", "what happened this week in [topic]", "what should I make content on this week", "ride the news", "content ideas from this week", "last 14 days of [topic]", pastes an idea cart that starts with "Idea cart:", or wants this week's trends turned into content ideas. Defaults to the niche set in its defaults block.
argument-hint: "[topic] [--days N]"
---

# Latest

Turns what people said about a niche in the last few days into ranked content ideas, on a results page the user searches, filters and picks from. The research is the `last30days` skill, run exactly as that skill says, plus a look at the user's own go-to sources. This skill adds the source check, the idea step, the page and the taste loop.

<!-- YOUR DEFAULTS: change these values here, in one place. Or ask your agent, for example "set my /latest niche to home gym equipment". -->
- Default topic: AI agents (an example, so it works out of the box. Change it to your niche, for example "home gym equipment" or "crochet patterns")
- Default window: 7 days (a slower niche may need 14 or 28)
- Ideas returned: up to 10
- Audience the ideas must help: beginners in your niche who want practical, hands-on help
- What the ideas are for: short videos you film on your phone or screen (change it to posts, newsletters or podcasts if that is your format)
- Your sources (your well of knowledge, where news in your niche lands first), used when they fit the topic. Swap these AI examples for your own:
  - Reddit communities: AI_Agents
  - X accounts: none yet
  - TikTok or Instagram creators: none yet
  - Websites: https://www.star-history.com/
- Slug for the default topic in run ids: the topic's first 4 words, lowercase, hyphens
- Results pages go to: the output folder inside this skill's folder
- Open the results page when done: yes (no = write it only)
- Next step to point at: none
<!-- END YOUR DEFAULTS -->

## Universal rules

1. **The window is the default unless the user names one.** [News is worth riding while it is fresh. A slower niche may need 14 or 28 days to find enough.] `--days N` or plain words set it for one run: "last 14 days", "last two weeks" (14), "last month" (30). To change it for good, change the default window above. Say the exact dates used in the first line of the answer.
2. **Run last30days as written. Never edit it, never improvise it.** [Its author found that improvised runs break its rules, and its fixes ship upstream.] Read `last30days/SKILL.md`, in the same skills folder as this skill, top to bottom, plus every reference file it routes topic research to, before the first command. Follow its topic research steps (query pre-flight, resolution, the plan, the engine run, the web supplements and the saved appendix) with `--days=N` and `--agent` added. If its first-run check prints `FIRST_RUN_DETECTED`, run its one-time setup first, without `--agent`, so the user answers its questions about X access and the free ScrapeCreators key. [Agent mode never grants cookie consent, so a silent first run loses X for good.]
3. **Include the user's sources when they fit the topic.** [The well of knowledge is where news lands before it reaches video. Sources for one niche are noise for another.] Reddit communities join `--subreddits`. X accounts join `--x-related` when X is active. Creators join `--tiktok-creators` and `--ig-creators` when a ScrapeCreators key is set. After the engine runs, open each listed website (at most 5) and keep what is new in the window: posts dated inside it, or a trending list as it stands today.
4. **Do not print last30days' own report.** [Its format rules govern that report. Here the idea list is the output.]
5. **Every link must be one that appeared in the research.** [An invented link is the one failure the user cannot spot by eye.] The pool is the saved raw file, this run's web search results and the source pages opened under rule 3. A link from a source page counts only when the page shows it; otherwise link the page itself.
6. **A company's own launch announcement is not an idea.** [Nobody can copy an announcement.] Make the idea a hands-on test or build of the thing, and put the announcement in as a source.
7. **Posted in the window does not mean new in the window.** [Old features get re-announced as "breaking" all the time.] Check the thing's own release date in a web result before calling it news.
8. **State an unverified claim as a claim.** [Leaked benchmarks and income stories are often wrong.] Turn it into a test the user can run, never a fact they repeat.
9. **Read the taste file before picking, when there is one.** [It holds what the user picked from earlier runs, which is a better guide than any default.] It is `taste.md` in this skill folder. A fit raises an idea's rank and shapes its angle toward the formats they liked. It never pushes out the week's biggest real news and never makes up an item. Each idea that fits gets a one-line `fit` saying why.

## Workflow

1. **Parse.** Topic and window from the arguments or the user's words, else the defaults. Give a one-line heads-up: about 3 minutes of research, longer on the first run while last30days sets up. Done when topic and dates are named in one line.
2. **Research.** Run `last30days` per rule 2 with rule 3's flags, including its web supplements and the saved appendix, then open the user's websites per rule 3. Done when the engine printed `Saved output to <path>` and each fitting website was opened or noted as unreachable.
3. **Read the saved raw file whole.** [The engine's printed output shows only the top clusters. The raw file holds every item with its link, date, author and engagement.] Done when you hold the full item list.
4. **Pick up to the default number of ideas.** Read `taste.md` first if it exists (rule 9). One real item anchors each idea. Prefer what the user can make in the format named in the defaults: for video, a test, a build, a walkthrough or a comparison they can show. Skip items off the niche whatever source they came from [GitHub and Hacker News return near misses for non-tech niches], drama, and anything rules 6 or 7 rule out. Done when you searched the raw file or the source pages for every link and found each one.
5. **Rank** by worth riding now: newest, strongest engagement, most useful to the audience, then fit with the taste file. Done when the order follows those four, in that priority.
6. **Write the results page.** Write the ideas as a results JSON, in the shape in [references/results-page.md](references/results-page.md), to the results folder from the defaults, named `latest-<slug>-<YYYY-MM-DD>.json`. Then run `python <this skill's folder>/scripts/fill.py <that json>`. It writes the page next to the JSON with the fonts inside, so it works offline, and opens it in the browser. If the defaults say not to open it, add `--no-open`. Done when the script printed `Wrote` and the page path.
7. **Present.** Keep the chat answer short: the page holds the detail. Done when the answer matches this shape:

```
Window: last 7 days (2026-10-01 to 2026-10-08). Topic: AI agents.

1. Short working title - platform, @author
2. Short working title - platform, @author

Page: <path to the .html> (open in your browser)
```

Keep each title under 100 characters, each angle under 280 and each why under 160. [Ideas get reused on cards and in sheets, and long text gets cut off.] After the page line, one line names any source that was not searched (for example X, without access), and one says how many ideas fit the taste file when there is one. Then the saved raw file path, and last, flat, the next step from the defaults if it names one.

## Learn from my picks (the taste loop)

The page's **Copy for my agent** button copies the user's picks as plain text that starts with `Idea cart:` and tells you to run this step. When the user pastes it and a `From:` line names `/latest`:

1. Send the whole pasted text to `python <this skill's folder>/scripts/taste.py add -` on standard input, or save it to a file outside the skills folder and pass that path instead of `-`. [Agents often guard their own skills folder, so the script does every write there.] It adds this skill's picks to `taste.md` with their counts, then prints them and the current "What you like" list. Picks whose `From:` line names another skill stay for that skill's own step.
2. Rewrite the "What you like" list: the topics, formats, sources and angles the picks share, merged with what is already there, 8 lines at most, in plain words. A note the user wrote beats your guess. Send it, one line per item, to `python <this skill's folder>/scripts/taste.py like -` the same way.
3. Tell the user in one line what you saved and that the next run ranks and shapes ideas around it.

```bash
python scripts/taste.py add - <<'CART'
Idea cart: 2 picks, in my order.
(the rest of the pasted text)
CART
```

Done when `taste.md` holds the new picks and the rewritten list.

## Tips

The same three tips sit in a Tips panel on every results page.

- **Too few results?** Go to a bigger niche or a broader topic. Or cast a wider net: run /latest over 14 or 28 days, or add more peer accounts to /outliers.
- **Be creative with topics,** not just your industry or job. Go from broad to narrow: AI, then local AI. Claude in general, then Claude for 3D work in Blender.
- **Teach it your taste.** Add the ideas you like to the cart, press Copy for my agent and paste it back to your agent. It saves what you liked to the skill's taste file and uses it to rank and shape your next run.

## Locked decisions

- **The angle says what the user would say and what they would show.** [An angle with nothing to show is not an idea.]
- **Ideas are anchored to one real item, not to a theme.** [A theme cannot be checked. A link can.]
- **This skill never edits last30days.** [Its author ships fixes. A forked copy goes stale.]
- **Every run ends on the results page, opened by default.** [The page is where the user searches, filters and picks. A list in chat cannot go in a cart.] To stop it opening, set "Open the results page when done" to no in the defaults; the page is still written.

## Resources

- `last30days/SKILL.md`, next to this skill's folder - the research contract. Read it in full every run, before the first command.
- [references/results-page.md](references/results-page.md) - the results JSON shape, what the page does, and how to switch opening off.
- `scripts/fill.py` - writes and opens the page. `scripts/taste.py` - every write to the taste file: the picks log, the counts and the "What you like" list.
- `assets/results.html` - the page itself. `assets/fonts/` - Outfit and Doto, bundled so the page needs no internet, under the SIL Open Font License (`assets/fonts/OFL-outfit.txt`, `assets/fonts/OFL-doto.txt`).
- `taste.md` - made on the first pasted cart, read at the start of each run (rule 9).

## Refining this skill

Fold new evidence into the rule it explains, and delete what it makes redundant. Never append a dated block.
