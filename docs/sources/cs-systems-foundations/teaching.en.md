# Computer Science Foundations: From a Byte to a Complete Software System

Computer Science & Systems Engineering | General concepts, first principles, mechanisms and practical judgment

This course organizes computer systems and software engineering into a body of knowledge applicable to Linux, macOS, Windows, websites, AI systems and cloud services.

Its central idea is that a computer system consists of layers, each managing particular resources, identities, states and operations.

Understanding their responsibilities and connections helps you explain why tools behave as they do and investigate problems independently.

## 1. Build a map of computer science

We can organize these system topics into six areas.

| Area | Core question | Foundations |
| --- | --- | --- |
| Computers and operating systems | How does a program run? | CPU, RAM, SSD, kernel, process, system call |
| Files and storage | How is data stored and shared? | Filesystem, inode, links, CoW, hashes |
| Software and dependencies | How does software obtain the right components? | Runtime, package, dependency graph, ABI, lockfile |
| Versions and collaboration | How are changes saved and integrated safely? | Git, DAG, commit, branch, transaction |
| Building and delivery | How does software become a usable system? | Build, container, artifact, CI/CD, HTTP |
| Testing and governance | How do we establish correctness and recoverability? | Testing, observability, security, provenance, data governance |

These are perspectives on one system rather than six unrelated collections of tools.

## The complete software lifecycle

Source

Code, data, configuration, requirements

Dependency

Packages, versions, libraries, toolchain

Build / Execute

Operating systems, processes, compilers, runtimes

Artifact

Website files, executables, container images, model packages

Deploy / Serve

Servers, containers, networks, browsers

Verification

Check every stage and confirm that users receive the correct result.

Filesystems and hardware support all stages. Git manages source history. Testing, security and evidence provenance should span the whole flow.

We will follow this route from the underlying mechanisms upward.

## 2. Computer fundamentals: how does a program run?

### 1. What do the CPU, RAM and SSD do?

Imagine a restaurant:

- The CPU is the chef, carrying out instructions.
- RAM is the workbench holding ingredients currently in use.
- The SSD is the storeroom preserving materials for later.
- The operating system manages assignments, equipment and access rights.

The analogy gives us an initial model, with several important details to add.

CPU

Executes instructions, computation and control

RAM

Temporarily holds data currently used by processes

SSD

Persistently stores files and programs

GPU

Performs large amounts of parallel computation, often for graphics and AI

The key distinction is this:

Data on an SSD has not necessarily been loaded into memory for the CPU. Data in RAM has not necessarily become available to a GPU.

Suppose you run an AI speech-recognition program.

Model weights may be stored on the SSD. At startup, the system reads model files and establishes the process's memory state. With a discrete GPU, relevant weights or data may also need to be transferred to memory the GPU can access.

Two projects sharing one on-disk model file through a hard link therefore do not automatically share one allocation of GPU memory across their processes.

Storage sharing and runtime memory sharing are different mechanisms.

### 2. What is a kernel?

The kernel is the core part of an operating system. It manages hardware resources and provides controlled system services.

A Python program cannot arbitrarily control all disk hardware directly. It normally reads and writes files through operating-system interfaces.

For example:

```
with open("data.txt", "r") as f:
    content = f.read()
```

To the programmer, this opens a file and reads its contents.

Conceptually, the underlying path is:

```
Python program
    ↓
Python runtime / libraries
    ↓
System call
    ↓
Kernel
    ↓
Filesystem and storage device
    ↓
Return data to the program
```

A system call is a formal entry point through which an application requests an operating-system service.

It is also one of the mechanisms that protects system resources.

### 3. A process differs from a program

A program usually means stored program content.

A process is a running execution entity managed by the operating system.

Think of a program as a recipe, and a process as the chef and working state involved in following that recipe.

The same program can have several running processes, each potentially with its own address space, open files, execution environment and permissions.

For example:

```
python server.py
```

This involves more than opening a Python file.

The shell finds the Python interpreter, the operating system creates a process, and the interpreter reads the program, loads required modules and executes its operations.

Understanding execution requires distinguishing program files on disk, running processes, and the memory and external resources those processes use.

## 3. Filesystem fundamentals: a path is not the data itself

### 1. Filenames, inodes and data blocks are different things

We commonly think of:

```
/home/user/report.txt
```

as a file.

A typical Linux filesystem distinguishes the path/name, file metadata and stored content:

```
Path
    ↓
Directory entry
    ↓
inode: file-object metadata
    ↓
Data blocks / extents: actual content
```

