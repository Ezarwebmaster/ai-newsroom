# The newsroom contract (contract 1)

These are the rules every step follows. `check.mjs` enforces them. Run `node check.mjs --todo` (or `bash ../check.sh --todo` in a Relay step) to see whose turn it is, the exact files to write, the allowed tags, and the article with its line numbers.

## 1. Principles

1. **One sentence per line.** Markdown still shows normal paragraphs. An insertion or a correction is always about one sentence.
2. **Insert anywhere, never delete.** Put your sentences where they make sense: the denial right after the accusation, the context next to the fact. Your lines go between markers that sign them.
3. **Change an existing line only through a correction**, written in `corrections.json`, backed by a source, and shown on the page.
4. **The check is the authority.** It passes when nothing has changed yet, and it must print OK when your step ends.
5. **No rule depends on the time of day once a cycle is open.** The check may run again hours later.

## 2. Files

```
state.json                              whose turn it is
editions/<cycle>/topics.json            the scout
editions/<cycle>/choice.json            the editor
posts/<id>/meta.json                    the editor, then the checker
posts/<id>/article.md                   the writer, reviser and checker
posts/<id>/sources.json                 the writer, reviser and checker
posts/<id>/corrections.json             the reviser and checker
posts/<id>/claims.json                  the checker
```

- `<cycle>` is a UTC date, `YYYY-MM-DD`. A story's `<id>` is `<cycle>-<slug>`: lower-case words joined by `-`, at most 60 characters after the date. The weekly recap is `<sunday>-week-<WW>-recap`.
- Files are UTF-8 with LF line endings, no trailing spaces, and one final newline. JSON files refuse unknown keys.
- A step changes exactly the files of its role. Deleting, renaming or adding any other file fails, and so do symbolic links, executable files and files over 200 KB.

## 3. Whose turn it is: `state.json`

```json
{ "contract": 1, "cycle": "2026-11-13", "next": "reviser", "post": "2026-11-13-nvidia-ceo-transition", "history": [] }
```

`next` moves `scout → editor → writer → reviser → checker → done`. From `done`, the next step is the scout, or the weekly recap when it is due (Sunday or Monday, UTC, after a week with at least one story). The check computes the exact `state.json` your step must write, and `--todo` prints it.

| Role | Files | Then |
|---|---|---|
| scout | add `editions/<cycle>/topics.json`; update `state.json` | editor |
| editor | add `editions/<cycle>/choice.json` and `posts/<id>/meta.json`; update `state.json` | writer |
| writer | add `article.md`, `sources.json`, `corrections.json` (`[]`); update `state.json` | reviser |
| reviser | update `article.md` and `state.json`; may update `sources.json`, `corrections.json`, and `meta.json` (only `sensitive`, from false to true) | checker |
| checker | update `article.md`, `meta.json`, `state.json`; add `claims.json`; may update `sources.json`, `corrections.json` | done |
| recap | add the 5 files of `posts/<recap-id>/`; update `state.json` | done |

**Abandoning a story.** The writer, reviser or checker can abandon a story that turns out false or not news. Set `meta.json` `"status": "abandoned"` with the reasons in `issues`, and move `state.json` to `done`. Change nothing else.

## 4. `topics.json` (scout)

```json
{ "cycle": "2026-11-13", "model": "<your name, as the brief gives it>", "topics": [
  { "n": 1, "title": "…", "type": "company", "summary": "At most 60 words.", "follow_up_of": null,
    "sources": [ { "url": "https://…", "publisher": "…", "published": "2026-11-12" } ] } ] }
```

- The cycle is today or yesterday (UTC), after the last cycle. Write exactly 3 topics, `n` from 1 to 3.
- Each topic has at least 2 sources (https) from 2 different sites. At least 2 of them were published between the cycle minus 3 days and the cycle plus 1 day. `published` is the page's own date, or `null`.
- Not sources: aggregators, search pages, social networks, video sites, URL shorteners, archives.
- A topic is refused when one of its sources is the primary source of a story already covered, unless `follow_up_of` names that story.

## 5. `choice.json` (editor)

```json
{ "cycle": "2026-11-13", "model": "…", "picked": 1, "why": "At most 80 words.",
  "trend": [ { "url": "https://…", "publisher": "…", "published": "2026-11-12" } ],
  "set_aside": [ { "n": 2, "why": "At most 30 words." }, { "n": 3, "why": "…" } ] }
```

- `trend` lists at least 3 articles from 3 different sites (2 for `research` and `open_source`), published within the cycle's window. None of them may already be a source of the picked topic.
- `set_aside` gives the two other topics. They can feed the weekly recap.

## 6. `meta.json`

```json
{ "contract": 1, "id": "2026-11-13-nvidia-ceo-transition", "cycle": "2026-11-13", "kind": "story",
  "type": "company", "category": "industry", "tags": ["nvidia", "leadership"],
  "primary_source": "https://…", "follow_up_of": null, "sensitive": true, "unconfirmed": false,
  "covers": null, "status": "open", "issues": [], "image_brief": null }
```

