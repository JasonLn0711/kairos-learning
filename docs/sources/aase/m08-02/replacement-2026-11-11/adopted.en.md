## cycle｜Define correctness, then make the program meet it

Define what “correct” means before implementing everything, then let the program meet those requirements step by step.

TDD (Test-Driven Development) has three core steps:

1. Red: Write a test first and show that the program cannot yet meet a requirement.
2. Green: Make the smallest change needed to pass the test.
3. Refactor: Improve clarity and maintainability while preserving existing behavior.

Choose the next requirement and repeat those three steps.

This development method connects requirements, implementation and verification.

## analogy｜1. Understand TDD through an automatic door

Think of TDD as deciding how to accept the work before starting construction.

Suppose you ask a contractor to build an automatic door.

A conventional approach might install the entire system first, then test whether the door opens normally.

A TDD approach proceeds as follows:

- Red: Specify “the door must open when someone approaches” and design a test. The current system cannot do it.
- Green: Implement the sensor and opening function so the test passes.
- Refactor: Organize the sensor and controller code, then test again to confirm the door still opens correctly.

Next, handle requirements such as “do not close while someone is in the doorway” and “recover after a power outage.”

Work on one small, explicit, verifiable goal at a time rather than implementing the entire system at the outset.

## red-meaning｜2. Why make a test fail first?

Beginners often find this part of TDD confusing.

You may wonder: “Shouldn’t I try to make the program succeed? Why deliberately make it fail?”

Red checks whether the test can actually detect a fault.

Imagine building a machine that automatically identifies defective products.

You feed it an obviously defective product, but it marks the item acceptable. Its inspection capability is inadequate.

If you only test acceptable products and never use a defective one, repeated “pass” results cannot establish that the machine detects defects.

The same reasoning applies to software tests.

### Not every red result is meaningful

| Test result | Meaning |
| --- | --- |
| Required data is missing, but the program allows export | Useful Red: the test detects a missing requirement |
| The `pytest` package cannot be found | Environment problem, not a business-rule failure |
| Python syntax error | The program cannot execute normally |
| No tests were found | No effective test was executed |
| The test already passes | Check whether the feature exists already or the test misses the real requirement |

Red must fail because the program does not meet the expected behavior. An arbitrary error does not establish that feedback; the original lesson makes this requirement explicit.

## industries｜3. Which industries can use TDD?

TDD is a software development method. Software in almost any industry with explicit rules can use it to develop or verify features.

| Industry | Required rule | Test to write first |
| --- | --- | --- |
| Banking | Reject withdrawals exceeding the balance | With a balance of 100, reject a withdrawal of 150 |
| Healthcare | Do not ignore a recorded drug allergy | Block or warn about prescribing a flagged drug according to configured policy |
| E-commerce | Do not complete an order with insufficient stock | With only 2 units in stock, reject or adjust a purchase of 3 |
| Education | Do not mark an incomplete assessment as passed | Do not produce a completed state while required answers remain blank |
| Public administration | Do not close a case missing required documents | Do not mark review complete without a signed document |

These are business rules.

TDD can turn requirements from a document into tests a computer can run repeatedly.

For the withdrawal rule, first describe Given–When–Then:

Given: The account balance is 100.

When: The user attempts to withdraw 150.

Then: Reject the withdrawal, and keep the account balance at 100.

There are two outcomes to test: rejection of the withdrawal and preservation of the original balance.

Once those two requirements are automated, the TDD cycle can begin.

## requirement｜4. Practice: from faulty code to correct code

Use the original lesson’s document-export example to practice a complete Red, Green, Refactor cycle in Python.

### What is the requirement?

We are developing a document-report generator.

It has this rule:

> If `document_type` is missing or invalid, the generator must not produce a report marked `complete`.

For example, a document type of “合成申請表” (synthetic application form) allows report generation.

Reject an empty string, whitespace-only text, `None`, or a number.

## red-stage｜Stage 1: Red — write the tests first

Suppose the current implementation is:

```
def build_report(record):
    return {"status": "complete", "data": dict(record)}
```

This code never checks the document type.

Whenever someone requests a report, it responds with `complete`.

Write a test file named `test_export_gate.py` first:

```
import pytest
from export_gate import build_report


@pytest.mark.parametrize("value", ["", "   ", None, 42])
def test_missing_document_cannot_be_complete(value):
    with pytest.raises(ValueError, match="缺少文件類型"):
        build_report({"document_type": value})


def test_valid_document_matches_contract():
    result = build_report({"document_type": "合成申請表"})
    assert result == {"status": "complete", "data": {"document_type": "合成申請表"}}
```

Three technical terms need explanation here.

`pytest` is a Python tool for automated testing.

`@pytest.mark.parametrize` enables parameterized testing: one test runs with several inputs without writing the same test four times.

`pytest.raises(ValueError)` means “this code is expected to raise a `ValueError` exception, and its message must match the specified content.”

If no such exception is raised, the test fails.

Run:

```
python -m pytest -q
```

All four invalid inputs are accepted, so four tests fail. The valid-document test passes.

This is the Red feedback we want to observe.

## green-stage｜Stage 2: Green — make the smallest repair

The cause is now known: input validation is missing.

Add only the necessary condition.

```
def build_report(record):
    value = record.get("document_type")
    if not isinstance(value, str) or not value.strip():
        raise ValueError("缺少文件類型")
    return {"status": "complete", "data": {**record, "document_type": value.strip()}}
```

