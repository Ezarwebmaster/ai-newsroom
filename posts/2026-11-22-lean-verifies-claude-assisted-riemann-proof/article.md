---
title: "Lean and Mathlib communities certify Alpöge's Claude-assisted Riemann proof"
dek: "Independent checks match the proof to Mathlib's Riemann hypothesis statement. Explaining the argument to mathematicians remains a separate task."
---

The Lean and Mathlib communities certified on November 21, 2026 that Levent Alpöge's proof of the Riemann hypothesis is correct, following his release of a Claude-assisted Lean library on November 20, 2026.[^1][^2]
The joint statement is endorsed by the Lean FRO and Mathlib Initiative.[^1]
<!-- add role="reviser" model="OpenAI GPT-6 Astra" -->
Alpöge works at Anthropic, the company behind Claude, so the author is also an employee of the system's developer.[^5]
<!-- /add -->

## Matching the theorem, then checking the proof

The library comprises 17 million lines of code and depends directly only on Mathlib, according to the communities' November 21, 2026 statement.[^1]
They report that independent compilation reproduced the same exported proof and that separate comparison tools matched Alpöge's theorem to Mathlib's existing Riemann hypothesis definition.[^1]
Matching the statement rules out proving a different theorem.[^1]

Independent checkers accepted an inert proof export, insulated from hypothetical malicious source code.[^1]

MIT mathematician Andrew Sutherland's verification page, updated on November 22, 2026, reports successful compilation of all 175,187 modules and only the three standard Lean axioms for the five headline theorems.[^3]
<!-- add role="reviser" model="OpenAI GPT-6 Astra" -->
Sutherland also reports that Lean's kernel accepted every compiled module and that independently written kernels, nanoda and con-leche, accepted the full exported proof.[^3]
<!-- /add -->
His results distinguish completed checks from additional Lean-kernel export replays still running.
<!-- add role="reviser" model="OpenAI GPT-6 Astra" -->
The outstanding export replays repeat verification on a different representation of the proof; the module-by-module checks have already passed.[^3]
<!-- /add -->
The verified generalization concerns Dirichlet L-functions; it does not cover every broader family of L-functions.[^3]
<!-- add role="reviser" model="OpenAI GPT-6 Astra" -->
In particular, Sutherland excludes Dedekind zeta functions, Hecke L-functions and automorphic L-functions generally from the statements checked.[^3]
<!-- /add -->

## From a formal library to a mathematical explanation

Alpöge says he and Claude "formalized the arguments without assumptions" and describes a collaboration in which he guided the approach and Claude supplied mathematical advances.[^2]
He released Lean rather than a conventional exposition, acknowledging that he had not mastered a large mathematical neighborhood surrounding the argument.
He says he intends to understand, explain and simplify it.[^2]

University of Manchester mathematician Thomas Bloom told Le Monde that, if true, the result would be a major mathematical achievement, while cautioning that immediate practical applications would not follow.[^5]

## Prime numbers and Clay's unchanged listing

The hypothesis concerns deviations from the average distribution of prime numbers.
Clay Mathematics Institute describes it as asserting that the non-obvious zeros of the zeta function have real part 1/2.[^4]
Its problem page still labels the hypothesis unsolved as of November 22, 2026.[^4]
<!-- add role="reviser" model="OpenAI GPT-6 Astra" -->
Clay's prize rules require publication in a qualifying outlet, at least two years after that publication, and general acceptance by the global mathematics community before it will consider a proposed solution.[^6]
Those requirements make prize consideration a separate process from the communities' certification, and the institute does not accept proposed solutions submitted directly to it.[^1][^6]
<!-- /add -->
Alpöge's promised explanation remains a separate task from the formal verification.[^2][^3]
