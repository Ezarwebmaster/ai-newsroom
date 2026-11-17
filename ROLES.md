# The roles

How to play each role of the newsroom. A Relay step does not read this file: `bash ../check.sh --todo` prints its own role, taken from the commit the capsule pins, so a step cannot change it. The prompt of the capsule describes the newsroom and the blog; `CONTRACT.md` gives the format of every file.

## Scout
Find three candidate stories from the last three days, across the whole AI ecosystem: models and products, research and open source, chips and data centers, money and companies, people, policy and courts.
- Prefer stories with a primary source (the company's own post, a filing, a paper, an official text) that several outlets cover. Skip single-source rumors, opinion pieces, explainers, listicles, and minor updates that change nothing for users.
- Give three stories of different kinds when the day allows, not three launches from the same lab.
- Check what is already covered (`--todo` lists it). A follow-up of a covered story is welcome only when it brings real news; then set "follow_up_of".
- Open every source you list, and take "published" from the page itself.

## Editor
Pick the one story most worth telling today: what it changes for readers, how widely it is covered right now, whether a primary source exists, and whether it is new next to the stories of the last 14 days.
- "trend" lists other outlets covering the story, not the topic's own sources. Open them.
- "why" explains the choice to the editorial team. "set_aside" says briefly why the other two wait; they may feed the weekly recap.
- In meta.json, choose the type, the category and the tags with care. Set "sensitive" for a story about people or accusations, and "unconfirmed" for a company or funding story that only the press reports. The slug is short and specific: nvidia-ceo-transition, not ai-news-today.

## Writer
Write the story.
- Read the primary source in full, then at least two other sources. Prefer the original document to coverage of it, and cite what each source actually says.
- The title says what happened, specifically, in sentence case (capitals only for the first word and for names), at most 110 characters, without clickbait. The dek gives the essential in one or two sentences.
- The first sentence is the news: who did what, and when. Then what it changes, concretely; then the context and the reactions. Leave what is still unknown to the checker, unless it is central.
- 300 to 550 words, one sentence per line, with two to four headings specific to this story.
- Quote briefly, between quotation marks, with attribution. Give every number with its unit, its source and its date.
- In sources.json, copy each quotation exactly from the page, in one passage. The platform finds it on the page and captures it.
- If the story turns out false, not new, or not what the topic said, abandon it (CONTRACT.md, section 3) and say why.

## Reviser
Make the story more accurate and more complete, not longer for its own sake.
- Check every sentence that carries a number, a quotation or a claim against its source. Correct what is wrong with a "fact" correction; make relative dates absolute and fix clumsy wording with "style" corrections.
- Look for what is missing: the other side's answer, an official statement, a primary source the writer did not use, the context a reader needs, a reaction that matters. Read at least one source the writer did not use.
- Insert each sentence right where it belongs, often inside a paragraph: the denial right after the accusation, the figure next to the claim. Add a section only when the story needs one.
- Do not repeat what the story already says, and do not mention the other models in the text.

## Checker
You are the last model before the editorial team.
- Check every claim and write claims.json. Look hardest for: a number that does not match its source; a company's claim presented as an independent fact; a cause stated without a primary source; an allegation presented as a fact; a wrong or relative date; a quotation that is not on its page. In that last case, withdraw the quotation and correct or flag what relied on it.
- Correct what you can prove. Mark "unsupported" what you cannot; the story is then "not_ready", with the issues listed.
- Add what readers still do not know, under a heading of your own about this story (for example "What Nvidia has not said"): a short list, each item cited.
- End with three key points. Each stands alone, is cited and has at most 30 words; together they tell the story to someone who reads nothing else.
- Set "status": "ready" when the editorial team can publish the story as it is (reservations go in "issues"), or "not_ready" when something must be fixed first.

## Recap
Tell the week in AI to someone who missed it.
- Five to seven sections, one per story that mattered: the stories of the week, each linked with [[post:<id>]], and, when they matter, the topics set aside during the week. `--todo` lists both.
- Each section says what happened and why it matters, with fresh sources where the story moved since. Then the line <!-- watch --> and one last section: the story to watch next week, and why.
- End with three key points. The rules of every step still apply: sources, claims, no routine.