An inode is a filesystem data structure containing or associated with permissions, ownership, link count, size, timestamps and data-allocation information.

An inode number identifies an object only within its filesystem. To compare file identity, normally consider the device and inode together.

### 2. Hard links, symbolic links, reflinks and copies

{{figure:links}}

Hard link

Two paths refer to the same inode. Removing one name does not automatically remove content still referenced by the other. An in-place modification through either name is visible through the other.

The following table compares the four mechanisms:

| Mechanism | What is shared? | Behavior on modification |
| --- | --- | --- |
| Symlink | Target path | Normally resolves the path to a target; may dangle when the target disappears |
| Hard link | Same inode | In-place writes affect all names for that object |
| Reflink / CoW | Underlying data blocks | Blocks that need modification are separated on write |
| Copy | Usually independent data | Changing one copy does not change the other |

CoW means copy-on-write.

Its central idea is to share identical content initially and allocate separate storage for changed portions when one instance is actually modified.

The same idea appears in filesystems, virtual memory, containers and snapshots.

### 3. Why can hard links be risky?

Suppose two applications need `config.json`.

Their contents are identical today, so you replace the separate files with hard links.

Tomorrow application A modifies its configuration, and application B may see the new content too.

Sharing an inode also shares metadata such as permissions and timestamps.

To share writable files safely, understand how the applications update them.

Opening and overwriting a file in place differs from creating a new file and using `rename` to replace the old path.

The latter can make that path refer to a new inode, ending its sharing of the original object with other hard links.

### 4. Why might deleting a large file not immediately free disk space?

Other hard links may still reference the inode, or a process may hold an open reference to the deleted file.

Snapshots, CoW sharing, concurrent writes and filesystem allocation behavior can also matter.

Distinguish three quantities:

Logical size is the file's externally visible byte length. Allocated size is the storage actually allocated. Free space is the capacity currently available across the filesystem.

This helps explain why `du`, `df` and application cache statistics can disagree.

GB and GiB also differ: GB normally means 10⁹ bytes; GiB means 2³⁰ bytes.

### 5. How can you observe this?

These Linux/GNU examples only read information. Replace `example.txt` with an existing file. On macOS, `stat` output formatting and `readlink` options depend on the version; check `man stat` and `man readlink` first.

```
# Filesystem capacity
df -h

# Estimated directory usage
du -sh .

# File inode, link count and permissions
stat example.txt

# Resolved symbolic-link path
readlink -f example.txt
```

Equal file sizes do not establish identical file objects. Check content and identity separately.

This leads to the next concept: hashing.

## 4. Hashes, content addressing and deduplication

### 1. A hash is a fingerprint of content

Suppose two files are named:

```
report-final.pdf
report-final-copy.pdf
```

Their names do not establish whether their contents match.

A hash function maps input data to a fixed-length digest.

SHA-256, for example, produces 256 bits regardless of file size.

```
File content A ── SHA-256 ──> Hash X
File content B ── SHA-256 ──> Hash X
```

Matching full SHA-256 digests normally give extremely high engineering confidence that file contents match. This relies on cryptographic collision resistance; collisions are not mathematically impossible.

### 2. What is content-addressable storage?

Ordinary storage uses a filename to locate content:

`Filename → File content`

Content-addressable storage (CAS) uses a content hash as identifying information:

`File content → Hash → Storage location`

Content: file bytes

SHA-256: compute the digest

Blob Store: store content by digest

Version A

References Hash X

Version B

References Hash X

Different versions can reference one content object, avoiding duplicate storage of identical bytes.

A blob is a chunk of data that a system manages as a whole.

A snapshot describes state at a particular time. It can record the paths present and their corresponding contents without storing every identical byte again for each snapshot.

These ideas apply to Git objects, package stores, model caches, backups and version history.

### 3. A matching hash does not establish trust

This distinction matters for security.

Integrity asks whether data changed. Authenticity asks whether it came from a source you trust.

An attacker can create a malicious file and compute its SHA-256 digest.

A download matching a digest supplied by the same untrusted website therefore does not establish that the software is safe.

Consider trusted release channels, digital signatures, package provenance and supply-chain security as well.

The underlying principle is:

A hash can establish content identity, but cannot establish source trust by itself.

## 5. Processes, commands and permissions

### 1. Terminal, shell and runtime have different roles

You enter:

```
python app.py
```

Several components participate.

The terminal provides a text interaction interface. The shell parses commands, manages the environment and starts programs. The Python runtime executes Python code.

