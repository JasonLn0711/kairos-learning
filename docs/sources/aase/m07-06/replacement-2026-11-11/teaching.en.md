# M07-06 | Reviewing diffs, tool records and decisions: how do you know an AI Agent did the job?

After an AI Agent reports completion, compare the specification, changes (diff) and evidence. The responsible person then accepts the work, requests revision or defers it. A program running establishes only the outcome of that execution; each requirement still needs acceptance checks.

## 1. A familiar example: why a completion report needs checking

Suppose you hire a contractor to renovate your kitchen.

You specify three requirements:

- Replace the faucet.
- Repair the leaking pipe.
- Leave the existing electrical wiring unchanged.

Three days later, the contractor says:

“Everything is finished, and we tested it without any problems.”

Would you immediately pay and accept the work?

Usually you would first check:

- Was the faucet actually replaced?
- Does the pipe still leak?
- Did the contractor change wiring without permission?
- What exactly did “tested” cover?

Apply the same checks to an AI Coding Agent.

@figure1

This acceptance approach applies across industries.

| Industry | Specification | Changes | Verification evidence |
| --- | --- | --- | --- |
| Construction | Plans and contract | Construction change records | Inspection and trial operation |
| Medical administration | Medical-record handling rules | System configuration changes | Synthetic test data and audit results |
| Banking | Credit-assessment rules | Review-logic changes | Test cases and secondary review |
| Software development | Requirements and acceptance conditions | Git diff | Automated tests and actual operation |
| AI Agent | Task and authorized scope | Code, file and configuration changes | Tool records and executed results |

Evaluate whether evidence supports the delivered work. The quality of the completion message alone cannot establish acceptance.

## 2. What is a diff, and why review it?

Diff is short for difference: it shows changes between versions.

Suppose you ask an AI to modify Python code whose original rule requires checking data before every report export.

Original code:

```
def export_report(record):
    validate(record)
    return create_report(record)
```

After the AI's change:

```
def export_report(record):
    return create_report(record)
```

The code is shorter and might still run.

However, the AI removed `validate(record)`.

Incomplete data could now be exported.

Diff review helps identify this change in behavior.

Git can show the difference between the two versions:

```
 def export_report(record):
-    validate(record)
     return create_report(record)
```

Here, `-` marks a removed line and `+` marks an added line. Unmarked lines normally provide context.

Ask both whether the program ran and whether the modification broke an existing rule.

Changed line count does not measure risk. Removing one validation line can be more dangerous than adding a thousand lines of interface code.

## 3. Three Git locations: working tree, staging area and history

Review begins by distinguishing Git's data locations.

Imagine writing an important research report.

You have a formally saved version, a version prepared for delivery and a draft currently being edited on your desk.

This is a useful analogy for Git.

@figure2

This is a simplified operation diagram. Git comparisons are not a one-way pipeline: the working tree and staging area can contain different edits. The repository stores objects and history; HEAD is a reference, usually to the current branch's latest commit, rather than a storage area itself.

Also check files that Git has not yet started tracking.

An Untracked File is a newly created file not yet included in Git's tracked content.

If an Agent creates `tests/test_export.py` without running `git add`, ordinary `git diff` will not show its complete contents.

### Four useful commands

| Git command | Plain-language meaning |
| --- | --- |
| `git status --short` | List modified, staged and untracked files |
| `git diff` | Compare unstaged working-tree changes against the index |
| `git diff --cached` | Compare staged changes against the current commit |
| `git diff HEAD` | Compare tracked working-tree content against the current commit; untracked files remain excluded |

