# M08-01 | Running is not verified: how do we prove software is complete?

The central idea is:

“Runs” means the program can execute. “Complete” requires evidence that it meets requirements under specified conditions.

Suppose you ask AI to develop a hospital appointment system. It reports: “Complete. The website opens normally.”

That does not establish that patients can book appointments, doctors cannot be double-booked, or other patients cannot see their records.

This lesson explains how to move from trusting that software works to providing evidence someone else can check.

## 1. A car that starts still needs safety checks

Suppose a salesperson starts your new car and says: “The inspection is complete. It is safe to drive.”

You still need answers:

- The engine starts, but do the brakes work?
- The brakes work, but will the car skid in rain?
- It drives normally, but will it protect passengers in a collision?
- The parts work, but can the driver understand the dashboard?

These are different questions and require different checks.

Software needs the same distinction.

AI may generate a thousand lines of code without an error and produce a website that opens. This does not establish that the software meets your requirements.

The resulting principle is:

Each quality claim needs corresponding verification evidence. Passing one kind of test cannot substitute for another.

## 2. Check software quality from five perspectives

Use the following structure to choose evidence.

@figure1

The five perspectives complement one another. Their displayed order is not a mandatory testing sequence, and none substitutes for the others.

### Perspective 1: startup verification (Smoke Test)

This checks basic startup behavior.

For example, a tester opens a restaurant reservation website and observes:

- The website displays normally.
- The server has not crashed.
- A date selector and reservation button are visible.

You can report: “The system started successfully in this test environment.”

You cannot yet report: “The reservation system is complete.”

You still do not know whether two customers simultaneously booking the last available place can create a duplicate reservation.

### Perspective 2: business rule testing

This checks business logic.

Consider online shopping.

The specification says: “Orders of at least NT$1,000 qualify for free shipping.”

The tester must check:

| Purchase amount | Expected shipping charge |
| --- | --- |
| NT$999 | Charge according to the shipping policy |
| NT$1,000 | Free |
| NT$1,001 | Free |

Why test 999, 1,000 and 1,001 specifically?

This is boundary value testing.

Errors often occur at condition boundaries. If an engineer writes “greater than 1,000” instead of “greater than or equal to 1,000,” a customer spending exactly 1,000 is incorrectly charged shipping.

Tools such as `pytest` can automate these rule tests. Their value depends on whether the cases cover important requirements, rather than the number of passing cases.

### Perspective 3: interface verification (UI Testing)

The frontend can be wrong even when backend calculations are correct.

Consider a bank transfer system.

The backend correctly detects insufficient funds and rejects a transfer, while the frontend displays “Transfer successful.”

Here, the backend rule is correct and the interface behavior is wrong.

Check what messages users see, when buttons are enabled, whether the display updates after data changes, and whether downloaded files contain the right data.

Streamlit AppTest can simulate app interactions and inspect interface element states. Finding a download button with AppTest does not establish that a real browser download and its file contents have been verified.

### Perspective 4: task-based usability testing

Technical testing can leave this perspective unexamined.

Suppose every program test for a hospital appointment system passes.

A first-time patient tries to book an appointment but does not know:

- Whether to select the department or doctor first.
- Why the booking button is disabled.
- Where to find the result after booking.

These may be usability problems rather than program bugs.

Assign a real goal and observe whether the user completes it, where they become stuck, and whether they need help. Asking whether the system looks attractive does not provide this evidence.

GOV.UK user research guidance likewise uses observation of actual tasks to identify usability barriers.

### Perspective 5: security testing

Suppose you build a student learning platform.

Student A signs in and sees their own grades. Normal functionality may be working.

If changing the student identifier in the URL lets A read student B’s grades, the system has an authorization control problem.

Distinguish these two terms:

- Authentication establishes who you are, for example through account sign-in.
- Authorization establishes whether you may access a particular record.

Passing a sign-in check does not grant access to every record. OWASP recommends least privilege, denial by default, and permission checks on every request.

A test that did not break a system does not prove complete security. State the scenarios tested, protections implemented, and risks still awaiting verification.

