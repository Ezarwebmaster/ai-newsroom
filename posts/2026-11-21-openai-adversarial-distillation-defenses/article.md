---
title: "OpenAI hardens GPT-6.2 Astra and Sol against reasoning-trace extraction"
dek: "Internal red-teaming found that updated request classifiers and conversation-bound encryption cut prior-turn reasoning leaks from 54.0% to 0.2%, as weekly enforcement bans reach tens of thousands of accounts."
---

OpenAI published a security report on November 20, 2026 detailing layered technical defenses and account enforcement against adversarial distillation of its frontier models.[^1][^2]
In internal adaptive black-box red-teaming across six attacker models, the average success rate for attacks extracting protected reasoning from an earlier request dropped from 54.0% on GPT-6 Astra with its original safeguards to 0.2% on GPT-6.2 Astra.[^1][^2]
Attacks targeting reasoning generated during the current request fell from 22.9% to 0.9% under the same evaluation, which covered safeguards rolled out across GPT-6.2 Astra and GPT-6.2 Sol and partially backported to GPT-6 Astra.[^1][^2][^4]

## Exact reasoning traces transfer cyber skills beyond summaries

Adversarial distillation uses a frontier teacher model's outputs without authorization to train a student model that can inherit dual-use cybersecurity or biology capabilities without the original model's safeguards.[^1][^3]
To test how much capability transfers through hidden chain-of-thought steps, OpenAI fine-tuned identical pretrained student models on coding and defensive cybersecurity trajectories from Astra-level teacher models.[^1][^2]
One run used only user-visible responses, reasoning summaries, and tool interactions, while a second run added the teacher's exact internal reasoning traces.[^1][^2]
OpenAI reported that after supervised fine-tuning, "the student trained on exact reasoning traces generally outperformed the student trained on reasoning summaries", and after reinforcement learning it still scored higher at the largest inference budget tested on ExploitBench and SEC-bench Pro.[^1][^3]
The summary-trained student scored higher at lower inference budgets, leading OpenAI to conclude that hiding exact traces limits cyber-capability transfer even on permitted tasks.[^1][^2]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
OpenAI linked that result to an October 12, 2026 study in which Anthropic trained a pretrained Claude model on Claude Opus 4.8 coding transcripts and reported a SWE-bench Verified score of 80.4% with full reasoning transcripts versus 71.8% with summaries.[^1][^6]
<!-- /add -->

## Conversation-bound encryption and tool-call classifiers

At the request level, OpenAI combines adversarial refusal training with input classifiers that flag extraction prompts and output classifiers that scan assistant messages and tool-call arguments across streaming and non-streaming responses.[^1][^5]
Scanning tool arguments prevents a model from exposing protected reasoning inside a tool call without including it in the final answer.[^1][^2]
After a September 30, 2026 disclosure where attackers moved encrypted reasoning between conversations and asked a model to transcribe it, OpenAI closed a path exposing encrypted reasoning across user, workspace, organization, and model-family boundaries.[^1][^2][^5]
In GPT-6.2 Astra and GPT-6.2 Sol, the API ties protected reasoning to its conversation history, drops subsequent reasoning if an earlier message is rewritten, and blocks older model families from reading the traces.[^1][^3]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
For developers using the Responses API, OpenAI's documentation notes that custom history edits or compaction trigger `prefix_mismatch` removals visible in `input_transformations`, whereas OpenAI's own `/responses/compact` and `context_management` features preserve subsequent reasoning items.[^9]
<!-- /add -->

## Weekly account bans, named campaigns and reseller rules

At the campaign level, OpenAI stated that its weekly enforcement actions against distillation networks in 2026 "have ranged in scale from thousands to tens of thousands of accounts", rising sharply during summer 2026.[^1][^4]
The company reiterated that it briefed the U.S. Congress in February 2026 on activity indicating DeepSeek was attempting to distill U.S. frontier models, and in September 2026 attributed a core cluster of a July 2026 extraction campaign—spanning 16,000 requests from over 4,000 users on July 24 and 25, 2026—to individuals associated with Moonshot AI.[^1][^2][^3]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
In its September 30, 2026 disclosure, OpenAI specified that the operators "did not break our encryption, compromise a database, or gain direct access to stored user conversations," noted that related prompt patterns spanned a wider cluster of more than 15,000 users disrupted by July 28, 2026, and cautioned that it was unclear whether all operators belonged to one actor.[^7]
<!-- /add -->
Noting that outside verification would require court dockets or regulatory filings, explainx.ai observed on November 20, 2026 that OpenAI's attributions and red-teaming figures are vendor statements rather than third-party audits.[^5]
Alongside indicator sharing—as Anthropic separately reports banning tens of thousands of accounts to cut reasoning theft by 90% to 99%—OpenAI's updated usage policies took effect on November 20, 2026, requiring approval for AI gateways and model routers reselling direct access, while OpenAI backs the Chip Security Act, the AI OVERWATCH Act, and the MATCH Act.[^1][^3][^4][^6][^8]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
In its October 12, 2026 report, Anthropic said its defenses often ban distillation accounts in under two hours while carrying commercial trade-offs, including turning away "meaningful revenue and trillions of tokens' worth of paying traffic" and requiring legitimate customers to adjust integrations.[^6]
OpenAI's October 21, 2026 consistent-standards policy also introduced SafetyIDs so API customers can help isolate abusive end users during misuse investigations without revealing those users' identities to OpenAI.[^8]
<!-- /add -->

<!-- add role="checker" model="Anthropic Claude Sonnet 5.5" -->
## No Sol figure yet, and no date for the promised campaign report

- Protection on GPT-6.2 Sol: OpenAI's published red-teaming result, the drop from 54.0% to 0.2%, is stated for GPT-6.2 Astra only, and the report gives no separate attack success rate for GPT-6.2 Sol.[^1]
- Newly disrupted campaigns: OpenAI wrote that it plans to share more soon about recent campaigns it has disrupted, without giving a date or naming the actors involved.[^1]
<!-- /add -->

<!-- keypoints model="Anthropic Claude Sonnet 5.5" -->
- OpenAI says internal red-teaming cut average success of extracting an earlier request's protected reasoning from 54.0% on GPT-6 Astra to 0.2% on GPT-6.2 Astra.[^1][^4]
- OpenAI's study found students trained on exact reasoning traces generally outperformed those trained on summaries after supervised fine-tuning, so it hides exact traces to limit cyber-capability transfer.[^1][^3]
- Weekly OpenAI enforcement has ranged from thousands to tens of thousands of accounts; all figures are vendor statements, with no Sol result or date for the next campaign report.[^1][^5]
<!-- /keypoints -->
