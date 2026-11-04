# M03-08 public source and editorial review

Reviewed: 2026-11-04 (Asia/Taipei). Stable concept M03-08, route unit CEH26-M03-C08, row 29 of the adopted 161-unit teaching design. The number is a curriculum design, not an official fixed exam count.

## Scope

Main question: how do network protection, scan observations, alerts and blocking evidence relate? Complete bilingual teaching uses one original building analogy and a synthetic tabletop case. No network commands were run and no real targets, personal identifiers or private learner records are published. Reference answers are separate teaching material; actual Q&A is empty.

## Sources actually read

- Nmap Port Scanning Basics: https://nmap.org/book/man-port-scanning-basics.html . Port states describe an observation under a method and viewpoint, not an intrinsic universal property.
- Nmap Determining Firewall Rules: https://nmap.org/book/determining-firewall-rules.html . An intermediate device can reject with RST; a returned reset must not be over-attributed to the service.
- NIST SP 800-41 Rev.1: https://csrc.nist.gov/pubs/sp/800/41/r1/final . September 2009; firewall policy principles, not a contemporary product configuration recipe.
- NIST SP 800-94: https://csrc.nist.gov/pubs/sp/800/94/final and https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-94.pdf . February 2007 final; later 2012 revision draft retired, as indicated by the 2022 planning note. Foundational IDS/IPS distinctions and visibility limitations.
- Suricata Rules Format: https://docs.suricata.io/en/latest/rules/intro.html . Page explicitly labels 9.0.0-dev; example action meanings, not a claim about any installed system.
- Suricata Thresholding Keywords: https://docs.suricata.io/en/latest/rules/thresholding.html . Same development-documentation caveat; notification frequency and action semantics need separate review. No evasion recipes or rule deployment supplied.

One attempted Suricata IPS-inline URL was unavailable and is not cited as read. Nmap historical IDS chapter was inspected for context but its legacy product examples and evasion instructions are not adopted.

## Review mapping

- WRITE-01/02/03: one question, plain Taiwan Chinese, first-use terminology, positive evidence workflow, observations separate from inferences.
- WRITE-04/05: sources dated and version-bounded; paired times 09:00/09:02, TCP8443, FW-17, four questions and four answers match across languages. All case values synthetic.
- WRITE-06/07: intended first edition 1.0.0 with actual publication date; no personal learning state or fixed AI byline.
- HTML/FIG/A11Y: source manuscript is full text; implementation and browser results must be recorded by the website publication receipt. No test is claimed completed by this editorial review.
- Two useful figures: parallel role cards (firewall/IDS/IPS, not an obligatory network chain), and the evidence-review sequence (an investigative order, not a packet path). Use existing constrained cards/flow and reviewed deterministic SVG exports.
- INT-01: not applicable; no interactive calculator required for this lesson.

Formal publication remains distinct from source preparation and successful tests. Record exact production commit, deployment run, bilingual URLs and actual checks after deployment.