When resolving `python`, the shell normally searches for an executable using the PATH environment variable.

PATH is a list of directories in which to look for tools.

Suppose two Python installations exist:

```
/usr/bin/python3
/home/user/project/.venv/bin/python
```

Different shells, PATH values or virtual environments can select different interpreters for the same `python` command.

An identical command name therefore does not establish that the same program runs.

### 2. Shebangs, PATH and child processes

A Unix-like script can start with:

```
#!/usr/bin/env python3
```

This is a shebang, specifying how to select an interpreter when executing the script directly.

Here, `env` finds `python3` in the execution environment. A fixed interpreter path instead depends on that particular path remaining valid.

This explains why moving a Python CLI environment can break its entry-point scripts.

A process can also start another process.

For example, in Node.js:

```
import { spawnSync } from "node:child_process";

const result = spawnSync("python3", ["worker.py"], {
  encoding: "utf8"
});
```

Node.js is the parent process; Python is the child.

The child has its own process identity, but normally receives an environment from its parent, including environment variables and a working directory.

Success of the outer tool therefore does not establish that the inner process received the intended PATH or Python environment.

### 3. What does an exit code mean?

Unix-like processes normally report results to callers through an exit status.

By convention:

`0` means the process reports success; a nonzero value indicates a failure or exceptional condition.

For example:

```
python validate.py && python build.py
```

`&&` runs the second command only if the first succeeds.

If `validate.py` discovers errors but still returns 0, `build.py` may continue.

A success indicator shows that a success signal was received. Check whether that signal reflects the intended acceptance criteria.

### 4. Permissions and least privilege

A Linux process normally runs under a user identity. Its ability to read files, change settings or manage services depends on applicable permission mechanisms.

This connects to the following principle:

Least privilege means giving a process only the capabilities required for its task, rather than maximum authority for convenience.

Reading a Docker container list, for example, does not by itself justify unrestricted host-management access. Docker socket permissions deserve particular care.

Likewise, package isolation through a venv does not create a security sandbox for the executing program.

## 6. Package management: dependency graphs and resource allocation

### 1. What is a dependency graph?

Suppose your application depends on A and B, and A depends on C.

```
Application
  ├── A
  │   └── C
  └── B
      └── D
```

This is a graph: packages are nodes and dependency relationships are edges.

A direct dependency is explicitly required by the application. A transitive dependency is required through another package.

Peer dependencies are another frequent source of confusion.

A UI component package, for example, may require the main project to provide a compatible React version. Giving every package its own downloaded React copy does not fully describe this relationship.

Package managers therefore solve compatibility constraints and version selection as well as downloading files.

### 2. Manifest, lockfile and installed environment

Manifest

Which dependencies are allowed

Lockfile

Which versions were selected

Installed Environment

Programs, modules, entry points and links actually present on disk

A manifest specifies requirements; a lockfile records a dependency-resolution result; an installed environment consists of the files and links actually created.

These three states can disagree.

Suppose a project permits version 2.x of a library, its lockfile selects 2.5.1, and a developer still has an older 2.4.0 environment.

A working local run does not establish that it uses the same dependencies as CI.

Use the lockfile together with a controlled installation procedure and verification.

### 3. Underlying differences between npm and pnpm

Both npm and pnpm resolve and install JavaScript packages. Their dependency-directory structures and file-reuse mechanisms can differ.

A typical pnpm installation expresses dependencies through a shared store, `node_modules/.pnpm` and symbolic links. Package-content import methods depend on the platform and configuration.

Distinguish two questions:

Dependency resolution: when a program requests package A, which version should it find?

Storage allocation: must every project keep a separate copy of identical package content?

pnpm handles these concerns separately, allowing content reuse while preserving project dependency relationships.

### 4. Python, venv, pip, uv and pipx

| Technology | Main role |
| --- | --- |
| Python Runtime | Executes Python programs |
| venv | Creates isolated package installation and search environments |
| pip | Installs Python packages |
| uv | Manages Python projects, dependency resolution, environments, tools and caches |
| pipx | Installs and runs Python CLI tools in isolated environments |
| Wheel | An installable Python distribution format |

venv lets projects use different package installation locations instead of sharing a single global Python environment.

uv supports package import strategies including copy, hardlink, symlink and clone (CoW). These differ in sharing, modification side effects and safe cache-cleaning behavior.

Remember:

Matching package versions do not establish binary-environment compatibility.

### 5. ABI, CPU architecture and toolchain

Imagine buying an electrical plug.

Its product name and model may be correct, but it still cannot connect directly to an incompatible socket.

