# AASE M05-02 | User Stories, functional and non-functional requirements: from a wish to verifiable completion

This chapter provides a foundation for Specification-Driven Development (SDD).

A user explaining the problem they want to solve does not yet tell you exactly how the software should behave or how to establish completion.

Software engineering therefore distinguishes four things:

- User Story: Who needs this, what are they trying to accomplish, and why?
- Functional Requirements (FR): What specific things must the system do?
- Non-Functional Requirements (NFR): What qualities must the system have while doing them?
- Constraints: What restrictions must development and use respect?

## 1. Understand the distinctions through ordering lunch

Suppose you are opening a restaurant and ask a chef to design lunch.

You say:

“I want office workers to have a healthy, convenient and quick lunch.”

Is anything wrong with that request?

No. But the chef still has questions:

What meals should be available? What counts as healthy? How quick is quick? Do customers have food allergies? Is there a price limit?

We need to turn a broad idea into actionable requirements.

User Story | Why do I need it?

Office workers want a suitable meal during their lunch break so that they can return to work on time.

FR | What should it do?

Provide ordering, customization, payment and order lookup.

NFR | How well should it work?

The process should be understandable, responses dependable and operation convenient.

Constraints | What restrictions apply?

Respect confirmed ingredient restrictions, budget and equipment conditions.

Acceptance Criteria | How can we confirm it works?

In specified scenarios, customers can order correctly, handle allergy restrictions, pay and look up orders; quality measures are also tested.

The purpose is to reduce ambiguity so that different people share an understanding of completion, regardless of document names.

Chefs, software engineers and AI Coding Agents face the same difficulty with vague requests: without explicit requirements, they have to guess.

## 2. User Story: establish the user's actual purpose

A common User Story format is:

> As a particular kind of user, I want to accomplish something, so that I obtain a particular value.

Consider examples from different industries:

| Industry | User Story example |
| -- | -- |
| Healthcare | As a nurse, I want to see a patient's allergy record before administering medication, so that I can reduce medication risks. |
| Commerce | As a shopper, I want to know shipping costs before checkout, so that I can decide whether to buy. |
| Education | As a student, I want to see concepts I frequently get wrong, so that I can plan revision. |
| Finance | As a credit reviewer, I want to find missing information in a report quickly, so that I can prepare the review. |
| Manufacturing | As a production supervisor, I want timely notice of equipment anomalies, so that I can arrange inspection and reduce downtime. |

None of these stories starts by specifying Python, React, a database or an AI model.

Why?

A User Story first expresses user value rather than the engineer's tool choice.

For example, students could identify weaknesses through a list of errors, a capability map or a revision list. AI is not necessarily required.

### A common mistake

“As a user, I want a blue button on the screen, so that I can press it.”

This follows the sentence pattern but does not explain the user's work purpose.

A better version is:

“As an intake worker, I want to check required fields before submitting information, so that I do not hand incomplete data to the next person.”

Whether a blue button implements this is usually a later design decision.

A User Story starts communication and requirements exploration. It is not a complete specification, and not every requirement needs to fit this sentence pattern.

## 3. Functional requirements: what exactly must the system do?

Suppose you are developing a hospital appointment system.

You receive this User Story:

“As a patient, I want to book an appointment online, so that I do not have to queue at the hospital.”

It explains value but does not give the engineer all the operating rules.

Functional requirements make the request more specific:

| ID | Functional requirement | How to check |
| -- | -- | -- |
| FR-01 | Patients can look up clinics with available appointments. | Selecting a date displays bookable sessions. |
| FR-02 | Patients can book a session with remaining capacity. | A successful booking creates an appointment record. |
| FR-03 | Patients can cancel their own appointments. | Cancellation updates the status correctly. |
| FR-04 | Full sessions must reject ordinary additional bookings. | Simulate a full session and confirm that capacity cannot be exceeded. |

Functional requirements describe both what the system permits and what it rejects.

For example, two patients may press Book at the same time when only one appointment remains.

The system must not accept both simply because both patients saw available capacity, unless the hospital explicitly permits overbooking.

The specification therefore also needs to address concurrent actions, data updates and error handling.

Asking AI only to “build online booking” leaves these rules unresolved.

## 4. Non-functional requirements: working functionality still needs quality

Imagine two banks offering the same online transfer function.

### Bank A

The function exists, but quality is poor.

Transfers often take a long time, the service occasionally crashes, and error messages are unclear.

### Bank B

Both functionality and quality have been designed.

Response times are predictable, failure states are clear, and duplicate debits can be prevented.

Both banks offer transfers, but the experience and risks differ.

That is why non-functional requirements matter.

Common quality dimensions include:

| Quality dimension | Plain meaning | Example |
| -- | -- | -- |
| Performance | How quickly work happens | Queries over a large dataset meet an agreed response-time threshold. |
| Reliability | Whether correct operation continues | Transaction states remain correct after service interruption. |
| Accessibility | Whether people with different abilities can operate it | The main task can be completed without a mouse. |
| Usability | Whether operation is understandable | Users understand how to correct an error. |
| Maintainability | Whether later changes are manageable | Adding a field does not require extensive changes to unrelated functions. |
| Security | Whether improper access and actions are prevented | Unauthorized people cannot read someone else's records. |

### Why is “the system must be fast” a poor requirement?

Suppose you commission a shopping website.

You say, “This website must be fast.”

The engineer replies, “Done. It feels fast to me.”

How would you establish whether the requirement was met?

You cannot, because there is no shared definition of fast.

Make it concrete:

Vague requirement

“Product search must be fast.”

Verifiable wording: illustrative values, not an approved threshold

