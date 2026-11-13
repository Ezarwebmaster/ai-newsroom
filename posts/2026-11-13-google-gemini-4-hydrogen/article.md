---
title: "Google launches Gemini 4 Hydrogen for everyday coding and agent workflows"
dek: "Google's new execution model offers configurable reasoning and flat context-window pricing, with Antigravity routing work between Hydrogen and Carbon."
---

Google opened Gemini 4 Hydrogen to developers on November 12, 2026, offering a model for everyday coding and agent workflows that can run alone or alongside its Carbon and Argon models.[^1]
The developer announcement identifies repository debugging, interactive web development and multimodal work as target uses, and directs builders to the Gemini API through AI Studio and Android Studio.[^1]
Ars Technica describes Hydrogen as the replacement for Google's faster Flash models, extending the company's element-based naming scheme beyond its more demanding reasoning models.[^4]

## One context window, four reasoning settings

Google's November 12 announcement gives standard API prices across Hydrogen's 1 million-token window of $1.50 per million uncached input tokens and $7.50 per million output tokens, including reasoning tokens.[^2][^5]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
VentureBeat notes that this price matches the standard rate Gemini 3.8 Flash is scheduled to charge from January 1, 2027, and is twice Flash's introductory rate, which runs through December 31, 2026.[^5]
<!-- /add -->
The company offers low, medium, high and xhigh thinking settings, with high as the default, allowing developers to choose how much reasoning to spend on a task.[^2]
That makes reasoning depth a setting within the model rather than requiring a switch to another model for every change in workload.[^2]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
VentureBeat reports that the model rejects the older `thinking_budget` parameter and the MINIMAL setting.[^5]
<!-- /add -->

Google says Hydrogen completes tasks 2.5 times faster than Gemini 3.8 Flash at its default high setting and reduces fabricated claims by more than fivefold.[^2]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
On Terminal-Bench 4.1, Google reports that Hydrogen completes 57% of tasks, against 18.2% for Gemini 3.8 Flash.[^2][^5]
The company also cites a 94% honesty rate on its own internal agent honesty evaluation.[^2]
<!-- /add -->
Those are the company's reported comparisons, rather than independent measurements of a particular developer's repository or application.[^2]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
In that Google table, Hydrogen still trails Anthropic's Claude Sonnet 5.5 at 63.9%, VentureBeat notes.[^5]
Artificial Analysis, an independent benchmarking firm, scored Hydrogen 51 on its Intelligence Index at the default high setting, according to VentureBeat, and lists 54 at the xhigh setting on its own page.[^5][^6]
That page also records that Hydrogen at xhigh generated 304 million tokens while running the index, against a median of 77.3 million, and averaged 13.9 minutes per task, slower than the 12.9-minute median for comparable models.[^6]
<!-- /add -->

## Carbon coordinates, Hydrogen executes

Google's new Orchestrator in Antigravity switches models within a session, assigning different parts of a workflow to Carbon and Hydrogen.[^2]
Its proposed parallel setup puts Carbon in charge of coordination while Hydrogen agents implement and verify changes in isolated workspaces.[^2]
Google describes the division as pairing deeper architectural judgment with faster code writing, testing and verification.[^2]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
Google's launch post credits Orchestrator with near-Carbon success, 24% less quota and 19% faster completion on average on Terminal-Bench 4.0, while its Antigravity team gives the same figures for version 4.1.[^2][^5][^7]
VentureBeat cautions that such savings depend on which model the work would otherwise have gone to.[^5]
<!-- /add -->
Individual Antigravity access requires a paid Google AI Pro or Ultra subscription, according to the developer announcement and VentureBeat.[^1][^5]

## Search and the app get the execution model too

The rollout also reaches Google's consumer products: 9to5Google reports that Hydrogen becomes the default model for AI Mode and handles the hardest questions in AI Overviews.[^3]
The outlet says free Gemini app users receive Hydrogen through automatic model selection when appropriate for a prompt.[^3]
Google frames the Search changes around understanding multipart questions and returning more visual answers with a broader range of relevant links.[^2]

<!-- add role="checker" model="OpenAI GPT-6 Astra" -->
## Open questions about Flash migration and Hydrogen’s safety tests

- Google's API retirement schedule still lists no shutdown date for Gemini 3.8 Flash, so developers have a successor and a price change to plan for, but no announced deadline to switch.[^5][^8]
- The Hydrogen model card promises a full safety and security report without giving a publication date for the evidence behind Google's internal tests.[^9]
<!-- /add -->

<!-- keypoints model="OpenAI GPT-6 Astra" -->
- Google released Gemini 4 Hydrogen on November 12, 2026, for everyday coding, with a choice of reasoning levels and access through the Gemini API.[^1][^2]
- Standard API prices are $1.50 per million uncached input tokens and $7.50 per million output tokens across the full context window.[^2][^5]
- Carbon and Hydrogen can share a coding session in Antigravity, while Google Search uses Hydrogen as its default AI Mode model.[^2][^3][^7][^10]
<!-- /keypoints -->
