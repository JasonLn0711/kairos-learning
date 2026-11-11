# M05-05 | OpenSpec and Lightweight Markdown: How Can AI Build Software to a Specification?

Software work requires AI, engineers and project managers to know what the system currently promises, what may change, why it should change and how correctness will be demonstrated.

This lesson addresses five questions:

1. Why do requirements documents still need change management?
2. What is OpenSpec, and how does it differ from ordinary Markdown files?
3. What responsibilities belong to specs, proposal, design and tasks?
4. How should a solo project and a collaborative project choose a workflow?
5. How can a request be traced through implementation, testing and acceptance?

## 1. Why Manage Specifications? Start with a Restaurant

Suppose you run a restaurant chain and develop an ordering system.

Its original rule is:

“An order may reach the kitchen only after the customer completes payment.”

This is a specification, often shortened to spec.

An operations manager proposes a new idea:

“Let regular customers order first and pay within 30 minutes.”

This proposed rule has not yet been approved.

If an engineer or AI changes the code immediately, it might let every customer receive food without paying, causing operational losses.

Separate these two records:

- Current specification: payment must complete before an order reaches the kitchen.
- Candidate change: consider letting eligible regular customers order first and pay later.

A candidate change is not an approved rule.

Keeping these states separate is a central OpenSpec design principle.

Even if the manager approves the feature, questions remain: who qualifies, what credit limit applies, what happens after the deadline, who implements it and how will it be tested?

“Let regular customers order first” leaves those decisions unresolved.

OpenSpec gives these different kinds of information explicit locations, relationships and change histories, helping a team distinguish ideas, decisions and completed functionality.

## 2. What Is OpenSpec?

OpenSpec helps developers and AI coding agents manage software specifications and changes.

It is neither a programming language nor another large language model.

Think of it as:

A system for organizing current rules, revision proposals, technical plans, work lists and history for a software team.

@figure1

The basic artifact responsibilities are:

| Artifact | Plain-language role | Main question |
| --- | --- | --- |
| specs/ | Current operating rules | How should the system behave now? |
| proposal.md | Change proposal | Why change, and what changes? |
| specs/ within a change | Difference from current rules | Which requirements are added, modified or removed? |
| design.md | Technical plan | How will it be implemented? |
| tasks.md | Work list | What work remains? |
| Tests and evidence | Acceptance records | How do we know it works? |

A tasks.md file does not itself prove that tests passed. Run the tests and retain their actual results.

### Read the Folder Structure

This synthetic restaurant example illustrates document contents, not output from an executed CLI. Whether design.md is needed depends on the change and version:

@code1

Two files are both named spec.md, but their responsibilities differ.

The top-level openspec/specs/ holds the current specification, the authoritative source of requirements. The spec inside openspec/changes/ describes a difference awaiting confirmation, implementation or integration.

Identical filenames do not give the contents identical authority.

## 3. Work Through a Change from Proposal to Delivery

@figure2

### Step 1: Confirm the Current Rules

The current spec.md might contain:

@code2

Suppose operations now wants eligible regular customers to reserve an order and pay within 30 minutes.

Clarify the rule before requesting code: reserving an order and starting food preparation are different actions.

### Step 2: Create proposal.md

The proposal could read:

@code3

The proposal states both the intended work and its exclusions.

AI might otherwise interpret deferred payment as permission to prepare food before payment. Explicit exclusions reduce that ambiguity.

### Step 3: Create a Delta Spec

Delta means difference.

An OpenSpec delta describes changes relative to the current specification. Common categories include:

- ADDED: a requirement that did not previously exist.
- MODIFIED: a change to an existing requirement.
- REMOVED: an existing requirement is withdrawn.

For example, add this requirement:

@code4

This uses the Given / When / Then pattern introduced in M05-03.

It turns an abstract statement into concrete behavior that can become a test.

R-01 already prohibits sending an unpaid order to the kitchen. Do not add a duplicate rule. Add the new reservation behavior and verify that it preserves R-01.

This helps prevent duplicated or contradictory requirements.

### Step 4: Create design.md

Now consider implementation.

For example:

@code5

Keep these responsibilities distinct:

- Spec states what the system must do.
- Design explains how engineers intend to implement it.

Switching from Python to Java may change the design while preserving the business rule that unpaid orders must not reach the kitchen.

Keep specifications independent of unnecessary implementation choices.

### Step 5: Create tasks.md

Break the design into concrete work:

@code6

This document can define the AI coding agent’s work scope.

The checklist tracks work; acceptance still requires the behavior defined in specs and actual evidence.

If AI checks every task without running tests, that records a completion claim without proving correct functionality.

### Step 6: Verify Before Updating Current Specifications

Check at least three distinct kinds of evidence:

| Check | Purpose |
| --- | --- |
| Document-format validation | Do the documents meet the tool’s structural requirements? |
| Functional and negative tests | Does the implementation behave as specified? |
| Human review | Are the business rules, design and change acceptable? |

Example tests include:

“An ordinary, non-eligible customer attempting to reserve an unpaid order must be rejected.”

“An eligible regular customer’s unpaid reservation is canceled after the 30-minute deadline.”

“An unpaid order must not reach the kitchen even when a user bypasses the frontend and calls the API directly.”

The final case checks the backend boundary: a disabled interface action does not establish server-side enforcement.

After the necessary verification and appropriate approval, integrate the accepted change into current specifications and archive the proposal and history.

Archive is a specification-management operation. It does not certify security, quality or deployment success.

