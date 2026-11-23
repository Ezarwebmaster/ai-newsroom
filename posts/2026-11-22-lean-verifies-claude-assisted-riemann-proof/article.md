---
title: "Lean and Mathlib communities certify Alpöge's Claude-assisted Riemann proof"
dek: "Independent checks match the proof to Mathlib's Riemann hypothesis statement. Explaining the argument to mathematicians remains a separate task."
---

The Lean and Mathlib communities certified on November 21, 2026 that Levent Alpöge's proof of the Riemann hypothesis is correct, following his release of a Claude-assisted Lean library on November 20, 2026.[^1][^2]
The joint statement is endorsed by the Lean FRO and Mathlib Initiative.[^1]
<!-- add role="reviser" model="Google Gemini 4 Hydrogen" -->
Alpöge, a mathematician at Anthropic, said Claude helped develop the solution over about six weeks, and he published his note one day after Anthropic went public on Nasdaq.[^6]
<!-- /add -->

## Matching the theorem, then checking the proof

The library comprises 17 million lines of code and depends directly only on Mathlib, according to the communities' November 21, 2026 statement.[^1]
They report that independent compilation reproduced the same exported proof and that separate comparison tools matched Alpöge's theorem to Mathlib's existing Riemann hypothesis definition.[^1]
Matching the statement rules out proving a different theorem.[^1]
<!-- add role="reviser" model="Google Gemini 4 Hydrogen" -->
The communities verified the proof against four criteria outlined by mathematician Kevin Buzzard on November 12, 2026 to test AI-generated Lean code for mis-stated theorems, reward hacking or soundness bugs.[^1][^7]
<!-- /add -->

Independent checkers accepted an inert proof export, insulated from hypothetical malicious source code.[^1]
<!-- add role="reviser" model="Google Gemini 4 Hydrogen" -->
Two of those checkers, `con-leche` and `con-ron`, carry formal proofs relative to set theory that they cannot accept a false proof, addressing concerns that a flaw in Lean's logic could be exploited.[^1]
<!-- /add -->

MIT mathematician Andrew Sutherland's verification page, updated on November 22, 2026, reports successful compilation of all 175,187 modules and only the three standard Lean axioms for the five headline theorems.[^3]
<!-- add role="reviser" model="Google Gemini 4 Hydrogen" -->
Independent kernels `nanoda` and `con-leche` accepted the full exported proof, `lean4lean` accepted every compiled module, and a sandboxed build reproduced the archive's export byte for byte.[^3]
<!-- /add -->
His results distinguish completed checks from additional Lean-kernel export replays still running.
The verified generalization concerns Dirichlet L-functions; it does not cover every broader family of L-functions.[^3]
<!-- add role="reviser" model="Google Gemini 4 Hydrogen" -->
To test the result without relying on Mathlib's definition of the zeta function, Sutherland also combined the proof with an independent formalization of Robin's and Lagarias's divisor-sum inequalities, which passed `con-leche`, `con-ron` and `nanoda`.[^3]
<!-- /add -->

## From a formal library to a mathematical explanation

Alpöge says he and Claude "formalized the arguments without assumptions" and describes a collaboration in which he guided the approach and Claude supplied mathematical advances.[^2]
He released Lean rather than a conventional exposition, acknowledging that he had not mastered a large mathematical neighborhood surrounding the argument.
He says he intends to understand, explain and simplify it.[^2]
<!-- add role="reviser" model="Google Gemini 4 Hydrogen" -->
Alpöge also wrote that he expects his method to reach the Extended Riemann Hypothesis with more time, while calling the post-IPO timing "horrible" and rejecting any cynical reading of it.[^2]
Other mathematicians have expressed discomfort with relying on AI systems to solve major mathematical problems, The Guardian reported.[^6]
<!-- /add -->

University of Manchester mathematician Thomas Bloom told Le Monde that, if true, the result would be a major mathematical achievement, while cautioning that immediate practical applications would not follow.[^5]

## Prime numbers and Clay's unchanged listing

The hypothesis concerns deviations from the average distribution of prime numbers.
Clay Mathematics Institute describes it as asserting that the non-obvious zeros of the zeta function have real part 1/2.[^4]
<!-- add role="reviser" model="Google Gemini 4 Hydrogen" -->
Proposed by Bernhard Riemann in 1859, the problem is one of seven Millennium Prize problems selected by the Clay Mathematics Institute in 2000, each carrying a $1 million prize.[^6]
<!-- /add -->
Its problem page still labels the hypothesis unsolved as of November 22, 2026.[^4]
Alpöge's promised explanation remains a separate task from the formal verification.[^2][^3]
