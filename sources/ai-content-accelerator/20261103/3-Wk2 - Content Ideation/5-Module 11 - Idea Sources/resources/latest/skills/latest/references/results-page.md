# The results page

Every /latest run ends on one HTML page: dark by default with a light toggle, a run summary, a search box (press `/`), filter chips, sort, cards that open and close, and an idea cart. It is the same design /outliers uses, and the cart is shared, so picks from both land in one list.

## Contents

The JSON · What the page does · Opening it, or not · The taste file

## The JSON

`scripts/fill.py` reads this and puts it inside `assets/results.html`. Keep the shape exact: the page reads these names.

```json
{
  "kind": "latest",
  "headline": { "text": "The LATEST in AI for GPs", "doto": "LATEST" },
  "run": {
    "skill": "/latest",
    "topic": "AI scribes and AI for GPs",
    "audience": "One or two sentences on who the ideas must help.",
    "window": { "days": 7, "from": "2026-10-02", "to": "2026-10-09" },
    "ranAt": "2026-10-09T11:36:00+11:00",
    "locale": "en-AU",
    "searched": [
      { "source": "Reddit", "platform": "reddit", "note": "r/FamilyMedicine, r/medicine" },
      { "source": "YouTube", "platform": "youtube", "note": "nothing from this week" }
    ],
    "notSearched": [{ "source": "TikTok", "platform": "tiktok", "why": "no ScrapeCreators key" }],
    "notes": ["Checked on 2026-10-09: ideas 1 and 9 were opened and confirmed."],
    "rawFile": "the saved raw file path the engine printed",
    "nextStep": "optional, the next step from the defaults"
  },
  "items": [
    {
      "id": "https://www.reddit.com/r/medicine/comments/1x03ipt/",
      "rank": 1,
      "title": "Short working title",
      "platform": "reddit",
      "source": "r/medicine",
      "author": "top comment by u/someone",
      "date": "2026-10-07",
      "url": "https://www.reddit.com/r/medicine/comments/1x03ipt/",
      "angle": "What the user would say and show.",
      "why": "Why it helps the audience, or why now.",
      "metrics": [{ "label": "points", "value": 388 }, { "label": "comments", "value": 285 }],
      "check": "opened",
      "fit": "Matches your taste: liability and safety angles, filmed on made-up patients."
    }
  ]
}
```

- `headline.doto` is one word of `headline.text`, shown in the pixel font. Keep the headline to 6 words.
- `platform` is one of `youtube`, `x`, `reddit`, `hackernews`, `github`, `tiktok`, `instagram`, `linkedin`, `web`. Anything else shows the web globe.
- `date` is `YYYY-MM-DD`. When the thing is not new, set `date` to `null` and `dateNote` to a few words, such as `"not new"`.
- `metrics` are the public counts from the raw file, plural labels (`likes`, `points`, `comments`, `reposts`, `replies`). The first one is the card's big number. Web pages have none: leave the list empty.
- `check` is `"opened"` when you opened the page this run, `"raw"` when the link came from the saved raw file.
- `fit` appears only on ideas that match the taste file (rule 9), one line saying why. Leave it out otherwise.
- `id` is the link. It keeps a pick in the cart the same across runs.

`fill.py` stops and writes nothing when a title or a real http(s) link is missing. It warns, and still writes, on long text or an em dash.

## What the page does

- **Header:** topic, window, when it ran, what was searched and what was not. On a phone the sources fold behind "Show the sources".
- **Find:** search across titles, angles, sources and authors (press `/`); filter by platform, source and "Fits your taste"; sort by rank, newest or engagement; "Showing N of M" with Reset.
- **Cards:** collapsed shows rank, platform mark, title, source, date and the main number. Open one, or Expand all, for the angle, why it helps, why it fits your taste, every count and the real link, which opens in a new tab.
- **Idea cart:** Add on any card. In the cart drawer: drag to reorder (or arrow keys on the grip), a note per pick, **Copy for my agent** and **Download .md**. The cart lives in the browser, shared by every results page, and survives a reload. If the browser blocks storage the page still works for that visit.
- **Tips:** a Tips panel with the three tips from SKILL.md. It opens by itself when a run comes back with fewer than 5 results.

## Opening it, or not

`fill.py` opens the page in the default browser after writing it. Three ways to stop that:

- for good: set "Open the results page when done" to no in the defaults; step 6 then adds `--no-open`
- for one run: `python scripts/fill.py results.json --no-open`
- everywhere, for scripts and tests: the environment variable `RESULTS_NO_OPEN=1`

## The taste file

`taste.md` in this skill's folder. `scripts/taste.py add -` keeps its "Picks" log and "Counts"; the agent writes its "What you like" list through `scripts/taste.py like -`, so nothing but the script writes inside the skills folder. The user can edit any of it. `fill.py` shows "Shaped by N picks you saved" on the page when the file has picks.
