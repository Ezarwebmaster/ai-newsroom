---
title: "Google releases Gemini 4 Neon for coding, reasoning and agent workflows"
dek: "Positioned between Carbon and Hydrogen, the model brings a 1-million-token context window, four thinking levels, and $3/$15 per-million-token pricing across Google platforms and GitHub Copilot."
---

Google released Gemini 4 Neon on November 18, 2026, introducing its fourth Gemini 4 model in seven weeks.[^1][^2]
Positioned between the larger Gemini 4 Carbon and the faster Gemini 4 Hydrogen, Neon targets complex software engineering, multistep tool use, and enterprise knowledge work.[^1]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
Its model card says Neon is adapted from Gemini 4 Carbon and has a knowledge cutoff of March 2026.[^6]
<!-- /add -->
It supports a 1-million-token context window across text, image, video, and speech inputs, along with four configurable thinking levels: low, medium, high, and xhigh.[^1][^2]

## Pricing, speed and Google AI Pro availability

Google priced Gemini 4 Neon at $3 per million input tokens and $15 per million output tokens, with cached inputs discounted by 95% to $0.15 per million tokens.[^1]
That rate is 25% below Gemini 4 Carbon's standard $4 and $20 pricing, though 50% above Carbon's $2 and $10 promotional rate that ends on November 30, 2026.[^2]
In independent testing by Artificial Analysis, Neon at xhigh effort averaged $6.44 and roughly 21 minutes per task, about 17% cheaper and 40% faster than Carbon at non-discounted rates, driven by an output speed near 110 tokens per second.[^2]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
Artificial Analysis found that Neon uses about 15% more output tokens per task than Carbon, so the savings come from its lower token prices rather than from shorter answers.[^2]
<!-- /add -->
In the Gemini app, Neon replaces Argon and the older Pro model for Google AI Pro subscribers paying $19.99 per month in the United States, while Carbon remains limited to the $99.99 AI Ultra tier and free or AI Plus users do not receive Neon.[^5]

## Benchmarks, Copilot rollout and enterprise caution

Neon scored 61 at xhigh effort on the Artificial Analysis Intelligence Index, ranking third overall behind OpenAI's GPT-6.2 Astra and Anthropic's Claude Fable 5.2, and one point ahead of Carbon.[^2]
Google reported that Neon ranked first on the Artificial Analysis Coding Agent Index with a score of 58.6, reached 65.2% on Terminal-Bench 4.1, and scored 39.0% on SWE-sweep inside Google Antigravity.[^1]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->
Measured by Artificial Analysis itself with Antigravity CLI, Neon at xhigh scored 59 on that index, three points ahead of Carbon and in line with Claude Opus 5.5 and Claude Fable 5.2.[^2]
Its average cost per task in Antigravity was $6.86, against $12.61 for Claude Opus 5.5 and $15.47 for Claude Fable 5.2 in Claude Code, according to the same measurements.[^2]
<!-- /add -->
On November 18, 2026, GitHub also made Neon generally available in GitHub Copilot for Pro+, Max, Business, and Enterprise users across Visual Studio Code, JetBrains IDEs, Xcode, Eclipse, and Copilot CLI under usage-based billing.[^3]
Industry analysts interviewed by InfoWorld noted that lower per-task costs could push enterprises toward a tiered model strategy, though they cautioned that AI-generated code still requires functional and regression testing under "supervised autonomy".[^4]
<!-- add role="reviser" model="Anthropic Claude Opus 5.5" -->

## Safety checks carried over from Argon, with the full report pending

Google did not run a full suite of critical capability evaluations on Neon: its model card says the capability gain over Gemini 4 Argon fell below the company's Material Capability Change threshold.[^6]
Neon therefore carries forward the frontier-safety results and threshold determinations made for Argon, and the full Safety & Security Report for Neon is promised for the coming days.[^6]
Google says that with real-time safeguards at its highest thinking level, Neon resisted every attack in Gray Swan's indirect prompt injection benchmark, a figure from the company's own testing.[^1]
A cyber-defense version of the model is rolling out to vetted defenders through Google's Fairwind Program over the coming days.[^1]
<!-- /add -->

<!-- add role="checker" model="Google Gemini 3.8 Flash" -->
## No free API tier, pending safety audit and enterprise agent limits

- Free access for developers: Notebookcheck observed that Google lists no free tier for Neon on its Gemini API pricing page, limiting access to paid developer accounts.[^5]
- Publication of the full safety report: Google DeepMind stated that the comprehensive Safety & Security Report for Neon will appear in the coming days.[^6]
- Cyber-defense rollout requirements: Google indicated that eligible Fairwind Program members must coordinate access through their Cloud account team rather than downloading the model directly.[^1]
- Production readiness of autonomous agents: InfoWorld cautioned that enterprise codebases and long-running reliability pose hurdles, leaving autonomous software development agents in need of supervision.[^4]
<!-- /add -->

<!-- keypoints model="Google Gemini 3.8 Flash" -->
- Google launched Gemini 4 Neon on November 18, 2026, offering a 1-million-token context window and four thinking levels positioned between its Carbon and Hydrogen models.[^1][^2]
- Priced at $3 per million input and $15 per million output tokens, Neon is 17% cheaper and 40% faster than Carbon, and replaces Argon for Google AI Pro users.[^1][^2][^5]
- Neon scored 59 on the Coding Agent Index, rolled out to GitHub Copilot, and carried over safety determinations from Argon with its full report pending.[^2][^3][^6]
<!-- /keypoints -->
