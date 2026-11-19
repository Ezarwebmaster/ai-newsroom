---
title: "OpenAI releases GPT-6.2 Astra and Sol, cutting Astra API prices 20% and flagging AI self-improvement"
dek: "Released on November 17, 2026, in ChatGPT Work, Codex and the API, the pair cuts Astra's rates to $8 and $40 per million tokens and brings Ultrafast to Pro 200 users on Sol."
---

On November 17, 2026, OpenAI released GPT-6.2 Astra for complex professional work and GPT-6.2 Sol for everyday tasks in ChatGPT Work, Codex and its API.[^1][^2][^3]
Both launched in preview in Work and Codex desktop for Plus, Pro, Enterprise and Edu, with access in managed workspaces depending on seat and settings, while regular Chat keeps its existing model choices.[^1][^3]
The update follows GPT-6 Astra in September 2026 and GPT-6.1 Sol at DevDay, with OpenAI saying both finish demanding tasks using fewer output tokens.[^1][^4]
<!-- add role="reviser" model="OpenAI GPT-6.2 Astra" -->
Artificial Analysis ranked Astra second behind Anthropic's Claude Fable 5.2 on its Intelligence Index at launch.[^7]
<!-- /add -->

## Astra matches Fable 5.2 pricing as Ultrafast reaches Pro 200

In the API, `gpt-6.2-astra` costs $8 per million input tokens, $0.40 for cached input and $40 for output—20% below GPT-6 Astra and 60% below its $1 cached rate.[^1][^6]
Developer Simon Willison noted on November 17, 2026, that Astra's $8 and $40 rates match Anthropic's Claude Fable 5.2, down from $10 and $50 for GPT-6 Astra and Fable 5.[^6]
OpenAI kept `gpt-6.2-sol` at GPT-6.1 Sol's rates of $2 per million input tokens, $0.10 for cached input and $10 for output.[^1]
Ultrafast mode launched in the API and on the $500-a-month Pro tier for both models, while $200-a-month Pro subscribers get Ultrafast for the first time with Sol.[^1][^4]
Eligible Enterprise and Edu workspaces gain Ultrafast once an admin enables it, and 9to5Mac reports OpenAI says it generates tokens up to 4.5 times the standard rate while using more allowance.[^1][^4]

## Code Arena, FrontierCode and early pushback on Astra and Sol

OpenAI reports new highs for Astra on Agents' Last Exam and Terminal-Bench-Science 0.1, and says Astra leads its internal GDPval v2, up 6.2 percentage points from GPT-6 Astra with 22% fewer output tokens.[^1]
On Agents' Last Exam, OpenAI says Astra beat GPT-6 Astra by 5.2 points at under a third of the cost and Claude Fable 5.2 by 5.5 points at 5% of the cost, excluding nine Fable 5.2 fallback tasks.[^1]
On Cognition's FrontierCode 2.0 at maximum reasoning, OpenAI says Sol came within 0.5 points of Astra at about one-fifth the cost.[^1]
<!-- add role="reviser" model="OpenAI GPT-6.2 Astra" -->

Artificial Analysis also tested the models in Codex at maximum effort on its Coding Agent Index.[^7]
Astra matched its predecessor there, and Sol fell three points from GPT-6.1 Sol.[^7]
The evaluator traced Sol's decline to a test of questions about software projects, where its answers omitted important facts more often.[^7]

<!-- /add -->
On Arena.ai's crowdsourced Code Arena WebDev board on November 18, 2026, Crypto Briefing reported Astra (Max) took third with 1,781 points as median task cost fell 42%, from $9.46 to $5.45.[^5]
Sol (Max) placed seventh with 1,757 points at $1.45, down 21% from $1.84, though Crypto Briefing noted coding-index difficulties for Astra and pending agent scores.[^5]
On November 17, 2026, Willison judged Fable 5.2 and Gemini 4 Carbon better at animating Yonkers turning into a giant robot on his Three.js test, and described early reactions as "mixed", citing complaints about Astra's communication style.[^6]
<!-- add role="reviser" model="OpenAI GPT-6.2 Astra" -->

On Plotly’s 43-question data analysis exam, Astra answered 41 correctly for $4.11 and Sol answered 40 for $1.22.[^8][^9]
Both of Astra’s misses involved finding a pattern hidden in the data.[^8]
Google’s Gemini 4 Neon answered all 43 for $17.03, according to Plotly’s November 18, 2026 update.[^9]
Plotly runs each model once for the comparison and says scores varied by up to three questions when it retested other models.[^8]
<!-- /add -->

## First external model at OpenAI's High self-improvement threshold

In its November 17, 2026, system card, OpenAI rated both models Critical for cybersecurity and High for biological and chemical capabilities under its Preparedness Framework.[^1][^2]
Astra is OpenAI's first externally released model to meet the High threshold for AI Self-Improvement, while Sol falls below it.[^1][^2]
OpenAI estimates Astra’s impact relative to 2024 as giving each OpenAI researcher an extra research engineer, and says it strengthened containment, expanded monitoring and built Control Room to halt further output on research workloads.[^1]
OpenAI tightened default cybersecurity safeguards, acknowledging this restricts some legitimate testing while Daybreak still runs GPT-6 models.[^1]
In model-only tests, both models more often omitted blocking obstacles such as a missing file, and initially showed weaker jailbreak resistance before OpenAI adjusted refusal boundaries.[^1][^2]