## 4. When Is Lightweight Markdown Enough?

Choosing a maintainable workflow is another major lesson objective.

Software development does not require OpenSpec.

For a small tool used only by you, with simple functionality and infrequent changes:

One Markdown file can record the following:

@code7

A well-maintained file can be sufficient without creating extra files for their own sake.

### A Practical Selection Matrix

| Condition | Lightweight Markdown | OpenSpec |
| --- | --- | --- |
| One developer | Usually start here | Optional |
| Few, simple requirements | Usually start here | Optional |
| Frequent changes to existing requirements | Possible with disciplined maintenance | Worth evaluating |
| Several people changing several features | Synchronization burden may grow | Worth evaluating |
| Reasons for each change must be traceable | Record manually | Explicit change structure |
| Team cannot maintain additional tooling | Often suitable | May add maintenance burden |

Compare the complexity of specification management with the extra tooling cost.

The questions to manage are:

“Which rules have been accepted? Who can change them? When did they change? How do we check that existing behavior remains intact?”

If Markdown answers those questions clearly, immediate adoption is unnecessary. OpenSpec’s structure may help when collaboration repeatedly confuses versions, deltas and reviews.

## 5. Does This Apply to Other Industries?

The same specification-management principles apply across industries; actual rules and risks depend on context. These are synthetic teaching examples.

| Industry | Current rule | Candidate change | Important verification |
| --- | --- | --- | --- |
| Healthcare | Show allergy records to clinical staff | Add selected drug-interaction alerts | High-risk situations must not be missed |
| Banking | Specified transactions require approval | Automate eligible small transactions | Required authorization cannot be bypassed |
| E-commerce | Create shipment orders after payment | Add preorder reservations | Prevent overselling and duplicate charges |
| Manufacturing | Stop specified operations for abnormal equipment | Add severity levels and maintenance notices | Do not incorrectly release serious abnormalities |
| Education | Students see grades after teacher publication | Add grade-review requests | Do not modify final grades without authority |

Suppose a bank’s current rule requires two reviewers for each specified transaction.

Someone proposes: “Let AI automatically approve transactions below a certain amount.”

A direct coding request may focus only on the amount threshold, overlooking authorization, aggregate limits, anomaly detection and audit responsibility.

Confirm the business rules, applicable legal requirements and authority first. Specify permitted and prohibited behavior, then test it. OpenSpec manages decision documents; it cannot decide their legal or organizational authority.

## 6. Five Common Confusions

### 1. Specification and Prompt

A prompt is what you tell AI in a particular interaction. A specification is a maintained set of behavioral requirements that people can review and use for acceptance.

### 2. Specification and Reality

Code can contain a defect even if its specification prohibits exporting stale data. Specifications state commitments; they do not prove observed behavior.

### 3. A Bug Does Not Always Require a Specification Change

If the specification already prohibits stale exports but code permits them, fix and test the implementation. Do not create a duplicate requirement.

### 4. Terminal Commands and Agent Instructions

In the reviewed version, openspec validate is a terminal command, while /opsx:propose is a workflow instruction in a supported AI assistant. Check actual version and tool support before use.

### 5. OpenSpec Does Not Require Waterfall Development

Proposals, specifications and designs can be revised iteratively. If implementation exposes a mistaken assumption, correct the documents and continue from the revised plan. The official material also addresses iteration and changes to existing systems.

## 7. A Minimal Exercise You Can Do Now

You can practice the concept without installing OpenSpec, Node.js or an AI agent.

Choose a simple rule, such as “editing input invalidates the previous check result,” and record these questions in spec.md:

- What is the current specification?
- Is this a new requirement or a bug violating an existing rule?
- If it is a change, what are the old and new requirements?
- What engineering approach is proposed?
- What work remains?
- What actual verification evidence exists, and what is untested?

Compare maintaining one Markdown file with using OpenSpec’s separate folders. Which is easier to maintain for this project?

This is a document-comparison exercise, not installation, CLI execution or completed collaboration with a real agent.

The source list links to the official OpenSpec Quickstart. This lesson retains the 2026-11-05 reviewed commit 3e4d5f0769e2857c8eb54f149cbf5e4f703fa04c (package.json: 1.16.0) as its fixed baseline; no installation or CLI execution is claimed. The 2026-11-11 Quickstart still presents five steps, but its current examples use natural-language requests, direct skill invocation varies by tool and design.md is created when needed. Check the pictured slash commands against the actual version and supported assistant.

## 8. Understanding Check: Make the Judgment

Use this synthetic scenario. Answer for yourself, then expand the reference explanations at the bottom of the page. This page does not submit answers, assign scores or record learning completion.

Scenario: a hospital laboratory-report system.

The current specification states: “A report can be marked complete only when all required test items are present.”

A test finds that a report can still be exported as complete when one required value is missing.

The hospital also proposes a new requirement: “Automatically notify staff when a test value exceeds a critical-value threshold.”

Question 1: Is the incomplete report a new feature requirement or an implementation defect? Why?

Question 2: Which documents should record critical-value notification, and what does each document do?

Question 3: If AI checks every tasks.md item, can the feature be accepted immediately? What evidence is still needed?

Question 4: Would you choose Markdown or OpenSpec for one engineer maintaining a prototype, and for five engineers maintaining a production system? Why?

Reference explanations are available under the page’s understanding checks.

The main idea to retain is:

Maintainable AI-assisted engineering makes the reason, specification, change and supporting evidence traceable alongside the code.
