# M07-01 | Environment, project skeleton and toolchain: a complete plain-language lesson

AASE · M07 Coding Agent collaboration workshop | Unit one

## 1. What does this lesson teach?

Keep this working rule in mind:

Before writing code, establish where it will run, which tools it requires and how to demonstrate that it works.

That preparation creates a development environment.

Suppose you ask an AI:

“Build a system that lets employees upload Excel files, checks whether the data is complete and produces a report.”

The AI may quickly write several hundred lines of code.

You still need answers to these questions:

- Which directory holds the code?
- Is Python installed on this computer?
- Which packages must be installed?
- Why does the AI’s program run on another computer but fail on yours?
- Does opening the web page establish that the system is complete?
- If the AI reports passing tests, how can you confirm that it actually ran them?

This lesson teaches you how to answer those questions.

Successful environment setup, successful startup and correct feature behavior require separate evidence.

## 2. Understand the environment through a restaurant

Imagine opening a beef noodle restaurant.

| Restaurant | Software development |
| --- | --- |
| Shop location | Project directory |
| Kitchen and cooking equipment | Runtime environment |
| Ingredients list | Dependencies |
| Separate cooking workbench | Virtual environment |
| Basic restaurant fit-out | Starter project |
| Chef and cooking tools | Development tools and Coding Agent |
| Cooking the beef noodles | Implementation |
| Tasting and hygiene checks | Testing and acceptance |

Read the analogy this way:

Renting a shop, buying cooking equipment and preparing ingredients establish preparation; you still need to cook a good bowl of noodles.

Likewise, installing Python, opening a web page and seeing an interface establish only their respective stages.

Keep environment preparation, implementation and feature acceptance separate.

## 3. Five technical concepts

### 1. Project directory: where are you working?

A project may contain this directory tree. The comment on `.venv` means that this directory appears after environment creation:

```
my-project/
├── README.md
├── requirements.txt
├── starter/
│   └── app.py
├── slices/
├── reference/
└── .venv/                 # 建立環境後才會出現

```

Each entry has a purpose:

| Name | Plain-language purpose |
| --- | --- |
| `README.md` | Instructions for installation and startup |
| `requirements.txt` | Required Python packages |
| `starter/` | The prepared starting skeleton |
| `app.py` | The example application entry point |
| `slices/` | Materials for staged workshop implementation |
| `reference/` | Workshop reference materials |
| `.venv/` | This project’s Python virtual environment |

A common mistake is assuming that opening a file also changes the terminal’s directory.

The editor and terminal can point to different locations.

You may see `app.py` in the editor while the terminal is in another directory.

If you run:

```
python -m pip install -r requirements.txt
```

The computer may report:

`Could not open requirements file`

It is looking for the file in the wrong location.

Start by confirming the current directory.

```
pwd
ls
```

These commands are common on Linux and macOS. Windows PowerShell provides `Get-Location` and `Get-ChildItem`.

### 2. Python interpreter: what actually executes the code?

Python is a programming language. The Python interpreter is the software that reads and executes Python code.

A computer may have several versions installed:

- Python 3.10
- Python 3.11
- Python 3.12

Think of a factory with production machines from different generations.

Running a program requiring Python 3.12 with Python 3.10 may cause syntax or package compatibility problems.

Check the version first:

```
python --version
```

Then identify the actual interpreter:

```
python -c "import sys; print(sys.executable)"
```

The second command displays the location of the Python executable.

Matching version numbers alone do not establish that two commands use the same Python environment.

### 3. Virtual environment: separate packages for each project

Package separation is a central concept in this lesson.

Suppose you develop three systems:

Hospital imaging analysis system

Python 3.11 + a validated set of AI packages

Restaurant inventory system

Python 3.12 + another set of data-processing packages

School assignment system

Python 3.12 + web and testing packages

Manage packages separately to avoid interference.

One computer can host multiple independent project environments.

If all three projects share packages, updating packages for the restaurant system may unexpectedly break compatibility in the hospital system.

Python’s `venv` is one way to manage this separation.

```
python -m venv .venv
```

This command means:

“Use the currently selected Python to create a separate environment named `.venv` in this directory.”

It mainly separates Python packages and their execution environment.

A virtual environment does not provide a security sandbox. It does not automatically prevent file access, network connections or access to operating-system resources. Coding Agent permissions still require separate isolation and authorization controls.

