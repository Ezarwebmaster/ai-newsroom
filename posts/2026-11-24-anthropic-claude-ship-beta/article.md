---
title: "Anthropic launches Claude Ship in beta to review, fix and approve GitHub pull requests"
dek: "The suite combines Anthropic's Code Review tool with two beta agents, PR Steward and Claude Approvals, letting Team and Enterprise repositories delegate routine pull request fixes and merge sign-offs under team-written policies."
---

Targeting the review backlog left behind when coding agents write software faster than engineers can check it, Anthropic launched Claude Ship in beta on November 23, 2026 for GitHub repositories on Claude Team and Enterprise plans.[^1][^5]
The suite pairs Anthropic's generally available Code Review tool, released in March 2026, with two beta agents—PR Steward and Claude Approvals—that push automated fixes and approve routine pull requests when a repository's policy allows.[^1][^4]
Newly public Anthropic said Claude already writes most code on its Claude Code team, stating that the goal is to "ship code as fast as teams write it."[^1][^5]

## Three agents across review, CI fixes and approval policies

Code Review inspects pull requests against surrounding code at Quick, Standard or Deep settings, adversarially verifies findings and posts severity-ranked inline comments.[^1][^2]
PR Steward responds to failing continuous integration checks, merge conflicts and comments from reviewers or bots by pushing commits and explaining how to undo each push, though it cannot approve or merge pull requests.[^1][^2]
Developers can steer or halt PR Steward on a pull request by commenting `@claude` or `@claude stop`.[^1]

Claude Approvals checks changes against `.claude/approvals.yml`, which Anthropic compares to "a smarter CODEOWNERS file" combining path rules, Code Review findings and natural-language classifiers to approve routine work or require human sign-off.[^1][^2]
Anthropic advises running Claude Approvals in observe-only mode before requiring its check under GitHub branch protection.[^1][^2]

## The /ship command, token billing and $10,000 credits

Developers can run a new `/ship` command in Claude Code or the desktop app to push a change, open a pull request and address feedback; an Anthropic representative told ZDNET that Pro, Max and Ultra subscribers can also use `/ship` under regular Claude Code usage.[^1][^4]
Administrators can instead enable Claude Ship across selected repositories automatically and cap monthly spending on Code Review and PR Steward.[^1]

On Team and Enterprise plans, usage is billed on tokens separately from plan allowances; Claude Approvals has no base fee, but classifiers consume tokens and policies using Code Review trigger billed reviews even in observe mode.[^1][^2]
Eligible Enterprise customers can claim at least $10,000 in promotional credits by January 15, 2027 for use within 30 days, while accounts with Zero Data Retention, HIPAA configurations or customer-managed encryption keys are excluded.[^1]

## Internal merge gains, pilots and shared blind-spot warnings

Anthropic said merged pull requests on its Claude Code team more than doubled from June to September 2026 while reverts fell by over 40%, without specifying how much came from AI code review alone.[^1][^3]
At pilot user Carvana, senior vice president Alex Devkar said teams tailored PR Steward to suggest changes and organize review feedback.[^1][^6]

Gartner analyst Nitish Tyagi told InfoWorld that "AI models are inherently non-deterministic, which makes them unsuitable as the sole quality gate," while IDC's Deepika Giri warned that coding and review models could share blind spots and noted GitHub and GitLab's tighter platform integration.[^3]
ZDNET's David Gewirtz added that automating routine pull request chores could speed fixes while removing tasks where junior developers build experience.[^4]
