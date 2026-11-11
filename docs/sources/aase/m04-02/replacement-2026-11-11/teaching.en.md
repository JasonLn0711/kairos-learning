# AASE M04-02 | Task Analysis and Operational Flows: How Can Systems Help People Complete Their Work?

The central idea is to understand the work a user wants to complete before deciding which buttons belong on a screen.

For example, suppose a hospital wants to develop an appointment system.

An engineer may immediately think: “We need doctor search, a date picker, a booking button and a confirmation page.”

The patient's thinking may be quite different:

“I feel unwell. I want to find an appropriate doctor, check available appointment times, book successfully and know where to go next.”

The difference between these perspectives is the focus of this lesson.

This lesson uses the supplied synthetic cases to explain task analysis, drawing on Nielsen Norman Group's Task Analysis article. These cases do not establish actual hospital, agency or factory procedures.

## 1. What Does Task Analysis Analyze?

Task Analysis is the systematic study of the work people do to achieve goals.

In everyday terms, it breaks the work someone wants to complete into smaller tasks that can be understood, performed and checked.

We want to answer five questions:

1. Goal: What does the user actually want to achieve?
2. Action: What must they do to achieve it?
3. Decision: When must they choose, compare or decide?
4. Information & Feedback: What must they know, and what must the system tell them?
5. Exception & Recovery: What happens if something fails, information is unavailable or they change their mind?

@figure1

Task analysis goes beyond arranging steps. It also identifies less visible thinking, information needs and possible failures.

### Understand It Through a Lunch Order

Suppose you are ordering lunch for five colleagues.

Looking only at the interface, the process might be:

Open the website → choose meals → place the order.

The actual work includes finding out what all five people want, checking dietary constraints such as avoiding spicy food, stock availability, budget, delivery timing and whether the order was actually accepted.

Even after ordering, a restaurant may report that a meal is sold out; you then need a way to change the order.

A system offering only meal selection and submission, without handling unavailable meals, may look simple while leaving people unable to complete their work.

Task analysis therefore examines how people achieve goals, including the work surrounding their clicks.

## 2. How Do You Break Down the Work?

Return to the course's main case: checking the completeness of intake data.

Suppose an administrative unit receives an application record and needs the system to check its completeness and generate a report.

If you ask AI directly:

“Build a data-entry page with submit, edit and download buttons.”

AI may produce an operable page without understanding what the business needs.

A better starting point is to analyze the task.

### Step One: Define the Start and End

| Element | Definition |
| --- | --- |
| User | Staff responsible for checking application data |
| Goal | Obtain a completeness report matching the latest data |
| Preconditions | Data to check and explicit field rules |
| Start | Begin processing this record |
| Successful endpoint | Confirm the check passes and obtain the correct current report |
| Other endpoints | Explicitly cancel or pause because information is unavailable |

One detail matters here:

Clicking Download does not establish success.

If someone checks the data, edits it and then downloads the old report, the download function may operate correctly while the person's task has failed.

That is why task analysis first defines what counts as success.

### Step Two: Break the Goal Into Subtasks

The following decomposition is possible.

| Subtask | What the person does | What the system provides |
| --- | --- | --- |
| 1. Prepare data | Confirm data and rules | Field explanations and required conditions |
| 2. Run the check | Enter data and initiate checking | Clear check results |
| 3. Handle omissions | Locate missing information and obtain correct values | Missing-field feedback and retention of entered data |
| 4. Verify results | Confirm the report matches the latest input | Current results and validity status |
| 5. Finish the task | Export the report or cancel | Completion, error and cancellation feedback |

Notice subtask three: handling omissions.

It is conditional. When no information is missing, the user should skip it.

This introduces the next concept.

## 3. Hierarchical Task Analysis: Decomposition and Execution Order

HTA stands for Hierarchical Task Analysis.

It divides a goal into smaller goals, which can be divided into more detailed operations.

For example:

@figure2

Alongside subtasks, HTA needs a Plan specifying which tasks to perform under which conditions.

For example, a normal path can be:

Prepare → check → verify → export.

When information is missing, the path becomes:

Prepare → check → supply missing data → recheck → verify → export.

Both paths can achieve the goal, but their conditions differ.

NN/G also distinguishes hierarchy, order, frequency, cognitive demands and variation in how different users work.

### Turn Tasks Into an Operational Flow

The following example organizes the course scenario as a flowchart. It does not claim that all real agencies use this procedure.

@figure3

The key is to define each Decision Point and Recovery Path clearly.

For example, “Is any data missing?” is a decision point.

“After obtaining correct data, return to checking” is a recovery path.

Without these provisions, an error can leave the user stuck.

## 4. Workload Includes More Than Mouse Clicks

This is another aspect of M04-02 that deserves careful attention.

Consider two broad kinds of workload:

| Workload | Plain-language explanation | Examples |
| --- | --- | --- |
| Physical / Interaction Effort | How much interaction a person performs | Clicking, typing, scrolling and switching pages |
| Cognitive Load | How much they must remember, understand, compare and decide | Remembering incorrect fields, judging correctness and determining the next action |

### Example: A Tax-Filing System

Suppose the bottom of a tax form says:

“You have three errors. Please correct them.”

It does not identify those errors.

You must scroll back through dozens of fields and work out which ones are wrong.

An engineer may say:

“The user only needs to submit once more; that adds little interaction.”

Yet the user must recall earlier input, identify errors, compare information and remember what needs correction.

That is cognitive load.

Candidate improvements include placing an explanation beside each affected field and preserving the data already entered.

These are theory-informed design hypotheses. They do not establish a measured reduction in completion time; actual effects need user testing.

### AI Systems Must Also Guard Against False Completion

Suppose AI reviews a document and finds that its document type is missing.

A faulty design guesses a type and displays “Check passed.”

A sound direction shows that information is insufficient, asks an authorized person to provide or confirm it, and then continues checking.

Task design and information reliability meet here: a smooth-looking flow must retain truthful result states.

## 5. Apply Task Analysis Across Industries

Task analysis applies wherever people follow a process to complete work, beyond software engineering itself.

| Industry | The user's actual goal | Easily missed decisions and exceptions |
| --- | --- | --- |
| Healthcare | Safely complete an outpatient booking | Unclear specialty, full appointments or rescheduling |
| Finance | Complete a loan application and understand its review status | Missing documents, additional submissions or re-review after edits |
| Manufacturing | Confirm that a product meets shipping quality requirements | Abnormal inspection, product isolation or reinspection after repair |
| E-commerce | Return goods and receive a refund | Ineligible returns, logistics failures or unclear refund status |
| Information security | Handle an incident and verify that risk is controlled | Insufficient evidence, false alarms, failed isolation or escalation |

Take manufacturing as a detailed example.

Suppose inspectors use a quality-checking system to decide whether a product may ship.

A superficial design offers only two buttons: Pass and Fail.

Closer analysis reveals that inspectors need the inspection standard, measurements, a judgment and recorded evidence. Failed products may need isolation, repair or disposal, followed by reinspection after repair.

A single product may also pass through several inspections performed by different people.

This introduces Workflow Analysis.

Task Analysis focuses on how one user achieves a goal. Workflow Analysis emphasizes how work connects across people, roles or departments. The approaches can complement each other.

## 6. How Task Analysis Relates to Other Design Methods

The following distinctions help separate commonly confused concepts:

| Method | Main question |
| --- | --- |
| Task Analysis | What must a person do and think to complete the work? |
| HTA | Which subtasks belong to a larger goal, and how are they carried out? |
| User Flow | Which paths can users take through the system? |
| UI Design | How should the interface support actions and feedback? |
| Usability Testing | Can actual users complete the task successfully? |

You can understand the methods as a design process:

@figure4

This is a conceptual order for understanding software design. Actual projects usually revisit stages and revise decisions rather than moving forward only.

## 7. Practice: Create Your Own Task Analysis

With a text editor alone, you can create an analysis that a designer and AI Coding Agent can use.

For the course's completeness-checking case, create `wireframe-notes.md` with the following content:

@template

This document has three practical uses.

First, it shows designers the work an interface must support, beyond a component list.

Second, it gives engineers the conditions and rules behind the functions.

Third, it shows testers which exceptions need coverage.

### Convert It Into an AI Coding Agent Specification

Once the analysis exists, you can give AI more than “Build me a form.”

Provide the analysis and ask it to design behavior and tests around the rules.

For example, use these three acceptance criteria:

@figure5

This connects task analysis with software testing:

Task Analysis describes how people should complete work. Acceptance Criteria translate those needs into checkable system behavior.

Passing all these functional tests still leaves actual users' ability to complete the task comfortably unverified.

Invite people from the intended user group to operate the system. Observe whether they understand messages, discover the next action, recover from errors and complete the work.

This follows NN/G's two-stage approach: gather information about actual tasks, then analyze their structure and complexity.

## 8. Understanding Check: Analyze a Different Industry

Suppose a logistics company plans an app for delivery drivers.

After delivering a parcel, a driver needs the recipient's signature and must report the delivery outcome.

Real situations include an absent recipient, an incorrect address, no network connection or discovering incorrect recipient information after signing.

Question 1: What is the driver's actual work goal?

Question 2: Identify at least three subtasks and the information each requires.

Question 3: How would you design recovery when the recipient is absent or connectivity fails?

Reference explanations appear in Understanding Checks below. Answer independently before expanding them. This page does not submit answers or establish learning completion.

The main lesson to take away:

Good software design helps people complete their actual work correctly and reliably across normal paths, exceptions and corrections.

M04-03, Information Architecture and Visual Priority, next considers how to arrange the information and actions you have identified so people can understand, find and use them.
