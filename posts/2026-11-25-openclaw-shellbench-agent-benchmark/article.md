---
title: "OpenClaw and partners launch ShellBench to test AI agents on messy everyday tasks"
dek: "A consortium led by the OpenClaw Foundation released ShellBench on November 24, 2026 after evaluating twelve models across 100 workplace scenarios, finding that top models failed about 40% of everyday tasks."
---

A consortium of research teams led by the OpenClaw Foundation launched ShellBench on November 24, 2026 to evaluate AI agents on messy workplace tasks drawn from over 10 million anonymized real-world interactions.[^1][^3]
Developed with Parsewave, Hugging Face, Red Hat, and UC Berkeley, the benchmark tested twelve frontier models across five software harnesses on 100 multi-step workplace scenarios.[^1][^4]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
The tasks derive from 10,456,576 opt-in user queries across personal AI assistants, pairing requests of a median 43 words with 16,296 files across 90 rubric-graded tasks and 668 across 10 code-tested tasks.[^1][^6]
All twelve models were tested between November 7 and November 20, 2026 across Claude Code, Codex, Hermes, OpenClaw, and Pi at three reasoning-effort levels, except DeepSeek V4.1 Flash in Hermes, yielding 59 configurations.[^1][^6]
<!-- /add -->
Across 53,100 graded runs, even the highest-performing model completed only 62.5% of tasks, leaving roughly four in ten attempts incomplete.[^1][^3]

## Top models stumble on conflicting workplace records

Unlike benchmarks centered on coding competitions or standardized exams, ShellBench placed agents in uncurated workspaces containing a median of 188 files, including emails, spreadsheets, receipts, calendar exports, and PDFs.[^1][^4]
Each scenario tested whether an agent could locate the latest records, reconcile contradictory evidence, and supply supporting citations in its final response.[^1]
OpenAI's GPT-6 Astra achieved the highest average completion rate at 62.5%, followed closely by Anthropic's Claude Fable 5.2 at 61.9% and OpenAI's GPT-6.1 Sol at 61.4%.[^1]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Fourth-place Gemini 4 Carbon averaged 58.7%, while the remaining models ranged down to 39.7% for Muse Wonder 1.0 and DeepSeek V4.1 Flash and 18.8% for GPT-6 Luna.[^1][^2][^6]
In the 90 rubric-graded tasks, GPT-6.1 Sol running at high reasoning effort in Pi acted as the automated judge across 721 binary criteria, requiring every criterion to pass for a task to succeed.[^1][^6]
<!-- /add -->
Omission proved to be a primary failure mode, as agents frequently identified correct solutions but failed to cite the underlying documents settled in their workspaces.[^1][^4]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Across 77 tasks, 87 criteria checked whether answers named the files used, and The Deep View reported that information omission caused 51% of completion failures even though agents retrieved the relevant data in 87% of those cases.[^1][^3]
<!-- /add -->
In a representative dinner-planning test, models selected the correct venue in 522 out of 531 attempts, but 331 attempts failed solely because the agents omitted the budget and schedule files that substantiated the choice, leaving 152 attempts that met every requirement.[^1][^4]
Reliability also deteriorated across repeat trials, with GPT-6 Astra passing 75.1% of tasks at least once across three attempts, but succeeding on all three attempts only 48.8% of the time.[^1][^2]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Although the automated judge agreed with human annotators on 89.9% of 278 consensus criterion decisions, six of 40 unchanged submissions received both a pass and a fail across repeated automated gradings.[^6]
<!-- /add -->

## Safety traps trigger failures even after correct reasoning