Native software faces a similar issue.

CPU architecture, such as x86-64 or ARM64, describes conditions including the processor's supported instruction-set architecture.

An ABI (Application Binary Interface) describes binary-level interaction between compiled programs: calling conventions, data layout and specific compatibility requirements.

A toolchain combines compilers, linkers and other build tools.

Therefore:

Executability ≠ correct package versions alone

Also consider the operating system, instruction set, ABI, native libraries, interpreter and required drivers.

This explains why some Python wheels and GPU-specific compiled artifacts cannot be exchanged across architectures simply because their names or sizes match.

Rust also distinguishes the host, where the compiler runs, from the target, where the compiled result will run.

### 6. APT, Snap, Rustup and project package managers

Identify who manages each piece of software.

APT commonly manages system packages on Debian and Ubuntu.

Snap manages its packages and revisions; some older revisions may provide rollback points.

Rustup manages Rust toolchains and associated proxy entry points.

pnpm and uv focus more on language- or project-level dependencies and tools.

These tools can coexist on one computer while owning assets at different layers.

Updating rustup, for example, does not mean every Rust compiler toolchain has been updated. Removing one Python CLI environment does not establish that pipx or uv is no longer needed.

Before reorganizing a computer, ask: who created this file, who uses it, who updates it, and how can it be restored?

## 7. Caches, garbage collection and Docker

### 1. Why do caches accelerate work?

The central tradeoff is:

Spend some storage now to reduce future access or computation costs.

A package's first download needs network transfer; a later retrieval from cache may avoid downloading it again.

There are several kinds of cache.

CPU caches hold data the processor may soon use. An operating-system page cache can hold file data. Package-manager caches store downloads or build results. Browser caches can retain web resources.

All reuse work or data, but their contents, owners, invalidation conditions and safety contracts differ.

### 2. How does garbage collection decide what can be removed?

One common approach starts from a root set and finds objects that remain reachable.

```
Root: an active entry point
   ├── Object A
   │    └── Object C
   └── Object B

Object D: no reachable valid reference
```

In this simplified model, D may be a collection candidate.

A system can make the wrong decision if it has not registered every consumer correctly.

A program may still need a particular browser executable, for example. If the cache manager does not know that requirement, cleanup may remove it.

Safe garbage collection therefore depends on a sufficiently complete reference model and lifecycle information.

For tools such as uv, prefer their cache-management interfaces over manually deleting internally managed files. Its official documentation also warns against directly modifying cache contents.

### 3. Docker images and containers

A Docker image is a prepared execution template containing an application and required filesystem layers.

A container is an instance created from an image, with isolation settings and writable state.

In a typical Linux container architecture, containers share the host kernel. Namespaces, cgroups and related mechanisms provide isolation and resource control. This differs from a virtual machine emulating a separate computer.

## Typical layered Docker storage

Container Writable Layer

State added or changed while the container runs

Application Layer

Application and related files

Dependency Layers

Runtimes and packages

Base Image Layers

Base filesystem contents

Volume / Bind Mount

Persistent data managed separately from the container writable layer

This is a conceptual structure. Multiple images can share layers, so adding listed image sizes does not establish unique physical disk usage.

Volumes deserve particular attention.

Suppose a database runs in a container while its data lives in a separate volume.

Recreating the container does not necessarily delete the volume. Deleting the volume by mistake, however, may destroy the data you actually needed to preserve.

Docker's official teaching separates containers from persistence and emphasizes independent management for long-lived data.

### 4. Why is minimum SSD usage an incomplete cleanup goal?

We can express resource optimization conceptually as:

Minimize (storage cost + reconstruction cost + operational risk)

Evaluate these costs in context. They cannot be added as one unit without first defining a common measure.

A 5 GB cache that is easy to download again may be suitable for cleanup.

A 500 MB local compilation result may be more valuable to retain if reconstruction requires a special environment, unavailable upstream resources or extensive manual work.

Mature resource management reduces overall maintenance cost while preserving recoverability and verifiability.

## 8. Git fundamentals: managing a directed acyclic graph

### 1. What does Git store?

Many people think of Git as a code-backup tool.

That captures part of its value but leaves out important mechanisms.

Git is a distributed version-control system that stores content, version snapshots and relationships between versions.

Start with three object types:

A blob stores file contents. A tree describes files and subdirectories at a directory level. A commit records a version's tree, parent commits and other metadata.

These structures preserve a history of versions.

## Three main Git working areas

Working Tree

Files being edited

Index

