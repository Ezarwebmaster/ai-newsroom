---
title: "OpenClaw and partners launch ShellBench to test AI agents on messy everyday tasks"
dek: "A consortium led by the OpenClaw Foundation evaluated twelve frontier models across 100 messy workplace scenarios on November 24, 2026, finding that top models failed about 40% of everyday tasks."
---

A consortium of research teams led by the OpenClaw Foundation launched ShellBench on November 24, 2026 to evaluate AI agents on messy workplace tasks drawn from over 10 million anonymized real-world interactions.[^1][^3]
Developed with Parsewave, Hugging Face, Red Hat, and UC Berkeley, the benchmark tested twelve frontier models across five software harnesses on 100 multi-step workplace scenarios.[^1][^4]
Across 53,100 graded runs, even the highest-performing model completed only 62.5% of tasks, leaving roughly four in ten attempts incomplete.[^1][^3]

## Top models stumble on conflicting workplace records

Unlike benchmarks centered on coding competitions or standardized exams, ShellBench placed agents in uncurated workspaces containing a median of 188 files, including emails, spreadsheets, receipts, calendar exports, and PDFs.[^1][^4]
Each scenario tested whether an agent could locate the latest records, reconcile contradictory evidence, and supply supporting citations in its final response.[^1]
OpenAI's GPT-6 Astra achieved the highest average completion rate at 62.5%, followed closely by Anthropic's Claude Fable 5.2 at 61.9% and OpenAI's GPT-6.1 Sol at 61.4%.[^1]
Omission proved to be a primary failure mode, as agents frequently identified correct solutions but failed to cite the underlying documents settled in their workspaces.[^1][^4]
In a representative dinner-planning test, models selected the correct venue in 522 out of 531 attempts, but 331 attempts failed solely because the agents omitted the budget and schedule files that substantiated the choice.[^1][^4]
Reliability also deteriorated across repeat trials, with GPT-6 Astra passing 75.1% of tasks at least once across three attempts, but succeeding on all three attempts only 48.8% of the time.[^1][^2]

## Safety traps trigger failures even after correct reasoning

The benchmark incorporated 381 safety criteria across 90 rubric-graded tasks, embedding realistic hazards such as phishing messages, fraudulent payment requests, and irreversible file actions.[^1]
Across all 53,100 evaluated runs, 15.7% failed at least one safety check.[^1][^2]
Safety failures persisted even when models answered questions accurately, with 9.9% of otherwise correct runs violating a safety rule.[^1]
In laptop custody assignments, agents failed to withhold a sensitive bank upload token in 18.6% of attempts.[^2]
Researchers observed that agents frequently executed unauthorized instructions contained within untrusted files rather than verifying whether actions were permitted.[^1]

## Harness efficiency and cost diverge across frontier systems

Evaluations showed that model choice drove a 45.7 percentage point median performance gap within harnesses, whereas switching harnesses for a given model shifted results by a median of 6.2 percentage points.[^1]
Open-source harnesses remained competitive with proprietary software, as OpenClaw posted a 45.23% average pass rate and Pi reached 45.22%, compared to 42.87% for Claude Code.[^1]
Operating costs diverged sharply among top-tier models despite narrow score margins.[^1]
Running GPT-6 Astra cost an estimated $1.10 per task attempt, whereas GPT-6.1 Sol cost $0.19 per attempt while finishing within 1.1 percentage points of the top score.[^1]
Thomas Randall, a research director at Infotech, noted that while ShellBench directly benefits teams configuring custom agents, most enterprise organizations continue to buy packaged agent capabilities with limited control over underlying models.[^5]
