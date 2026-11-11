# M03-05｜Success criteria, hypotheses and requirements records: how do we show that a system helps?

Building a feature does not establish that a problem has been solved. Even when a problem appears to improve, the improvement may have causes other than your system.

We need three abilities:

1. Define success criteria: what result would count as success?
2. Test hypotheses: what evidence supports our belief that a design helps?
3. Maintain requirements traceability: why was a design chosen, why was it changed, and has the result passed verification?

These abilities apply to software engineering, healthcare, finance, education, manufacturing, public administration, scientific research and business management.

This lesson uses examples across industries to explain success criteria, hypotheses, requirements records and practical verification methods.

## 1. How do we know whether something has improved?

Suppose patients at a hospital wait an average of 50 minutes between checking in and seeing a clinician.

The director wants to address this problem, so the IT department develops an AI registration and patient-routing system.

Three months later, the department reports:

“We completed 15 features, introduced AI, automated registration, and can process one record in two seconds.”

The director might reply:

“Good, but do patients still wait 50 minutes?”

That question is our starting point.

Faster system processing does not necessarily shorten patients’ waiting time. The actual bottleneck might be insufficient clinical staff or poor scheduling of examination rooms.

We therefore distinguish:

- Output: what did we build? For example, an AI registration feature.
- Outcome: did users’ circumstances improve? For example, shorter average waiting time.
- Impact: what value does that improvement create over time? For example, fewer delays and better healthcare service quality.

@figure1

A requirement states what the system should do; a hypothesis explains why doing it might help; a metric specifies how we intend to judge the effect. These are distinct concepts.

## 2. Functional success and user success are different questions

Start with two terms.

A functional metric asks whether the system operates correctly according to its requirements.

A task metric asks whether users can actually accomplish the work they set out to do.

For example, a bank introduces AI document recognition.

An engineer says: “Our recognition API returns data normally, and 99% of requests produce no system error.”

That is good news about functionality.

But a credit analyst might say: “I still spend a long time correcting recognition results, and now I have another checking step.”

A normally operating system does not necessarily improve work efficiency.

Compare several industries:

| Industry | Functional metric: does the system operate correctly? | Task metric: does it help people? |
| --- | --- | --- |
| Healthcare | Does AI read medical-record fields correctly? | Can staff complete correct records faster? |
| Logistics | Does the routing algorithm generate routes successfully? | Are goods delivered on time? |
| Education | Does AI generate practice questions successfully? | Do students actually learn to solve problems? |
| Manufacturing | Does defect detection identify defects correctly? | Can it reduce defective shipments without blocking too many good products? |
| Public administration | Does the system check application documents correctly? | Can people complete applications independently? |

Test both whether the program operates without errors and whether people can complete their work.

A third perspective is the guardrail metric.

A guardrail checks that improving one thing does not make another important thing worse.

For example:

A logistics company wants faster deliveries without more traffic accidents. A hospital wants shorter waits without more medical-record or patient-routing errors.

@figure2

Together, these perspectives help answer whether the system is worth adopting.

## 3. How do we calculate success? Start with the denominator

People often say: “Our system has a 90% success rate.”

That statement is less informative than it appears.

Ask: “Which cases produced that 90%? What counts as success? Were failures excluded?”

### Example: defect detection in a factory

Suppose a factory is trying an AI inspection device.

We prepare six test products: four genuinely defective products and two good products.

| Product | Actual condition | AI decision |
| --- | --- | --- |
| A | Defective | Block |
| B | Defective | Block |
| C | Defective | Block |
| D | Defective | Incorrectly release |
| E | Good | Release |
| F | Good | Release |

If the question is “What proportion of defective products were successfully blocked?”

The formula is:

Defect blocking rate = successfully blocked defective products / all defective products.

Here, 3/4 = 75%.

The denominator is the four defective products, not all six products.

### Try the calculation

Adjust the two counts below and observe how the reported performance changes.

@figure3

## Denominators, error costs and small-sample limits

This example introduces two important machine-learning concepts:

- False negative: a real problem exists, but the system fails to detect it.
- False positive: no problem exists, but the system incorrectly reports one.

