# M06-01 | User Flow and System Architecture: a complete practical explanation

How people operate software and how the software works internally answer different questions.

- User Flow describes how a person completes a task.
- System Architecture describes the software units, their responsibilities and communication, and where data is kept.

The aim is to draw both views clearly and connect them to each other.

## 1. Start with a restaurant

Imagine that you run a restaurant.

A customer might follow this dining process:

@figure 1

This is a complete User Flow for this simplified dining scenario.

As the owner, can you run the restaurant merely by knowing that customers order, eat and pay?

You also need to answer these questions:

- Does a waiter record orders, or do they enter an electronic ordering system?
- How does the kitchen know which dishes to prepare?
- How does inventory management know how much food was used?
- Who calculates the bill?
- What happens if the card terminal fails?

These questions involve the restaurant's internal organization, equipment and information systems.

@figure 2

This is a conceptual example: boxes are systems or devices, and arrows show information relationships rather than the customer's action sequence.

The customer's actions can stay the same while the restaurant's internal architecture differs substantially.

A small eatery may use paper menus and spoken kitchen orders. A chain may use ordering tablets, a POS system, a central database and payment services.

Similar visible tasks can therefore be supported by very different systems internally.

## 2. Compare the two views

Identify the question each view answers before selecting its elements and verification methods.

| Comparison | User Flow | System Architecture |
| --- | --- | --- |
| Core question | How does the user complete the task? | How does the system support it? |
| Main audiences | Users and product designers | Engineers, architects and operators |
| What it describes | Steps, decisions, errors and recovery | Processes, services, stores, communication and responsibilities |
| Typical elements | Screens, actions and decisions | Frontends, backends, modules and databases |
| Typical question | How can a user return after a mistake? | How does the program recover from failure? |
| Verification | Can the user complete the actions? | Do units cooperate correctly and satisfy quality and security requirements? |

The views complement each other; both can describe the same product.

## 3. Draw two views of the same software feature

The course uses an intake-data completeness checker. A staff member enters data, the system checks for missing fields, and a report becomes downloadable after the teaching completeness rules pass. This establishes neither factual truth nor official intake or business approval.

### First view: User Flow

Trace the normal actions, then follow the missing-information branch back to Check.

@figure 3

This view answers what happens when information is missing, whether the user can check again, and when export is available.

It still leaves open which software actually checks the data.

### Second view: System Architecture

The reference project uses Streamlit and Python. It does not implement a full React, custom API and database three-tier system. Its main structure is:

@figure 4

This view answers another set of questions:

- Browser: presents the interface for entry and viewing results.
- Python process: runs the program, checks data and produces the report.
- rules.py: contains validation logic called directly by the Python process.
- Session State: temporarily holds data needed by that session.
- JSON: represents check results in a structured format for download or use by other programs.

The reference implements no separate REST API or persistent database, and calls no external AI model to check the fields. Familiar technologies should appear in the current architecture only when they are actually present.

Streamlit's official documentation describes the browser client and Python server, with WebSockets maintaining interactive session communication. The client-server division still exists when both run on your own computer.

### Connect the two views

Compare each action with its processing location.

| User action | What must happen inside the system |
| --- | --- |
| Enter data | The browser gathers input and the application manages state |
| Press Check | Python executes validation logic |
| Discover missing information | The system produces validation results and the interface displays guidance |
| Edit and check again | Updated input is validated again |
| Download results | The program produces JSON and the browser offers the download |

Each meaningful action should be traceable to the software responsible for handling it.

## 4. Resolve commonly confused technical ideas

Inspect files, running processes and data lifecycles separately, and review responsibilities against the intended usage scale.

### 1. A program file is not an independent service

Suppose you have these two Python files:

```python
# rules.py
def validate(data):
    return bool(data.get("name"))
```

```python
# app.py（與 rules.py 放在同一目錄）
from rules import validate
result = validate({"name": "Alice"})
print(result)
```

In Python 3, save these as rules.py and app.py in the same directory, then run python3 app.py. The expected output is True. Afterwards, delete only these practice files and their __pycache__, retaining the original workshop program. This minimal example checks the truth value of name; it does not reproduce the workshop's complete three-field validation rules.

This is normally an in-process module call, not evidence of two servers.

An independent service normally has its own execution boundary and may communicate with other services through HTTP, a message queue or another mechanism.

### 2. No database does not mean no data

Imagine entering information on a website without pressing Save.

The data may still exist in browser or server memory. A downloaded file may remain on the computer for a long time.

Architecture must therefore ask where data exists, how long it remains, who can access it and which events remove it, in addition to asking whether there is a database.

### 3. Running locally does not establish security

Suppose a program used by one person will now serve ten employees.

Its interface may remain unchanged, while authentication, authorization, separation of users' data, concurrent resource use and recovery after server failure all need reconsideration.

An unchanged User Flow can therefore require a changed System Architecture.

## 5. Apply the distinction across industries

These scenarios help distinguish action questions from structure questions; they do not describe the actual architecture of any particular organization.

| Industry | User Flow question | Architecture question |
| --- | --- | --- |
| Healthcare | How do patients book, look up and cancel appointments? | How does the booking system connect to hospital databases? |
| Banking | How does a customer apply for a loan? | Who calculates credit scores, and where is data sent? |
| Logistics | How does a customer track a parcel? | How are scan records transmitted, stored and updated? |
| AI applications | How does a user upload a file and obtain a summary? | Where do document parsing, model inference and storage run? |
| E-commerce | How do customers order and request refunds? | How are orders, inventory, payments and refunds coordinated? |

Many implementations can support the same User Flow. Select an architecture using data volume, user count, security requirements, cost and operational capacity, rather than only the apparent number of interface features.

## 6. Next: what is the C4 model?

The C4 model explains software architecture at different zoom levels, much like zooming through a software map.

@figure 5

A C4 container is an application or data store, not necessarily a Docker container. C4 architecture diagrams mainly describe structure. Add a sequence diagram when you need the precise order of calls in a particular operation.

For further reading, follow the official C4 model sources linked in this section.

## 7. Ask AI to help design the system

When developing software with an AI coding agent, use this order:

1. Define the user's task and success conditions.
2. Draw the User Flow, including normal actions, decisions and recovery.
3. Propose System Architecture based on functions, data and non-functional requirements.
4. Map each important action to the modules and data locations that handle it.
5. Distinguish implemented behavior, design proposals and unknowns, then inspect security boundaries.

For an existing project, ask the agent to inspect code, configuration and deployment evidence and justify every architectural element. An attractive imagined diagram cannot establish the actual architecture.

## 8. Check your understanding

Try the three questions without consulting the answers first.

The three checks appear below, each with an expandable reference explanation. They do not record learner answers or establish learning completion.

User Flow explains how people complete work; System Architecture explains how software supports that work. Cross-checking the two helps you explain how the product operates, how to verify it and how to maintain it.
