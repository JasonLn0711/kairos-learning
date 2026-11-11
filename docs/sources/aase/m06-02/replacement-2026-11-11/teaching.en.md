# M06-02 | C4 System Context: establish the system’s relationships with the outside world

Before designing software, establish what system you are building, who will use it, and which external systems it needs to cooperate with.

That is the purpose of a C4 System Context diagram.

It gives engineers, managers, customers and other stakeholders a shared understanding of scope before discussing code, API endpoints or database structures.

Remember the lesson in one sentence:

Start with the system’s external relationships, then examine its internal technical design.

## 1. An everyday analogy: treat the software as a restaurant

Imagine opening a restaurant.

You bring together a designer, chef, accountant and engineer to plan its operation.

Before discussing kitchen equipment, gas pipes or till wiring, everyone needs to establish:

- Whom does the restaurant serve?
- How do customers order?
- Does the restaurant need a delivery platform?
- Does it collect payment through an external payment provider?
- Which responsibilities belong to the restaurant, and which belong to other companies?

Suppose you are designing a restaurant ordering system.

@figure1

The diagram lets readers identify the focal system, external participants and their relationships.

If the restaurant offers no delivery service, do not add a delivery platform merely because other restaurants have one.

An architecture diagram should describe a system supported by evidence. Keep candidate features separate from the current system.

## 2. What is C4, and why are there four levels?

C4 is an approach to describing software architecture promoted by Simon Brown. Think of zooming into a map: from a city to a neighbourhood, a building and its internal layout. The levels change the detail and the question being answered.

@figure2

The view zooms inward. C4 does not require every project to draw every level; Context and Container diagrams communicate the main architecture for many teams.

For a hospital appointment platform, the questions might be:

| Level | Question |
| --- | --- |
| C1 Context | How do patients, doctors and existing hospital systems interact with the appointment platform? |
| C2 Container | Which web applications, backends and databases make up the platform? |
| C3 Component | Which booking, scheduling and notification components are inside the backend? |
| C4 Code | Which classes, interfaces and implementations make up the booking service? |

This lesson focuses on C1: Context.

In C4, a container is an application or data store that runs or stores data. It does not necessarily mean a Docker container.

## 3. Read a C4 System Context diagram

Locate the focal system, then follow each labelled relationship.

@figure3

This is an adaptation of Simon Brown’s fictional Internet Banking System example supplied with the lesson. Source: https://c4model.com/diagrams/system-context. Attribution: Simon Brown, c4model.com, CC BY 4.0; the layout and labels have been adapted for responsive teaching. The email service also sends email to the customer. Keep that relationship visible even though both endpoints are outside the focal system. The supplied image names Amazon Web Services Simple Email Service; this is a fictional architecture example, not a claim about an actual bank.

Start by locating the Internet Banking System. Then identify who uses it, which other systems it relies on, and what each directed relationship means.

For example:

“Internet Banking System → Core Banking System” should say that the banking application obtains account information and makes payments through the core system. A generic “connected” label leaves the purpose unclear.



A useful Context diagram lets a reader without programming knowledge explain how the system cooperates with the outside world.

## 4. Build a Context diagram from scratch

Return to the course’s intake completeness-checking system.

A user enters a synthetic record; the program checks required fields and produces a report.

@figure4

This case has no other directly interacting external runtime software system, so no external service is added.

Build the diagram in these five steps.

| Step | Task | Answer for this case |
| --- | --- | --- |
| 1. Choose the focus | What system are we designing? | Intake completeness-checking system |
| 2. Identify roles | Who uses it directly? | Intake worker |
| 3. Identify external systems | Which other systems does it depend on at runtime? | None at present |
| 4. Draw relationships | Who supplies what to whom, and for what purpose? | Input data and returned checking results |
| 5. Review scope | Have internal details or unimplemented features slipped in? | Exclude Python functions and nonexistent APIs |

### Why label arrows clearly?

Compare the two ways of labelling the same relationship:

| Too vague | More informative |
| --- | --- |
| User → system: uses | User → system: supplies data and requests checking |
| System → user: data | System → user: returns omissions and a completeness report |
| System → external service: connects | System → payment service: sends a payment request and receives the transaction result |

