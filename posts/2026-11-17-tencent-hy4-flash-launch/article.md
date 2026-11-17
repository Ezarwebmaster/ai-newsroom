---
title: "Tencent launches Hy4 flash, a 12-billion-active-parameter model priced at $0.070 per million input tokens"
dek: "Tencent released Hy4 flash on November 16, 2026, a multimodal model for everyday office and agent work. Its cost and quality claims come from Tencent's own tests."
---

Tencent launched Hy4 flash on November 16, 2026, a model it describes as the most cost-effective in its Hy family.[^1]
Tencent says the model has 224 billion total parameters, 64 billion of them Engram parameters, with only 12 billion active, and a context length of up to 1M tokens.[^1]
It accepts multimodal input.[^2]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
Tencent says the model's KV cache is 1/24 the size of Hy3's and 1/6 that of Hy4, and that it decodes at more than 150 tokens per second.[^1]
It adds that reinforcement learning cut the average number of output tokens per task by 50 percent.[^1]
<!-- /add -->

## Priced for volume, with a discount until November 30

Tencent prices the model at about US$0.070 per million input tokens and US$0.281 per million output tokens.[^1]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
Cached input costs US$0.003 per million tokens.[^1]
<!-- /add -->
Tbreak reports the same prices, and an Italian technology site rounds them to roughly 7 cents for input and 28 cents for output.[^2][^3]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
Tbreak, citing Superpower Daily, says those prices are roughly 92 percent and 89 percent below those of the full Hy4.[^2]
<!-- /add -->
Until November 30, 2026, Tencent says users can use the model for free on WorkBuddy and get 50 percent off standard pricing via Tencent Cloud TokenHub.[^1]

## Tencent's blind test and its own benchmark

Tencent says the model's per-task cost on its WorkIndex benchmark is 1/13 that of Hy4 Preview and 1/20 that of Hy4.[^1]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
The release also puts that cost at 1/8 of DeepSeek-V4.1-Flash-1017's, measured at that model's Max tier and peak-hour pricing.[^1]
<!-- /add -->
In a blind evaluation, Tencent says, 85 internal Tencent WorkBuddy users rated outputs across 259 tasks in 27 categories.[^1][^2]
The company reports that in this evaluation "Hy4 flash achieved user satisfaction close to Claude Haiku 5.5".[^1]
The same release says the model slightly outperforms the larger Hy4 Preview overall.[^1]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
Atomic Agent reports that DeepSeek V4.1 Flash 1017, not Hy4 flash, won the blind test on satisfaction.[^5]
On a scale of 1 to 4, Hy4 flash scored 2.79, Claude Haiku 5.5 scored 2.81 and the DeepSeek model 3.09.[^3]
The DeepSeek model took 10.3 minutes per task, against 6.7 minutes for Hy4 flash and 6.8 for Claude Haiku 5.5.[^3]
Tencent says Hy4 flash had "the shortest task completion time" and a much lower per-task cost than every other model evaluated.[^1]
Atomic Agent lists that cost at ¥0.26 per task, against ¥4.73 for Claude Haiku 5.5 and ¥1.20 for DeepSeek at its peak rate.[^5]
<!-- /add -->

Tencent recommends the model for everyday tasks such as deep research, document processing and slide generation.[^1]
It directs users to the more capable Hy4 for complex tasks such as long-horizon software engineering.[^1]
Another outlet reports that Hy4 flash trails Hy4 in programming, so it is not an obvious choice as the brain of a coding agent.[^3]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
In Terminal-Bench 4.0 runs that Tencent carried out itself, Hy4 flash scores 19.2, against 44.4 for Hy4 and 40.0 for DeepSeek V4.1 Flash 1017.[^3][^5]
In a coding-agent test of its own, Atomic Agent says Hy4 flash passed all 59 hidden tests in four of six runs, for about two cents per task.[^5]
<!-- /add -->

## Where it runs and what is still closed

Tencent says the model is available across Tencent Cloud TokenHub, WorkBuddy, Yuanbao, WeCom, QQ, ima and Marvis.[^1]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
The release adds that OpenRouter integration is coming soon.[^1]
Tbreak, citing Unite.AI, reports that the API takes up to 960,000 input tokens and 64,000 output tokens and supports the OpenAI Chat Completions, OpenAI Responses and Anthropic Messages protocols.[^2]
<!-- /add -->
The company says it also plans to open-source the model, without giving a date in the passages cited here.[^1][^3]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
The Italian site calls the open weights "a promise with no date and no license" and notes that there is no model card and no paper on the architecture.[^3]
<!-- /add -->
The launch follows the release of Hy4 on November 4, 2026, which AI Journal says entered the top tier of open-source models.[^4]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
Tbreak reports Tencent's claim that Hy4 ranks second among Chinese models on the Artificial Analysis Intelligence Index.[^2]
<!-- /add -->

The performance figures come from tests that Tencent designed and ran itself.[^2]
One reviewer notes that Tencent built both WorkIndex and the blind test, "with its own users and tasks of its own choosing".[^3]
Tbreak adds that independent comparisons are not available yet.[^2]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
Atomic Agent says Artificial Analysis and Vals have not published results for Hy4 flash yet.[^5]
<!-- /add -->
The same reviewer says the release does not state in which countries the API is accessible or under what data terms.[^3]
