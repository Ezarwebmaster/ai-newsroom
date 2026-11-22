---
title: "Thinking Machines Lab releases Inkling 2 Mini, an open-weight looped transformer"
dek: "The 26.4-billion-parameter model runs its middle layers three times per token to pack deeper reasoning into a 20 GB local footprint."
---

Rather than adding layers to deepen reasoning, Thinking Machines Lab released Inkling 2 Mini on November 20, 2026, a 26.4-billion-parameter open-weight model that loops its middle 12 layers three times per token.[^1][^3]
The company released the mixture-of-experts model under an Apache 2.0 license with text and image inputs and a 1-million-token context window.[^2][^3]
Its 24 physical layers include 3.4 billion active parameters per pass, rising to 5.4 billion weight activations per token across the three loops.[^1]

## Loop-three architecture and local hardware footprint

Thinking Machines Lab trained most of the weights natively in NVFP4 precision, with the final four layers in MXFP8, resulting in a memory footprint of roughly 20 GB.[^1]
That size lets the model run offline on consumer laptops, and the company said it supports any Mac with at least 32 GB of RAM via Ollama at launch, alongside NVIDIA's DGX Spark desktop computer.[^1]
In an offline test on a MacBook Pro, researchers ran the model on a flight and built a playable flight simulator in a few minutes, Thinking Machines Lab said.[^1]

The model divides its 24 layers into four six-layer blocks and uses attention residuals so the middle two blocks can read outputs from earlier blocks and from the previous loop pass.[^1][^4]
Thinking Machines Lab said that looping the middle 12 layers beat looping the last 12 layers on 27 of 28 evaluations.[^1]
<!-- add role="reviser" model="Google Gemini 3.8 Flash" -->
During midtraining, Thinking Machines Lab pruned two-thirds of the experts to retain the 128 most-used expert blocks per layer, allowing the model to run faster on local hardware.[^1]
Each layer routes tokens to 8 of those 128 experts, while hybrid attention pairs local windows of 1,024 tokens with full-context global attention every six layers to support the 1-million-token window.[^5]
<!-- /add -->

## Coding benchmarks, cost per task and knowledge limits

Thinking Machines Lab reported that Inkling 2 Mini leads open-weight models under 100 billion total parameters on DeepSWE v1.1 at 48.2% and Vals Index v2.2 at 46.5%.[^1]
Independent testing by Artificial Analysis placed the model at 20 on its Intelligence Index, matching Alibaba's Qwen3.8 27B and Nanbeige4.3-33B with roughly five times and six times fewer active parameters, respectively.[^2]
On Artificial Analysis's suite, Inkling 2 Mini used about 38% more output tokens than Qwen3.8 27B but 2.8 times less compute, costing $0.59 and taking 9.0 minutes per task versus $3.53 and 38.2 minutes for Qwen3.8 27B.[^2]

Looping does not increase factual recall, which Thinking Machines Lab noted depends mainly on total parameter count.[^1]
On the AA-Omniscience factuality benchmark, the model scored -8.6 with a 63.4% non-hallucination rate, trailing Qwen3.8 27B's -6.4 score and 71.4% rate, though it led comparable open-weight models on tool-assisted search benchmarks such as BrowseComp (79.0%) and DeepSearchQA (85.3%).[^1]
<!-- add role="reviser" model="Google Gemini 3.8 Flash" -->
However, independent testing revealed gaps between benchmark scores and live agent workflows, with MindStudio reporting that the model looped for over an hour trying to debug a tiered pricing calculation without reaching a fix.[^5]
The model card also states that Inkling 2 Mini is not strongly multilingual and performs best on English-language tasks.[^5]
<!-- /add -->

## Shorter reasoning chains and Goodfire's interpretability access

To test how looping affects chain-of-thought monitoring, Thinking Machines Lab also released a variable-loop research variant on Hugging Face.[^1][^3]
Across GPQA Diamond questions answered correctly at every depth, five-pass reasoning averaged 1,661 tokens compared with 3,703 tokens at one pass, while sentence length and English dictionary word rates stayed unchanged.[^1]
<!-- add role="reviser" model="Google Gemini 3.8 Flash" -->
On that research variant, the unprompted reasoning time horizon rose from 16 seconds at one pass to 37 seconds at three passes, while the model showed no upward trend on tests of agentic sabotage as loops were added.[^1]
<!-- /add -->

Thinking Machines Lab gave interpretability firm Goodfire early access to the weights to study how information moves across loops.[^1][^4]
Goodfire reported on November 20, 2026 that layers in the looped blocks coordinate across passes in ways that let them write to themselves or read from future layers, and both Inkling 2 Mini and the variable-loop model are available via Tinker and Hugging Face.[^1][^4]

<!-- add role="checker" model="Google Gemini 3.8 Flash" -->
## Chat constraints, inference latency overhead and pretraining compute costs

- Multi-turn instruction constraints: Thinking Machines Lab acknowledged that Inkling 2 Mini trails Qwen3.8-27B on multi-turn chat and complex instructions, scoring 50.0% on MultiChallenge and 33.4% on ComplexConstraints v1.1.[^1]
- Inference latency penalty: MindStudio reported that looping and per-pass memory add real inference latency, yielding slower token generation speeds than raw active parameter counts suggest.[^5]
- Pretraining compute overhead: Non-looping baseline models required 7.5% less compute during initial pretraining, although the looped architecture required 140% less inference compute to match loss on 512,000-token traces.[^1]
<!-- /add -->

<!-- keypoints model="Google Gemini 3.8 Flash" -->
- Thinking Machines Lab released Inkling 2 Mini on November 20, 2026, an open-weight 26.4-billion-parameter transformer that loops middle layers three times per token within a 20 GB footprint.[^1][^3]
- In independent testing, Artificial Analysis placed the model at 20 on its Intelligence Index matching Qwen3.8 27B, while costing $0.59 per task with 2.8 times less compute.[^2]
- Looping cuts reasoning chain length while maintaining legibility, though the model exhibits real inference latency and lags on multi-turn instructions and raw factual recall.[^1][^5]
<!-- /keypoints -->