In medical screening, a false negative can mean a disease goes undetected. In bank fraud detection, a false positive can mean a legitimate transaction is blocked.

The costs of errors differ across industries, so success metrics and acceptance criteria should reflect those differences.

Two other mistakes deserve attention.

First, if there are no defective test cases, the denominator is zero. Do not report a 100% blocking rate. Report “not measured”: this situation has not been tested.

Second, blocking all four defective products establishes that those four cases passed. It does not establish that the system’s true overall accuracy is necessarily 100%.

Passing acceptance checks on a small sample and demonstrating overall reliability support different levels of claim.

## 4. Why does faster processing not necessarily mean more efficient work?

Consider the entire workflow.

Suppose a law firm wants AI to help organize case materials.

A lawyer previously spent 30 minutes organizing one document. With AI, the system generates a summary in just 5 minutes.

The software company claims: “Work efficiency has increased sixfold.”

Further observation shows that the lawyer also needs 20 minutes to verify the AI summary.

The comparison is:

| Work stage | Previous workflow | AI workflow |
| --- | --- | --- |
| Organizing material and producing the summary | 30 minutes | 5 minutes |
| Checking and correction | Included in the original workflow | 20 minutes |
| Total time | 30 minutes | 25 minutes |

These are illustrative numbers. The actual time saving is only 5 minutes, about 16.7%; they do not show a sixfold improvement in overall efficiency.

We also do not yet know whether AI increases the risk of errors.

### What is a baseline?

A baseline describes the situation before an improvement.

For example, the previous average of 30 minutes can provide a baseline, provided both measurements cover the same work.

The UK government’s service performance guidance connects metrics to service purpose, baseline performance and data sources, and combines measurement with user research.

In practice, check three things.

First, use the same start and end points.

It is not a fair comparison if the old workflow is timed from receipt of the document but timing for the new workflow begins only after the material has already been organized.

Second, require the same completion quality.

If the old workflow produces a correct document while the faster new workflow leaves three important errors, speed alone does not establish improved efficiency.

Third, investigate other possible causes.

For example, lawyers may work faster the second time they organize the same case because they already know the material.

This is a practice effect.

For a more rigorous comparison, vary the order in which participants use the old and new systems, using tasks of comparable difficulty. This is called counterbalancing.

Also record people who do not complete the work. If only five out of ten people succeed, do not report only the five successful participants’ times while omitting the other five failures.

## 5. A hypothesis is an idea awaiting evidence

Many design failures begin with an untested belief rather than an inability to write software.

For example, a university finds that students are doing poorly in mathematics.

The university proposes: “We should develop an AI tutor so students can ask questions at any time.”

That may be a reasonable option, but it does not establish that an AI tutor will improve learning.

Students might lack prerequisite knowledge or practice, or misunderstand the notation used in the course.

Write a testable hypothesis.

@figure4

The possible counterevidence matters.

Ask: “What evidence would support this design?”

Also ask: “What result should make us acknowledge that the design may not have achieved its goal?”

This is the spirit of falsifiability in engineering practice.

However, a hypothesis that receives no support has not necessarily been conclusively refuted. The sample might be too small, the measurement too insensitive, or the study design flawed. Judge evidence quality, effect size and uncertainty together.

## 6. Why keep requirements records? Six months later, the rationale may be forgotten

Consider a financial example.

Suppose a bank develops an AI credit-report system.

The original requirement is:

“Users can upload data, have it checked, and generate a report.”

After implementation, a tester discovers a problem:

@figure5

The engineer therefore adds a rule:

“Whenever data that affects the check is modified, the previous pass status must become invalid. Export is allowed only after a new check.”

If the engineer changes the program without recording why, a future maintainer may ask:

“Why must we check again whenever a field is edited? Could we remove this to improve performance?”

The maintainer may not know that the rule prevents unchecked financial data from being exported.

This is why we need requirements traceability.

Its purpose is:

For each important decision, we should be able to trace the originating problem, who confirmed it, why it changed, and how its implementation can be demonstrated.

For example:

