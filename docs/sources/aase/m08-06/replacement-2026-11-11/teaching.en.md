## Understanding Negative Testing and Regression Evidence

The central idea of this lesson is:

A system must work when users do the right thing, and must also refuse invalid input, incorrect operations and attempts to exceed permissions in a controlled way, without creating new problems.

For example:

- A bank system that transfers money successfully may still allow unauthorized transfers.
- A hospital system that retrieves records may still let staff read records they have no permission to access.
- An AI system that generates a correct report may still leak sensitive extra input.
- A vulnerability repair may break a previously working feature.

This lesson brings together Negative Testing, Regression Testing and verifiable Evidence.

The examples use a local, single-user data-validation and report-export system. Multiuser authorization remains a separate requirement that is not implemented and unverified.

## 1. Positive and Negative Tests

Imagine opening a bank and designing its ATM withdrawal system.

### Positive Testing

You want to know whether an ordinary customer can withdraw money successfully.

> Insert a valid card → enter the correct PIN → sufficient balance → withdraw 3,000 → success.

A passing test establishes that the system works for this particular normal scenario.

### Negative Testing

Next, check how the system handles requests that should not succeed.

| Test scenario | Expected behavior |
| --- | --- |
| Incorrect PIN | Refuse withdrawal |
| Balance of 1,000; requested withdrawal of 5,000 | Refuse withdrawal |
| Negative withdrawal amount | Reject the invalid amount |
| Logged-out customer requests a withdrawal | Reject the operation |
| Customer A attempts to access customer B's account | Deny unauthorized access |

The purpose of these tests is to check this question:

Does the system handle operations that should fail predictably, safely and under control?

Rejection does not require a crash or an error page. A good rejection stops the transaction, avoids unauthorized side effects and provides an appropriate message.

## 2. Turning Risks into Testable Scenarios

Security testing starts by identifying what you need to protect. Randomly entering unusual data does not establish a useful acceptance criterion.

Use this process:

@figure

This corresponds to the threat-modeling questions discussed by OWASP: what are we building, what can go wrong, how will we address it, and how will we know the response is sufficient?

For example, a hospital requires that only authorized people can read a particular record.

Derive a negative test: an unauthorized healthcare worker attempts to read the record. Confirm denial at data access and confirm that no record content is disclosed.

That gives the test a clear purpose and an observable acceptance criterion.

## 3. Three Core Cases

The teaching system validates data and exports reports. Its three negative scenarios illustrate three different protection goals.

### Case 1: Missing Required Data Must Prevent a Complete Report

Suppose an insurer generates a claim report.

The insured person, incident date and claim amount are required.

If the amount is missing but the system labels the report complete, later processing may be incorrect.

Test these conditions:

- Normal: complete data permits export.
- Invalid: a required field is blank, so export is refused.
- Invalid: a date field receives the wrong data type, so the system refuses it or requests correction.
- Invalid: input exceeds the specified length, so the system rejects it safely.

Disabling the export button is only one check. A direct call to the export function must also refuse invalid data.

The button is one route into the system. If the underlying function still permits export, the data rule is not enforced at that boundary.

### Case 2: Extra Input Fields Must Not Escape through Output

Suppose a logistics API allows only three output fields:

```
{
  "order_id": "A001",
  "product": "筆記型電腦",
  "quantity": 2
}
```

The input also contains an extra field:

```
{
  "order_id": "A001",
  "product": "筆記型電腦",
  "quantity": 2,
  "debug_note": "內部測試紀錄"
}
```

If the program copies every received field into a report, debug_note may be exported too. The sample product means laptop; debug_note contains an internal test note.

Use an Allowlist.

Explicitly permit only order_id, product and quantity in the output. Other input fields do not enter that output.

The test should compare the exact set of JSON keys with those three names. Checking only that a report was created does not check its output contract.

This establishes constrained output fields for that scenario. It does not establish that logs, databases or other output channels cannot leak data.

### Case 3: Changed Data Must Invalidate an Old Success

This case is easy to overlook.

Imagine checking out at an online store:

1. The cart contains two items.
2. The system calculates a total of 2,000.
3. The interface shows that the order check is complete.
4. You remove one item.
5. The system still retains the old 2,000 checkout result.

This is a Stale State problem.

In the report system, a user first completes all required fields and obtains a success message and download. The user then clears a required field, but the old success and download remain visible.

The correct behavior invalidates that old result and requires another check. The backend must also reject data that no longer meets the specification.

This case tests whether a state change causes the system to reassess the validity of its previous result, as well as whether an input is valid in isolation.

## 4. Why Hidden Interface Elements Do Not Establish Security

This is a key security idea in this lesson.

Consider two employees, Ming and Hua.

After Ming signs in, the interface lists only Ming's reports. The engineer assumes report isolation is complete.

Ming might instead request Hua's report directly through the backend API:

```
GET /api/reports/102
```

If the backend checks only whether Ming is signed in, without checking permission to read report 102, unauthorized access remains possible even though Hua's report never appears in Ming's interface.

Distinguish these terms:

| Concept | Plain-language question |
| --- | --- |
| Authentication | Who are you? |
| Authorization | What are you allowed to do? |
| Access Control | How does the system enforce those permissions? |

A secure multiuser system enforces authorization on a trusted server or at the data-access boundary. Hiding a browser button does not enforce that rule. OWASP recommends Deny by Default and appropriate permission checks on every protected request.

### Writing Given / When / Then

