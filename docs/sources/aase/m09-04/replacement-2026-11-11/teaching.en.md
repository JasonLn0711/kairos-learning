# M09-04 | Changing technology and continuing engineering responsibility

The central idea of this lesson is simple:

Tools may keep changing, but your responsibility for the quality, safety, and correctness of their output continues.

For example, today you might use ChatGPT to write code, tomorrow Claude Code, and later another AI Coding Agent. Tools may become more capable, but you still need to establish whether the program does the right thing, data remains protected, permissions stay controlled, and failures can be recovered from.

This is the central lesson of M09-04.

## 1. Start with an everyday example

Imagine that you own a restaurant.

Your kitchen replaces a traditional gas stove with a modern smart induction cooker.

The new equipment may be faster, use less energy, and control temperature automatically.

Three commitments still remain:

- Customers must receive the meals they ordered.
- Food must meet hygiene and safety requirements.
- The restaurant must have a way to handle orders if the new equipment fails.

Therefore:

Changing equipment does not redefine what makes a restaurant good.

The same reasoning applies to software engineering.

Changing a programming language, AI model, development framework, or cloud platform does not erase previously confirmed user requirements, data protections, and acceptance criteria.

## 2. What may change, and what must be retained?

@figure1

The responsibilities on the right can also change when requirements change. That requires an explicit decision, updated specifications, and renewed verification; the tool cannot decide on its own.

For example, a hospital originally permits only authorized doctors to view particular medical records.

One day, the hospital replaces its AI medical system.

Even a highly capable replacement does not justify allowing every employee to view those records simply because broader access is convenient.

A tool's capability and a system's authorization are separate matters.

## 3. Different technical changes need different checks

This is a practical part of the lesson.

Engineers must distinguish the kinds of change involved in a tool update.

| Change type | Everyday example | What to check again |
| --- | --- | --- |
| Replace the AI Coding Agent | Switch from tool A to tool B for coding | Files the AI can access, commands it can run, and whether changes meet specifications |
| Replace the UI framework | Move a website from Vue to React | Buttons, input, screen state, downloads, keyboard operation, and deployment |
| Move from one user to many | Turn a personal bookkeeping tool into a shared company system | Identity, separation of users' data, authorization, and audit records |

### Example A: replace the AI Coding Agent

Suppose you use AI to develop a bank loan calculator.

Tool A correctly calculates monthly repayments. You now want to use tool B.

Asking whether tool B writes code faster is only a starting point.

Also ask:

Did tool B read the correct requirements? Could it alter a core formula that should remain unchanged? Can it preserve a reviewable code diff? Could an external-service call transmit sensitive data without authorization?

Replacing an AI development tool therefore calls for checking the development process, tool permissions, and actual changes produced.

If you change the tool without executing the program again, you cannot claim that the replacement has passed acceptance.

### Example B: replace the frontend UI framework

Suppose a school has a grade-query website.

It was built in Vue and is now being migrated to React.

The semester-average formula remains unchanged, but the website could still develop these failures:

- Clicking the query button produces no response.
- The grade screen displays the previous student's data.
- The PDF export button stops working.
- The mobile interface becomes unusable.

Passing every unit test for average calculation therefore does not establish that the website migration succeeded.

This introduces an important term:

Regression testing checks that previously working behavior still works after a change.

A UI-framework replacement requires retesting affected UI behavior as well as the original calculation rules.

### Example C: move from one user to many

Suppose you wrote a personal bookkeeping tool used only by you.

You now want to offer it to one hundred companies.

Even if its existing functions are correct, the original program is not ready for that deployment without further work.

There are new questions to address:

Can employees of company A see company B's accounts? Can managers access employees' private data? When are departing employees' permissions revoked? Do data operations leave audit records?

Adding a login page alone does not resolve these questions.

The system's identity management, authorization model, and data governance have changed.

## 4. Define success before migrating

A general process can guide technical replacement across industries.

@figure2

Two concepts deserve particular attention.

Acceptance criteria state in advance what counts as success, rather than allowing the standard to be chosen after the work is done.

For example, a replacement customer-service AI must complete specified customer tasks, handle unknown answers appropriately, and avoid leaking other customers' data. Quality, latency, and cost thresholds can make these criteria more precise.

Rollback asks whether a failed replacement can safely return to a previous working version.

If a new e-commerce system cannot process payments after release, use the recovery plan to switch to a stable version instead of leaving customers to encounter the failure.

If database schemas or stored data have changed, reverting code in Git may be insufficient. Data compatibility and a recovery plan are also needed.

## 5. Why people remain responsible as AI becomes more capable

Suppose an insurer uses an AI Agent to analyze claims automatically.

The AI says, “This claim does not meet the rules; rejection is recommended.”

That raises questions:

Who defined the rule? Did the AI use the correct version of the policy? Who can correct a mistaken decision? Who handles a customer's appeal?

Engineering responsibility therefore includes at least these roles:

The business owner defines rules and acceptable outcomes; the technical owner ensures implementation follows specifications; data and security owners check access and risk controls; the acceptance owner decides whether to accept the result based on test evidence.

One person can hold several roles, but each responsibility still needs an owner.

The NIST AI Risk Management Framework (AI RMF) helps organizations identify, assess, govern, and manage AI risks. Using it does not establish security certification or prove that all controls have actually been implemented.

## 6. Practice: plan a company's tool migration

A retailer wants to replace customer-service AI model A with model B to reduce costs.

Start with this short migration plan.

| Item | Migration plan |
| --- | --- |
| Change goal | Reduce the cost of each customer-service conversation |
| Requirements to retain | Query orders, explain return policy, and escalate to a person when needed |
| Security rule to retain | Never obtain another customer's order data |
| Normal case | Customers can retrieve their own authorized orders |
| Negative case | Providing someone else's order number must not disclose their information |
| Acceptance criteria | Core tasks meet predefined quality thresholds, security tests pass, and costs actually improve |
| Stop conditions | Cross-customer disclosure, major errors, or loss of core functionality |
| Recovery | Retain the old model, settings, and routing so traffic can switch back when needed |
| Current status | Plan complete; tests not yet executed |

The last row matters.

Writing a plan does not establish a successful model replacement. A few test runs do not establish formal acceptance either.

Engineering records need to distinguish:

Plan complete → implementation complete → tests passed → acceptance complete → formal delivery

Each stage needs corresponding evidence.

## 7. How this lesson connects to software engineering

Think of the AASE series as a chain of responsibilities:

@figure3

The technical implementation layer can change frequently, but each replacement requires checking its effects on the other layers.

Capabilities worth developing over time include defining problems, specifying behavior, assessing technical changes, verifying results, controlling risk, and delivering maintainable systems, alongside knowledge of particular models and frameworks.

## 8. Check your understanding

You inherit a clinic's appointment system. It uses one AI Agent and a conventional website; the company now wants several collaborating Agents and a rebuilt frontend.

Consider the three questions in the understanding checks below.

The judgment to practice is to ask what evidence demonstrates that existing commitments still hold after replacing technology, alongside asking what the new technology can do.