Content prepared for a commit

Repository

Committed version objects

Working Tree

git add

git commit

The working tree, staging area and committed data represent distinct states. `git add` and `git commit` perform different operations.

Official Git documentation also uses these three areas as its basic working model.

### 2. Why does Git use a DAG?

DAG means Directed Acyclic Graph.

It is a graph with directed connections in which following those directions never leads back to the starting point.

Git commits point to parent commits, representing version history.

In the conceptual illustration, B branches into two development histories and G records both parents as a merge commit. Git's internal parent pointers actually run from newer commits to their parents.

This structure matters because developers cannot always make changes along one uninterrupted line.

A branch is fundamentally a reference to a commit.

Developers can work along separate histories and choose how to integrate them.

### 3. Fast-forward, merge and rebase

A fast-forward moves a branch reference to a newer descendant commit without creating an additional merge commit.

A merge integrates diverged histories, creating a commit with multiple parents when needed.

A rebase reapplies changes from one development line onto another base, producing new commit identities.

Avoid rewriting shared history without an agreement among collaborators.

Force pushes require particular care because they can change the history reachable from a remote branch.

### 4. Stash and worktree

Stash temporarily saves working-tree and index changes. `git stash push -u` also includes untracked files, but normally excludes ignored files.

Worktree allows one repository to have additional working directories and indexes.

For example, you may be editing a feature while needing a clean environment based on the latest main to test a release.

A separate worktree reduces the risk that the two tasks overwrite each other's files.

This illustrates a general engineering principle:

Isolate separate work appropriately while sharing the underlying resources and history it actually needs.

### 5. Commit, push and deploy

Commit saves a version in the local Git object database.

Push attempts to update references in a remote Git repository.

Deploy delivers an executable or serviceable artifact to a target environment.

These operations can involve different times, commits and artifacts.

Therefore:

Commit success ⇏ Deployment success

Even successful deployment does not establish that the application satisfies requirements.

That requires the next layer: building, delivery and acceptance.

## 9. CI/CD: making engineering procedures repeatable

### 1. What are CI and CD?

CI (Continuous Integration) frequently integrates changes and uses automated checks to reduce accumulated problems.

CD can mean Continuous Delivery or Continuous Deployment.

Continuous Delivery keeps software in a deliverable state. Continuous Deployment additionally deploys qualifying changes automatically to the target environment.

For a typical website:

```
Engineer commits source
        ↓
CI establishes an execution environment
        ↓
Install specified dependencies
        ↓
Run content, type, unit and security checks
        ↓
Build
        ↓
Produce an artifact
        ↓
Deploy
        ↓
Verify the production service
```

A build compiles, transforms or packages source into a usable result.

TypeScript, for example, is transformed into JavaScript browsers can execute. A website may also require bundling, compression and prerendering.

### 2. Separate source, cache and artifact

| Category | Purpose | Examples |
| --- | --- | --- |
| Source | Defines what should be created | Code, requirements, configuration, content models |
| Cache | Accelerates repeated work | Downloaded packages, intermediate compilation data |
| Artifact | Output of a particular execution | Built website, executable, test report |

Required content should remain rebuildable when a cache is absent. An artifact may instead be an output that must be retained, transferred or deployed.

GitHub's official documentation also distinguishes workflow artifacts from dependency caches.

The distinction applies to AI systems too.

Original training data, temporary training caches, delivered model weights and evaluation reports should not all follow one retention policy.

### 3. Why control the CI environment?

Suppose developers use Python version A locally while CI uses version B.

Identical source can still encounter syntax, package, ABI or behavioral differences.

Represent the build result conceptually as:

B = f(S, D, T, P, E)

B is the build result, S the source, D dependencies, T the toolchain, P the platform and E environmental conditions.

This is a conceptual model of interacting inputs, rather than an execution formula for a particular tool.

Reproducible builds require controlling enough of those inputs.

A lockfile covers only part of the problem.

### 4. Why does CI need security governance?

CI often downloads software, executes commands, reads some secrets and may deploy production systems.

CI itself is therefore an attack surface worth protecting.

GitHub Actions, for example, may use tokens with different permissions or OIDC credentials.

Consider least privilege, supply-chain security, workflow triggers and untrusted-input handling.

CI caches also require trust boundaries. A lower-trust source that can influence cache contents may introduce cache-poisoning risks.

### 5. Eventual consistency

Suppose one service has uploaded an artifact but another service lists it only a little later.

This may reflect different visibility times across components rather than an upload failure.

Distributed-system consistency models help explain such behavior.