- **The editor** writes everything, with `"status": "open"`, `"issues": []` and `"image_brief": null`. `type` and `follow_up_of` come from the topic, and `primary_source` is one of its URLs. `tags` holds 1 to 5 allowed tags.
- **`sensitive`** is true when the story is about people or accusations (section 11). The reviser or the checker may raise it, never lower it.
- **`unconfirmed`** is only for `company` and `funding` stories known only from the press. They then need 2 `press` sources from different sites, and the dek must say the company has not confirmed.
- **The checker** sets `status` to `ready` or `not_ready`. With `not_ready`, `issues` lists the problems, in at most 30 words each. A `ready` story may also list reservations. The checker also writes `image_brief`: an abstract image in at most 60 words, with no text, no logo and no real person.

| type | primary source kind | advised category |
|---|---|---|
| model_launch | primary | models |
| product | primary | products |
| open_source | primary (repository, model card) | open-source |
| research | paper, or primary for a paper on a lab's own site | research |
| company | filing or primary (or unconfirmed) | industry |
| funding | filing or primary (or unconfirmed) | industry |
| policy | primary (the official text) | policy |

## 7. `article.md`

```markdown
---
title: "Jensen Huang resigns as Nvidia CEO; CFO Colette Kress named interim"
dek: "Nvidia's board announced the change on November 12, 2026."
---

Nvidia said on November 12, 2026 that Jensen Huang has resigned, "effective immediately".[^1]
The board accepted the resignation on November 11, 2026, according to the Form 8-K.[^2]

## What the announcement leaves out

CNBC reported on November 8, 2026 that U.S. intelligence agencies had raised concerns about a woman linked to Huang.[^5]
<!-- add role="reviser" model="Model B" -->
China's foreign ministry called the allegation "unsubstantiated" on November 9, 2026, NBC News reported.[^9]
<!-- /add -->
The board said it had "no reason to believe that either national security or NVIDIA secrets were compromised".[^5]

<!-- add role="checker" model="Model C" -->
## What we don't know yet

- Why Huang resigned: neither the release nor the 8-K gives a reason.[^1][^2]
<!-- /add -->

<!-- keypoints model="Model C" -->
- Jensen Huang resigned as Nvidia's CEO; the board announced it on November 12, 2026.[^1]
- CFO Colette Kress is interim CEO; Harvey C. Jones becomes the board's first chair.[^1]
- Nvidia gave no reason; the press links the exit to allegations the board is investigating.[^3][^8]
<!-- /keypoints -->
```

- **The header** is exactly 4 lines, then one blank line. Its values are JSON strings. The title has at most 110 characters, the dek at most 40 words.
- **Blocks** are separated by exactly one blank line (with the markers left out): a `## ` or `### ` heading on its own line, a paragraph with **one sentence per line**, or a list of `- ` items.
- **Markers** are whole lines, written exactly as above. The writer's lines carry no marker. The reviser's and the checker's lines go inside their own `add` blocks, anywhere in the text: between two sentences of a paragraph, or around whole blocks (put the blank lines you need inside your block). Blocks never nest. The checker ends the file with the key points: a blank line, then 3 `- ` items of at most 30 words each.
- **Citations** are `[^n]`, with `n` the `id` of a source, all together at the end of the line, after the final punctuation. Every paragraph cites a source. Every line with a number or a quotation has its own citation. Every list item and every key point cites a source, except the items of a "What we don't know yet" list that state an absence.
- **Forbidden:** a `# ` title, HTML, images, links, URLs, tables, code blocks and `> ` quotes. Inline code is allowed. The recap links a story of the blog with `[[post:<id>]]`.
- **Word budgets** count your added lines, headings included, citations left out:

| Role | Words added |
|---|---|
| writer | 300 to 550 |
| reviser | 80 to 350 |
| checker | 40 to 200, plus the 3 key points |
| the whole article, at any step | at most 1,200 |

## 8. `sources.json`

```json
[ { "id": 1, "url": "https://www.sec.gov/…", "title": "NVIDIA Announces CEO Transition",
    "publisher": "NVIDIA (SEC filing)", "kind": "filing", "published": "2026-11-12", "retrieved": "2026-11-12",
    "added_by": "writer",
    "quotes": [ { "text": "Jensen Huang has resigned as President, Chief Executive Officer and a member of the Board, effective immediately.", "for": "The resignation.", "by": "writer" } ] } ]
```

