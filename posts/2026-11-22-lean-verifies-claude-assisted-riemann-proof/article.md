---
title: "Lean and Mathlib communities certify Alpöge's Claude-assisted Riemann proof"
dek: "Independent checks match the proof to Mathlib's Riemann hypothesis statement. Explaining the argument to mathematicians remains a separate task."
---

The Lean and Mathlib communities certified on November 21, 2026 that Levent Alpöge's proof of the Riemann hypothesis is correct, following his release of a Claude-assisted Lean library on November 20, 2026.[^1][^2]
The joint statement is endorsed by the Lean FRO and Mathlib Initiative.[^1]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Alpöge, an Anthropic mathematician, says the proof took about six weeks with Claude and appeared one day after Anthropic's Nasdaq debut.[^6]
Calling the timing "horrible", Alpöge wrote that he reached the result on November 16, 2026 and consulted Anthropic leadership and trusted mathematicians before releasing it, while Anthropic had issued no official announcement as of November 20, 2026.[^2][^7]
<!-- /add -->

## Matching the theorem, then checking the proof

The library comprises 17 million lines of code and depends directly only on Mathlib, according to the communities' November 21, 2026 statement.[^1]
They report that independent compilation reproduced the same exported proof and that separate comparison tools matched Alpöge's theorem to Mathlib's existing Riemann hypothesis definition.[^1]
Matching the statement rules out proving a different theorem.[^1]

Independent checkers accepted an inert proof export, insulated from hypothetical malicious source code.[^1]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Verifiers used `comparator` and `con-leche --compare` to confirm the isolated theorem statement, and validated the export with Lean's kernel, third-party checkers, and the `con-leche` and `con-ron` kernels, which carry formal proofs relative to set theory that they cannot accept a false proof.[^1]
<!-- /add -->

MIT mathematician Andrew Sutherland's verification page, updated on November 22, 2026, reports successful compilation of all 175,187 modules and only the three standard Lean axioms for the five headline theorems.[^3]
His results distinguish completed checks from additional Lean-kernel export replays still running.
The verified generalization concerns Dirichlet L-functions; it does not cover every broader family of L-functions.[^3]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Sutherland also rebuilt the archive inside a sandbox on a separate machine, reproducing the export byte for byte as `nanoda`, `con-leche` and `con-ron` accepted the full proof and `lean4lean` verified every module.[^3]
As a check independent of Mathlib's zeta definition, he combined Alpöge's library with an independent formalization of Robin's and Lagarias's criteria to prove two unconditional divisor-sum inequalities without mentioning zeta.[^3]
<!-- /add -->

## From a formal library to a mathematical explanation

Alpöge says he and Claude "formalized the arguments without assumptions" and describes a collaboration in which he guided the approach and Claude supplied mathematical advances.[^2]
He released Lean rather than a conventional exposition, acknowledging that he had not mastered a large mathematical neighborhood surrounding the argument.
He says he intends to understand, explain and simplify it.[^2]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Because an AI-generated prose draft exceeded 250,000 pages, Alpöge withheld it and outlined an argument adapting Stepanov's function-field method by chaining automorphic theta lifts.[^2][^7][^8]
On November 22, 2026, Institut des Hautes Études Scientifiques postdoctoral fellow Robin Zhang published a preliminary guide drafted with GPT 6 Pro to trace the proof's number-theoretic lineage, cautioning that no human can swiftly verify prose against 17 million lines of Lean.[^8]
<!-- /add -->

University of Manchester mathematician Thomas Bloom told Le Monde that, if true, the result would be a major mathematical achievement, while cautioning that immediate practical applications would not follow.[^5]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Jean Monnet University number theorist Filippo A. E. Nuccio wrote that the archive spans the past 50 years of number theory, whereas New York University mathematician Maksym Radziwiłł told Quanta Magazine that symbol manipulation in Lean short-circuits understanding without answering why the theorem holds.[^7]
On November 20, 2026, American Mathematical Society president Ravi Vakil also uploaded a 940-page draft proof of the generalized Riemann hypothesis developed without AI by Stanford postdoctoral scholar Alessandro Masullo.[^6][^7][^8]
<!-- /add -->

## Prime numbers and Clay's unchanged listing

The hypothesis concerns deviations from the average distribution of prime numbers.
Clay Mathematics Institute describes it as asserting that the non-obvious zeros of the zeta function have real part 1/2.[^4]
Its problem page still labels the hypothesis unsolved as of November 22, 2026.[^4]
<!-- add role="reviser" model="Google Gemini 4 Argon" -->
Formulated by Bernhard Riemann in 1859 and selected in 2000 among Clay's seven $1 million Millennium Prize Problems, the conjecture had previously been checked for the first 10,000,000,000,000 solutions.[^4][^6]
<!-- /add -->
Alpöge's promised explanation remains a separate task from the formal verification.[^2][^3]