Bounded retries are a common response, with two important conditions.

Define when retries stop. For operations with side effects, also consider idempotency.

An idempotent operation does not keep changing the intended final state merely because it is repeated.

Querying an artifact list can usually be retried safely. Payments, deletions and deployments need more careful retry design.

### 6. Why can concurrency cause problems?

Concurrency means work overlaps in time.

Suppose two builds read and write the same output directory simultaneously.

One may read incomplete intermediate files from the other, making results depend on execution timing.

This is a race condition.

Identify which tasks can run in parallel, which must run sequentially, and which require isolated workspaces or locks.

A CI concurrency group also does not inherently provide a complete FIFO queue. Pending-job retention, cancellation and ordering depend on the platform and configuration.

## 10. Websites: from data models to browser output

### 1. HTML, CSS and JavaScript

Imagine building a house.

HTML defines its structure, CSS its appearance and layout, and JavaScript its interactive behavior.

More precisely:

HTML describes document content and semantics.

CSS controls presentation and layout.

JavaScript executes browser-side logic, manipulates pages, handles interaction and exchanges data with services.

They cooperate with distinct responsibilities.

A visually attractive button with incorrect semantics may still be hard to recognize through keyboard operation or assistive technology.

Frontend design therefore needs more than visual inspection.

### 2. How does a browser retrieve a website?

Understanding deployment requires understanding the resource-retrieval path.

A typical HTTPS request involves:

```
Enter a URL
    ↓
DNS: look up location information for the hostname
    ↓
Establish a connection and TLS-secured channel
    ↓
HTTP: request web resources
    ↓
Server or CDN returns HTML / CSS / JS
    ↓
Browser parses and renders the page
```

DNS, TLS and HTTP operate at different layers.

DNS helps locate the destination; TLS provides communication-security functions; HTTP defines request and response semantics.

If GitHub Pages reports a completed deployment but the displayed website is wrong, investigate artifacts, assets, browser behavior and caches as well as source code.

### 3. Static and dynamic websites

A static website normally produces ready-to-serve HTML, CSS and JavaScript during its build.

A dynamic website may query a database, compute content and generate a response for each request.

For example:

```
Static:
Source → Build HTML → Server serves HTML

Dynamic:
Request → Application → Database / business logic → Response
```

Choose according to functionality, update frequency, interaction needs and deployment cost; neither approach is universally superior.

Many modern websites combine both.

### 4. What do schemas and TypeScript protect?

Suppose lesson data looks like this:

```
{
  "lessonId": "lesson-01",
  "title": "Introduction",
  "published": true
}
```

A schema specifies required fields, types and validity conditions.

TypeScript checks type relationships in program code during development and building.

Passing TypeScript checks does not establish that external JSON is valid.

At runtime, files, APIs and databases can still supply invalid data.

Runtime validation addresses that boundary.

A valid structure also does not establish factual correctness.

Distinguish three judgments:

Is the structure valid? Can the program handle it? Is its content correct?

### 5. Responsive design means more than shrinking pictures

Responsive design keeps content understandable and operable across available space, devices and usage conditions.

Shrinking a 1200px diagram to 300px may preserve the entire picture while reducing labels to one quarter of their size.

HTML text wrapping and rearrangement through CSS Grid, Flexbox or container queries can provide a better reading experience.

Rearrangement must preserve logical relationships.

Two parallel branches in a classification tree should retain that meaning when stacked on a phone, rather than appearing to be sequential dependencies.

Semantics and visual presentation must work together.

Accessibility also involves keyboards, reading order, semantic markup, assistive technology and interaction states, in addition to legibility.

### 6. Hiding a draft does not protect its contents

Suppose navigation hides a draft, but its content still ships in a search index or JavaScript bundle.

Users may still retrieve it.

Hiding data in an interface differs from withholding it from delivery.

This is a common security misunderstanding.

Frontend visibility conditions cannot replace publication or access-control rules.

For a static website, inspect the entire production output as well as checking that a draft route is absent.

## 11. Testing: evidence must match the claim

This is one of the course's most transferable skills.

### 1. What does “tests passed” establish?

Suppose all 100 tests pass.

What have you established?

That depends on their assertions, scope and environment.

Tests of an addition function do not establish website security.

A local browser test does not establish production-service behavior.

Every test needs a defined evidence boundary.