### 4. Dependencies: which external tools does the program use?

Building a website does not require writing every feature from scratch.

For example:

- Use Streamlit for a web interface.
- Use pytest for automated tests.
- Use pandas for tabular data processing.

In Python, these reusable tools are generally called packages.

They are dependencies because your program relies on them to work.

For example, `requirements.txt` can contain:

```
streamlit==1.51.0
pytest==8.4.2
```

These are the workshop’s two specified direct dependency versions.

The `==` operator requests an exact version.

Pinning direct dependencies does not necessarily lock every transitive dependency or guarantee identical behavior across operating systems.

### 5. Toolchain: which tools work together?

A toolchain connects tools with different responsibilities to complete development work.

| Tool | Main responsibility |
| --- | --- |
| Python | Execute the application |
| pip | Install and manage Python packages |
| Streamlit | Build an interactive web interface |
| pytest | Run automated tests |
| Git | Manage code versions and changes |
| Coding Agent | Help read/write code, edit files and call authorized tools |

Think of a Coding Agent as an engineer who can use tools.

An engineer operating a drill and the drill have different roles; likewise, the Agent can execute Python while Python remains the code execution tool.

## 4. Practice: start a Python project

Use the course’s Streamlit workshop. Its specified versions are Python 3.11 or 3.12, Streamlit 1.51.0 and pytest 8.4.2.

Standard operating sequence

1. Find the correct project root

   Confirm that README, requirements.txt and starter are in the expected locations.
2. Create and activate a virtual environment

   Confirm that the selected Python meets the requirements.
3. Install dependencies

   Confirm that installation finishes successfully.
4. Start the program

   Observe the starting skeleton in the browser.
5. Stop and retain evidence

   Stop the service properly and record successes, failures and unverified items.

### Step 1: create and activate the environment

### Linux / macOS

```
# 在工作坊根目錄執行
python3 --version

# 確認為 Python 3.11 或 3.12 後建立環境
python3 -m venv .venv

# 啟用虛擬環境
source .venv/bin/activate

# 查看目前 Python
python --version
python -c "import sys; print(sys.executable)"
```

### Windows PowerShell

Confirm that Python 3.11 or 3.12 is installed. This example selects 3.12; replace `-3.12` with `-3.11` when using 3.11. `py` is the Windows Python launcher; if it is absent, locate the interpreter through your actual Python installation.

```powershell
Get-Location
Get-ChildItem
py -3.12 --version
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python --version
python -c "import sys; print(sys.executable)"
```