Here is what the code does:

Get the document type, check that it is text, then check that content remains after trimming surrounding whitespace.

For invalid input, use `raise ValueError(...)` to tell the caller that the data does not meet the requirement.

For valid input, return a complete report.

Run exactly the same tests again.

The four invalid cases should now be rejected correctly, while valid data still produces a report.

This is Green.

Repair the implementation to meet the original acceptance standard; do not change that standard merely to obtain a pass.

## refactor-stage｜Stage 3: Refactor — organize without changing behavior

The tests pass, but document-type validation might later be needed by other functions.

We can extract it into a function.

```
def require_document_type(value):
    if not isinstance(value, str) or not value.strip():
        raise ValueError("缺少文件類型")
    return value.strip()


def build_report(record):
    document_type = require_document_type(record.get("document_type"))
    return {"status": "complete", "data": {**record, "document_type": document_type}}
```

This version separates two responsibilities that were previously mixed together.

`require_document_type()` validates the document type.

`build_report()` assembles the report.

Other functions could reuse the validator if they need the same check later.

Refactoring must preserve externally observable behavior, and it does not require function extraction. Excessive splitting can make already-clear code harder to understand.

After editing, rerun the tests to check that the reorganization has preserved existing functionality.

## evidence｜Execution results and evidence boundaries

The supplied source reports a run in a separate Python environment: Red had 4 failures and 1 pass; Green passed all 5 tests; Refactor passed all 8 after three tests were added. The figure represents that report, not completion of the reader’s exercise.

The refactoring stage added tests for a missing field key, trimming surrounding whitespace and preserving the original input. The source reports pytest 9.0.2, differing from the original lesson’s 8.4.2. This revision’s reproduction and environment are recorded separately in the release evidence; a source report is not a current measurement.

This revision separately ran the published code using Python 3.11.15 in isolated pytest 8.4.2 and 9.0.2 environments. Both produced 4 failures and 1 pass at Red. Green and Refactor each passed the original 5 tests, and both passed 8 after the three regression cases were added. This distinguishes test-set expansion from behavior-preserving refactoring; coverage remains limited to this example’s document-type rule.

Evidence from these stages answers different questions:

Red shows that tests detect a specific fault; Green shows that the implementation fixes it; Refactor checks that the tested behavior still works after reorganization.

## comparison｜5. How does TDD differ from testing afterward?

Conventional testing and TDD are not mutually exclusive tools.

Their main difference is the role tests play during development.

| Aspect | Implement, then test | TDD |
| --- | --- | --- |
| Starting point | Consider implementation first | Consider expected behavior first |
| Test timing | Often after implementation | Write a test before implementation |
| Defect discovery | May wait until the feature is complete | Immediate feedback in each small cycle |
| Design | Architecture may be fixed first | Requirements and tests progressively inform design |
| Refactoring | Use existing tests and review | Protect each refactoring step with passing tests |

This comparison does not establish that TDD is always faster or produces fewer defects than every other process. Outcomes depend on test quality, developer capability, system type and maintenance cost. Agile Alliance also treats empirical outcomes with caution.

## agent-workflow｜6. How does TDD support AI Coding Agents?

TDD is useful to understand when using an AI Agent to write code.

AI can generate code quickly, but generation alone does not verify requirements.

Suppose the only instruction is:

“Build a report-generation feature.”

The Agent may produce apparently normal code while omitting document-type validation.

With TDD, structure collaboration as follows:

1. A person defines requirements and acceptance criteria.
2. The Agent writes tests, executes them and shows the expected failure.
3. The Agent repairs implementation and reruns the same tests.
4. Confirm results, refactor and verify again.

You can give an AI Coding Agent this instruction:

> From the requirements specification, select one smallest verifiable behavior and create a pytest test. Run it first and explain the expected reason for failure. Do not change the test at this stage to accommodate existing code. Then make the smallest repair and retain the same tests’ passing results. Finally, refactor where necessary, run regression tests and report which requirements have been verified and which remain unverified.

This makes the implementation process behind AI output reviewable.

A remaining risk is that the same Agent may misunderstand the requirement, write an incorrect test and produce code that passes that incorrect test. TDD cannot guarantee correctness in that situation. People or independent verification should confirm important acceptance criteria.

## quality｜7. Do passing tests establish overall software quality?

No.

For example, document-type validation may be confirmed while the following remain unverified:

| Verification layer | Question still to answer |
| --- | --- |
| Unit test | Are individual fields and business rules correct? |
| Integration test | Does document processing integrate correctly with the database? |
| End-to-end test | Can a user proceed from upload through export? |
| Security test | Can a user read documents owned by someone else? |
| Usability test | Do users understand the error message and know how to fix it? |

TDD contributes quality evidence within a broader quality-assurance process.

As the original lesson notes, this exercise covers one document-type rule. Passing it cannot establish completion of the whole application, every field or security controls.

## applicability｜8. When is TDD most useful?

Prioritize explicit, repeatable rules where errors have a higher cost: monetary calculations, permission decisions, data validation, state transitions, API contracts and regression fixes for observed bugs.

When exploring a new visual design, user preferences or unclear product requirements, first use prototypes, interviews or exploratory testing to understand the problem. Then automate the behaviors that have been confirmed.

TDD helps answer “Did we implement this requirement correctly?” It does not automatically answer “Is the requirement itself right?”

This connects TDD with the earlier topics of requirements engineering, Given–When–Then and specification-driven development (SDD).