Check these comparison modes in the [official git-diff documentation](https://git-scm.com/docs/git-diff).

### Worked inspection

After the AI edits the project, run this in the project directory:

```
git status --short
```

A hypothetical result is:

```
 M app.py
M  rules.py
?? tests/
```

Read the two status columns carefully:

` M app.py` means `app.py` has unstaged working-tree changes.

`M  rules.py` means changes to `rules.py` have been staged.

`?? tests/` means the directory contains untracked files.

If you now run only:

```
git diff
```

you may see only the changes in `app.py`.

That does not establish that `rules.py` or `tests/` is safe; their contents have not yet been reviewed.

A basic review combines these commands:

```
# 查看狀態
git status --short

# 查看尚未暫存的修改
git diff

# 查看已暫存的修改
git diff --cached

# 查看最新提交以來的已追蹤檔案差異
git diff HEAD
```

The comments mean: inspect status, unstaged changes, staged changes and tracked changes against HEAD. Open untracked files separately and read their contents.

If the Agent has already committed its changes, the working tree may be clean. Inspect commit history with `git log` and `git show`; “no uncommitted changes” does not mean the Agent changed nothing.

## 4. Tool records: what did the passing tests cover?

A successful command needs a scope check.

Suppose you ask an AI to build an online registration system with form entry, data validation and downloadable registration certificates.

The AI reports:

> The feature is complete and all tests passed.

The tool execution record shows:

```
工作目錄：/project/slices/01-form

執行命令：
python -m pytest -q

退出碼：0

輸出：
4 passed in 0.18s
```

This is a hypothetical teaching log, not an actual execution result. Its labels mean working directory, command, exit code and output.

What does it establish?

It establishes that pytest completed successfully in that directory and reported four passing tests.

It does not establish correct downloads: that directory might contain form tests without export tests.

Distinguish four terms:

| Term | Meaning |
| --- | --- |
| Command | The command actually executed |
| Working Directory | The directory where the command ran |
| Exit Code | The program's termination status; usually 0 means command success |
| Test Coverage | The code or behavior exercised; passing tests do not establish verification of every requirement |

Check whether the evidence supports the Agent's specific claim.

@figure3

The same reasoning applies to scientific research.

When a researcher claims a method works, inspect experimental conditions, datasets, metrics and results as well as the conclusion.

Agent tool records serve a similar purpose to experimental execution records.

## 5. Why out-of-scope changes also need correction

Suppose you run a clinic and ask an engineer to change how appointment dates are displayed.

The request is to replace a US-style date format with the format commonly used in Taiwan.

While doing so, the AI adds an external analytics API that sends appointment data to a third-party service.

Correct date formatting alone cannot justify accepting this work.

The external API was not authorized and could disclose data.

Two principles apply.

Scope: the AI works within this task's approved boundary. Reasonable implementation details can be reviewed within that boundary; new data transfers, permissions or business behavior require separate approval.

Least Privilege: give the AI only the tools, resources and permissions required for the task, rather than unrestricted access to every system.

The [OWASP AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html) discusses tool permissions, human approval, sensitive-data protection and observability.

Preserve other work when correcting unauthorized edits.

Do not immediately run commands that could erase all uncommitted work, such as:

```
git reset --hard
git clean -fd
```

These are destructive commands and may remove other people's unsaved work too. They are shown for recognition, not as exercise instructions.

First identify what this Agent task introduced. Then correct specific files or change ranges while preserving unrelated work.

## 6. Build an Agent review procedure

After each AI Coding Agent task, use the following procedure.

@figure4

### What should a review record contain?

Use `review-notes.md` to retain enough information to trace the decision.

The following is a hypothetical example.

@figure5

The next reviewer can see what has been established, what remains unverified and why a decision was made. Keep private conversations, credentials and real personal data out of public records.

## 7. Three review decisions

Choose a decision from requirements and evidence, and record the next action.

| Decision | When it applies | Next action |
| --- | --- | --- |
| Accept | Requirements met, scope appropriate and key checks passed | Proceed to the separately authorized commit or delivery process |
| Revise | Core requirements unmet, insufficient tests or inappropriate changes | Restrict the correction scope, revise and verify again |
| Defer | A new requirement falls outside this task's approved scope | Record a separate requirement or task |

Separate a newly discovered requirement from a defect in the originally promised feature.

For example, an AI building a restaurant reservation system discovers an opportunity to add member recommendations.

Recommendations may be useful, but they are outside this reservation task's acceptance conditions.

Defer that feature rather than accepting it merely because the AI implemented it.

## 8. Five common misconceptions

The table compares five reasoning traps with the checks they require.

| Assumption | Correct interpretation |
| --- | --- |
| No `git diff` output means no changes | Staged, untracked or already committed changes may still exist |
| Green tests establish the whole system works | They support only the behavior actually covered |
| A one-line change has little risk | One line can disable important validation |
| More AI features are always better | Extra behavior may exceed authorization and requirements |
| No Git changes means no system side effects | Programs can alter databases, call external APIs or affect remote services |

Git primarily tracks file content within version control. It does not automatically record every external-system change.

Higher-risk Agents also need appropriate execution records, permission controls and external-operation audits.

## 9. Understanding check: how would you review this Agent?

Suppose you ask an AI to modify an insurance-claim system with this requirement:

“If an applicant lacks required supporting documents, the system must not generate a report marked ‘Review complete’.”

The AI says, “The feature is complete and all tests passed.”

You find this hypothetical status output:

```
git status --short

 M app.py
M  rules.py
?? tests/
```

The hypothetical tool log shows:

```
工作目錄：/project/slices/01-form
命令：python -m pytest -q
結果：5 passed
```

The labels identify the working directory, command and result. In the diff for `rules.py`, you also find that the pre-export `validate()` call was removed.

Read each question and its reference explanation below. These are self-checks; the page does not submit answers or record learner scores.

The responsible reviewer connects each promise to the actual changes and relevant evidence, then records a traceable decision.
