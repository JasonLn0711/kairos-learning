## 1. Understand the central idea

Making software work does not automatically let someone else take it over.

Imagine a chef who develops a delicious dish. The chef knows the ingredients, equipment, cooking time and when to turn off the heat. On leaving, the chef writes only: “Put the ingredients in the pot and cook them.” Could the next chef reliably reproduce the dish? The missing conditions make that difficult.

Software has the same problem. Your program runs on your computer, but its recipient may still need answers:

- What problem does the software solve?
- Which tools and versions must be installed?
- How do I start it, and from which directory?
- How can I demonstrate that it works correctly?
- What should I do about errors, and which features remain unavailable?
- How should I manage data and services after use?

README is the entry document for those questions. Alongside operating instructions, retain reproducible acceptance evidence, limitations, and shutdown and recovery procedures.

## 2. What is README, and where does it fit?

README is usually a text file named `README.md`. Think of a product's instruction manual, expanded to explain installation, verification and maintenance for an engineering project.

@figure1

The four stages organize a handoff: locate the purpose, users, scope and version; rebuild with the environment, dependencies and installation/startup commands; accept with test data, steps, expectations and actual evidence; and hand over with known limits, error handling, recovery, shutdown and cleanup. The arrows show the document's operating route, not evidence that any stage has passed.

## 3. Connect the stages through a restaurant example

Suppose you develop a Daily Order Checker for a restaurant. Each day, the manager imports a CSV file, and the system checks for missing order IDs, unusual amounts or duplicate orders.

### Stage 1: Locate — what can the system do?

A weak description:

> This is an order system written in Python.

A more useful description:

> This system checks daily order CSV files for missing required fields and duplicate orders. Restaurant managers can use it locally with test data. It currently does not support multiuser login, live point-of-sale integration or production payment processing.

The first description identifies the software. The second also explains capabilities, exclusions and intended use. If the owner assumes that the checker can charge credit cards, that misunderstanding can lead to an incorrect operating decision. Explicit exclusions help the recipient make an appropriate decision.

### Stage 2: Rebuild — can another computer install it?

Your computer may already contain dozens of Python packages. The new engineer may start with none. README therefore needs the Python version, dependencies, file locations and correct installation and startup instructions.

The following commands are illustrative. Start at the project root with a working `python` command, a delivered `requirements.txt`, pytest tests, and a directly executable `app.py`. They do not describe the separate Streamlit workshop package.

@code0

Two ideas matter here. “Run app.py” alone leaves out the prerequisites, paths and dependencies. A clean environment also helps reveal these assumptions: it is like a new kitchen without the special tools and prepared ingredients you normally use.

If the program works only on your computer, installation conditions may be missing. Success in one clean environment still does not establish compatibility with every operating system; test each claimed platform separately.

### Stage 3: Accept — does opening the program establish success?

No. If the checker opens but fails to warn about duplicate orders, it has not met its purpose. Define observable success first.

| Test scenario | Expected result |
| --- | --- |
| Upload valid orders | Display a passed check |
| Omit an order ID | Display a missing-field message |
| Use the same ID for two orders | Display a duplicate-order warning |
| Upload an empty file | Display a clear error without crashing |
| Correct an error and check again | Display the updated result |

These are expectations, not evidence of passed tests. When testing, record the date, program version, input data, actual result, and pass or fail. “I expect success” and “I demonstrated success under these conditions” support different claims.

### Stage 4: Hand over — what happens on failure or after use?

Suppose the manager notices an incorrect order amount. README should explain whether it can be undone, whether reimport is needed, which records to retain, and how to stop the program safely.

A working local prototype also needs further decisions before all branches can use it in production. Shared use can introduce authentication, access permissions, retention, backup and maintenance requirements. Handoff gives the recipient enough information about these boundaries to decide what to do next; it does not guarantee the absence of defects.

## 4. Three different kinds of success

Separate these evidence layers in the handoff record.

| Evidence layer | Plain meaning | What it can support |
| --- | --- | --- |
| Author execution | I ran it in my own environment | Success under this run's environment and conditions |
| Author rebuild | I reinstalled in a new directory and environment | Reduced dependence on the original environment |
| Independent successor reproduction | Another person operated it using only the instructions | Stronger evidence that the document supports handoff |

Imagine teaching a mathematical problem. Solving it yourself shows that you can do it. Solving it again demonstrates that you can reproduce your method. If another student can understand your written explanation and solve it without asking you, that provides stronger evidence that your explanation transfers the knowledge. README likewise needs to serve someone beyond its author.

## 5. The same documentation principle in other industries

### Healthcare: instrument and laboratory-procedure handoff

New laboratory personnel need more than the power switch location. Documentation also identifies calibration procedures, operating conditions, quality controls, abnormal alerts and criteria for stopping use.

### Manufacturing: production-equipment handoff

A machine running today does not establish that a newcomer can operate it safely. Handoff includes settings, normal ranges, abnormal-stop conditions and recovery procedures.

### AI systems: model and Agent project handoff

Weights and source code alone leave out model versions, inference environments, tool permissions, test data, evaluation results and known failure scenarios. Experimental success does not establish production safety.

These are analogies about documentation, not instrument-specific operating instructions. Their shared principle is to turn knowledge in one person's head into information another person can follow, inspect and verify.

## 6. What makes a usable README?

Use the following eight-item self-check to inspect your document. Each checkbox marks your own review of an item; the count is not an acceptance result.

@figure2

This is an initial document-completeness check. Selecting every item does not demonstrate software quality or safety. For independent reproduction, retain the successor's actual environment, actions, assistance and result rather than relying on the checkbox.

Whenever code, dependencies, startup instructions or output specifications change, update README and the relevant acceptance evidence together.

## 7. Check your understanding with a scenario

You develop an AI paper-summary system for a school and successfully generate summaries of 100 papers on your computer. You give the GitHub repository to a new research assistant, but README contains only:

@code1

Answer these three questions in your own words:

1. Which four or more important kinds of information are missing from this README?
2. If the assistant cannot run the system but you can, how would you investigate an environment issue, a program issue or a handoff-document issue?
3. If the assistant successfully generates summaries, can you claim the AI is ready for production in hospitals or banks? Why?

Writing software gives the machine instructions to execute. README, acceptance evidence and handoff documentation let other people understand, rebuild, verify and use it responsibly. Engineering delivery allows the work to continue without depending on the original author.