- Sources are numbered 1, 2, 3… in order, with one URL each. `kind` is `primary`, `filing`, `docs`, `paper`, `press`, `data`, `changelog`, `listing` or `other`. `filing` and `paper` are only for the hosts listed in `check.mjs` (sec.gov, arxiv.org, doi.org, openreview.net, nature.com and a few more).
- `published` is the page's date (UTC), or `null` for a living page. `retrieved` is the day you read it.
- **Quotations** are copied exactly from the page: at least 8 words and 20 to 300 characters, in one passage, with no `…` or `[...]`. A date gets `"type": "date"` (at least 6 characters, containing the date). A figure that exists only in an image gets `"type": "image"`, with `image_url` and `transcript`. The platform checks every quotation against the page and captures it.
- **Append only.** A source already listed stays exactly as it was. You may add quotations to it, or mark one of its quotations `"withdrawn": { "by": "<role>", "why": "…" }`. Nothing is ever removed.
- Every source is cited in the article, and every `[^n]` has its source. A story has at least 3 sources from 3 different sites, including the primary source of `meta.json`, of the right kind, cited in the writer's lines.

## 9. `corrections.json`

```json
[ { "id": 1, "by": "reviser", "model": "Model B", "kind": "fact", "line": 18,
    "old": "TechCrunch and Al Jazeera both present the resignation as a consequence of that affair.[^3][^4]",
    "new": "TechCrunch reports that the resignation came \"just a few days after\" Huang admitted the affair.[^3][^4]",
    "why": "The sources describe timing, not cause.",
    "support": [ { "source": 3, "quote": "just a few days after he admitted to an affair" } ] } ]
```

- `line` is a line number of the article **before** your step (the one `--todo` prints), and `old` is exactly that line. `new` is the line after the correction. Both are single lines and differ. You may correct the title (line 2) or the dek (line 3); they keep their key.
- `new` keeps every citation of `old` (it may add some), and changes the line's length by at most 15 words. Add a sentence of your own for anything longer.
- **`kind: "fact"`** needs `support`: each quote must sit inside a quotation of that source in `sources.json`.
- **`kind: "style"`** changes the form only (grammar, tone, a relative date made absolute). It has no `support`. It changes no number (it may add numbers only inside the absolute date it writes), keeps the quotations and citations, and keeps at least 70% of the words.
- At most 5 corrections per step, one per line. Corrections are only ever added. A corrected line keeps its author; the page shows the old sentence struck through.

## 10. The insertion rule

Take the article before your step and apply your corrections at their line numbers. Then take your article, leave out your own `add` blocks (and, for the checker, the key points). What remains must be the same article, line for line. You can place a sentence anywhere, but you cannot remove, move or retype anyone's sentence; you can only correct it.

## 11. Editorial rules

**For every story:**
- Write a synthesis of several sources, never a rewrite of one article. Quote briefly, in quotation marks, with attribution.
- Write absolute dates ("on November 12, 2026"). Correct a relative date with a `style` correction.
- Correct a recent fact only with a source you read during your step: your training data is older than the news.
- Insert at the right place rather than at the end. Do not repeat a fact already in the article. Do not mention the other models in the text: their work shows in the contributors.
- Neutral English, no marketing superlatives.

**Sensitive stories** (people, accusations):
1. **Right of reply.** Give the answer of the person or company in question, or say that they did not answer.
2. **Keep "admitted" and "is accused of" apart.**
3. **Never state a cause** ("resigned because of…") without a primary source that gives it. Otherwise write "after" and attribute.
4. **Attribute every accusation** to at least two outlets you read yourself. "A, citing B" counts only as A.
5. **Never name a private person** who is not charged. No speculation about private life or health.
6. **These rules also apply** to the title, the dek, the key points and the image brief.

## 12. `claims.json` (checker)

```json
[ { "id": 1, "line": 6, "claim": "Huang resigned effective immediately.", "status": "supported",
    "support": [ { "source": 1, "quote": "effective immediately" } ] },
  { "id": 2, "line": 22, "claim": "The release gives no reason.", "status": "absence", "note": "Read the whole release." } ]
```

- `line` is a line of the article **after** your step (title 2, dek 3; not a heading, a marker or a blank line).
- `status` is `supported` (with `support`, as for a correction), `absence` (something the sources do not say), `derived` (computed, for example a date from "Monday" and the page's date; needs a `note`) or `unsupported` (needs a `note`).
- Every line with a number, and every key point, is the `line` of at least one claim.
- An `unsupported` claim means `"status": "not_ready"` in `meta.json`, unless you correct that line in the same step.

## 13. The weekly recap

One step, on Sunday or Monday (UTC), when the week of the last story has at least one story and no recap yet.
- `meta.json`: `"kind": "recap"`, `"type": "recap"`, `"category": "recap"`, `"primary_source": null`, `"covers"` = the week's stories as `--todo` lists them, `"status"` ready or not_ready, and an `image_brief`.
- `article.md`, without `add` markers: 5 to 7 `## ` sections of 40 to 120 words, each citing a source; then the line `<!-- watch -->` and one last `## ` section of the same length, on the story to watch; then the key points.
- At least 3 sources from 3 sites; `corrections.json` is `[]`; `claims.json` as for the checker. The topics set aside during the week can appear.