If activation is unavailable, address the same environment’s interpreter directly:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m streamlit version
.\.venv\Scripts\python.exe -m pytest --version
.\.venv\Scripts\python.exe -m streamlit run starter/app.py --server.address 127.0.0.1
```

If PowerShell policy prevents running activation scripts, investigate the policy. You can use the environment’s interpreter directly without relaxing the policy merely for convenience.

### Step 2: install packages

```
python -m pip install -r requirements.txt
```

Why use `python -m pip` rather than just `pip`?

It runs pip with the currently selected Python, reducing the risk of installing into another environment.

### Step 3: confirm installation

```
python --version
python -m streamlit version
python -m pytest --version
```

Keep these checks distinct:

Displaying the pytest version does not execute the tests.

`python -m pytest --version` establishes only that the selected Python can invoke pytest and display its version.

To actually run tests later, normally use:

```
python -m pytest
```

Also confirm that appropriate test cases exist and inspect the actual test results.

### Step 4: start the web interface

```
python -m streamlit run starter/app.py --server.address 127.0.0.1
```

Read the command in three parts:

- `python -m streamlit`: run Streamlit with the selected Python.
- `run starter/app.py`: start the specified application.
- `--server.address 127.0.0.1`: bind the service only to the local loopback address.

Successful startup normally prints a local URL that you can open in the browser.

At this stage, check that the skeleton opens correctly. Complete data validation and report export are not yet expected.

### Step 5: stop correctly

In the terminal running the service, press:

```
Ctrl + C
```

This commonly stops the foreground service.

To also leave the virtual environment, enter:

```
deactivate
```

Stopping the service and deactivating the environment are separate actions.

## 5. Diagnose the failed layer

Use this table to choose the first investigation:

| Symptom | Check first | Avoid rushing to |
| --- | --- | --- |
| requirements.txt not found | Terminal working directory | Arbitrarily changing code |
| `python` not found | Python installation and PATH | Deleting the project |
| `ModuleNotFoundError` | Installation in the selected environment | Rewriting the entire feature |
| Streamlit cannot start | Packages, error output and port | Claiming the system is complete |
| Page opens but export is absent | Whether export is implemented | Calling it an environment failure |
| A test fails | Test cases, input and implementation | Deleting failing tests |

For example, a logistics company is developing a shipping management system.

After the AI writes code, execution reports:

```
ModuleNotFoundError: No module named 'streamlit'
```

The selected Python cannot find Streamlit.

Check which Python is running, whether Streamlit is installed in that environment and whether installation failed.

Investigate the layer implicated by the error before treating it as application-logic failure.

## 6. Why Coding Agents need this discipline

An AI Agent may both modify code and execute commands.

Suppose you request:

“Finish this hospital appointment system and fix all errors.”

The AI discovers that the test environment lacks a package.

Changing large amounts of code or deleting tests and then claiming success would obscure the environment problem.

Ask the Agent to inspect the environment first and make the smallest necessary change.

Use three acceptance gates:

| Gate | What it establishes | Evidence |
| --- | --- | --- |
| G1 Environment established | Tools and versions are available | Installation results and version output |
| G2 Program executable | The service starts normally | Startup screen and terminal record |
| G3 Features meet requirements | Actual behavior is correct | Test results and acceptance operations |

Evidence for one gate cannot substitute for another.

If G1 and G2 pass while G3 has not run, record: “Environment and skeleton startup succeeded; feature acceptance has not run.”

This is evidence-based development in AI collaboration: connect completion claims to observed results.

## 7. Retain the outcome

Create `environment-notes.md` to record the environment and startup results.

Use this template. Its six groups record: (1) project name, root and README location; (2) operating system, Python version and executable, Streamlit and pytest versions; (3) installation command, success/failure/not run, exit outcome and errors; (4) startup command, local URL, expected/actual screen and successful shutdown; (5) completed, unimplemented and unverified features; (6) unresolved issues and the next smallest task. The shared workshop template below retains its original Chinese field labels:

```
# Environment Notes

## 1. 專案資訊
- 專案名稱：
- 專案根目錄：
- README 位置：

## 2. 執行環境
- 作業系統：
- Python 版本：
- Python 執行檔位置：
- Streamlit 版本：
- pytest 版本：

## 3. 安裝結果
- 執行命令：
- 成功 / 失敗 / 未執行：
- 結束狀態與錯誤訊息：

## 4. 啟動結果
- 啟動命令：
- 本機網址：
- 預期畫面：
- 實際畫面：
- 是否成功停止服務：

## 5. 功能狀態
- 已完成：
- 尚未實作：
- 尚未驗證：

## 6. 下一步
- 待處理問題：
- 下一個最小工作：

```

Keep code, dependency specifications and necessary environment notes in version control so others can recreate the environment. Python documents virtual environments as disposable and recreatable rather than movable; exclude `.venv` from Git.

## 8. Four working habits

1. Locate the project: confirm the terminal’s current directory.
2. Select the environment: confirm Python version, virtual environment and packages.
3. Verify stages separately: package installation, startup and feature correctness need distinct checks.
4. Retain evidence: verify actual execution rather than relying on an AI’s completion claim.

Use commands to develop engineering judgment:

When AI helps build software, identify its working environment, the changes it made, the outcomes confirmed and the work still incomplete.

## 9. Check your understanding

Suppose an AI Agent is building a school grade-management system and reports:

“All Python packages installed successfully and the Streamlit page opens, but grade statistics and Excel export have not been implemented.”

Question 1: which stage can you report as complete?

A. The entire system is complete

B. Environment setup and skeleton startup succeeded

C. All feature tests passed

Question 2: an Agent says a virtual environment prevents access to other directories. Is this correct?

A. Yes; it provides complete security isolation

B. No; it mainly separates Python package environments

Question 3: if `pytest --version` displays a version successfully, can you report that all automated tests passed?

A. Yes

B. No; actually run the tests and inspect the results

Reference explanations: B for all three questions. Setup and startup support G1/G2; venv mainly separates packages; a pytest version check does not establish passing tests.

M07-02, “Constrain Agent work with a specification,” continues with limiting edits to specified files, following requirements and supplying verifiable outcomes after environment preparation.