| ID | Type | Record |
| --- | --- | --- |
| R-01 | Requirement | Recheck after important data is modified |
| H-01 | Hypothesis | Automatically invalidating old status may reduce the risk of unchecked exports |
| M-01 | Metric | Every specified stale-status test case must be blocked |
| T-01 | Test | Test after editing amount, name or other fields that affect the check |
| C-01 | Change | Add a mechanism to invalidate check results |
| E-01 | Evidence | Tests pending; no result obtained yet |

These identifiers are illustrative management aids, not a unique formal standard.

Also record the source, proposer, confirming role, date, version, decision rationale and status. This helps prevent an unconfirmed suggestion from being treated as an approved requirement.

## 7. How do verification, validation and evaluation differ?

These terms are easily confused in AI and software engineering.

| Term | Plain meaning | Main question |
| --- | --- | --- |
| Verification | Did we implement it according to specification? | Does the system meet its requirements? |
| Validation | Did we build what users actually need? | Can the system address the real problem? |
| Evaluation | How well does it perform? | What metrics are used to measure performance? |

For example, a restaurant develops a self-service ordering system.

Verification checks whether submitting an order sends the correct dishes and quantities to the kitchen.

Validation checks whether customers can complete their orders smoothly and whether the system actually improves the service problem.

Evaluation measures ordering time, order error rate and completion rate.

These activities complement one another.

## 8. Start with a problem.md file

A useful principle of M03-05 is to avoid introducing overly complex tools before you need them to manage requirements.

A small project can begin with Markdown.

Here is a delivery-exception notification example. The original Chinese problem.md is retained verbatim in both languages.

@template

The template describes customers repeatedly contacting support because they do not learn about delivery exceptions promptly. R-01 proposes clear notifications after an exception, with business confirmation still pending. H-01 proposes that proactive notices and handling instructions can reduce repeated inquiries; it remains unverified. M-01 divides delivered notifications by events requiring a notice. M-02 divides exception orders with repeated inquiries during a defined period by all eligible exception orders in that period. M-03 measures from the first exception record to confirmed resolution. Scope, data sources, measurement periods and success thresholds still need confirmation. The baseline, new-system result and test records remain unmeasured or unavailable. C-01 proposes notification retries because delivery may fail; the decision maker and date remain unconfirmed and the change remains a proposal. The document has two practical benefits.

First, it connects the problem, requirement, hypothesis, metrics and evidence rather than recording only a feature list.

Second, it distinguishes intended results from results already demonstrated.

An AI-generated test plan does not justify marking a test as passed.

AI can help write requirements, design test cases and organize execution records. It should not claim acceptance is complete when the actual results have not been observed.

## 9. Turn the lesson into an executable work method

When designing your next AI system, whether for healthcare, education, research or business, start with these five tasks.

| Order | Question to answer | Artifact to retain |
| --- | --- | --- |
| 1 | What exactly are we trying to improve? | A clear problem statement |
| 2 | What must the system do? | Testable requirements |
| 3 | Why do we believe this design helps? | A falsifiable hypothesis |
| 4 | What evidence will determine success? | Metrics, denominators, baseline, thresholds and data sources |
| 5 | How will we handle testing and changes? | Test evidence, acceptance decisions and change records |

This approach follows the sequence in the GOV.UK service performance guidance: understand service purpose, develop hypotheses, decide what to measure, find data sources, and revise based on results. The source is listed below this lesson.

For formal acceptance, define pass conditions for important metrics in advance and consider sample representativeness, risk, cost and measurement uncertainty.

## 10. Check your understanding: can you identify unsupported success claims?

@figure6

Answer the following questions:

1. Metric calculation: what are the defect blocking rate and the correct release rate for good products? What does each tell us?
2. Evidence judgment: does a change from 10 minutes to 7 minutes establish a 30% improvement in production efficiency? What information is missing?
3. Hypothesis testing: how would you make “AI can reduce quality-inspection costs” into a testable hypothesis?
4. Requirements traceability: if recalibrating the machine may invalidate previous pass decisions, what requirement and records would you add?
5. Overall decision: as project lead, would you roll out fully, continue a limited trial, or stop the project? Why?

Try answering first, then expand the reference explanations to check your reasoning and calculations.

Good engineering makes the rationale, success criteria and supporting evidence for decisions clear.
