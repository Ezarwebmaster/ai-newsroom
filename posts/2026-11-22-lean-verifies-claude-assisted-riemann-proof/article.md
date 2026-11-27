---
title: "Lean and Mathlib communities certify Alpöge's Claude-assisted Riemann proof"
dek: "Independent checks match the proof to Mathlib's Riemann hypothesis statement. Explaining the argument to mathematicians remains a separate task."
---

The Lean and Mathlib communities certified on November 21, 2026 that Levent Alpöge's proof of the Riemann hypothesis is correct, following his release of a Claude-assisted Lean library on November 20, 2026.[^1][^2]
The joint statement is endorsed by the Lean FRO and Mathlib Initiative.[^1]

## Matching the theorem, then checking the proof

The library comprises 17 million lines of code and depends directly only on Mathlib, according to the communities' November 21, 2026 statement.[^1]
They report that independent compilation reproduced the same exported proof and that separate comparison tools matched Alpöge's theorem to Mathlib's existing Riemann hypothesis definition.[^1]
Matching the statement rules out proving a different theorem.[^1]

Independent checkers accepted an inert proof export, insulated from hypothetical malicious source code.[^1]
<!-- add role="reviser" model="Anthropic Claude Sonnet 5.5" -->
The statement adds that the checkers con-leche and con-ron come with a formal proof, relative to set theory, that they cannot accept a false proof, addressing concerns that Lean's logic itself might be flawed.[^1]
<!-- /add -->

MIT mathematician Andrew Sutherland's verification page, last updated on November 25, 2026, reports successful compilation of all 175,187 modules and only the three standard Lean axioms for the five headline theorems.[^3]
His page now says all checks have finished, including single-threaded Lean-kernel replays of the full export.[^3]
The verified generalization concerns Dirichlet L-functions; it does not cover every broader family of L-functions.[^3]
<!-- add role="reviser" model="Anthropic Claude Sonnet 5.5" -->
Sutherland notes that his checks were run with Claude Code.[^3]
He reports that Lean's own kernel accepts the full export and that Comparator, the statement-matching tool, reports success on the challenge file.[^3]
A shorter Lean proof was published on November 25, 2026, and its checks are recorded on a separate page that this story has not reviewed.[^3]
<!-- /add -->

## From a formal library to a mathematical explanation

Alpöge says he and Claude "formalized the arguments without assumptions" and describes a collaboration in which he guided the approach and Claude supplied mathematical advances.[^2]
He released Lean rather than a conventional exposition, acknowledging that he had not mastered a large mathematical neighborhood surrounding the argument.
He says he intends to understand, explain and simplify it.[^2]
<!-- add role="reviser" model="Anthropic Claude Sonnet 5.5" -->
The Lean and Mathlib statement likewise says it looks forward to activity in the mathematical community that will help explain the new ideas in the proof.[^1]
<!-- /add -->

University of Manchester mathematician Thomas Bloom told Le Monde that, if true, the result would be a major mathematical achievement, while cautioning that immediate practical applications would not follow.[^5]

## Prime numbers and Clay's unchanged listing

The hypothesis concerns deviations from the average distribution of prime numbers.
Clay Mathematics Institute describes it as asserting that the non-obvious zeros of the zeta function have real part 1/2.[^4]
Its problem page still labels the hypothesis unsolved as of November 22, 2026.[^4]
Alpöge's promised explanation remains a separate task from the formal verification.[^2][^3]
