## After the rules are correct, how do you verify user operations?

Correct program rules do not guarantee correct behavior when someone uses the screen. Consider a bank application system with the rule “Incomplete data must not produce a report.” Even if a backend function rejects omissions, the interface and state management may still fail:

1. The user leaves required data incomplete.
2. The screen nevertheless displays “Check successful.”
3. The user completes the data, but the screen does not update.
4. The user deletes data again but can still download an earlier report.

These are interface and state-management failures, which may occur even when the business rules are correct. Streamlit AppTest automates simulated operations and inspects the resulting display and program state. Read each assertion in relation to the preceding input and rerun.

@figure1

After every input change, verify the result of the new operation rather than reusing the previous state. Building on the rule tests in M08-03, this lesson checks how a user task is completed through the interface.

## 1. Why use AppTest? Think of restaurant ordering

Imagine running a restaurant with a self-service ordering kiosk. Its system has three rules:

- An order cannot be submitted without a selected meal.
- The meal, quantity and payment method must be selected before confirmation.
- Changing a confirmed order must invalidate its previous confirmation.

Test rules and operations separately. Business Rule Testing calls the checking function directly with an order that has no meal and verifies rejection. The pytest examples in M08-03 mainly address this layer.

UI Testing simulates a customer using the kiosk:

1. Submit without selecting a meal.
2. Check for “Please select a meal.”
3. Select a meal and submit again.
4. Check that the screen indicates success.
5. Change the meal and check that the previous confirmation disappears.

AppTest lets Python replay these operations automatically, reducing repeated manual clicking. It simulates the Streamlit program without operating Chrome or Firefox; verify layout, focus and actual downloads separately in a browser.

## 2. See the map: software testing has different layers

Different layers answer different questions. Plan them together according to the task.

| Test layer | Plain-language meaning | Question to verify |
| --- | --- | --- |
| Unit Test | Check one rule in isolation | Is the amount calculated correctly? |
| UI AppTest | Simulate interface operations | Do feedback and buttons update correctly after input? |
| Browser E2E Test | Complete the workflow in a real browser | Does clicking download actually deliver the file? |
| Usability Test | Ask real users to complete a task | Do users understand the feedback? |
| Security Test | Test security boundaries and improper operations | Can an unauthorized person obtain someone else's data? |

These tests complement one another. Seeing a download button in AppTest only establishes that the simulated test found that component; it does not establish that the user's computer received the correct file. An ordering kiosk can display “Order successful” while delivery to the kitchen still needs separate confirmation.

## 3. The three-stage test at the center of this lesson

The example is an intake-data checking system with three fields: application ID, applicant code and document type. The three stages in the figure are successive operations in one scenario. Downward arrows mean changing input and then inspecting the new result.

@figure2

The third stage is easy to overlook: the system produced a correct result, but the user subsequently changed its input. If the old result remains valid, the user may download data that no longer matches the screen. This is Stale State.

> Whenever a result depends on a set of inputs, changing those inputs requires reconsidering whether the previous result is still valid.

This example clears success state and the report whenever a field changes, requiring another check. The same principle applies to financial approvals, medical reports, research-data processing and logistics scheduling; each system's specification still determines when revalidation is necessary.

## 4. Six core AppTest terms

Distinguish input components, data retained across reruns and the action that the test explicitly executes.

| Term | Plain-language meaning |
| --- | --- |
| Streamlit | A framework for building interactive web applications quickly in Python |
| Widget | An input field, button, selector or other interface component |
| AppTest | A tool that simulates a Streamlit app, sets input and inspects results |
| Session State | Data and state remembered for the current user session |
| run() | Explicitly rerun the program so new input produces a new screen |
| assert | Require a condition to hold, failing the test if it does not |

Think of Session State as a shopping cart: after adding three items and switching pages, the site still remembers them. The analogy illustrates retaining data across operations; actual storage scope and lifetime depend on implementation.

Streamlit widget interactions trigger script reruns, while Session State retains data across them. AppTest requires the test program to call run() explicitly: set input, rerun and then inspect the new screen.

## 5. Build an application you can test automatically

This simplified teaching example uses the same three synthetic fields to demonstrate blocking omissions and invalidating stale results. A production intake or approval system also needs authorization, data isolation and backend validation appropriate to its specification.

```text
my-project/
├── app.py
└── tests/
    └── test_app.py
```

### Step 1: Write app.py