```
Given：
使用者 A 已登入，
但未獲授權讀取使用者 B 的報告。

When：
A 透過 API 請求 B 的報告。

Then：
伺服器拒絕存取，
不回傳 B 的報告內容，
也不產生未授權的資料變更。
```

The candidate scenario above means: Given authenticated A lacks permission to read B's report, When A requests it through the API, Then the server denies access, returns no report content and makes no unauthorized changes. It turns an abstract security requirement into an executable, observable test.

The current teaching prototype is local and single-user. It has no real accounts, multiple-user identities or database isolation.

Record multiuser authorization as not implemented and unverified. A fake function that merely simulates labels A and B cannot establish that production access control passed.

## 5. Regression Testing after a Repair

Regression Testing means:

Check whether a modification has broken behavior that previously worked.

Suppose a restaurant's ordering system incorrectly allows repeated use of a single-use coupon.

After fixing that defect, checking that repeated use is blocked is only the first part.

Also check:

- A valid coupon can still be used once.
- A customer without a coupon can still check out.
- Amount calculations remain correct.
- Existing discount and payment flows still work.

After a repair, answer two questions:

Does the original failing negative scenario now pass?

Do the affected normal features still work?

This is the relationship between negative and regression tests.

Weakening the rule or deleting a failing test merely to obtain a passing result leaves the original problem unresolved and removes the warning.

## 6. Writing the Tests

Python's pytest can run repeatable automated tests.

Start with a simplified report function:

@report

It checks two rules: required fields contain nonempty strings, and output contains only the three allowlisted fields.

Then write the tests:

@test

Save both files in the same empty directory. Create a virtual environment, install pytest and run:

@command

These three tests check rejection of missing data, exclusion of an extra field and preservation of normal report output.

pytest.raises(ValueError) means that this particular exception is expected. If the function returns without raising it, the test fails.

This is an independent, simplified teaching example that checks only nonempty strings and an output allowlist. Its fields and full specification differ from workshop slice three. It does not validate calendar dates, numeric amounts, length limits, stale UI state, file-write side effects or real account authorization. Of the three core cases, this code illustrates the first two only; stale results require a separate UI-state test.

### Choosing the Test Layer

| Test layer | Main observation |
| --- | --- |
| Unit Test | A function correctly rejects invalid input |
| API / Integration Test | Rules and permissions are enforced at actual data access |
| UI Test | Changing data updates success and download state |
| E2E Test | The complete path from user action to backend behavior meets expectations |

For the Streamlit teaching application, AppTest simulates interface actions and state changes. Pair it with actual browser tests to check real interaction.

## 7. What Counts as Regression Evidence?

Imagine an engineer reports a repair to a manager:

> Yesterday's problem has been fixed.

The manager needs to know which version changed, what was tested, whether the original problem disappeared and whether other behavior was affected.

Keep a verifiable record, rather than only a statement that the repair is complete.

The following is a template, not an executed test result:

| Evidence field | Example record |
| --- | --- |
| Risk ID | RISK-03 |
| Test case | NEG-03: changing a required field invalidates the old download |
| Expected result | Old success and download are invalidated |
| Method | AppTest + browser |
| Actual result | Fill in after execution |
| Code version | Git Commit Hash |
| Environment | Python, package versions and operating system |
| Regression tests | Original case and affected normal-case results |
| Unverified scope | Multiuser authorization and real deployment security |

This lets another engineer identify how the system was tested, which version was tested and which protections still lack evidence.

It establishes reproducible, auditable quality evidence. It does not mathematically prove absolute system security.

## 8. Applying the Method across Industries

| Industry | Negative test | Regression check after repair |
| --- | --- | --- |
| Finance | A non-owner attempts a withdrawal | Authorized withdrawals still succeed |
| Healthcare | Unauthorized staff attempt to read a record | Authorized clinicians can still read it |
| E-commerce | A single-use coupon is applied repeatedly | A valid coupon still works |
| Logistics | A shipment report contains extra internal fields | Valid shipment data is fully exported |
| Education | A student attempts to alter another student's grades | Teachers can still update grades within their permissions |
| AI Agent | An agent attempts a tool operation outside its authority | Authorized tool calls still complete |

The shared principle is to establish both that permitted work completes and that prohibited work is blocked, while preserving existing protections after each change.

Passing these tests establishes only the tested scenarios. Untested vulnerabilities, deployment configuration, dependencies and operational-environment risks need their own evaluation.

## 9. An Integrated Understanding Check

A school is building a grade-query system.

It currently has a simple query interface, and is intended eventually to serve 30 teachers. Each teacher should access only the student records they are authorized to manage.

An engineer discovers that teacher A cannot see B's student list in the interface, but can read B's student data by changing student_id in an API request.

Question 1: What is the most likely root cause?

A. The interface is not attractive enough

B. The backend does not correctly enforce resource authorization

C. The database query is too slow

D. The user did not refresh the page

Question 2: Which test approach is appropriate after the repair?

A. Only check that A cannot see B's data in the interface

B. Only check that sign-in works

C. Confirm unauthorized access is denied and legitimate queries still work

D. Delete the original tests

Question 3: How should acceptance be recorded if real sign-in and authorization have not been implemented?

A. Assume a pass

B. Mark not implemented and unverified; retain later acceptance requirements

C. Declare production security after testing fake accounts

Use the Understanding Checks below to reveal reference explanations. Opening an answer does not submit a response or record learning completion.

The main contribution of security verification is reliable test evidence that states which boundaries were checked, which repairs preserved existing behavior and which security requirements remain incomplete.
