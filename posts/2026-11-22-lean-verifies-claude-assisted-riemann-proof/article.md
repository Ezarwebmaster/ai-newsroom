---
title: "Lean and Mathlib communities certify Alpöge's Claude-assisted Riemann proof"
dek: "Independent checks match the proof to Mathlib's Riemann hypothesis statement. Explaining the argument to mathematicians remains a separate task."
---

The Lean and Mathlib communities certified on November 21, 2026 that Levent Alpöge's proof of the Riemann hypothesis is correct, following his release of a Claude-assisted Lean library on November 20, 2026.[^1][^2]
The joint statement is endorsed by the Lean FRO and Mathlib Initiative.[^1]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
Alpöge, a mathematician at Anthropic, called the timing "horrible" in his accompanying note, after messaging Anthropic CEO Dario Amodei about announcing the result as the company prepared for its stock market debut.[^2][^7][^8]
Anthropic did not respond to an Associated Press email requesting comment on Alpöge's claim.[^8]
<!-- /add -->

## Matching the theorem, then checking the proof

The library comprises 17 million lines of code and depends directly only on Mathlib, according to the communities' November 21, 2026 statement.[^1]
They report that independent compilation reproduced the same exported proof and that separate comparison tools matched Alpöge's theorem to Mathlib's existing Riemann hypothesis definition.[^1]
Matching the statement rules out proving a different theorem.[^1]

Independent checkers accepted an inert proof export, insulated from hypothetical malicious source code.[^1]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
Two of those checkers, `con-leche` and `con-ron`, carry formal proofs relative to set theory that they cannot accept a false proof, addressing concerns that flaws in Lean's own logic could be exploited.[^1]
<!-- /add -->

MIT mathematician Andrew Sutherland's verification page, updated on November 22, 2026, reports successful compilation of all 175,187 modules and only the three standard Lean axioms for the five headline theorems.[^3]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
Every module has been replayed through the Lean kernel, the independent kernels `nanoda` and `con-leche` accept the full exported proof, and `lean4lean` accepts every compiled module.[^3]
<!-- /add -->
His results distinguish completed checks from additional Lean-kernel export replays still running.
The verified generalization concerns Dirichlet L-functions; it does not cover every broader family of L-functions.[^3]

## From a formal library to a mathematical explanation

Alpöge says he and Claude "formalized the arguments without assumptions" and describes a collaboration in which he guided the approach and Claude supplied mathematical advances.[^2]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
The Guardian reported that the collaboration with Claude took about six weeks, and Alpöge wrote that "Claude far outpaced me near the finish line".[^2][^7]
<!-- /add -->
He released Lean rather than a conventional exposition, acknowledging that he had not mastered a large mathematical neighborhood surrounding the argument.
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
He noted in a footnote that an informal write-up hit "250,000+ pages".[^2]
<!-- /add -->
He says he intends to understand, explain and simplify it.[^2]

University of Manchester mathematician Thomas Bloom told Le Monde that, if true, the result would be a major mathematical achievement, while cautioning that immediate practical applications would not follow.[^5]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
Rutgers University mathematics chair Alex Kontorovich told the Associated Press that findings buried in that code would traditionally be published in a formal paper.[^8]
<!-- /add -->

## Prime numbers and Clay's unchanged listing

The hypothesis concerns deviations from the average distribution of prime numbers.
Clay Mathematics Institute describes it as asserting that the non-obvious zeros of the zeta function have real part 1/2.[^4]
Its problem page still labels the hypothesis unsolved as of November 22, 2026.[^4]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
Under the institute's Millennium Prize rules, which allocate $1 million to each problem, it does not accept direct submissions.[^6]
Before the institute considers a proposed solution, it must appear in a qualifying outlet, wait at least two years after publication and gain general acceptance in the global mathematics community.[^6]
<!-- /add -->
Alpöge's promised explanation remains a separate task from the formal verification.[^2][^3]