| Test type | Main purpose | Main limitation |
| --- | --- | --- |
| Unit test | Checks small units of logic | Does not establish whole-system correctness |
| Integration test | Checks component interaction | May not cover a real deployment |
| End-to-end test | Checks a specified complete user flow | Covers only designed scenarios |
| Regression test | Guards existing behavior | Uncovered problems can remain |
| Negative test | Checks that forbidden cases are rejected | Needs valid negative fixtures |
| Security test | Checks specified threats or security conditions | Does not establish complete security |

### 2. Positive and negative behavior

Suppose you build a file-upload system.

Positive tests check that legitimate users can upload files meeting the requirements.

Negative tests check handling of unauthorized users, invalid files and operations exceeding limits.

Both are necessary.

In security, allowing legitimate operations and blocking forbidden operations are distinct requirements.

### 3. Why must test data itself be valid?

Suppose you test that unpublished articles cannot appear publicly.

You create a draft whose basic JSON structure is invalid.

The build fails while parsing content.

This does not establish that publication control works: execution never reached the publication decision.

Keep other conditions valid and vary the condition under test whenever possible.

This follows the experimental principle of controlling variables.

### 4. SHA-256, Playwright and human review

Suppose a hash comparison confirms that an SVG matches a trusted source file.

It establishes byte equality.

It does not establish correct arrows, readable text or reader understanding.

Playwright checks presentation and interaction in a specified browser environment; it does not automatically judge all teaching claims.

Human review evaluates meaning, context and professional content, with potential omissions and subjective judgment.

Combine complementary evidence in acceptance rather than expecting one tool to answer every question.

## 12. Reliable systems: atomicity, races, recovery and governance

Files, Git, Docker, CI/CD and data governance share deeper system principles.

### 1. Atomicity

An atomic operation appears externally as an indivisible state transition.

Consider updating an important file.

Overwriting it in place can expose partially written content to another process.

A common approach writes a temporary file and then replaces the target through an appropriate atomic rename.

This reduces the chance that other processes observe intermediate state.

However:

Atomic visibility does not establish durable storage after a power failure.

File synchronization, directory metadata, filesystem journaling and device guarantees can affect durability.

### 2. TOCTOU

TOCTOU means Time-of-Check to Time-of-Use.

A condition can hold when checked but change before an operation uses that result.

For example:

```
Check that a file is unchanged
       ↓
Another process updates it
       ↓
Original process acts on its earlier check
```

This can create correctness or security problems.

A single pre-operation check may be insufficient to maintain the condition at execution time.

Depending on the situation, use locking, version checks, atomic operations, isolation or other concurrency controls.

### 3. Commits across repositories are not one transaction

Suppose a release updates a website repository and a planning repository.

The website push succeeds but the planning push fails.

Git does not automatically provide all-or-nothing transaction guarantees across these independent repositories.

Their states can temporarily disagree.

Use explicit recovery and reconciliation: retain completed commit identifiers, then complete the other update.

Large distributed systems face similar problems.

They may need compensating operations, idempotency and reconciliation beyond a single database's transactions.

### 4. Single source of truth and data provenance

A single source of truth is a principle for assigning data authority.

It does not require one database for the entire system. Each piece of information needs a clear authoritative source.

Specifications own product requirements; CI records own build results; deployment systems own deployed-version records; actual learning evidence owns learner outcomes.

Data provenance tracks where information came from, how it was transformed, who or what changed it, and whether that history can be traced.

The principles complement each other:

Clear authority reduces conflicts; provenance makes changes understandable and verifiable.

### 5. Control plane and data plane

These concepts appear in networking, cloud infrastructure and distributed systems.

The data plane processes actual data or carries out the main workload.

The control plane configures, coordinates and manages how the system should operate.

In a website analogy, servers delivering production pages form the service path. Systems recording deployment targets, release states and workflows resemble a control plane.

This is an architectural analogy. A project-management document does not automatically implement a formal distributed control plane.

### 6. Why retain Unknown?

Engineering systems record many states.

Suppose deployment has completed but manual accessibility acceptance remains unconfirmed.

One `done = true` can conflate distinct activities.

A more precise model might be:

```
build        = passed
deployment   = succeeded
browser_test = passed
a11y_review  = pending
user_impact  = unknown
```

This prevents unmeasured conditions from being reported as passed.

Do not invent estimates as measured numbers for hours, performance, reliability or security metrics.

Unknown is a meaningful information state, not necessarily a data-management failure.

## 13. Turn foundations into troubleshooting skills

How would you choose an initial investigation for these observations?

