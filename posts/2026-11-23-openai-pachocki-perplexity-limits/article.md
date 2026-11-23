---
title: "OpenAI chief scientist proposes perplexity-based limits on frontier AI"
dek: "Jakub Pachocki disclosed internal pretraining loss figures on November 22, 2026, urging labs to pause past shared thresholds until monitoring improves, as Microsoft shared its own score."
---

OpenAI chief scientist Jakub Pachocki proposed on November 22, 2026 that frontier AI developers adopt binding limits tied to pretraining perplexity thresholds until monitoring tools meet concrete safety milestones.[^1]
In a post on OpenAI's site, Pachocki argued that cross-entropy loss on held-out data offers a durable yardstick because downstream benchmarks saturate quickly.[^1]
He warned that AI contributions to pretraining research could trigger an "avalanche of fundamental pretraining advancements" as soon as 2027, outpacing alignment and monitoring work.[^1]

## Internal loss thresholds and emerging capabilities

Pachocki disclosed internal log-perplexity measurements on OpenAI's held-out codebase dataset going back to GPT-3.5.[^1]
GPT-3.5 measured about 0.99 when fluent conversation emerged, and GPT-4 reached roughly 0.91 alongside productive chain-of-thought reasoning.[^1]
Below 0.8, OpenAI saw "transformative capabilities in fields like cybersecurity and mathematics," with a model around 0.76 solving open math problems.[^1]
Pachocki wrote that entering the 0.68 to 0.70 window is expected to bring further capabilities alongside degradation in "currently dominant forms of alignment auditing" and higher evaluation awareness.[^1]
He proposed that labs commit not to cross an agreed threshold until monitoring reaches a milestone such as a successor to chain-of-thought monitors, though he did not specify an initial limit or start date.[^1][^3]

## Rival responses and measurement hurdles

Microsoft AI CEO Mustafa Suleyman became the first rival leader to answer on November 23, 2026, reporting on X that Microsoft's MAI-2 Base scored 0.819 log-perplexity on OpenAI's test set and MAI-1 Base scored 0.878.[^4]
Suleyman noted that Microsoft could compare directly only because it uses the same tokenizer as OpenAI and received access to OpenAI's evaluation dataset.[^4]
For other developers, Suleyman suggested reporting bits per byte on new shared test sets to account for different tokenizers.[^4]
Pachocki also flagged structural limits: different data mixtures across labs, the fact that chain-of-thought reasoning boosts capability without lowering perplexity, and an unknown entropy floor for datasets.[^1]

## Industry coordination and Washington scrutiny

OpenAI CEO Sam Altman endorsed Pachocki's essay on X, calling it "the most important thing OpenAI has published in awhile" and saying common limits would support "safety and control."[^3]
TechCrunch noted that the proposal follows Anthropic CEO Dario Amodei's call to "pace the frontier" through shared safety standards and limits on unchecked progress.[^2]
Insurance Journal reported that the debate coincides with expectations of heightened congressional scrutiny of AI companies after Democrats won control in the 2026 midterm elections, contrasting with President Donald Trump's opposition to broad AI restrictions.[^3]