## 3. Claims, evidence and limits

Consider an automated invoice bookkeeping system.

An engineer reports: “The invoice feature is complete.”

That statement is too vague to verify.

Break it into concrete, testable claims.

Example evidence matrix: every entry below is hypothetical, not an actual test result.

| Completion claim | Evidence to provide | What it does not establish |
| --- | --- | --- |
| The system starts | Startup logs and display | Correct amount calculations |
| Invoice amounts are correct | Rule tests against known answers | An error-free interface |
| Missing fields prevent bookkeeping | Tests rejecting incomplete data | Coverage of every abnormal case |
| Users can correct errors | Observed task records | Ease of use for everyone |
| Others cannot read invoices | Tests rejecting cross-account access | Absence of every security risk |

This matrix makes quality claims reviewable through evidence rather than personal impressions.

Apply this chain to each claim:

Completion claim → corresponding specification → verification method → actual result → scope not yet covered.

## 4. Turn the concepts into a development workflow

Use `spec.md`, test results and `verification-notes.md` to manage verification records.

Suppose you are developing a document upload system.

### Step 1: write explicit acceptance criteria

A broad statement is:

“Users can upload documents.”

Make the acceptance behavior explicit:

“When required fields are missing, the system must explain what is missing and must not generate a complete report.”

This tells you what to test.

### Step 2: design normal and abnormal scenarios

Use Given–When–Then:

- Given: an uploaded document lacks an identity field.
- When: the user selects “Export report.”
- Then: the system rejects the export and identifies the missing field.

Add cases for complete data, blank data, malformed data and expired data.

### Step 3: run tests and record actual results

A “Pass” label alone is insufficient.

Record at least:

- The program version (commit).
- The environment used.
- Input data and expected results.
- The output actually observed.
- Test status.

These details let someone else rerun the test and check the result.

### Step 4: distinguish three evidence states

@figure2

### Step 5: create the verification record

You can use this example in `verification-notes.md`:

```

# Verification record

## Acceptance criterion
Do not export a complete report when required fields are missing.

## Test environment
Version: commit abc123 (example)
Environment: local test environment

## Test input
A synthetic document with its identity field missing.

## Expected result
Reject export and explain the missing field.

## Actual result
Fill in after executing the test.

## Status
Not Tested

## Next step
Run rule and interface tests,
then verify download behavior in a real browser.

```

This record lets the next person identify what has been established and what evidence is still missing.

## 5. Why AI Coding needs this discipline

In traditional software development, an engineer may write every line and have some direct understanding of its logic.

With an AI Coding Agent, you might provide only this request:

“Implement invoice recognition, amount calculations and data export.”

The Agent quickly changes a dozen files and replies:

> Implementation completed. All tests passed.

This does not establish that your requirements have been verified.

At least four gaps are possible:

1. The Agent tested new functionality without checking whether existing features broke.
2. The Agent wrote tests that do not cover the actual business requirements.
3. Tests use ideal data and omit abnormal, boundary and malicious inputs.
4. Tests pass in the Agent’s development environment, while production has different settings or permissions.

Establish the following collaboration workflow:

@figure3

This links M08-01 to M05 (specification-driven development) and M07 (AI Coding Agent collaboration):

The Spec defines completion; the Agent implements; Verification provides inspectable evidence for the completion claim.

## 6. Verification and Validation

These terms address different questions.

Verification asks: have we implemented the specified requirements correctly?

Validation asks: does what we built meet the needs of users in their actual context?

Consider a logistics route planning system.

It finds the shortest route exactly as specified, and every algorithm test passes. This provides evidence of conformance to the specification.

Drivers then discover that the shortest routes often include alleys too narrow for large trucks.

Verification can therefore pass while Validation fails.

The earlier tests still have value. The original requirements may have omitted important conditions of use.

Check actual needs to avoid implementing an unsuitable specification perfectly.

## 7. Check your understanding

Keep this purpose in mind:

Testing establishes what evidence supports and what remains uncertain.

Whenever an AI Agent reports “complete,” ask: which requirement is complete, how was it verified, where is the evidence, and what has not been tested?
