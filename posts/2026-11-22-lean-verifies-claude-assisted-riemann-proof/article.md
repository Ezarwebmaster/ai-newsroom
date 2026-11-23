---
title: "Lean and Mathlib communities certify Alpöge's Claude-assisted Riemann proof"
dek: "Independent checks match the proof to Mathlib's Riemann hypothesis statement. Explaining the argument to mathematicians remains a separate task."
---

The Lean and Mathlib communities certified on November 21, 2026 that Levent Alpöge's proof of the Riemann hypothesis is correct, following his release of a Claude-assisted Lean library on November 20, 2026.[^1][^2]
The joint statement is endorsed by the Lean FRO and Mathlib Initiative.[^1]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Alpöge, a mathematician at Anthropic, said he developed the solution with Claude over roughly six weeks and published his note and 14-part Lean archive one day after Anthropic went public on the Nasdaq stock market.[^2][^3][^6]
<!-- /add -->

## Matching the theorem, then checking the proof

The library comprises 17 million lines of code and depends directly only on Mathlib, according to the communities' November 21, 2026 statement.[^1]
They report that independent compilation reproduced the same exported proof and that separate comparison tools matched Alpöge's theorem to Mathlib's existing Riemann hypothesis definition.[^1]
Matching the statement rules out proving a different theorem.[^1]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
The community isolated Mathlib's theorem statement in a separate challenge file and checked it against Alpöge's theorem with two independent comparison tools, `comparator` and `con-leche --compare`.[^1][^3]
<!-- /add -->

Independent checkers accepted an inert proof export, insulated from hypothetical malicious source code.[^1]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Those checkers include Lean's official kernel along with `con-leche` and its Rust port `con-ron`, both of which carry a formal proof relative to set theory that they cannot accept a false proof.[^1][^3]
<!-- /add -->

MIT mathematician Andrew Sutherland's verification page, updated on November 23, 2026, reports successful compilation of all 175,187 modules and only the three standard Lean axioms for the five headline theorems.[^3]
His results distinguish completed checks from additional Lean-kernel export replays still running.
The verified generalization concerns Dirichlet L-functions; it does not cover every broader family of L-functions.[^3]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Sutherland's log shows that an offline bubblewrap-sandboxed rebuild reproduced the 61,570,595,788-byte unpacked proof export byte for byte, while the independent Rust kernel `nanoda` verified the export in 27 minutes 42 seconds on 80 threads and `con-leche` checked all 1,468,418 declarations in 3 minutes 15 seconds on 64 threads.[^3]
To test the result without relying on Mathlib's definition of the zeta function, Sutherland also combined the proof with an independent Lean formalization of Robin's and Lagarias's elementary divisor-sum criteria, verifying both inequalities with no mention of zeta.[^3]
He noted that Dedekind zeta functions, Hecke L-functions and general automorphic L-functions were not among the checked statements.[^3]
<!-- /add -->

## From a formal library to a mathematical explanation

Alpöge says he and Claude "formalized the arguments without assumptions" and describes a collaboration in which he guided the approach and Claude supplied mathematical advances.[^2]
He released Lean rather than a conventional exposition, acknowledging that he had not mastered a large mathematical neighborhood surrounding the argument.
He says he intends to understand, explain and simplify it.[^2]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
In his note, Alpöge describes the proof as a descendant of Stepanov's function-field argument that uses Fourier-analytic ideas to chain theta lifts in a natively automorphic manner so as to mimic multiplicity over the integers.[^2]
He wrote that while producing a huge, unreadable document from the finished formalization is routine, he viewed the formal library as a first step before writing a proper mathematical exposition.[^2]
<!-- /add -->

University of Manchester mathematician Thomas Bloom told Le Monde that, if true, the result would be a major mathematical achievement, while cautioning that immediate practical applications would not follow.[^5]

## Prime numbers and Clay's unchanged listing

The hypothesis concerns deviations from the average distribution of prime numbers.
Clay Mathematics Institute describes it as asserting that the non-obvious zeros of the zeta function have real part 1/2.[^4]
Its problem page still lists the problem as active and notes that a proof "would shed light" on prime distribution.[^4]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Formulated by Bernhard Riemann in 1859 and checked computationally for the first 10,000,000,000,000 solutions, the conjecture is one of the seven Millennium Prize Problems selected in 2000 by the Clay Mathematics Institute, which offers $1m for a solution.[^4][^6]
<!-- /add -->
Alpöge's promised explanation remains a separate task from the formal verification.[^2][^3]