“On specified test equipment, with a fixed dataset and 50 simulated concurrent users, 95% of requests should finish within 2 seconds, measured from the server receiving a search request to returning the complete result.”

The 95% condition can usually be expressed using p95 latency, the 95th-percentile latency.

But why choose 50 users and 2 seconds?

These figures require confirmation against the usage scenario, load tests, costs and stakeholder needs. Inserting arbitrary numbers does not make them official requirements.

Where evidence is missing, record a TBR (To Be Resolved) item, identify who will resolve it and when, and state which measurements are needed.

NASA's requirements guidance emphasizes clarity, consistency, traceability and verifiability, and warns against undefined terms such as fast, easy or safe.

## 5. Constraints: which boundaries must be respected?

A constraint is not necessarily a function and is not identical to quality.

Suppose you are building a school student-data analysis system.

The school might require:

“Phase one may use only de-identified test data and must not connect to the production student database.”

Even an excellent analysis function violates this phase's requirements if it connects directly to that database.

Other examples include offline execution, specified hardware, an approved budget limit, or a ban on sending particular data to external services.

FR, NFR and constraints are not completely separate boxes.

For example, “Only authorized doctors can view specified medical records” can be decomposed into access-control functions, authorization rules, audit requirements and data-governance constraints.

Classification supports discussion. Every condition still needs to be understood, implemented and verified.

## 6. Integrate the requirements into one specification

Return to the course's synthetic intake-data example.

Suppose an intake system receives test records containing a name, case number and contact information.

Develop the original User Story into a specification that can be accepted.

S-01

User Story

As an intake worker, I want to know which required fields are missing before export, so that I can complete them before handoff.

FR-01

Check omissions

If a required field is absent, an empty string or whitespace only, the system shall list it as missing.

FR-02

Prevent incorrect export

If completeness checking has not passed, the system shall not produce an export report labelled “complete.”

NFR-01

Keyboard operation

Users shall be able to fill in, check, correct and export using only the keyboard. Focus must be identifiable and must not become trapped in an area they cannot leave.

C-01

Data and usage scope

This prototype processes only synthetic data, runs locally for one person, does not connect to a real intake system and does not claim official business intake capability.

The corresponding WCAG 2.2 keyboard principles require ordinary functionality to be keyboard operable. Writing the requirement does not establish that the product has passed accessibility testing.

### Next: connect requirements to acceptance tests

For FR-01 and FR-02, write two scenarios.

Normal scenario:

```
Given all required fields are complete
When the user selects Check
Then the system displays a passed check
And permits export of a complete report
```

Error scenario:

```
Given the case number contains only whitespace
When the user selects Check
Then the system identifies the missing case number
And does not permit export of a complete report
```

The next chapter, M05-03, develops this Given/When/Then style of acceptance scenarios.

There is another easily missed scenario:

After a successful check, suppose you delete the case number. Can the system continue using the earlier passed result?

It should not. The changed data may invalidate that result.

Add a rule: changing data invalidates the existing completeness-check result. A complete export requires a new successful check.

Software engineering often becomes difficult because exceptions and state changes have not been specified, even when writing the code itself is straightforward.

## 7. Why does this matter more with AI Coding Agents?

A human engineer may ask follow-up questions when you request software.

Now you can directly ask AI:

“Build me a data-checking website.”

AI may quickly create an attractive, operable site while mishandling whitespace-only fields, stale check results or export restrictions. It may never define completeness.

A useful AI collaboration process is:

1. Write a User Story: establish the user and purpose.
2. Add FR, NFR and constraints: define behavior, quality and boundaries.
3. Add Acceptance Criteria: cover normal, error and boundary scenarios.
4. Ask an AI Coding Agent to implement: follow the specification and do not invent consequential business rules.
5. Execute tests and retain evidence: compare results against requirements and leave untested items unverified.

Give requirements stable identifiers so they can link to acceptance scenarios and test results. For example:

`S-01 → FR-01 → AC-01 → TEST-01 → PASS / FAIL`

This is traceability.

When requirements change, the links identify which specifications to update and tests to rerun, beyond relying on AI's “changes complete” message. Traceability is also a central feature of NASA's requirements guidance.

## 8. Practice: write a minimal specification

You do not need to write code for this chapter. Record the following in `spec.md`:

```
# S-01 User Story
Role:
Goal:
Reason:

# Functional Requirements
FR-01:
FR-02:

# Non-Functional Requirements
NFR-01:

# Constraints
C-01:

# Acceptance Criteria
AC-01 Normal scenario:
AC-02 Error scenario:

# Verification
Verification method:
Actual result: not yet tested

# Open Questions
Unresolved rules:
Responsible person:
```

Choose one small business task before planning a large system. The specification should allow another engineer or AI Agent to produce externally consistent behavior that can be independently accepted.

## 9. Check your understanding

Judge each scenario before opening its reference explanation. This page does not submit answers or establish learning completion.

1. A manager says, “I need a usable and secure HR system.” What is most missing?

A. A chosen frontend framework

B. The user's purpose, concrete behavior, quality conditions, constraints and acceptance method

C. Having AI build all screens first

D. Rewriting the request in English

2. The system must prevent employees from viewing another department's confidential records. How should this be handled?

A. Put it only under NFR and omit tests

B. Treat a login screen as completion

C. Define authorization rules and rejection behavior, then verify them with tests

D. Only encrypt the database

3. AI has generated code from the specification and says every function is complete. What is the most reasonable next action?

A. Launch immediately

B. Check only visual appearance

C. Execute the corresponding normal, error and quality acceptance checks and retain evidence

D. Regenerate with a different AI model

A User Story defines value, FR defines behavior, NFR defines quality, constraints define boundaries, and Acceptance Criteria make those conditions verifiable.
