## 1. Understand the Lesson in One Sentence

pytest is a tool that automatically examines a program. Business-rule tests check whether the program follows the rules we have agreed on.

Imagine a bank with this teaching rule: “An applicant must be at least 18 years old.” An engineer says the system is finished and its buttons work. That alone does not show that it follows the rule.

At minimum, check these cases:

- Does it reject a 17-year-old?
- Does it accept an 18-year-old?
- Does it accept a 19-year-old?
- What happens when age is missing?
- What happens when someone enters “eighteen” instead of a number?

Opening the website, filling in forms and clicking buttons by hand after every change is costly. pytest lets us write these situations as tests and rerun them after changes to check that previously correct rules remain protected.

The core skill is turning a Specification into Automated Tests.

## 2. Build the Knowledge Map

@figure1

The lesson connects six concepts:

| Concept | Plain meaning |
| --- | --- |
| Business Rules | What a company, institution or process permits and prohibits |
| Unit Test | An examination of a small individual function |
| Assertion | A statement of the expected answer |
| Parameterization | The same examination with different input data |
| Boundary Testing | Checks immediately around a limit |
| Contract Testing | Checks of agreed inputs, outputs and failure behavior |

The following sections connect these concepts into a practical workflow.

## 3. What Are Business Rules?

Business rules are the requirements a system must obey. They come from real activities and needs rather than programming syntax.

For example:

| Industry | Teaching rule | Expected behavior |
| --- | --- | --- |
| E-commerce | Free delivery at 1,000 or more | Charge at 999; waive at 1,000 |
| Healthcare | Required specimen information is needed for an examination request | Block submission and identify missing information |
| Banking | Application fields are required | Prevent completion when fields are missing |
| Education | Scores range from 0 to 100 | Reject negative scores and scores above 100 |
| Logistics | Parcel weight has a service limit | Reject overweight parcels or select another service |
| HR | Leave depends on the applicable policy and service duration | Calculate the allowance using that policy |

These are illustrative rules, not statements of the actual law for those industries.

### Why Test More Than the Screen?

Suppose an e-commerce input prevents negative order totals. The screen looks correct, but some data arrives by an API or an internal function call without going through that screen. Without a backend check, the system may still receive an unreasonable total such as -500.

Distinguish two responsibilities:

- UI Validation: warn the user early on the screen.
- Business Rule Validation: enforce the rule regardless of where data comes from.

That is why this lesson calls rules.py directly instead of relying only on mouse interaction.

## 4. How Does pytest Examine a Program?

Use a delivery-fee example with a confirmed specification:

- Orders of 1,000 or more have free delivery.
- Smaller orders have a delivery fee of 60.
- The total must be a nonnegative integer.

First, write the business function in rules.py.

@code0

In plain language: reject a total that is not an integer or is below zero. Return zero when it is at least 1,000; otherwise return 60.

Here, def defines a function, return supplies its result, and raise ValueError tells the caller that the supplied value does not meet the requirement.

Second, write tests/test_rules.py.

@code1

pytest calls the same function with four normal inputs and compares each returned fee with the expected answer. Four additional inputs check rejection of a negative number, a fractional number, a string and a Boolean. The strict type check intentionally rejects True even though Python treats bool as a subclass of int.

@figure2

### What Is assert?

An assertion says, “This condition should hold; otherwise the test fails.”

@code2

This says that delivery for an order of 999 should cost 60. If the program incorrectly returns zero, pytest reports a failure and reveals a disagreement between the implementation and specification.

## 5. Parameterization: Reuse the Same Examination

A key technique is @pytest.mark.parametrize, called parameterization.

Think of a teacher applying the same grading standard to different students rather than writing a new examination for each student. Tests can reuse assertions in the same way.

Suppose an application has three required fields:

- application_id: the application identifier.
- applicant_code: the applicant code.
- document_type: the document type.

The synthetic teaching specification requires each field to be a string, nonempty after trimming surrounding whitespace, and no longer than 80 characters after trimming.

Each field has six invalid values to examine:

| Invalid value | Reason to test it |
| --- | --- |
| "" | No text |
| "   " | Only spaces |
| "\t\n" | Only tab and newline whitespace |
| None | No valid value |
| 42 | A number instead of text |
| "x" * 81 | More than the allowed length |