Arrow direction describes an interaction or dependency, not necessarily a complete timeline. Context describes structural relationships; it is not a flowchart of every action in order.

## 5. Applications in three industries

These hypothetical cases help you identify the focal system and its external relationships.

| Setting | Focal system | Users | Possible external systems |
| --- | --- | --- | --- |
| Education | Online examination platform | Students and teachers | School identity service and grade-management system |
| Healthcare | AI-assisted image interpretation platform | Radiologists | PACS and an external inference service, if used |
| Logistics | Shipment tracking platform | Logistics staff and customers | Map service and carrier tracking systems |

PACS means Picture Archiving and Communication System: a system for managing medical images.

If an image interpretation platform retrieves CT images from an existing PACS, show:

PACS → AI image interpretation platform: provides the specified patient’s CT images.

If the AI runs locally and calls no external inference service, do not add a cloud LLM API.

Mixing technical options, future plans and the current implemented architecture makes the diagram misleading.

## 6. Should an AI Coding Agent appear in the diagram?

Suppose Claude Code, Codex or OpenCode helps write the intake checker, but the finished product calls no AI model when a user operates it.

The Coding Agent is a development-time tool and does not belong among the product’s runtime dependencies.

Conversely, suppose a customer-support platform sends each customer message to an external LLM API to generate an answer.

That model service is a runtime dependency and belongs in the Context diagram.

| Situation | Include in the product’s runtime Context? |
| --- | --- |
| AI generates code and leaves after development | No |
| An AI Agent runs tests during development | No |
| A support product calls an external LLM API for each answer | Yes |
| The system runs an embedded model locally | Usually describe it as an internal implementation detail at a finer architecture level |
| The product connects to a separate external AI inference service | Yes |

Development tools still need security controls. A Coding Agent may read source code, execute commands or access a network, so manage those permissions in the development environment even when it is outside the product’s runtime Context.

## 7. Three distinctions that prevent confusion

Use these distinctions when reviewing the scope of your diagram.

### 1. System Context and User Flow answer different questions

User Flow asks which action the user takes first, which follows, and what happens next.

System Context asks which people and external systems have relationships with the system.

For online shopping, “select a product → add it to the cart → check out” is a User Flow. “Shopping system ↔ payment service” describes a relationship for System Context.

### 2. A system boundary is not a security boundary

A box around a medical image analysis platform defines the software scope being discussed.

It does not establish a firewall, TLS encryption, network isolation or access control.

Analyse trust boundaries separately: which trust regions does data cross, and where are validation, authorization, encryption and monitoring needed?

### 3. An external system need not belong to another company

“External” is relative to the focal system.

A company may maintain both its HR and payroll systems, yet payroll can still be an external dependency of the leave-management system.

Decide from responsibility and design scope, rather than machine location or company ownership.

## 8. A practical deliverable: architecture.md

Leave a readable record of system scope and relationships. Use this minimum template as a starting point.

```markdown
# System Context — Intake completeness-checking system

## 1. Purpose
Check required fields in synthetic data, identify omissions and export the current report.

## 2. Scope
Focal system: intake completeness-checking system.

## 3. Users
Intake worker: enters data, reviews results and obtains reports.

## 4. External runtime systems
None.

## 5. Relationships
- Intake worker → focal system:
  supplies synthetic data and requests checking and export.
- Focal system → intake worker:
  returns omission feedback and a checking report.

## 6. Outside this scope
- Coding Agent, used only during development.
- Official business acceptance.
- External APIs that have not been implemented.

## 7. Boundary notes
- System scope is not a security trust boundary.
- List unconfirmed integrations separately as open questions.
```

Ask someone who did not develop the system to read only the diagram and record. They should be able to identify the purpose, users, external dependencies and each relationship’s purpose without mistaking unimplemented functionality for something that exists.

## 9. Check your understanding with a scenario

You are developing an AI contract-review system. A lawyer uploads a contract. The system sends the necessary content to an external LLM API, receives an analysis and displays it to the lawyer. Codex helps edit the program during development.

Answer the three questions in the understanding-check section before opening the reference explanations. Reading the explanation does not submit an answer or establish learner understanding.

When you begin designing another system, first establish its responsibilities, users, external dependencies and data exchanges. This record supports later Container, API, authorization and trust-boundary design.
