# M09-01 | Git, Diff, Commit and Restore: Record Changes and Recover Safely

This lesson covers Git, Diff, Commit and Restore in AASE M09, Version Control, Delivery and Continuous Improvement.

The lesson belongs under m09, not m04. Its canonical route is /courses/aase/v1/m09/concepts/m09-01/.

## 1. A Plain-language Starting Point

Git manages the history of changes to a project. It helps you inspect what changed, who recorded the change, why it was made and how to recover when something goes wrong.

Imagine writing an important report. You finish the first version on Monday, change the data on Tuesday, add charts on Wednesday and discover on Thursday that Tuesday's data change was wrong.

Without version control, you might have to search through these files:

- `報告_最終版.docx` (report_final)
- `報告_最終版2.docx` (report_final2)
- `報告_真的最終版.docx` (report_really_final)
- `報告_最後修改版.docx` (report_last_revision)

With Git, you can find Tuesday's recorded changes, compare the error and decide which parts to restore. You can recover the incorrect part while preserving the valid work from Wednesday and Thursday.

The engineering skill is to make each change inspectable, understandable and traceable, with a way to recover the required content. Git works particularly well with text; the report analogy does not imply that Word files offer the same line-by-line comparison.

## 2. Four Important Places in Git

Editing, staging, committing and sharing are separate actions. Imagine editing a book at a publishing house. Read the figure from top to bottom: each labeled arrow names an action between two locations.

@figure1

### 1. Working Directory: The Draft You Are Editing

Editing a file in VS Code changes the working directory. You might edit three files, with only one ready and two unfinished. Saving a file does not automatically create a commit.

### 2. Staging Area: What Belongs in This Commit?

Suppose task A fixes an order-total calculation and task B adds member login. The calculation is fixed, but login is only half finished. Stage A and commit A while leaving B out of this snapshot. `git add` selects the content to stage.

### 3. Commit: Record a Version

A commit records the snapshot prepared in staging, together with authorship/committer information, timestamps, a message and history relationships. You can read it as: “At this point I record this content as a meaningful revision.”

Every commit has an identifier for finding, comparing and referencing it later. The signature fields record the supplied identity; they do not by themselves verify a person's identity.

### 4. Push: Share Versions

A commit usually remains on your computer until it is shared. `git push` sends applicable local commits to the configured remote repository. New code on GitHub does not establish that a website has changed: deployment follows its own release process. Push, testing and acceptance each need their own evidence.

## 3. Diff: Inspect What Changed

Diff means difference. Imagine a hospital revising a standard operating procedure (SOP). The original says: “Before surgery, the nurse must check the patient's name.” The revision says: “Before surgery, the nurse must check the patient's name, date of birth and surgical site.” This is a synthetic text-comparison example, not clinical guidance.

A diff identifies the added requirements. The retained Chinese example reads as follows:

@code0

A leading `-` marks content removed from the old version; `+` marks content added to the new version. Ask both whether the program runs and which specific parts changed, including any unrelated changes.

### Two Easily Confused Diffs

| Command | Comparison or status |
| --- | --- |
| `git diff` | Working directory relative to staging: changes not yet staged |
| `git diff --cached` | Staging relative to the current commit (HEAD): changes prepared for committing |
| `git status --short` | Whether paths are modified, staged or untracked |

On an ordinary checked-out branch, HEAD refers through that branch to its current tip commit. In detached HEAD state, it refers directly to the checked-out commit; it need not be the newest commit on a branch.

New untracked files are not shown by ordinary `git diff`. An empty diff therefore does not prove there are no new files or changes elsewhere. Check `git status` and inspect the untracked file contents too.

## 4. Commit: One Clear Purpose at a Time

Suppose an AI Coding Agent is developing an e-commerce system and makes these changes:

| Change | Same commit? |
| --- | --- |
| Fix the product-price formula | Yes |
| Add automated tests for the price calculation | Yes |
| Also change the login page colors | No |
| Also change database connection settings | No; confirm separately |

The first two support one purpose: correcting the calculation. Handle the unrelated appearance and connection changes separately.

A useful message states the purpose. The following retained command means “fix the order-discount calculation”:

@code1

A vague message such as “update” is less useful:

@code2

Three months later, a reader cannot tell what “update” means. A stronger record links the commit to a requirement or specification, such as `REQ-003: fix discount calculation`, and retains the related test record.

A commit provides history evidence. It does not establish that the code is free of defects.

## 5. Restore: Recover Only What You Need

Imagine working at a law firm on two files. `contract.txt` contains a contract clause you accidentally changed today. `case-notes.txt` contains important new case analysis added by a colleague.

You want the contract back at yesterday's version while preserving the analysis. First ask: which file, which source version and which current changes must remain?

Assume both files have committed baselines, you have confirmed that the target edits can be discarded and you have made a backup. If HEAD contains the intended baseline, use:

@code3

The command has four parts:

| Syntax | Meaning |
| --- | --- |
| `git restore` | Restore file content |
| `--source=HEAD` | Use the content from the commit referenced by HEAD |
| `--worktree` | Change only the working-directory file |
| `-- contract.txt` | Limit the operation to this path |

`--` separates options from file paths. This command does not select a version by calendar date: check that HEAD really contains the intended content, or supply the verified historical commit instead.

