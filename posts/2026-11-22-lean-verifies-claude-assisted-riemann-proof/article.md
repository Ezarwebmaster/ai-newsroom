---
title: "Lean and Mathlib communities certify Alpöge's Claude-assisted Riemann proof"
dek: "Independent checks match the proof to Mathlib's Riemann hypothesis statement. Explaining the argument to mathematicians remains a separate task."
---

The Lean and Mathlib communities certified on November 21, 2026 that Levent Alpöge's proof of the Riemann hypothesis is correct, following his release of a Claude-assisted Lean library on November 20, 2026.[^1][^2]
The joint statement is endorsed by the Lean FRO and Mathlib Initiative.[^1]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Alpöge, a mathematician at Anthropic, worked with Claude for about six weeks and published his note one day after Anthropic's Nasdaq debut, calling the timing "horrible".[^2][^6]
<!-- /add -->

## Matching the theorem, then checking the proof

The library comprises 17 million lines of code and depends directly only on Mathlib, according to the communities' November 21, 2026 statement.[^1]
They report that independent compilation reproduced the same exported proof and that separate comparison tools matched Alpöge's theorem to Mathlib's existing Riemann hypothesis definition.[^1]
Matching the statement rules out proving a different theorem.[^1]

Independent checkers accepted an inert proof export, insulated from hypothetical malicious source code.[^1]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Along with Lean's official kernel, independent proof checkers including `nanoda`, `con-leche`, and `con-ron` validated the exported proof, while `lean4lean` accepted every compiled module.[^1][^3]
<!-- /add -->

MIT mathematician Andrew Sutherland's verification page, updated on November 22, 2026, reports successful compilation of all 175,187 modules and only the three standard Lean axioms for the five headline theorems.[^3]
His results note that the lake comparator run and the Lean-kernel export replay are still in progress.[^3]
The verified generalization concerns Dirichlet L-functions; it does not cover every broader family of L-functions.[^3]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
An independent sandboxed build on a separate machine without network access reproduced the proof export byte for byte under Lean and Mathlib v4.33.1, and Sutherland notes that Dedekind zeta functions, Hecke L-functions, and general automorphic L-functions are not among the verified statements.[^3]
<!-- /add -->

## From a formal library to a mathematical explanation

Alpöge says he and Claude "formalized the arguments without assumptions" and describes a collaboration in which he guided the approach and Claude supplied mathematical advances.[^2]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
He describes the argument as a descendant of Stepanov's function-field proof that pairs Fourier-analytic ideas from a toy setting with chaining theta lifts to work automorphically over the integers, writing that "Claude far outpaced me near the finish line".[^2]
<!-- /add -->
He released Lean rather than a conventional exposition, acknowledging that he had not mastered a large mathematical neighborhood surrounding the argument.
He says he intends to understand, explain and simplify it.[^2]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
On November 21, 2026, University of Waterloo mathematician Michael Rubinstein published an independent verification on Waterloo servers and a 164-page working guide, drafted with Claude, Codex, and Gemini, that translates the Riemann zeta function proof into classical analytic number theory.[^7]
His draft deduces the hypothesis from two Dirichlet character estimates proved from existing literature and one weighted prime-sum inequality taken from the Lean development.[^7]
<!-- /add -->

University of Manchester mathematician Thomas Bloom told Le Monde that, if true, the result would be a major mathematical achievement, while cautioning that immediate practical applications would not follow.[^5]

## Prime numbers and Clay's unchanged listing

The hypothesis concerns deviations from the average distribution of prime numbers.
Clay Mathematics Institute describes it as asserting that the non-obvious zeros of the zeta function have real part 1/2.[^4]
Its problem page still labels the hypothesis unsolved as of November 22, 2026.[^4]
Alpöge's promised explanation remains a separate task from the formal verification.[^2][^3]
