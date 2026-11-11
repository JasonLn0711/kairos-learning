## 1. The main idea of this lesson

Preventing invalid input on screen does not establish that the system validates its data.

This lesson separates the rules for acceptable data from the screen so they can be reused and tested independently.

Imagine opening a bank.

A teller helps customers check whether their application forms are complete. The bank still cannot assume that every record entering its systems is correct merely because a teller looked at a form.

Data may also arrive through a web API, another bank’s system, a batch import or content produced by an AI Agent.

The design therefore separates these responsibilities:

@figure1

Create a `validate(record)` function independent of Streamlit. It judges the record, and the interface presents its result.

## 2. Why call this vertical slice two?

Start with the meaning of a Vertical Slice.

Imagine a restaurant whose full operating system includes ordering, the kitchen, payments, delivery, inventory and membership.

There are two ways to develop it.

The first is Horizontal Development.

Build all screens, then all backend logic, then connect them. Each layer may be partly complete while no single meal can yet travel from ordering to serving.

The second is a Vertical Slice.

Complete a small, usable function such as ordering one meal and successfully submitting that order. It crosses the necessary interface, logic and data layers.

Add further capabilities one at a time.

In this AASE workshop:

| Stage | What it actually completes |
| --- | --- |
| M07-03, slice one | Three input fields display the entered values, without validation. |
| M07-04, slice two | Data rules distinguish valid and invalid records. |
| M07-05, slice three | Currently valid data supports preview and export. |

Each delivery can answer “What works now, and what evidence shows it?” Testing starts with each slice rather than waiting for the entire system.

## 3. What does data validation check?

The synthetic intake system has three fields:

- `application_id`: application ID
- `applicant_code`: applicant code
- `document_type`: document type

All three must be strings, nonempty after removing leading and trailing whitespace, and at most 80 characters after that removal.

Change the inputs below to observe the rules.

@figure2

This interactive example simulates text-field rules only. Missing keys, None and numbers are tested at the program layer in the following sections.

The main test categories are:

| Test category | Example | Expected result |
| --- | --- | --- |
| Valid input | `"SYN-001"` | Accept |
| Empty string | `""` | Reject |
| Whitespace only | `"   "` | Reject |
| Missing field | No `application_id` key | Reject |
| Wrong type | `12345` or `None` | Reject |
| Length boundary | 80 characters | Accept |
| Beyond boundary | 81 characters | Reject |
| Surrounding whitespace | `"  SYN-001  "` | Judge after trimming |

These are teaching rules for completeness, not the complete business checks of a production banking or medical system.

## 4. Implement validation in Python outside the screen

The technical task is to separate responsibilities.

Split the program into three parts:

@figure3

### 1. Create the rule function

This simplified implementation follows the lesson’s rules. The workshop’s existing rules.py combines missing keys, nonstrings and blanks into a “missing…” message. This example distinguishes those causes and additionally rejects non-dict input. The three text-field rules agree; their messages and input contracts differ.

@rules

Read the implementation piece by piece:

`FIELDS` is the checklist of required data.

`isinstance(value, str)` checks whether a value is text. For example, `123` is an integer, whereas `"123"` is a string.

`strip()` removes leading and trailing whitespace. `"  DEMO-A  "` becomes `"DEMO-A"` for the check, but the function does not change the original record.

`len(cleaned)` measures the resulting string.

`errors.append(...)` adds a discovered problem to the list.

`return errors` returns every discovered problem to the caller. An empty list `[]` means this record passed this set of rules.

The function uses no Streamlit, HTML or screen components.

A website, mobile app, API or AI Agent can therefore call the same rule function.

## 5. How do you know the function is correct? Write tests first

Two terms describe the approach:

- Unit Test: check one function against its expected behavior in isolation.
- Test-Driven Development (TDD): define tests and expected outcomes, observe a meaningful failure, implement until tests pass, then refactor.

A failure should expose an unimplemented rule. A syntax error or missing pytest installation does not establish that the test detected the requirement.

Check both whether valid data passes and whether invalid data is rejected.

@tests

These terms help you read the tests:

| Term | Plain meaning |
| --- | --- |
| `pytest` | A commonly used Python automated-testing tool |
| `assert` | Require a condition to hold; otherwise the test fails |
| `parametrize` | Run one test with multiple sets of data |
| Positive Test | Confirm valid data is accepted |
| Negative Test | Confirm invalid data is rejected |
| Boundary Test | Test thresholds such as 80 and 81 explicitly |

This compact suite does not yet apply every invalid value to every field. It also omits explicit 80-character, trimming and non-dict cases. Complete it using the matrix in section 3.

Some tests only ask whether rejection occurred. They do not check precise, useful error wording. Acceptance tests should also inspect the messages.

### Why not test only the screen?

Suppose a hospital registration screen restricts a birth year to four digits.

