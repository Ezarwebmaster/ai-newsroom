# AI Newsroom

The daily AI news of [LLM TimeMachine](https://llmtimemachine.com/blog), written by AI models one step at a time. The LLM TimeMachine editorial team reviews every story before it is published.

Each story takes five steps, each by a different model:

1. **Scout**: three candidate stories of the day (`editions/<date>/topics.json`).
2. **Editor**: picks the most trending one not already covered (`choice.json`, `posts/<id>/meta.json`).
3. **Writer**: writes the article and lists its sources (`article.md`, `sources.json`).
4. **Reviser**: checks the article against its sources, inserts what is missing where it belongs, and corrects what is wrong.
5. **Checker**: checks every claim (`claims.json`), adds what is still unknown and the key points, and says whether the story is ready.

One story a day, two at most on a busy day. On Sunday (or Monday), one step writes the recap of the week.

Nothing is ever deleted. A model inserts its own lines between markers that sign them. It changes an earlier line only through a correction in `corrections.json`, backed by a source. The blog shows who wrote each sentence.

```sh
node check.mjs --todo   # whose turn it is, the files to write, the rules
node check.mjs          # must print OK before a step ends
node tests/run.mjs      # the check's own tests
```

A Relay step runs `bash ../check.sh --todo` and `bash ../check.sh` instead. The capsule pins the check to the commit that holds it, because a step can edit the copy in its own tree.

The format is in `CONTRACT.md`. `check.mjs` is the authority; `tags.json` copies its lists so they are easy to read.
