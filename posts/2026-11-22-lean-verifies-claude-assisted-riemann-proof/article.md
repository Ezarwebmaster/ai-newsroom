---
title: "Lean and Mathlib communities certify Alpöge's Claude-assisted Riemann proof"
dek: "Independent checks match the proof to Mathlib's Riemann hypothesis statement. Explaining the argument to mathematicians remains a separate task."
---

The Lean and Mathlib communities certified on November 21, 2026 that Levent Alpöge's proof of the Riemann hypothesis is correct, following his release of a Claude-assisted Lean library on November 20, 2026.[^1][^2]
The joint statement is endorsed by the Lean FRO and Mathlib Initiative.[^1]
<!-- add role="reviser" model="Google Gemini 4 Hydrogen" -->
Alpöge, an Anthropic mathematician, said Claude helped develop the proof over about six weeks, and he published his note one day after Anthropic went public on Nasdaq.[^2][^6]
He described the release timing as "horrible" in his note, saying he would have finished earlier if he could have.[^2]
<!-- /add -->

## Matching the theorem, then checking the proof

The library comprises 17 million lines of code and depends directly only on Mathlib, according to the communities' November 21, 2026 statement.[^1]
They report that independent compilation reproduced the same exported proof and that separate comparison tools matched Alpöge's theorem to Mathlib's existing Riemann hypothesis definition.[^1]
Matching the statement rules out proving a different theorem.[^1]

Independent checkers accepted an inert proof export, insulated from hypothetical malicious source code.[^1]
<!-- add role="reviser" model="Google Gemini 4 Hydrogen" -->
Two of those checkers, con-leche and con-ron, carry formal proofs relative to set theory that they cannot accept a false proof, addressing concerns about potential flaws in Lean's own logic.[^1]
<!-- /add -->

MIT mathematician Andrew Sutherland's verification page, updated on November 22, 2026, reports successful compilation of all 175,187 modules and only the three standard Lean axioms for the five headline theorems.[^3]
His results distinguish completed checks from additional Lean-kernel export replays still running.
<!-- add role="reviser" model="Google Gemini 4 Hydrogen" -->
Sutherland, whose checks were run with Claude Code, also reported that an independent sandboxed build reproduced the 61.6-gigabyte export byte for byte and that the Rust kernel nanoda and lean4lean accepted the proof or compiled modules.[^3]
<!-- /add -->
The verified generalization concerns Dirichlet L-functions; it does not cover every broader family of L-functions.[^3]

## From a formal library to a mathematical explanation

Alpöge says he and Claude "formalized the arguments without assumptions" and describes a collaboration in which he guided the approach and Claude supplied mathematical advances.[^2]
He released Lean rather than a conventional exposition, acknowledging that he had not mastered a large mathematical neighborhood surrounding the argument.
<!-- add role="reviser" model="Google Gemini 4 Hydrogen" -->
Generating a text version of the formalized proof produced more than 250,000 pages, which he called an "unreadable document".[^2]
<!-- /add -->
He says he intends to understand, explain and simplify it.[^2]

University of Manchester mathematician Thomas Bloom told Le Monde that, if true, the result would be a major mathematical achievement, while cautioning that immediate practical applications would not follow.[^5]
<!-- add role="reviser" model="Google Gemini 4 Hydrogen" -->
The Guardian reported that some mathematicians have voiced discomfort with private AI companies spending millions on math problems, pointing to OpenAI's September 2026 claim that a non-public tool helped solve part of another Millennium Prize problem at a reported cost of $15 million.[^6]
<!-- /add -->

## Prime numbers and Clay's unchanged listing

The hypothesis concerns deviations from the average distribution of prime numbers.
Clay Mathematics Institute describes it as asserting that the non-obvious zeros of the zeta function have real part 1/2.[^4]
Its problem page still labels the hypothesis unsolved as of November 22, 2026.[^4]
<!-- add role="reviser" model="Google Gemini 4 Hydrogen" -->
The institute offers a $1 million prize for each problem, and its rules require publication in a qualifying outlet, a two-year waiting period and general acceptance in the global mathematics community before a solution is considered.[^6][^7]
<!-- /add -->
Alpöge's promised explanation remains a separate task from the formal verification.[^2][^3]
