# M09-03 | Demo and Acceptance Evidence: How Can You Prove Your Work Meets Requirements?

This lesson belongs to M09 of AASE, AI-Assisted Software Engineering. Its topic is Demo & Acceptance Evidence.

## 1. Start with one idea

Building something, making it look usable, and having evidence that it meets requirements are three separate achievements.

Imagine hiring a construction company to build a house.

The company shows you the finished work:

“Look, the house is finished, and it looks beautiful!”

But your actual concerns might include:

- Was it built according to the original plans?
- Do plumbing, electrical systems, fire protection, and earthquake resistance meet requirements?
- Will rain cause leaks?
- Were discovered defects repaired and checked again?
- Can another contractor understand the construction records when maintenance is needed?

A beautiful completion photograph cannot answer these questions on its own.

Software follows the same logic.

AI can quickly produce code, websites, and polished interfaces. Without test records, version information, and acceptance evidence, we still cannot determine whether the result meets requirements.

The core principle is:

> Whenever you claim that a feature is complete, identify its requirement, implementation, version, and the evidence used to confirm completion.

## 2. The overall structure: trace requirements to evidence

@figure1

This connection from requirements to acceptance is called requirements traceability.

The purpose is to let someone follow evidence and examine your commitments. More documentation alone does not establish that connection.

For example:

| Stage | Common software-development artifacts |
| --- | --- |
| Problem | `problem.md` |
| Interface design | `wireframe.svg` |
| Functional specification | `spec.md` |
| System architecture | `architecture.md` |
| Implementation | `app.py`, `rules.py` |
| Test evidence | `tests/`, actual execution records |
| Version and delivery | Git commit, `README.md` |

Use the same case across the documents and demonstration. If requirements describe case A, code demonstrates case B, and tests use case C, the links become difficult to trace.

## 3. Demonstrating an insurance-claim system

Suppose an insurer wants an AI document-checking system.

Staff upload claim documents. The system checks whether the information is complete and produces a review report.

There are three requirements:

“Incomplete information must not produce a complete report.”

“Complete information can produce a correct report.”

“If the user changes the information, the previous validation result must become invalid.”

Use one test claim to demonstrate three scenarios.

@figure2

The third scenario deserves particular attention.

Imagine a bank calculating a loan limit of five million, then continuing to use that result after the customer's income data changes.

Or a hospital generating medication guidance from one set of test values and continuing to display the old analysis after the values are updated.

This is a stale result. The interface may appear normal while its result no longer matches the current data.

That is why the demonstration includes normal, negative, and stale-result scenarios.

## 4. What counts as acceptance evidence?

Separate what you expect to succeed from what you have actually observed succeeding.

| What you present | What it can establish |
| --- | --- |
| Screenshot | What an interface looked like at a particular moment |
| Specification | What the system was intended to do |
| Git commit | What code a particular version contains |
| Automated test result | A specified version's result under specified conditions |
| Human operation record | How real users operated in the observed scenario |
| Another person successfully redeploying | Reproduction under the stated environment and instructions |

Keep the scope of the evidence explicit.

For example, a screenshot of successful login does not establish the security of the entire account-permission system. One successful test does not establish success for all inputs, loads, or deployment environments.

Evidence also needs context.

Suppose you announce during a demonstration: “All 30 of our tests passed.”

The reviewer should at least be able to identify the code version, execution environment, execution time, and actual results retained for those 30 tests.

This is why Git versions and test records belong together.

### Connect specifications and evidence with Given / When / Then

First express the insurance-claim rule as a scenario that is easy to compare with observations:

```text
Given: the claim is missing a required medical receipt
When: a staff member selects “Generate complete report”
Then: the system refuses to generate a complete report
And: the interface identifies the missing medical receipt
```

Then actually run a test and inspect whether the implementation meets those conditions.

Given / When / Then describes expectations. Test results record actual observations.

This scenario-based description follows the basic approach of Cucumber Gherkin. The colons above are explanatory prose formatting. Executable .feature files omit colons after Given / When / Then / And and require Feature, Scenario, and matching step definitions.

## 5. What if the demonstration fails?

Suppose all tests passed beforehand, but the AI system reports an error when you demonstrate it to management.

You may want to show yesterday's successful recording instead.

A recording can supplement the explanation, but it does not establish that today's demonstration succeeded.

Preserve the current error, identify the failed step, record the version and environment, and label yesterday's recording as historical evidence.

Two concepts help explain this:

Traceability: someone can locate the requirement, change, and test associated with a problem.

Reproducibility: someone can repeat the execution under the same necessary conditions and inspect the result.

For example, a logistics system may list deliveries successfully on your computer but fail on another machine. Evidence of cross-environment reproduction is still missing.

Failure records also provide information for diagnosis and improvement.

## 6. Passing acceptance does not establish production readiness

This is a key engineering judgment in this lesson.

Suppose a student project passes all functional tests on a personal computer. Can a hospital immediately let 100 employees use it?

That remains unproven.

The requirements of the two settings differ substantially.

| Teaching or local-prototype acceptance | Acceptance for an organizational production system |
| --- | --- |
| Basic functional correctness | Correct functions and business workflows |
| Successful local execution | Viable production deployment and operation |
| Correct handling of test data | Protection of real data and permissions |
| Successful individual operation | Reliability with concurrent users |
| Demonstrable work | Monitoring, backup, recovery, and security governance |

State the scope attached to an acceptance result.

For example:

“We accept this version as a local teaching prototype. Missing documents, completed documents, and result invalidation have been verified. Multiuser authorization, production data retention, and deployment security have not been verified.”

This gives the recipient a more useful engineering decision than an unqualified “system complete.”

The lesson distinguishes acceptance of a local prototype from formal review for organizational multiuser operation.

## 7. An acceptance template for practical work

Use the following record when handing over an AI Agent, medical tool, financial-reporting program, or simple website.

### Acceptance record

Example template: fill it using actual execution results.

```text
Feature or requirement
Incomplete required documents must prevent export of a complete report

Related specification
spec.md — AC-03

Code version
Git commit: enter the actual SHA

Verification scenarios
Missing documents, completed documents, changes to previously validated data

Verification evidence
Enter locations of test reports, operation records, and actual outputs

Unverified items
Multiuser permissions and production-deployment security

Acceptance scope
Local teaching prototype

Acceptance decision
Pending review
Conditionally accepted
Accepted within the specified scope
Rejected; correction required
```

Entering a test name or selecting “accepted” does not itself establish verification. Attach actual evidence and obtain review by the appropriate people.

## 8. What to take away

M09-03 teaches a traceable engineering evidence chain alongside demonstration practice.

Requirements describe your commitments, code represents the implementation, tests record what you observed, and acceptance decides the extent to which the current work can be accepted.

This reasoning applies beyond AI and software. Building inspections, pharmaceutical quality release, financial audits, legal evidence review, and factory acceptance also require independently examinable evidence that matches the claim being made.

## 9. Check your understanding

Suppose you build an AI recruiting system with resume upload, analysis, and ranking. During a live demonstration, it successfully ranks 10 resumes. A manager concludes: “The feature is complete. All HR staff can now use it in production.”

Answer the following:

Question 1: What does successfully producing those rankings establish? What important matters remain unproven?

Question 2: If a user modifies one resume after ranking, how should the system respond? How would you design an acceptance scenario?

Question 3: To move from a personal demonstration to an enterprise HR system, what three categories of acceptance evidence would you need at a minimum?

Explain the reasoning in ordinary language, then compare it with the reference explanations. Reading an answer does not establish assessment completion.
