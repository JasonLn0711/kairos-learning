# Different responsibilities of Prompt and Spec

A prompt tells AI what to do in this task. A specification defines the system behavior, constraints and acceptance conditions. They may reference each other; their responsibilities, rather than their length or filename, distinguish them.

## 1. Understand the distinction through building a house

Suppose you are building a house and appoint a site supervisor.

You tell the supervisor:

> Finish the bathroom today. Install the toilet and washbasin first, then send photographs. Leave the kitchen untouched for now.

This resembles a prompt: a work instruction.

You could also say:

> The bathroom floor must have an appropriate drainage slope. Waterproofing must meet the agreed standard, drainage testing must show no leaks, and electrical work must satisfy applicable safety requirements.

This resembles a specification: requirements for the result.

Prompt: assign work.

Define today's work, who performs it, the permitted scope and how to report completion.

Spec: define acceptance standards.

Define the properties the finished work must have, its constraints and how to check compliance.

Use a change of supervisor to examine the difference:

Tomorrow's supervisor might receive entirely different work instructions. Would the requirement that the bathroom must not leak change as well?

It would remain applicable.

Software needs an independently maintained specification so that correctness has a shared basis across conversations, AI models and developers.

## 2. How do Prompt and Spec differ?

| Comparison | Prompt | Spec |
| --- | --- | --- |
| Core question | What should AI do in this task? | What requirements must the system satisfy? |
| Main audience | AI, Coding Agents and people executing tasks | Developers, testers, users and acceptance reviewers |
| Content | Work scope, sequence, tools and reporting | Functions, constraints, exceptions and acceptance conditions |
| Lifetime | Usually one task | Remains applicable until formally revised |
| Confirmation | Inspect task execution and reporting | Inspect actual system behavior and test evidence |

Length does not establish that a document is a specification. Saving text as `spec.md` does not make its requirements adequate.

For example:

“Ask AI to build a very usable, secure and fast system.”

This is a vague instruction. Even in `spec.md`, it gives different people no objective basis for deciding what “very usable” means.

## 3. Examples from different industries

Suppose AI helps develop three systems.

| Industry | Prompt: this task | Spec: the system commitment |
| --- | --- | --- |
| Healthcare clinic | Build a patient appointment page; start with date selection | Prevent booking an occupied time slot and clearly explain a failed booking |
| E-commerce | Change shipping-cost calculation on checkout | Apply the approved shipping rules and display the final total before payment |
| Manufacturing | Build a factory quality-inspection form | A measurement outside the defined acceptance range cannot be marked as passing |

The examples share a distinction in lifetime.

Prompts change with development progress: forms today, the database tomorrow and tests afterward.

The specification's commitments remain applicable while the business requirements remain unchanged.

## 4. Turn a vague request into an assessable specification

A logistics company wants AI to develop a recipient-data checking system.

The manager says:

“I want a usable system that checks customers' recipient details without making mistakes.”

That is a reasonable goal, but developers need answers to several questions:

- Which fields are required?
- Should incomplete input produce a warning or prevent submission?
- Must edited data be checked again?
- Does “complete” mean that required fields are filled, or that the delivery address really exists?

Without definitions, AI may fill these gaps with its own assumptions.

### Five questions for one requirement

| Define | Plain-language question | Recipient-data example |
| --- | --- | --- |
| Input | What does the system receive? | Recipient, telephone and address |
| Condition | When does the rule apply? | Any required field is empty |
| Output | What should the system do? | Identify missing fields |
| Constraint | What must not happen? | Do not mark the data complete |
| Acceptance | How can this be demonstrated? | Enter empty data and inspect the result |

The resulting `spec.md` could contain:

```
# Recipient-data checking specification (teaching example)

## R-01: Required fields
Recipient, telephone and address are required.

## R-02: Missing input
If any required field is empty, or contains no content
after trimming leading and trailing whitespace:
- Display the corresponding field error.
- Prevent marking the data complete.

## R-03: Editing data
When a user edits previously checked data,
the earlier completion status must become invalid
and another check must be required.

## R-04: Business boundary
Passing the check establishes required-field completeness only.
It does not establish a valid telephone, a real address
or official acceptance of the request.

## Acceptance scenarios
T-01: All three fields contain values; the completeness check can pass.
T-02: Address is empty; show an error and do not mark complete.
T-03: Address contains only whitespace; treat it as missing.
T-04: Edit checked data; invalidate the previous completion status.
```

