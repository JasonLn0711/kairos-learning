## 1. What does this chapter teach?

When software behaves incorrectly, establish the conditions and cause, make the smallest necessary repair, and gather evidence that affected features still work.

Imagine that you repair cars. A customer says, “My car seems strange.” Would you immediately dismantle and rebuild the engine? You would first ask when the problem occurs, see whether you can reproduce it, and inspect the battery, starter motor, fuel supply or sensors before repairing the part supported by the evidence.

Software investigation follows the same reasoning. Given “This program is broken; fix it,” an AI Coding Agent may change a dozen files, restructure the application or replace dependencies. An initially small fault can then acquire additional causes and make the repair harder to evaluate.

This chapter develops an evidence-based repair process:

@figure1

Reproduce the fault, narrow the cause, capture the behavior with a test and repair it in small steps. Retain evidence and recover only the necessary changes if the repair needs to be reversed.

## 2. What does reproducing a fault mean?

Suppose you build a bank credit-document checking system with three fields: customer name, business tax ID and document type. Once all three are complete and checked, the screen says “Check passed” and allows a report download.

The user then clears the document type. The screen still says “Check passed” and still offers the previous report. This is the stale-report scenario used in this chapter.

@figure2

The underlying fault concerns the relationship between input and result: the system treats a result checked against earlier data as valid for the current data. This is Stale State, meaning that old state has not been invalidated correctly.

An application can produce incorrect results without crashing. Such faults are easy to miss when testing only for successful execution.

## 3. First identify the failure layer

A broken command does not by itself establish a fault in application logic. Distinguish three layers:

| Failure type | Plain explanation | Initial investigation |
| --- | --- | --- |
| Environment Error | Tools, packages or the runtime are not ready | Check installation, versions and paths |
| Test Error | The test cannot execute correctly | Check configuration, imports and fixtures |
| Functional Regression | A feature that should work no longer behaves as required | Reproduce the behavior and locate the cause |

Consider three Python test outcomes.

### Scenario A: the testing package is unavailable

`No module named pytest`

This usually points to the execution environment. It does not establish a fault in the form's behavior.

### Scenario B: the test cannot import the application

`ModuleNotFoundError: No module named 'app'`

Inspect the project structure, working directory and Python import path before drawing conclusions about functionality.

### Scenario C: the test executes and an assertion fails

`AssertionError: stale report still visible`

This provides direct evidence that an expected behavior and the observed behavior differ. Investigate application state and logic while also reviewing whether the assertion expresses the requirement correctly.

A test failing to execute and an executed test detecting incorrect behavior provide different evidence.

## 4. Turn a vague symptom into a repairable problem

A Minimal Reproducible Example identifies the smallest set of conditions and actions that reliably produces a fault again.

For the stale-report scenario, write down all four parts:

| Stage | Required detail |
| --- | --- |
| Given | All three fields are filled and the data has been checked |
| When | The user clears the document type |
| Then | The previous result becomes invalid and a complete report cannot be exported |
| Actual | The success message and old download remain available |

This record identifies the starting state, triggering action, expected behavior and observed fault. Another engineer or AI Agent can replay it, unlike the vague report “The download is odd.”

### Why should the test fail before repair?

A Regression Test captures the behavior so that a repaired fault can be detected if it returns.

In this chapter's Python project, run the interface test file:

```sh
python -m pytest -q tests/test_app.py
```

The command selects the interface tests; `-q` requests concise output. The pytest documentation supports invocation through `python -m pytest`.

Use this repair order:

@figure3

This resembles the Red–Green reasoning of Test-Driven Development. Here the specific task is to capture an existing fault before repairing it; this sequence alone does not establish that a complete TDD process has been applied.

If you deliberately introduce the stale-report fault and tests remain green, they may not cover that behavior. Inspect and improve the assertions before treating a passing suite as evidence for the repair.

Streamlit's `AppTest` can simulate an application, modify widget values and inspect displayed results for this type of interface test. After changing widget values, explicitly run the application again with `run()` before checking the resulting state.

## 5. How can the cause be repaired safely?

The stale-report fault arises when current input is not distinguished from the input that was previously checked. Use three protections:

1. Invalidate old results when input changes. Editing a field makes the earlier report unavailable as a current result.
2. Check consistency before display. Before showing success or download controls, compare current input with the checked data.
3. Validate again at export. The export boundary must reject invalid data even if the display layer behaves incorrectly.

The following simplified Python example illustrates the logic; it is not the workshop's original application source:

@python

The key design is a `snapshot`: a record of the input that produced the report. If the user changes the input, the earlier result cannot continue to stand for the current data.

Here `form.copy()` is appropriate for a simplified form containing only strings. Nested structures require suitable deep copying, immutable data or version identifiers. A real implementation must also validate business rules beyond the presence of field values.

## 6. Where does the same principle apply?

The following five hypothetical scenarios compare input changes and result invalidation.

| Industry | Fault scenario | Appropriate design |
| --- | --- | --- |
| Healthcare | A prescription prints the previous dose after the doctor edits it | Invalidate the old confirmation and review the current prescription before signing |
| E-commerce | Payment uses an old amount after the customer changes quantity | Recalculate before checkout and compare the current cart version |
| Logistics | An address change still permits downloading an old shipping label | Bind the label to the current order version and regenerate after changes |
| Education | A transcript retains old scores after a teacher updates grades | Recalculate and export against the updated grade version |
| Scientific research | A chart reuses an earlier analysis after the dataset changes | Record dataset, parameter and computation versions and recalculate after changes |

These are hypothetical examples illustrating one shared design rule: when a result depends on input, an input change requires reassessing whether that result is still valid.

This connects to Cache Invalidation, Data Consistency and version control. The specific invalidation mechanism depends on what inputs the result actually depends on.

## 7. Recover changes while preserving other work

Suppose an AI Agent changes `app.py` and breaks downloads. Another engineer has improved keyboard interaction in the same file. Restoring the entire file to yesterday's version would also remove that improvement.

Identify the scope of the changes you intend to recover. Begin by inspecting the working state:

```sh
git status --short
git diff -- app.py
```

After backing up the current state and confirming that `HEAD` is the intended reference, you may select individual change hunks:

```sh
git restore -p --source=HEAD -- app.py
```

`-p` selects patch mode so you can review hunks individually. Selected hunks may still discard unsaved edits, and changes spanning several hunks may not be separable safely. Back up and inspect the dependencies between changes first.

Whole-project `git reset --hard` or `git restore .` can destroy unrelated work. Choose a recovery scope supported by the diff and then verify the resulting behavior.

## 8. Give the AI Coding Agent a verifiable task

Provide the observed fault, working rules, completion conditions and scope restrictions in the task:

@figure4

A bounded task makes the Agent's proposed repair reviewable. Its completion claim must be supported by actual commands and observed results.

## 9. What evidence completes the practice?

In your own practice copy, deliberately introduce the stale-report fault, demonstrate that a test detects it, then repair it. This is a controlled synthetic exercise; it does not imply that the teacher's reference application originally contained this bug.

Retain `debugging-notes.md` with the fault conditions, reproduction steps, failure evidence, root cause, repair, test results and unverified scope.

That record lets another engineer, the next AI Agent or your future self understand what happened and why the repair was chosen. Keep the injected fault out of the normal working application.

## 10. Check your understanding

Answer the three questions yourself, then expand the reference explanations to compare your reasoning. Reading an explanation does not submit an answer or record learning completion.

Question 1: An e-commerce system still shows the old price after product quantity changes. What should you first ask the AI Agent to do?

A. Rewrite the entire checkout system

B. Establish reproducible steps and the expected result

C. Replace the frontend framework

Question 2: You deliberately retain stale reports, but all existing tests still pass. What does this indicate?

A. The application has no fault

B. The tests may not check this incorrect behavior

C. The relevant tests should be deleted immediately

Question 3: An Agent's repair shares a file with a colleague's new feature. The Agent's change is faulty. What should you do?

A. Restore the entire project to the previous version

B. Preserve the current state, identify and locally recover the faulty change, then verify again

C. Keep every change without further action

A repair needs evidence that the original problem is resolved, affected features continue to work and any necessary recovery preserves unrelated work.