| Observation | Mechanisms to inspect first |
| --- | --- |
| Two directories each appear to occupy 10 GB | inode, hard links, CoW, allocated size |
| Deleting a large file does not change `df` | Other links, open references, snapshots, concurrent writes |
| A program works locally but not elsewhere | Runtime, package versions, ABI, CPU architecture |
| The same command behaves differently in different terminals | PATH, shebang, environment variables, working directory |
| A tool breaks after cache cleanup | References, link modes, version coupling |
| Git push succeeds but the website stays unchanged | CI, build, artifact, deployment |
| CI succeeds but website content is wrong | Assertions, publication boundaries, production environment |
| A desktop page is unreadable on mobile | CSS reflow, semantics, responsive design |
| Jobs overwrite one another's files | Race conditions, isolation, locks, transactions |
| Release completion records contradict one another | Source of truth, provenance, state models |

Notice the diagnostic method:

First identify the abstraction layer, then choose its observation method, rather than immediately guessing which tool broke.

This is a direct practical benefit of understanding underlying mechanisms.

## 14. Safe experiment: observe inodes and hard links

Use a new temporary directory in a Linux or macOS terminal, away from production projects.

```
# Create an isolated temporary directory
lab=$(mktemp -d)

# Create a file
printf 'Hello Computer Science\n' > "$lab/a.txt"

# Create a hard link
ln "$lab/a.txt" "$lab/hard.txt"

# Create a symbolic link
ln -s a.txt "$lab/soft.txt"

# Observe identity and link count
stat "$lab/a.txt"
stat "$lab/hard.txt"

# Compare content: sha256sum on Linux, shasum on macOS
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "$lab/a.txt" "$lab/hard.txt"
else
  shasum -a 256 "$lab/a.txt" "$lab/hard.txt"
fi
```

Check whether the original and hard link share an inode, whether the hard-link count changed, and whether their content digests match.

This turns abstract filesystem concepts into observable evidence. Expect `a.txt` and `hard.txt` to share a device and inode, have a link count of 2 and matching SHA-256 digests. `soft.txt` is a separate symbolic-link object. Actual inode numbers depend on the filesystem.

After observation, use the same shell to remove only the three names created by this experiment, then the empty directory. `rmdir` stops if additional content remains.

```
rm -- "$lab/soft.txt" "$lab/hard.txt" "$lab/a.txt"
rmdir -- "$lab"
unset lab
```

## 15. Comprehensive understanding check

The following case spans the course's main areas. Answers are intentionally withheld.

Scenario: a research team maintains a Python AI inference service, a JavaScript teaching website and a Docker database service. SSD space is running low, engineers have inconsistent environments, CI sometimes fails, and a website update exposed draft content in production.

Answer in your own words, explaining the investigation and evidence needed.

A | Hardware and filesystems
Two AI projects have equally sized model weights. How would you determine whether they duplicate physical disk usage? What else must you check before sharing hard links? Does disk sharing imply GPU-memory sharing?

B | Dependencies and execution environments
Python and JavaScript projects behave differently across engineers' computers. How would you distinguish PATH, dependency resolution, lockfiles, ABI and architecture issues?

C | Caches and containers
A manager requests deletion of all large caches, Docker images and volumes. How would you identify rebuildable data, potentially unique important data, and removals that could break other environments?

D | Git, CI/CD and distributed systems
Git push and CI build succeeded, but production did not update. Which stages would you trace? What could happen if two builds modify the same output directory?

E | Websites and security
How can a draft be retrievable from search even without a public page? Which positive, negative and production tests would you design?

F | Testing, recovery and governance
After recovery, how would you distinguish file integrity, service availability, version correctness, effective security restrictions and satisfied user needs? Which evidence would you preserve, and how would you avoid calling unknown states successful?

Bring A–F responses to an instructor or a subsequent discussion for individual review. This page provides no online submission or automatic grading.

## Five ideas to retain

1. Names differ from objects. A filename is not an inode; a package name is not a specific installed version; a command name is not its actual executable.

2. Identical content requires a separate sharing-safety judgment. Check write behavior, ownership and recovery needs before sharing.

3. Environment consistency requires more than version numbers. Toolchains, operating systems, CPU architectures, ABIs and execution conditions can affect results.

4. Each stage has its own completion criteria. Commit, build, deployment, testing and user acceptance require different evidence.

5. Engineering conclusions require matching evidence. Byte equality does not establish software safety; a started service does not establish that a user completed their task.

Apply these ideas to a real Python project, JavaScript website and Docker service. Observe their resources, dependencies, versions, execution and acceptance evidence step by step. This develops transferable understanding more effectively than memorizing commands alone.
