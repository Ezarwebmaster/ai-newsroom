---
title: "Google launches Gemini Decision 1, a model that scores answers instead of writing them"
dek: "The new Gemini Decisions API answers yes/no, multiple-choice and rubric questions with probabilities, at $0.10 per million input tokens and no charge for output."
---

Google DeepMind introduced the Gemini Decisions API on November 11, 2026, a new endpoint for what it calls "fast, closed-set decisions", powered by a new model named Gemini Decision 1.[^1]
The model does not write text.[^4]
Given an input and a list of questions, it returns a probability for each possible answer, which software can use to route a request, check a rule or grade a result.[^1][^4]

## Three question types, one pass

The API accepts three kinds of question: yes/no checks, multiple choice among 2 to 255 options, and scores on an ordered rubric.[^1]
One request carries a single shared input of up to 256K tokens, which can mix text, images, audio, video and PDFs, along with up to 1,000 independent questions.[^1]
<!-- add role="reviser" model="Claude Fable 5.2" -->
The two headline limits share one budget: the documentation gives a context window of "262,144 tokens across shared input and all questions", so a request cannot carry both a full-size input and a very long list of questions.[^4]
<!-- /add -->
Google's documentation says each question is scored on its own: "Questions can't see each other".[^4]

Every answer comes with a confidence score from 0 to 1 so that, in Google's words, "your code can route ambiguous cases to a fallback or human reviewer".[^1]
SiliconANGLE gives the example of a security team asking the model to rate the severity of an antivirus alert on a scale of 1 to 10.[^2]

## Price and speed

Gemini Decision 1 costs $0.10 per 1M input tokens, and output is not billed, because the model generates no output tokens.[^1][^4]
The shared input is billed once per request, however many questions are asked.[^1]
Google says this makes the model "nearly 5x cheaper across the shared benchmark suite" than Gemini 3.5 Flash-Lite, which SiliconANGLE describes as Google's entry-level language model.[^1][^2]
A no-cost tier is available in Google AI Studio for prototyping.[^1]
<!-- add role="reviser" model="Claude Fable 5.2" -->
A Crypto Briefing article says the cost case "remains unproven" because pricing was not published.[^6]
That is not what Google's post says: it gives the price, and OpenRouter lists the model at $0.10 per million input tokens with free output.[^1][^7]
MLQ.ai notes that $0.10 per million input tokens is also what Meta charges for Muse Ember, "its small model for high-volume agent work", although Muse Ember generates text and Gemini Decision 1 does not.[^5]
<!-- /add -->

Google reports an end-to-end latency of 150 to 250 milliseconds.[^1]
The figure comes with a condition: it was measured on "contexts up to 16K tokens", far below the 256K maximum, and with 1 to 100 questions per request rather than 1,000.[^1]

## Availability

The model is available now, under the identifier gemini-decision-1, through the Gemini API in Google AI Studio.[^1]
The documentation lists it on the Gemini Developer API (v1beta) only, and notes that context caching and the Batch API are not supported.[^4]
Google says integrations with OpenRouter, LangChain, Vercel and other tools are rolling out, with support "coming soon" to Gemini in Google Cloud.[^1]

## A crowded new category

Google is not first.
According to SiliconANGLE, the first decision model, Jev, was launched in mid-September by a startup called TypeSafe AI, and OpenAI's competing Decisions API launched last month.[^2]
The Decoder adds Cloudflare and Microsoft to the companies that "quickly followed with similar offerings".[^3]
<!-- add role="reviser" model="Claude Fable 5.2" -->
The outlets agree that Jev came first, but not on what Jev is.
The Decoder writes of "the startup Jev", while SiliconANGLE says Jev is the model and TypeSafe AI the company.[^3][^2]
Crypto Briefing gives the only precise dates for the rivals: OpenAI's Decisions API "entered public beta on October 6, 2026", and Microsoft followed on October 9, 2026 with a model called Microsoft-Decision-1.[^6]
<!-- /add -->

On performance, Google's post says only that Gemini Decision 1 "leads across the suite, with the lowest calibration error".[^1]
According to SiliconANGLE, Google says its model "performed better across seven of the nine benchmarks it tested", while Jev "proved to be slightly more cost-efficient".[^2]
<!-- add role="reviser" model="Claude Fable 5.2" -->
Google's post names the areas tested, "agent routing, reasoning, ranking, and multimodal understanding", but gives its results in a chart, not in figures a reader can quote.[^1]
MLQ.ai puts it plainly: "Those are Google's own benchmarks."[^5]
<!-- /add -->
Google also says it already uses the API in its own products, for example to route queries between models in Gemini Notebook.[^1][^3]

<!-- add role="checker" model="Claude Opus 5.5" -->
## What we checked, and what is still open

- The rival dates hold up: OpenAI's API changelog lists its Decisions API in beta on October 6, 2026 and as generally available on October 22, 2026.[^8]
- Microsoft's post putting Microsoft-Decision-1 in public preview is dated October 9, 2026.[^9]
- Every benchmark figure in the coverage we read comes from Google, and none of those articles reports an independent test.[^5]
- Google gives no latency figure for inputs above 16K tokens, although one request can carry up to 256K.[^1]
- Google Cloud support is "coming soon", without a date.[^1]
<!-- /add -->

<!-- keypoints model="Claude Opus 5.5" -->
- Gemini Decision 1 answers up to 1,000 yes/no, multiple-choice or rubric questions about one input of up to 256K tokens, returning probabilities instead of text.[^1]
- It costs $0.10 per million input tokens with no output charge; Google's latency figures cover inputs up to 16K tokens, and its benchmarks are its own.[^1][^5]
- Google follows TypeSafe AI's Jev, OpenAI and Microsoft into decision models; OpenAI's rival API has been generally available since October 22, 2026.[^2][^8]
<!-- /keypoints -->
