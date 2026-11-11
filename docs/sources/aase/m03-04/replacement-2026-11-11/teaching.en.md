# MVP, scope and the not-in-this-version list

The central idea of this lesson is to identify the most valuable question to test, complete one valuable task at minimal cost, and collect evidence for the next decision, before building every desired feature.

This applies to software development, food services, healthcare, finance, manufacturing, education, government services and academic research.

The AASE M03-04 lesson requires the first version to retain a complete input-to-result workflow, necessary error handling and an acceptance method that demonstrates task completion.

## 1. Understanding MVP: why more features do not automatically help

Imagine opening a restaurant.

Your ideal is a large restaurant with these services:

- Chinese, Western and Japanese food, and desserts.
- Dining in, takeaway and delivery.
- Online reservations, membership and reward points.
- Automated purchasing, inventory management and financial analysis.

You do not yet know whether nearby residents like your food or how much they will pay.

There are two possible approaches.

Approach A: build the complete restaurant first.

Rent a large space, hire chefs, design the menu and develop membership software, investing considerable money before opening.

If customers ultimately dislike your food, that investment may be wasted.

Approach B: start by selling one boxed meal.

Select a meal you can prepare well and establish a complete service workflow:

@figure1

You can observe:

1. Will customers buy it?
2. Do they consider the price reasonable?
3. Will they buy it again?
4. Is there a reasonable profit per meal after costs?

These observations provide useful information before a large investment.

That is the basic purpose of an MVP.

### What does MVP mean?

MVP stands for Minimum Viable Product.

Consider the three words separately:

| Word | Plain meaning |
| --- | --- |
| Minimum | Only the parts needed to answer the core question |
| Viable | Works in a limited situation and provides useful validation |
| Product | A product or service that target users can actually experience or operate |

Eric Ries, an important advocate of MVP, emphasizes obtaining validated learning with minimal effort, rather than merely producing something with few features.

Therefore:

MVP ≠ a crude product.

MVP = a product or experiment that tests the most important assumption with minimal investment.

In the original Lean Startup context, MVP focuses on real customers and market assumptions. This AASE lesson applies the idea to a teaching prototype, first asking whether a verifiable workflow can be completed. Completing a classroom prototype does not establish market demand.

## 2. Small still needs to be complete

This is an easily misunderstood point with substantial practical consequences.

Suppose the first version of a laundry service handles only ordinary clothes.

That is a reasonable reduction in scope.

Taking clothes from customers without washing, return or exception-notification arrangements leaves the service incomplete.

Compare these cases:

| Reasonable reduction | Core part to retain |
| --- | --- |
| One type of boxed meal | Food safety and order delivery |
| Ordinary laundry only | Handling lost clothes or failed delivery |
| One report format | Required-field checks and error handling |
| One supported machine | Abnormal shutdown and safety protection |
| One booking situation | Booking conflict checks |

You can reduce the variety of services while retaining the steps necessary to complete the chosen service correctly.

In software engineering, a minimum end-to-end flow is often described using a vertical slice: one small selected capability works through the frontend, necessary backend processing and final result, without completing every feature first.

Consider an order system:

@figure2

The second system may look more polished, but it has not completed the user's task.

Keep this principle in mind:

A first version can be small while remaining accountable for the task it promises to complete.

## 3. Find the riskiest assumption before building

Projects can fail because untested ideas are treated as facts, even when engineers can write the code.

Suppose a company plans an AI customer-service system.

A manager may think:

“If AI understands customer questions, we can reduce customer-service staffing.”

This statement contains several unverified assumptions.

| Assumption | Consequence if false |
| --- | --- |
| AI understands customer questions | Wrong answers may mislead customers |
| Customers will use AI | The finished system may have no users |
| AI handles genuinely frequent questions | Human workload may not decrease meaningfully |
| AI recognizes questions it cannot answer | Invented answers may lead to complaints |
| The company has rights to use the relevant data | Legal or data-governance issues may arise |

Spending three months on an attractive interface may leave the main risk unresolved if the company has no organized support knowledge.

First ask:

“Which assumption, if wrong, could make the rest of this work pointless?”

This is the riskiest assumption.

The UK Government Digital Service's official alpha guidance also emphasizes testing the riskiest assumptions without building the whole service first.

### Finding high-risk assumptions in different industries

The following are hypothetical teaching examples.

| Industry | Question to establish first | First small experiment |
| --- | --- | --- |
| Food services | Will customers pay? | Sell a small batch of one meal |
| Finance | Does an AI-generated report meet necessary rules? | Generate one report from synthetic data and check it manually |
| Healthcare | Can users operate it correctly? | Test one booking flow using fictional patient data |
| Manufacturing | Can it warn reliably before a material shortage? | Evaluate one production line using historical or simulated data |
| Education | Does the new method improve learning outcomes? | Small-scale pre/post testing with a comparison assessment |
| Logistics | Is the dispatch method more efficient? | Compare simulated routes in a defined area |
| AI research | Does the method beat the baseline? | A controlled comparison on a fixed dataset |

Each MVP differs because the core question differs.

An MVP does not always require programming: paper workflows, manual services or operable prototypes may test the assumption without a complete software system.

## 4. Decide what belongs now, later or outside this version

M03-04 uses three scope states as a practical decision method.

@figure3

### A teaching example: clinic appointments

Suppose you are designing a teaching appointment system. The initial goal is to test:

“Can an administrator complete one appointment while preventing duplicate bookings?”

You could classify the features as follows:

| Feature | Decision | Reason |
| --- | --- | --- |
| Select a date and time slot | First version | Necessary booking step |
| Check availability | First version | Prevent conflicting use of a slot |
| Show booking success or failure | First version | Users need to know the outcome |
| Cancel and choose another slot | First version | Core exception recovery |
| Cross-campus appointments | Deferred | Campus-specific management rules need confirmation |
| Integrate official medical records | Deferred | Requires integration, identity and personal-data governance |
| Automatically diagnose disease | Not in this version | Outside the booking system's responsibility |

Cross-campus appointments may matter, but they are not currently needed to test the core question.

### Why deferred work needs an activation condition

Suppose a manager says:

“The system must eventually support ten hospitals.”

“Do it in version two” supplies too little information.

Record a conditional decision:

> Cross-campus appointments: deferred. Once each campus's roles, permissions, appointment rules, data isolation and official integration requirements are confirmed, reassess scope, architecture and acceptance conditions.

The first statement is a vague promise; the second records conditions for a decision.

This helps prevent a common problem:

A tool created for testing gradually becomes an operational system without the necessary redesign.

## 5. Retain necessary quality and safety

This section concerns conditions the first version must retain.

Imagine a food factory testing an automatic packaging machine.

To reduce costs, the first version can package one product.

Can it therefore remove safety guards?

No.

Packaging one product reduces scope; removing necessary safety guards breaks a basic condition for the system to operate safely.

Software has the same distinction.

In requirements engineering, these conditions are constraints or invariants: conditions that must remain true.

Consider AASE's synthetic intake example:

Users enter three required fields. The system identifies omissions, supports correction and produces a report.

Two constraints matter:

Constraint one: incomplete required fields must not produce a report marked complete.

Constraint two: editing input invalidates the previous check; the system must not export using stale results.

The second constraint is easy to miss.

Consider this input sequence:

@figure4

Connecting an AI model or polishing the interface does not resolve this issue.

Even a simple program needs to enforce its core business rules.

## 6. Responding to a request for another feature

This situation occurs frequently in development.

Suppose a team plans to finish an order-system MVP in two weeks.

Halfway through, a manager says:

“Since users can enter orders, add Excel batch import too!”

That apparent extra button may require handling:

File-format errors, duplicate orders, field mapping, partial success and failure, post-import confirmation, and correction of erroneous records.

Scope creep occurs when work gradually expands without corresponding changes to time, resources or commitments.

### A change-decision framework

@figure5

Retain this principle:

Adding a feature must retain the necessary tests, input checks and safety constraints.

With a fixed deadline, added work requires explicit tradeoffs. If existing work cannot be removed, revisit time or resources.

## 7. Evidence that an MVP is complete

A program starting successfully does not establish task completion.

An AI agent's claim that coding is finished does not establish acceptance.

We therefore need acceptance criteria.

They ask:

Under which conditions, and with which observable results, will we recognize the work as complete?

Given–When–Then describes these criteria:

Given: the initial state.

When: the user's action.

Then: the required system outcome.

For the report system:

| Test situation | Expected result |
| --- | --- |
| A required field is missing | Identify missing fields and block complete export |
| The user fills the fields and checks again | Pass the check and allow the current report |
| The user edits input after a successful check | Invalidate the old result and require a new check |
| The user cannot understand an error message | Record the difficulty and improve the message |

The first three primarily test functional correctness.

The fourth concerns usability and requires observing whether actual users understand and complete the task.

Preserve these evidence types separately: correct software behavior does not establish successful user operation.

### Four related terms

| Term | Main question |
| --- | --- |
| PoC: Proof of Concept | Is the technology feasible? |
| Prototype | Does the design or interaction make sense? |
| MVP: Minimum Viable Product | Can minimal investment test core value or an important assumption? |
| Pilot | Can it operate effectively in a limited, controlled real environment? |

These types can overlap and do not require a fixed order. An MVP may include prototype and PoC experiments.

In healthcare, finance, government and other high-responsibility contexts, an MVP using synthetic data supports only the corresponding prototype conclusions. It does not establish safe, lawful handling of real data.

## 8. Turn the ideas into an executable scope document

The lesson's deliverable is a scope document for team discussion, AI Coding Agent handoff and acceptance, rather than a large volume of code.

Here is a synthetic problem.md example. Both language versions retain the same Chinese document; the explanation below covers its complete contents.

@sharedcode

This converts “build an equipment-inspection system” into work with explicit responsibility, completion conditions and verifiable outcomes.

In AI-assisted development, it helps prevent unrequested features and avoids treating generated code volume as project progress.

## 9. The lesson's knowledge map

@figure6

Each investment cycle should provide the knowledge needed for the next decision. It does not always have to produce a product.

This leads to M03-05: after defining minimum scope, which success metrics will show whether the product delivers value?

## 10. Understanding check: a logistics decision

Scenario: a logistics company wants to introduce AI dispatch.

Dispatchers currently plan truck routes manually each day. A manager wants an AI dispatch system within three weeks.

The five requested capabilities are route suggestions, live GPS tracking, a driver mobile app, cross-region collaboration and exceptional-order handling.

The team has not established that AI routes outperform manual scheduling. Test outputs must not directly affect operational dispatch.

Question one: Which high-risk assumption would you test first, and why?

Consider whether the other features retain development value if that assumption fails.

Question two: Which steps would you retain for a minimum complete workflow? Which features would you defer or exclude?

Displaying a map alone does not complete the task.

Question three: Give two necessary constraints and three objectively checkable acceptance scenarios.

Consider correct results, exceptions and operational boundaries.

Question four: In week two, the manager requests the driver mobile app. How would you respond?

Consider workload, tradeoffs, decision responsibility and effects on the original validation.

Write your judgment before comparing it with the reference explanations.

These questions test problem-driven scope, risk-based priorities, correctness constraints and evidence of completion.