The page might prevent a normal user from entering five digits.

Another hospital system may instead send this through an API:

```json
{
  "birth_year": "abcd"
}
```

Without backend rules, the data may still enter the system.

Frontend checks improve operation. The trust boundary that receives and processes the data must also perform the relevant validation.

Every entry point that can bypass the screen needs appropriate checks beyond the screen’s constraints.

## 6. What if a record changes after passing?

A Stale Validation Result is a result that no longer describes the current input.

Consider an application form:

1. The user fills in all three fields and presses “Check data.”
2. The system displays “Completeness check passed.”
3. The user clears a field.
4. A continuing “passed” message would now mislead the user.

This involves State and State Invalidation: a stored status may need to be invalidated after its dependencies change.

A successful validation result belongs to one specific version of the input.

The sequence is:

@figure4

The principle applies beyond forms.

An online store may show verified payment details before the customer changes cards. A factory may show a passed batch check before its batch data changes. An AI Agent’s report may be reviewed before its upstream source document is updated.

In each case, ask whether the original result still applies.

This page’s demonstration clears the old result immediately on an input event. The Streamlit workshop clears it after a committed field change triggers a rerun. Browser edits not yet submitted to Python do not establish a fresh server-side check.

After input changes, clear the previous success and check again. Slice two does not yet provide formal report export.

## 7. How does this design apply in different industries?

These six synthetic examples distinguish what a rule checks from what still requires a separate judgment.

| Industry | Validation example | What passing does not establish |
| --- | --- | --- |
| Banking | Application ID exists, format is correct, required fields are present | Credit approval |
| Healthcare | Required medical-record fields and correct numeric types | Correct diagnosis |
| Manufacturing | Batch number exists, weight is positive, dates are valid | Product quality acceptance |
| E-commerce | Quantity is a positive integer and address is present | Completed payment |
| Human resources | Required résumé fields are present | Candidate eligibility for hiring |
| AI Agent | Tool arguments match a Schema | Authorization to operate the tool |

The distinction extends beyond field completeness.

Data validation is one gate in a trustworthy system.

Separate four layers:

1. Structural Validation: required fields exist and types are correct.
2. Business Validation: values, lengths, dates and other business conditions meet the rules.
3. Authorization: the actor has permission to handle this record.
4. Truth and business judgment: the data is true, the application should be approved and the document is valid.

M07-04 covers basic parts of the first two layers. Passing three fields does not establish the other two.

## 8. How can an AI Coding Agent complete this slice?

Define the rules and acceptance criteria before assigning the work to an AI Coding Agent.

### Example Agent work instruction

Copy the instruction and adapt it to your project. The shared code block is in Traditional Chinese; its eight tasks require reading spec.md/app.py, extracting validate into rules.py, enforcing required string/trim/80 rules, writing positive/negative/boundary tests, connecting the UI, retaining input on error, invalidating old results and keeping export outside this slice. Acceptance requires direct-function rejection, passing pytest, browser correction/rechecking, a Diff with commands and actual results, and honest reporting of unexecuted checks.

@prompt

From the workshop directory, run:

```sh
cd slices/02-validation
python -m pytest -q
python -m streamlit run app.py --server.address 127.0.0.1
```

These commands serve different purposes. pytest checks program rules. Starting Streamlit still requires browser operation to verify interaction, correction and state updates.

An Agent’s “done” report is insufficient by itself. Retain the Diff, test results and actual operation evidence.

## 9. Five things to take away

1. Screen restrictions do not establish valid data.
2. Validation rules should run independently of the UI.
3. Test blanks, missing keys, wrong types and boundaries as well as valid data.
4. After input changes, the previous validation result cannot be reused unchanged.
5. Completeness does not establish business approval, data truth or permission to act.

Python len(str) counts Unicode code points. This page uses the same counting unit and checks whitespace consistently. Some emoji occupy two JavaScript UTF-16 length units, so that length cannot simply stand in for Python’s count.

A production system must define whether “80 characters” means Unicode code points, user-perceived characters (grapheme clusters) or another unit. Otherwise frontend and backend may disagree on Chinese or combining characters.

## 10. Check your understanding

You are building a factory quality-inspection system. Its screen makes the batch number required and limits it to 80 characters.

An AI Agent can call the API directly with:

```json
{
  "batch_id": "   ",
  "inspector_code": 123,
  "document_type": "品質檢驗單"
}
```

Answer these three questions:

Question 1: Why do UI restrictions not establish that this record is valid?

Question 2: What problems does this record contain, and which program layer should check them?

Question 3: After the user corrects the data, what risk arises if the screen keeps the old validation result? How should it be resolved?

Use the three answers, your own `validate(record)` implementation and its negative tests to demonstrate the lesson’s main skills. Reference answers support comparison; reading them does not establish learner mastery.