The command does not target `case-notes.txt` and does not erase existing commits. It does overwrite the current working-directory content of `contract.txt`, so inspect and protect unsaved changes first.

If the target file also contains work you want to keep, preserve a backup and consider `git restore -p` to select individual hunks instead of replacing the whole file.

### Restore, Revert and Reset Have Different Uses

| Command | Main purpose | Caution |
| --- | --- | --- |
| `git restore` | Restore selected files or changes | Can overwrite uncommitted content |
| `git restore --staged` | Unstage while preserving working-directory edits | Useful after staging by mistake; default source is HEAD |
| `git revert` | Create a new commit that reverses an earlier commit | Suitable for shared history; conflicts may need resolution |
| `git reset --hard` | Reset the current branch/HEAD, staging and working directory to a commit | Can lose work; do not use casually |

Start by inspecting status and diffs, then restore a confirmed source and path. This gives a narrower recovery scope than a whole-project hard reset.

## 6. A Ten-minute Git Practice

Create a completely separate exercise directory. Do not use a production project or real personal data. The commands target a Linux, macOS or Windows WSL Bash terminal. Use a parent directory where `git-lab` does not already exist; if creation fails, stop rather than entering an existing directory.

### Step A: Create the Exercise Repository

@code4

`git init` creates the repository. The two `git config` commands set the exercise's local commit identity rather than changing global settings for every project.

Create three files. The retained Chinese strings mean “slice one: three input fields and an unvalidated preview” and “other work: original record”:

@code5

`.gitignore` tells Git which matching untracked files to leave out of ordinary version control. It does not remove already tracked files or erase history.

### Step B: Make the First Commit

@code6

This creates the first commit. `git log -1 --oneline` shows its short identifier and message. The Chinese message means “create synthetic slice-record baseline.” This is the version to restore later.

### Step C: Simulate Two Concurrent Edits

@code7

The appended strings mean “mistaken addition: full report completed” and “other work: pending.” Both files now have unstaged changes. The goal is to restore `slice-notes.md` to its original content while retaining the addition to `keep.txt`.

### Step D: Back Up, Then Restore Selectively

@code8

Read the following as expected conditions, then verify the real files and history. The check symbols are not evidence that you have already run the exercise.

@figure2

Meeting all four conditions demonstrates selective restoration in this lab. The backup remains untracked. A later `git add .` could stage it too, so inspect each path before committing.

## 7. Applications Across Industries

Version records help teams identify which change belongs to which purpose.

### Software Engineering: AI Agent Changes

An AI Agent changes 20 files. The engineer reviews the diff, checks whether unrelated permission settings changed, checks the tests and then records the relevant feature in a commit.

### Construction: Design Change Management

A structural engineer changes material specifications. Traceable revisions help identify the reason, approved version and affected design documents, reducing the risk that builders use the wrong version.

### Scientific Research: Reproducibility

A research team changes preprocessing code and model parameters. A commit identifies the code version for an experiment and reduces configuration mix-ups. Data, environment and run settings still require their own records.

These examples apply version-control thinking across industries. They do not imply that every document belongs directly in Git. Git is especially suitable for code, Markdown, JSON and other text. Word documents, images and large binary data may need complementary document/version-management tools.

## 8. Three Common Mistakes

### Mistake 1: Assuming Git Has Saved Everything

Committed history contains the content actually included in commits. Untracked, unstaged or otherwise uncommitted work must be protected separately; do not assume it is recoverable from committed history.

### Mistake 2: Committing a Secret, Then Hiding It with .gitignore

Suppose an API key was committed in `.env`. You later add this ignore pattern:

@code9

This does not erase the committed key from existing history. If exposure is possible, revoke or rotate the key, assess the exposure and handle history and relevant copies through the project's incident process.

### Mistake 3: Letting an Agent Reset All Changes

An instruction like “clean up Git if there is a problem” can lead an agent to use an overly broad restore operation and lose your uncommitted work.

A safer working rule is:

> Show the diff first and identify which files to keep and restore. Before overwriting working-directory content, rewriting history or deleting content, establish the affected scope.

This is also a question of authority and responsibility in the agent's workflow.

## 9. Key Concepts

Use this table to distinguish the roles and limits of each concept.

| Concept | What to remember |
| --- | --- |
| Git | Manage project versions and change history |
| Working Directory | Files currently being edited |
| Staging Area | Content selected for the next commit |
| Diff | Compare versions or states |
| Commit | Record a meaningful version snapshot |
| HEAD | Current checked-out commit, normally through the active branch |
| Restore | Recover selected paths or hunks from a specified source |
| Push | Send local commits to a remote; deployment is separate |
| .gitignore | Ignore matching untracked files; historical secrets remain |

Build this habit:

Confirm requirements → edit → inspect diff → test → choose staged content → commit → verify delivery.

It makes individual work, team collaboration and AI Agent changes easier to review and hand over. Connect commit identifiers to requirements, changes and test results across the workshop's three slices. Follow shared-history procedures when correcting published changes. The next lesson puts startup, limits and recovery instructions in README.

## 10. Check Your Understanding

Answer the three questions in the understanding-check section before opening their reference explanations. Complete the `git-lab` exercise too: verify that `slice-notes.md` is restored while `keep.txt` retains its new work. Choosing an answer and demonstrating recovery are separate checks.