The specification could later cover telephone format, address verification and data-retention policies. This teaching example first defines field completeness precisely.

A verifiable requirement lets developers, testers and users inspect the same input and decide whether the observed result meets the requirement.

NASA's requirements guidance supports clear, unambiguous, traceable requirements and a defined verification method. This lesson adopts those writing principles without claiming aerospace-process compliance.

## 5. Does a specification still need a prompt?

Yes. A specification does not schedule AI work by itself.

After confirming the specification, assign implementation to a Coding Agent.

The following is an unexecuted assignment example:

### Agent work instruction example

Read this project's `spec.md` and confirm requirements R-01 through R-04.

Implement required-field checking and its tests only. Do not implement login, a database or a redesigned interface.

List the files you expect to change and their affected scope before implementation.

Run the tests corresponding to T-01 through T-04. Provide the diff, actual test results and items that remain unverified.

If requirements conflict, a new dependency is needed, or work requires changing an unauthorized data boundary, stop the affected edits and list the decisions that need confirmation.

Three terms clarify this instruction.

Coding Agent: an AI collaboration system that uses tools to read code, edit files and execute commands and tests.

Diff: the changes to code, showing what AI added, removed or modified.

Stop condition: a predefined situation that the agent cannot decide independently, such as conflicting requirements, insufficient permissions or a change to sensitive-data handling.

The final instruction identifies decisions owned by people.

The agent should recognize when a human decision is required and report the unresolved issue with enough context to resolve it.

## 6. Connect the development workflow

Problem: problem statement

What problem are we trying to solve?

Spec: system specification

What must the system do, and what must it not do?

Prompt: work assignment

Which part goes to AI this time, with what permissions and limits?

Implementation

AI or developers write and modify code.

Verification

Use the specification and test evidence to determine whether the result meets requirements.

When a problem is found, return to the appropriate stage, revise, implement again and retest.

This diagram provides a reading sequence for beginners. Actual engineering is iterative: implementation, requirements clarification and testing can happen repeatedly.

BDD (Behavior-Driven Development) connects to this workflow.

BDD uses concrete scenarios to build shared understanding across roles, then connects those scenarios to checkable system behavior.

For example:

- Given: the user has entered the recipient and telephone but no address.
- When: the user requests completion of the data check.
- Then: the system identifies the missing address and cannot mark the data complete.

This scenario can later be connected to an automated test. Given/When/Then notation alone does not establish a complete BDD practice.

## 7. Three common mistakes

Mistake 1: assuming that longer prompts make systems more reliable.

Ten thousand words with contradictory rules still cannot guarantee correctness.

Mistake 2: treating AI's “finished” message as acceptance.

That message is a work report. Review the code changes, actual test results and tests that were not run.

Mistake 3: treating the specification as an unchangeable law.

Specifications can be incomplete or wrong. When business requirements change, the decision-owning person confirms the change, revises the specification, records the reason and updates tests. If a prompt conflicts with a specification, do not simply adopt the latest sentence or let AI choose independently.

## 8. What to take into your own work

Keep a software system's requirements in a record that can be maintained beyond AI conversations.

A direct prompt may be sufficient for a personal tool. Systems that must support handover, multiple maintainers, continued modification or audits need clear records of requirements, execution and evidence.

Start with one vague request. Rewrite it as an observable, testable system commitment, then write an agent assignment that explicitly references that specification.

## 9. Check your understanding

Answer first, then expand the reference answers to inspect the reasoning.

Question 1: distinguish Prompt and Spec.

Which statement is a system specification?

A. When the system detects an abnormal order amount, it must prevent payment and display the reason.

B. Ask AI to modify the payment module first, then run tests.

C. Report the code diff after finishing.

Question 2: a conflict between instruction and specification.

`spec.md` says “An order with a missing address cannot be completed,” but a new prompt says “Skip the address check for now.” What should happen?

A. Implement the latest prompt directly.

B. Confirm the decision authority and reason for the rule change; formally revise the specification and tests where needed.

C. Let AI choose the easier implementation.

Question 3: apply the distinction.

For a school's student-absence notification system, write:

1. One assessable specification requirement.
2. One assignment for a Coding Agent.