Three fields multiplied by six invalid values produce 18 cases. We do not need 18 separate test functions.

@code3

This example defines a valid GOOD dictionary and imports the workshop rules.py functions. The delivery and three-field examples use different rules.py files; run them in separate project directories.

{**GOOD, field: bad} copies the valid baseline and replaces only the field under examination. with pytest.raises(ValueError) states that this operation must reject the input by raising the specified exception.

If invalid data exports successfully, the test must fail. This expected-exception mechanism is supported by pytest itself.

## 6. Why Focus on Boundaries?

For a maximum of 80 characters, which lengths would you test? Testing only 10 and 100 covers a normal and an invalid case but may miss the most likely mistake.

An engineer might accidentally write:

@code4

That condition also rejects exactly 80 characters. The intended rule rejects values only when they exceed 80.

@figure3

The same reasoning applies to transaction limits, scores, parcel weights, discounts and API request limits. Start from the specified threshold, then test immediately before, at and after it.

## 7. Output Contracts: Check What Gets Produced

An Output Contract defines the required structure and contents of the result. Suppose a JSON report may export only three approved data fields while the input also contains an internal note:

@code5

Check three things:

1. Valid input produces a report.
2. The report includes only approved data fields.
3. Export does not unexpectedly change the original input.

These checks support functional quality and may reduce accidental export of additional data. They do not replace access control or a complete security test program.

Use json.loads() to parse the report and assert its structure and values. The workshop report has a status field and a data object; the three-field restriction applies to data, not to the entire outer JSON object.

## 8. Why Passing Tests Do Not Establish Complete Correctness

Different tests answer different questions:

| Test type | Main question |
| --- | --- |
| Unit Test | Does an individual rule calculate correctly? |
| Integration Test | Do connected components work together? |
| UI Test | Do the screen and interactions work as expected? |
| Usability Test | Can real users complete the task? |
| Security Test | Does the system address identified security risks appropriately? |

A bank’s interest formula passing 100 unit tests does not establish that users can submit the web form or that other people cannot access their records.

Two testing problems deserve attention. First, the expected answer itself may be wrong. Copying the current function result into the test can make the implementation and test share the same mistake. Derive expected results from confirmed requirements.

Second, tests cover only the situations you wrote. A 100% pass rate does not show that every possible input, operation or attack has been checked. Record both checked conditions and conditions still unverified.

## 9. How to Run pytest

For the delivery example, use this project structure:

@code6

With pytest installed in the active Python environment, enter the project root and run:

@code7

python -m pytest uses the current Python environment. -q requests concise output. pytest discovers files according to its naming rules.

The delivery example includes four normal and four invalid-value cases. The following illustrates output when all eight pass; preserve the output of your own actual run:

@code8

Each dot represents a passing case. On failure, distinguish environment or import errors, incorrect expectations and implementation defects. Keep correct acceptance criteria intact instead of weakening them just to obtain green output.

## 10. Five Principles to Keep

1. Establish the specification before tests. Reliable correctness judgments require an agreed expected answer.
2. Change one test condition at a time where practical, so a failure is easier to diagnose.
3. Cover normal, invalid and boundary cases rather than only successful inputs.
4. Check the required failure behavior. A specified ValueError is not satisfied by an arbitrary exception.
5. Treat tests as repeatable evidence. Rerun them after changes and record uncovered risks; passing is not an absolute guarantee.

## 11. Check Your Understanding with a Scenario

Suppose a hospital examination-request system has these confirmed teaching requirements:

- A medical-record code is required.
- The examination-item code must belong to an approved list.
- The requested quantity must be an integer from 1 to 10.
- Invalid data must not be submitted.
- Exported reports must exclude internal debugging fields.

Try answering:

Question 1: For a quantity from 1 to 10, give at least six normal, invalid and boundary cases.

Question 2: The screen prevents 11, but a direct backend API request containing 11 succeeds. What testing or implementation problem does this reveal?

Question 3: Invalid data is rejected with TypeError instead of the specified ValueError. How should the test judge this?

Question 4: If all business-rule tests pass, may the whole hospital system be declared accepted? Why?

Answer independently, then expand the reference answers on this page and compare your reasoning.

The practical target is to independently turn requirements into five categories of tests: valid data, invalid data, boundaries, expected exceptions and output contracts.
