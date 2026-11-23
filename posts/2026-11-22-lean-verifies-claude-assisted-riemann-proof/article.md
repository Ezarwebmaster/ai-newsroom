---
title: "Lean and Mathlib communities certify Alpöge's Claude-assisted Riemann proof"
dek: "Independent checks match the proof to Mathlib's Riemann hypothesis statement. Explaining the argument to mathematicians remains a separate task."
---

The Lean and Mathlib communities certified on November 21, 2026 that Levent Alpöge's proof of the Riemann hypothesis is correct, following his release of a Claude-assisted Lean library on November 20, 2026.[^1][^2]
The joint statement is endorsed by the Lean FRO and Mathlib Initiative.[^1]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
Alpöge, a mathematician at Anthropic, said Claude helped develop the solution over about six weeks.[^6]
The release came one day after Anthropic went public on Nasdaq, timing Alpöge called "horrible" in his note.[^2][^6]
<!-- /add -->

## Matching the theorem, then checking the proof

The library comprises 17 million lines of code and depends directly only on Mathlib, according to the communities' November 21, 2026 statement.[^1]
They report that independent compilation reproduced the same exported proof and that separate comparison tools matched Alpöge's theorem to Mathlib's existing Riemann hypothesis definition.[^1]
Matching the statement rules out proving a different theorem.[^1]

Independent checkers accepted an inert proof export, insulated from hypothetical malicious source code.[^1]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
The communities noted that the `con-leche` and `con-ron` checkers carry a formal proof, relative to set theory, that they cannot accept a false proof, addressing concerns about potential flaws in Lean's own logic.[^1]
<!-- /add -->

MIT mathematician Andrew Sutherland's verification page, updated on November 22, 2026, reports successful compilation of all 175,187 modules and only the three standard Lean axioms for the five headline theorems.[^3]
His results distinguish completed checks from additional Lean-kernel export replays still running.
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
As a check independent of Mathlib's zeta-function definition, Sutherland also combined the proof with an existing Lean formalization of Robin's and Lagarias's inequalities, verifying two divisor-sum consequences.[^3]
<!-- /add -->
The verified generalization concerns Dirichlet L-functions; it does not cover every broader family of L-functions.[^3]

## From a formal library to a mathematical explanation

Alpöge says he and Claude "formalized the arguments without assumptions" and describes a collaboration in which he guided the approach and Claude supplied mathematical advances.[^2]
He released Lean rather than a conventional exposition, acknowledging that he had not mastered a large mathematical neighborhood surrounding the argument.
He says he intends to understand, explain and simplify it.[^2]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
In his note, Alpöge described the argument as a descendant of Stepanov's function-field method in which Claude suggested chaining theta lifts to mimic multiplicity over the integers.[^2]
<!-- /add -->

University of Manchester mathematician Thomas Bloom told Le Monde that, if true, the result would be a major mathematical achievement, while cautioning that immediate practical applications would not follow.[^5]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
Mathematician Terence Tao wrote on November 20, 2026 that initial analysis suggests the proof draws on modern developments in the Langlands program and arithmetic geometry, adding that "the digestion process will take some time".[^7]
The Guardian also reported unease among mathematicians over lucrative private companies spending millions of dollars on AI systems to solve major problems.[^6]
<!-- /add -->

## Prime numbers and Clay's unchanged listing

The hypothesis concerns deviations from the average distribution of prime numbers.
Clay Mathematics Institute describes it as asserting that the non-obvious zeros of the zeta function have real part 1/2.[^4]
Its problem page still labels the hypothesis unsolved as of November 22, 2026.[^4]
<!-- add role="reviser" model="Google Gemini 4 Neon" -->
The Riemann hypothesis is one of seven Millennium Prize Problems carrying a $1 million award, and Clay does not accept direct submissions.[^6][^8]
Under the institute's rules, a proposed solution must be published in a qualifying outlet, stand for at least two years after publication and win general acceptance in the global mathematics community before consideration.[^8]
<!-- /add -->
Alpöge's promised explanation remains a separate task from the formal verification.[^2][^3]
