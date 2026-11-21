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

## Conversation-bound encryption and tool-call classifiers

At the request level, OpenAI combines adversarial refusal training with input classifiers that flag extraction prompts and output classifiers that scan assistant messages and tool-call arguments across streaming and non-streaming responses.[^1][^5]
Scanning tool arguments prevents a model from exposing protected reasoning inside a tool call without including it in the final answer.[^1][^2]
After a September 30, 2026 disclosure where attackers moved encrypted reasoning between conversations and asked a model to transcribe it, OpenAI closed a path exposing encrypted reasoning across user, workspace, organization, and model-family boundaries.[^1][^2][^5]
In GPT-6.2 Astra and GPT-6.2 Sol, the API ties protected reasoning to its conversation history, drops subsequent reasoning if an earlier message is rewritten, and blocks older model families from reading the traces.[^1][^3]

## Weekly account bans, named campaigns and reseller rules

At the campaign level, OpenAI stated that its weekly enforcement actions against distillation networks in 2026 "have ranged in scale from thousands to tens of thousands of accounts", rising sharply during summer 2026.[^1][^4]
The company reiterated that it briefed the U.S. Congress in February 2026 on activity indicating DeepSeek was attempting to distill U.S. frontier models, and in September 2026 attributed a core cluster of a July 2026 extraction campaign—spanning 16,000 requests from over 4,000 users on July 24 and 25, 2026—to individuals associated with Moonshot AI.[^1][^2][^3]
Noting that outside verification would require court dockets or regulatory filings, explainx.ai observed on November 20, 2026 that OpenAI's attributions and red-teaming figures are vendor statements rather than third-party audits.[^5]
Alongside indicator sharing—as Anthropic separately reports banning tens of thousands of accounts to cut reasoning theft by 90% to 99%—OpenAI updated its usage policies on November 20, 2026 to require approval for AI gateways and model routers reselling direct access, while backing the Chip Security Act, the AI OVERWATCH Act, and the MATCH Act.[^1][^3][^4]
