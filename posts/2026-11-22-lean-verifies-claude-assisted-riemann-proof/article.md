---
title: "Lean and Mathlib communities certify Alpöge's Claude-assisted Riemann proof"
dek: "Independent checks match the proof to Mathlib's Riemann hypothesis statement. Explaining the argument to mathematicians remains a separate task."
---

The Lean and Mathlib communities certified on November 21, 2026 that Levent Alpöge's proof of the Riemann hypothesis is correct, following his release of a Claude-assisted Lean library on November 20, 2026.[^1][^2][^6]
The joint statement is endorsed by the Lean FRO and Mathlib Initiative.[^1]

## Matching the theorem, then checking the proof

The library comprises 17 million lines of code and depends directly only on Mathlib, according to the communities' November 21, 2026 statement.[^1]
They report that independent compilation reproduced the same exported proof and that separate comparison tools matched Alpöge's theorem to Mathlib's existing Riemann hypothesis definition.[^1]
Matching the statement rules out proving a different theorem.[^1]

Independent checkers accepted an inert proof export, insulated from hypothetical malicious source code.[^1]
<!-- add role="reviser" model="Google Gemini 3.8 Flash" -->
Verification tools included the independent kernels nanoda and con-leche as well as lean4lean.[^1][^3]
Sutherland confirmed that an independent sandboxed lake build in bubblewrap reproduced the 61-gigabyte export byte for byte.[^3]
<!-- /add -->

MIT mathematician Andrew Sutherland's verification page, updated on November 22, 2026, reports successful compilation of all 175,187 modules and only the three standard Lean axioms for the five headline theorems.[^3]
His results distinguish completed checks from additional Lean-kernel export replays still running.
The verified generalization concerns Dirichlet L-functions; it does not cover every broader family of L-functions.[^3]

## From a formal library to a mathematical explanation

Alpöge says he and Claude "formalized the arguments without assumptions" and describes a collaboration in which he guided the approach and Claude supplied mathematical advances.[^2]
He released Lean rather than a conventional exposition, acknowledging that he had not mastered a large mathematical neighborhood surrounding the argument.
He says he intends to understand, explain and simplify it.[^2]
<!-- add role="reviser" model="Google Gemini 3.8 Flash" -->
Alpöge published the formalization on November 20, 2026 after working with Claude over six weeks, reaching the generalized theorem on November 16, 2026.[^2][^6]
Fourier-analytic ideas led them to chain theta lifts in a natively automorphic manner to mimic multiplicity.[^2]
Anthropic had priced its initial public offering on November 19, 2026, leading Alpöge to remark that the announcement timing looked horrible.[^2][^6]
<!-- /add -->

University of Manchester mathematician Thomas Bloom told Le Monde that, if true, the result would be a major mathematical achievement, while cautioning that immediate practical applications would not follow.[^5]

## Prime numbers and Clay's unchanged listing

The hypothesis concerns deviations from the average distribution of prime numbers.
Clay Mathematics Institute describes it as asserting that the non-obvious zeros of the zeta function have real part 1/2.[^4]
Its problem page still labels the hypothesis unsolved as of November 22, 2026.[^4]
<!-- add role="reviser" model="Google Gemini 3.8 Flash" -->
The institute has recorded numerical verification of the conjecture across the first 10 trillion solutions.[^4]
The Riemann hypothesis remains one of seven Millennium prize problems selected in 2000 with a $1 million award.[^4][^6]
<!-- /add -->
Alpöge's promised explanation remains a separate task from the formal verification.[^2][^3]