Save the complete program below as app.py. Stable keys identify the three fields in tests; the check button has its own key too.

@app

on_change=invalidate runs invalidate() when an input field changes, clearing the previous confirmation. pop("checked", None) removes that state if present and otherwise does nothing; report is cleared in the same way.

When the check button is pressed, the program trims surrounding whitespace and identifies missing fields. Missing data clears old results and displays an error; complete data is serialized to JSON, saved as the report and marked checked. The success and download area sits outside the button condition so subsequent reruns display it according to current state; a field change triggers the callback to invalidate the old report.

### Step 2: Simulate operations with AppTest

Save the following test as tests/test_app.py. Path finds app.py relative to the test file, avoiding dependence on the launching shell's incidental working directory.

@tests

Stage one fills only two fields and checks that the error names document type, entered data remains and both success and download components are absent. Stage two completes the third field and checks for success, a download component and checked/report state. Stage three clears the third field again and checks that old success, download, checked and report all disappear.

The test checks whether the screen and state after each operation satisfy the specification. Streamlit 1.51.0 has no dedicated at.download_button operation API; this lesson uses at.get("download_button") to inspect component presence, which does not establish a real download. The example pins this version; recheck APIs and test results when upgrading.

### Step 3: Run the test

Use an isolated Python virtual environment from the project root, install the specified version and execute the test.

```sh
python -m venv .venv
source .venv/bin/activate
python -m pip install streamlit==1.51.0 pytest
python -m pytest -q tests/test_app.py
```

Passing means the assertions executed in this run held. Start the actual program, replay the operations and inspect the download filename report.json, Chinese data, status and field values against the current input.

```sh
python -m streamlit run app.py
```

In the browser, fill two fields and check for omission feedback; complete the third field, check and download JSON. Then clear document type and leave the field: old success and the download entry should disappear. Also use Tab, Shift+Tab, Enter and Space to inspect focus and button operation. Stop the service you started with Ctrl+C and leave the virtual environment with deactivate.

## 6. Translate AppTest code into everyday language

Match each expression to the effect it inspects. The five entries below are a syntax reference, not a test that must execute continuously from top to bottom.

@figure3

A Regression Test reruns existing tests after a program change to check that previously working behavior has not been damaged. For example, a system may correctly reject missing data until a new export feature permits incomplete downloads. Retaining tests for omission, success and invalidation after edits helps expose such changes early.

## 7. What can AppTest check in other industries?

When changing industries, identify which inputs a result depends on, then design assertions for changes to those inputs.

| Industry | Interface scenario | Important assertion |
| --- | --- | --- |
| Healthcare | A patient changes the date after booking | The old summary must not represent confirmation of the new date |
| E-commerce | A customer changes the cart after applying a coupon | Recalculate the amount without retaining an invalid discount |
| Human resources | An employee changes leave dates | Do not reuse the old duration or approval state incorrectly |
| Logistics | A warehouse worker changes shipment quantity | Reconsider the previous shipping cost and confirmation |
| Education | A student changes registration data | Incomplete data must invalidate the previous completion state |

These scenarios share the reasoning sequence “Input → validation → result → changed input → invalidated old result.” Recognizing that dependency transfers the testing approach to other systems; each system's specification still defines the actual fields and validity conditions.

## 8. AppTest boundaries: four common mistakes

When interpreting results, state both the scenarios executed and the evidence still needed.

| Common misconception | Correct interpretation |
| --- | --- |
| All tests passed, so the software has no bugs | Only the executed scenarios passed |
| A download button exists, so downloading succeeded | The actual file and contents still need verification |
| Input changes do not require running the test again | AppTest requires an explicit run() |
| A normal-looking screen establishes security | Authorization, data isolation and backend validation also need tests |

Suppose users A and B can both log in. Testing that A can download their own report does not establish that A cannot download B's report. Design separate authorization and cross-user isolation tests. AppTest can inspect some visible interface behavior; backend security controls still require corresponding verification.

## 9. Check your understanding before reading explanations

In “Check your understanding” below, choose an answer and consider your reasoning before expanding each reference explanation. The three questions address run(), stale state and evidence for real downloads. This page uses native disclosures; choosing answers and reading explanations does not record learning completion.

The skill to take away is separating a user task into operations, state transitions and expected results, then checking the system with repeatable assertions. As a next exercise, deliberately introduce a bug that leaves an old report downloadable after input changes, verify that AppTest fails, repair the program and rerun it.
