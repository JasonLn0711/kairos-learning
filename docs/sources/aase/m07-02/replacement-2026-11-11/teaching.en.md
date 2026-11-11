## 1. Understand the idea in plain language

An AI Agent resembles a capable, fast colleague who may fill gaps with assumptions. State the goal, prohibited actions, conditions requiring a pause, and the evidence expected at completion.

Imagine asking a contractor:

“Make my kitchen easier to use.”

The contractor might remove a wall, replace pipes, rebuild cabinets, or even remodel the living room.

Your actual requirement might be:

“Add two storage drawers to the existing kitchen. Keep plumbing and wiring unchanged, spend no more than NT$20,000, confirm dimensions before construction, and check that both drawers open and close afterward.”

The difference is a task agreement with boundaries, acceptance criteria and stop conditions. It turns a vague commission into work that a responsible person can review.

This applies to coding agents, document organization, research analysis, financial operations, medical administration and other delegated work.

## 2. Follow one delegation loop

1. Human confirms the specification (Specification)

Define what counts as correct and which rules have been confirmed.

2. Establish a task contract (Task Contract)

Specify scope, tools, acceptance criteria and stop conditions.

3. AI Agent executes

Operate within actually granted permissions and retain records.

4. Provide evidence (Evidence)

Show file differences, test results and unfinished items.

5. Human review and acceptance

Accept the result, request corrections or clarify requirements first.

This is a loop: the responsible person must be able to inspect what the Agent did. Giving instructions and receiving an output are only parts of verifiable delegation.

@figure1

## 3. What belongs in a task contract?

Break each delegated task into eight elements.

| Element | Plain-language question | Example |
| --- | --- | --- |
| 1. Goal | What must this task accomplish? | Build a three-field form |
| 2. Basis | Which sources govern the work? | Confirmed requirements |
| 3. Scope | What may change? | Only the form code |
| 4. Exclusions | What must remain untouched? | No login or database |
| 5. Tools and permissions | Which tools and resources are allowed? | Only the test project |
| 6. Acceptance criteria | What observable behavior counts as success? | Three editable fields and an input preview |
| 7. Stop conditions | When must the Agent defer a decision? | Ask when a business rule is unclear |
| 8. Completion evidence | What proves the work was done? | Change records and test results |

Acceptance, stop conditions and evidence are especially easy to omit.

People often state a goal without explaining which decisions the worker has no authority to make.

Consider a bank asking AI to help prepare a credit assessment report.

“Produce a complete report” could prompt the Agent to invent a scoring scheme and plausible financial judgments.

The bank's risk classifications and lending criteria are official business rules. The Agent must not guess them.

Delegate use of approved data and templates. Mark undefined evaluation rules for confirmation instead of inventing bank policy.

This is Human-in-the-Loop: the Agent performs authorized work while consequential decisions remain with a person who has the responsibility and authority to confirm them.

## 4. Why split a large task into small slices?

A vertical slice is a small result that can be accepted independently.

Suppose you are building a restaurant reservation system.

You might ask for everything at once:

“Build a complete restaurant reservation platform.”

That may produce membership, seating, payment, SMS, administration and unconfirmed reservation rules together.

A steadier approach delivers one independently reviewable behavior at a time.

| Slice | Scope of this delivery | Acceptance |
| --- | --- | --- |
| First | Name, party-size and date input | Inputs can be entered and displayed |
| Second | Date and party-size validation | Invalid input is rejected |
| Third | Find available tables | Only eligible tables appear |
| Fourth | Submit a reservation | One reservation record is created successfully |

Each slice demonstrates a meaningful user behavior; a technical component alone may not do so.

If the first slice fails, investigate the input form without simultaneously checking payments, storage, notifications and all reservation logic.

M07-02 follows the same approach: this task covers the form; later lessons add validation and export separately.

## 5. How do you instruct a Coding Agent?

The lesson uses four project documents.

| Document | Purpose |
| --- | --- |
| `problem.md` | Explain why the system is needed and the problem it addresses |
| `spec.md` | Define functions, behavior and acceptance rules |
| `architecture.md` | Explain structure, components and technical boundaries |
| `AGENTS.md` | State the project's Agent collaboration rules |

These files let separate executions work from shared project knowledge. They do not authorize the Agent to invent organizational rules.

The following task example applies those principles.