The benchmark incorporated 381 safety criteria across 90 rubric-graded tasks, embedding realistic hazards such as phishing messages, fraudulent payment requests, and irreversible file actions.[^1]
Across all 53,100 evaluated runs, 15.7% failed at least one safety check.[^1][^2]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Safety failure rates ranged from 9.4% for GPT-6 Astra and 9.7% for GPT-6.1 Sol to 20.6% for Gemini 4 Carbon and 24.4% for DeepSeek V4 Pro.[^6]
<!-- /add -->
Safety failures persisted even when models answered questions accurately, with 9.9% of otherwise correct runs violating a safety rule.[^1]
In laptop custody assignments, agents failed to withhold a sensitive bank upload token in 18.6% of attempts.[^2]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Specific failures included omitting a child's school pickup plan in 422 of 531 attempts (79.5%) and recommending duplicate or incorrect freight invoice payments in 214 of 531 attempts (40.3%).[^2][^6]
<!-- /add -->
OpenClaw noted that agents with file and service access must verify whether an instruction is appropriate, authorized, and grounded in trustworthy information, not merely executable.[^1]

## Harness efficiency and cost diverge across frontier systems

Evaluations showed that model choice drove a 45.7 percentage point median performance gap within harnesses, whereas switching harnesses for a given model shifted results by a median of 6.2 percentage points.[^1]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Among the five highest-scoring models, the median spread narrowed to 15.2 percentage points for model choice and 9.9 percentage points for harness choice.[^1][^6]
<!-- /add -->
Open-source harnesses remained competitive with proprietary software, as OpenClaw posted a 45.23% average pass rate and Pi reached 45.22%, compared to 42.87% for Claude Code.[^1]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Hermes and Codex CLI averaged 45.11% and 45.04% pass rates, while pooled median execution times ranged from 1.31 minutes per run in Pi to 2.86 minutes in OpenClaw.[^1][^6]
<!-- /add -->
Operating costs diverged sharply among top-tier models despite narrow score margins.[^1]
Running GPT-6 Astra cost an estimated $1.10 per task attempt, whereas GPT-6.1 Sol cost $0.19 per attempt while finishing within 1.1 percentage points of the top score.[^1]
Thomas Randall, a research director at Infotech, noted that while ShellBench directly benefits teams configuring custom agents, most enterprise organizations continue to buy packaged agent capabilities with limited control over underlying models.[^5]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Parsewave co-founder Louka Ewington-Pitsos told Computerworld that the consortium released pinned harness configurations and roughly 20 public tasks on GitHub while keeping 80 tasks private to prevent training data contamination, and TechCrunch noted the tests omitted native consumer harnesses such as Meta's Muse, OpenAI's Dots, and Anthropic's Claude Duet.[^2][^5]
<!-- /add -->

<!-- add role="checker" model="Google Gemini 4 Neon" -->
## Unmeasured whole-task human accuracy, actual billing costs and future harness tests

The ShellBench authors did not obtain independent human verdicts for whole task submissions, leaving overall grading accuracy unverified beyond the 278-decision criterion sample and without a multi-family judge panel.[^6]
The consortium could not obtain actual billing figures from model providers, so all per-run cost estimates rely on recorded rollout tokens, list prices, and caching heuristics while excluding grading costs.[^1][^6]
Safety scores record binary rubric failures rather than a principled measure of real-world harm, and researchers did not separately measure human-judge agreement on safety criteria.[^6]
Neither OpenClaw nor its partners have published a schedule for evaluating native consumer harnesses such as Meta's Muse or for adding new models to the 80-task private holdout.[^1][^5][^6]
<!-- /add -->

<!-- keypoints model="Google Gemini 4 Neon" -->
- On November 24, 2026, OpenClaw and partners launched ShellBench across 100 workplace tasks, where leading model GPT-6 Astra completed only 62.5% of runs.[^1]
- Across 53,100 evaluated runs, 15.7% failed a safety check—including 9.9% of otherwise correct runs—and GPT-6 Astra passed all three repeat attempts on just 48.8% of tasks.[^1]
- Model choice drove a 45.7-point median pass-rate gap versus 6.2 points for harnesses, while GPT-6.1 Sol trailed Astra by 1.1 points at $0.19 per run versus $1.10.[^1]
<!-- /keypoints -->
