# How can we confirm that software meets its requirements?

This lesson belongs to Specification-Driven Development. It addresses a common software-development question:

Why can a system differ from what we wanted even after we tell an engineer or AI what to build?

One reason is that we describe a list of features without defining correct outcomes or the conditions that require rejection.

The goal is to turn ambiguous requirements into acceptance criteria that engineers, AI Coding Agents and testers can understand together and actually verify.

## 1. Understand Given / When / Then

Imagine ordering at a restaurant.

You tell the server, “I would like a steak without onions.”

The steak arrives with onions. The server says, “But we did make the steak.”

The restaurant completed the feature of preparing steak, but failed to follow the conditions you requested.

Software development has the same problem.

“Build an ordering system” needs more detail: what outcome should a particular user action produce under specified conditions?

Given / When / Then expresses those conditions, actions and outcomes.

@figure1

The three keywords ask three questions:

| Keyword | Plain meaning | Question to answer |
| --- | --- | --- |
| Given | What was the situation? | Which conditions hold when the scenario begins? |
| When | What happens? | Who performs which action? |
| Then | What outcome is expected? | What counts as success or correct rejection? |

This description is common in Behavior-Driven Development (BDD). Gherkin is a structured syntax for describing behavioral scenarios; Cucumber is one tool that connects scenarios to automated test code.

## 2. Why “the system works normally” is insufficient

Suppose you ask AI to build a bank-transfer system.

Your requirement is:

“Let customers transfer money, and keep the system secure.”

That sounds reasonable, but leaves outcomes undefined.

Does a screen displaying “Success” after pressing Transfer count as completion? What if no money is debited, money is debited twice, or a transfer proceeds despite insufficient funds?

Turn the requirement into rules that a reviewer can judge.

Consider a simplified demonstration transfer system:

@code1

`And` adds another condition that must hold at the same time. In the preserved scenario above, the account has 1,000 units of currency and requests a transfer of 1,500. The system must reject it, display “Insufficient funds,” retain the sender’s 1,000 balance and prevent a 1,500 credit to the recipient.

Even this simple request has four acceptance points: reject the transaction, explain why, prevent a debit and prevent a credit.

An acceptance scenario specifies both required outcomes and outcomes that must never occur.

## 3. Positive and negative acceptance

Positive acceptance asks whether the system can complete the task when the conditions are valid.

Negative acceptance asks whether it safely rejects, blocks or handles a request when conditions are invalid, data is problematic or permissions are insufficient.

| Industry | Positive acceptance | Negative acceptance |
| --- | --- | --- |
| E-commerce | Place an order when stock is sufficient | Do not promise shipment when stock is insufficient |
| Banking | Complete an authorized transfer with sufficient funds | Neither debit nor credit when funds are insufficient |
| Healthcare | Qualified staff can read authorized records | Unauthorized staff cannot obtain record content |
| Human resources | Employees can view their own payslips | They cannot view other employees’ pay |
| Education | Complete enrollment when prerequisites are met | Reject restricted enrollment without prerequisites |
| AI Agent | Execute authorized work instructions | Block protected operations beyond tool permissions |

Negative acceptance checks that the system continues to follow its rules under invalid conditions.

### Displaying an error and actually blocking the action

Suppose a medical system prohibits general administrative staff from downloading complete patient records.

An administrator presses Download, and the screen displays:

“You do not have permission.”

If the API has already returned the file and the frontend merely hides the download button, the content is still exposed.

Verification must establish the following:

- The user did not obtain the file content.
- The server rejected the unauthorized request.
- Other interfaces cannot bypass the authorization check.

Observe both the result shown to the user and whether the protected action was actually blocked.

## 4. Four acceptance scenarios for the teaching example

Use this lesson’s synthetic intake-checking example.

The form has three required fields: application number, applicant code and document type.

Four different scenarios cover the following conditions.

@figure2

Scenario D checks that a validation result still corresponds to the current data version.

Imagine that a bank credit record passes validation at 10:00 a.m.; someone changes an important field at 10:05; another person prepares to export a report at 10:10.

A result from 10:00 may no longer apply.

Bind validation results to the data version that was checked and revalidate their applicability when exporting.

This illustrates Time-of-Check to Time-of-Use (TOCTOU): a condition true when checked may no longer be true when used.

## 5. Give acceptance scenarios to an AI Coding Agent

Acceptance scenarios directly support AI-assisted development.

An ambiguous instruction would be:

> Build a data-checking feature that lets users export reports.

The agent has substantial room to interpret the requirement.

Write the requirement and acceptance scenarios into `spec.md` first.

The simplified document below preserves the original Chinese specification. Its business rule requires non-whitespace values in all three required fields before a report can be marked complete and exported. A permits current-data export after a pass. B identifies missing document type, blocks complete export and retains other values. C treats a whitespace-only applicant code as missing and blocks a complete status. D starts with a pass followed by clearing document type: discard the old result, check current data and block complete export.

@code2

Then instruct the AI:

“Implement this feature according to `spec.md` and create matching tests for all four scenarios. Do not relax the required-field rules. Provide actual test results and the code diff when finished.”

`spec.md` provides a shared contract for the engineer and agent.

Writing Gherkin or Markdown scenarios does not execute tests. Cucumber automation also needs Step Definitions that connect natural-language steps to test code. The same acceptance requirements can also be implemented with pytest or interface tests.

## 6. Judge the quality of acceptance criteria

Use these questions to review each criterion.

| Quality check | Weak example | Better example |
| --- | --- | --- |
| Specific? | The system must be usable | Identify the missing field |
| Observable? | Handle the request correctly | Return rejection and create no order |
| Forbidden behavior included? | Display error text | Do not export a complete report |
| Replayable? | When user data has a problem | When document type is an empty string |
| Independent of implementation? | Turn the third button green | Permit export after validation passes |
| Evidence available? | The test should succeed | Record the test name, result and version |

Evidence fields let another person inspect execution.

Ten written scenarios establish what should be accepted; they do not establish that the system passed acceptance.

Connect these five layers:

@figure3

For example, if the specification prohibits exporting an incomplete report, the matching test must actually attempt export and confirm that no report marked complete was generated or delivered. Record the tested version, command and outcome; an AI statement that “tests passed” is insufficient evidence.

This gives reviewers evidence for whether observed behavior meets the requirement.

## 7. Understanding check: a new industry scenario

A hospital is developing an AI-assisted examination-report system.

Physicians upload examination data and AI produces a draft. The hospital’s example rule requires a qualified physician to approve the draft before it becomes an official report.

An engineer proposes this acceptance scenario:

@code3

Question 1: What is the most serious defect in this criterion?

It does not confirm approval of the official report by a qualified physician.

It does not specify the button color.

It does not specify which language model the AI must use.

It does not require PDF output.

Question 2: Write a negative-acceptance Then clause.

Answer independently before opening the reference explanations. No answer is submitted or saved here.

Code tells the computer how to act. Acceptance scenarios tell everyone which outcomes count as correct and which errors must never occur.

Clear conditions allow the same external behavior requirements to guide verification across languages, frameworks and AI Coding Agents.

These Scenarios are specification fragments. A complete Cucumber `.feature` file also needs a `Feature:` header, step definitions and a test runtime. The examples and hospital rule are synthetic teaching scenarios, not acceptance tests executed at a real bank or hospital. The preserved three-line example says: Given AI has generated a report; When the user submits; Then display success. It omits the required approval condition.