```
TASK_TEMPLATE
```

This is an instruction for the Agent, not a record of successful execution. Adjust paths and test commands to the actual project.

### Written constraints and technical controls

Telling the Agent not to modify a file does not remove its technical ability to modify it.

Distinguish two layers of constraint:

| Layer | Function |
| --- | --- |
| Written constraint | Explain which behavior is prohibited |
| Technical control | Enforce limits using file permissions, a sandbox or tool allowlists |

Telling an employee not to enter the finance room is a management rule. Requiring an access card enforces the boundary technically.

Use both. OWASP's Agent security guidance covers least privilege and human review for high-impact actions.

## 6. Should the Agent fix a problem or pause?

The kind of problem determines whether human input is needed.

Distinguish requirement ambiguity from implementation error.

Scenario A: Requirement Ambiguity

A school requests a leave system but has not specified whether leave exceeding three days requires additional approval.

The Agent must ask the responsible person instead of inventing school policy.

Response: pause affected functionality and resume once the rule is confirmed.

Scenario B: Implementation Error

The specification requires “Leave start date,” but the screen says “Enrollment date.”

The rule is already clear; the implementation is wrong.

Response: correct it within authorization and verify the change.

Stop conditions need enough flexibility to support this distinction.

Spelling fixes and code errors within the agreed scope do not require a fresh approval every time.

New official policy, broader data access, spending, deletion of important data and production deployment follow the authority and approval rules defined for the task.

@figure2

## 7. Why is “completed” insufficient evidence?

Imagine an Agent reporting:

“The system is complete and every feature works normally.”

That sentence is a claim. Acceptance needs evidence.

Check the following:

| Agent claim | Supporting evidence |
| --- | --- |
| Code was changed | Changed-file list and diff |
| Tests were executed | Actual commands and original results |
| The form works | Observed operation |
| All requirements are met | Criterion-by-criterion acceptance record |
| No extra features were added | Diff and dependency-change review |

A diff shows changes between versions, including additions and deletions.

Tests also have different scopes. Passing unit tests establishes the behavior covered by those cases; it cannot establish that the entire system has no problems.

For a form, check editable fields, keyboard operation, rejection of invalid data and whether data is sent somewhere it should not go.

Anthropic's Agent engineering guidance discusses real feedback from tool execution, stopping conditions and appropriate human checkpoints.

## 8. Apply the method across industries

| Industry | Work AI may perform | Boundary requiring explicit control |
| --- | --- | --- |
| Medical administration | Organize medical-record fields and documents | Do not invent diagnoses |
| Finance | Organize customer financial data | Do not invent loan approval rules |
| Manufacturing | Analyze equipment anomaly records | Do not shut equipment down without authorization |
| Law | Organize judgments and legislation | Do not fabricate judgments or provisions |
| Education | Produce questions and practice | Do not change official grading criteria |
| Research | Clean and analyze data | Do not modify original data or fabricate results |
| Software | Modify code and tests | Do not arbitrarily expand features or permissions |

The shared principle is:

AI can execute, analyze, organize and suggest within the authority actually granted to it.

Design specification, permissions, acceptance and traceability together so that delegation preserves decision ownership.

## 9. Four common mistakes

| Mistake | Better approach |
| --- | --- |
| Only saying “make it good” | Define observable outcomes and acceptance criteria |
| Delegating an entire complex system at once | Split work into acceptable vertical slices |
| Treating `AGENTS.md` as file protection | Also configure actual execution permissions |
| Accepting an Agent's test-pass claim | Inspect actual commands and results, retaining pending checks |

Let the Agent work autonomously within confirmed boundaries and return necessary decisions to the human owner. This supports execution while preserving responsibility.

## 10. Check your understanding: design the task contract

A hospital wants an AI Agent to develop an outpatient data organizer.

Phase one only asks for patient identifier, visit date and department inputs with a preview of entered values.

During execution, the Agent proposes adding diagnostic suggestions, an electronic medical-record database and automatic report emailing “to make the system complete.”

Answer these questions:

1. What vertical slice should this task actually deliver?
2. Which two actions would you explicitly prohibit?
3. What situation requires stopping affected changes and asking a human?
4. What evidence would you request before accepting the result?

Answer in your own words and review task boundaries, permission controls, stop conditions and acceptance evidence. Reading an explanation does not submit an answer or establish practical acceptance.
