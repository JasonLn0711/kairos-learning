# CEH M03-06 | OS Fingerprinting: Inferring a System from Network Responses

**Core idea: OS fingerprinting compares a combination of network-response features with known samples, proposes a conditional identification, and uses device-side evidence for confirmation.**

The previous lesson identified software from service responses. This lesson examines a lower layer: response details can provide clues even when a host does not announce its operating system. The goal is to separate observed packet features, a tool's inference, and an administrator-confirmed version.

## 1 | A familiar example: recognizing a desk by its response habits

Imagine calling several offices. Everyone follows basic telephone etiquette, but some staff introduce their department first, others ask your name, and others confirm details before transferring you. A combination of habits may suggest which desk answered. A single “hello” tells you much less.

Network implementations also have recognizable habits. An **operating system (OS)** manages computer resources and provides an environment for programs. A **protocol stack** is the collection of implementations that handle network communication at different layers, such as processing IP packets and managing TCP connections.

Systems follow common protocols, while supported options, defaults and some response details can differ. **OS fingerprinting** collects these features and compares them with known systems. A fingerprint here is a feature combination, not a permanent identity unique to one device. Multiple devices can look alike, and updates and network conditions can affect observations. [Nmap: Remote OS Detection](https://nmap.org/book/osdetect.html)

## 2 | Active and passive: how are clues collected?

**Active fingerprinting** sends selected probes to an authorized target and analyzes its replies. It resembles asking agreed questions and observing the response style. Nmap's -O uses this approach and generates network traffic.

**Passive fingerprinting** observes traffic already present and authorized for analysis, without sending additional probes for identification. It resembles analyzing an authorized recording. p0f is an example of this tool category; this lesson does not ask you to install it or capture anyone's traffic.

Active methods can select the questions; passive methods work with the evidence available. If an authorized recording lacks suitable packets, passive identification lacks the necessary material. Observation location also determines which traffic is visible. Both approaches need a defined scope and permission to handle the data. [Nmap: Passive Fingerprinting and Other Methods](https://nmap.org/book/osdetect-other-methods.html)

## 3 | What does the tool examine? Three kinds of clues

A **packet** is a unit of transmitted network data. Its **header** contains fields describing how to handle that data. Tools combine multiple fields and responses rather than treating one value as an identity.

**A. IP TTL: limiting further forwarding**

**Internet Protocol (IP)** handles addressing and delivery across networks. The IPv4 header's **Time to Live (TTL)** limits a packet's lifetime so it cannot circulate indefinitely. Routers decrement it during forwarding. The receiving observer therefore sees a value after processing along the path, not necessarily the sender's initial value.

For a synthetic example, receiving TTL 61 supports three decrements only if we assume an initial value of 64 and a decrement of one at each hop. With an unknown initial value, that assumption does not establish a verified path, much less a definite operating system. Interpret TTL together with other clues. [RFC 791: IPv4 Header and TTL (1981)](https://www.rfc-editor.org/rfc/rfc791.html#section-3.1)

**B. TCP receive window and options: negotiating communication**

**Transmission Control Protocol (TCP)** provides connection state and reliable, ordered byte delivery. A **receive window** advertises the range of data a receiver is willing to accept as part of flow control. It is not the computer's total memory or its network bandwidth.

TCP headers can carry options such as **Maximum Segment Size (MSS)**, which indicates the maximum amount of data acceptable in one TCP segment. Identification tools can observe an initial window and the presence and order of options as part of a feature combination. [RFC 9293: TCP Header and Options (2022)](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.1)

**C. Responses to different probes**

Tools may also compare sequence numbers, timestamps and error responses. **Internet Control Message Protocol (ICMP)** carries network status and error information. The responses and retained fields provide additional evidence. Nmap combines multiple tests into a fingerprint for database comparison or classification. For this lesson, understand the combined-evidence approach rather than memorize every field. [Nmap: Fingerprinting Methods](https://nmap.org/book/osdetect-methods.html)

## 4 | Why look for both open and closed ports?

**Open** means the test observed a service accepting connections at the port. **Closed** means the test received a response supporting that no service was listening there. **Filtered** means filtering or related effects prevented the method from determining whether the port was open or closed.

For Nmap TCP/IP fingerprinting, finding at least one open and one closed TCP port generally provides better comparison material. It resembles observing how a desk responds both when it accepts a request and when it does not. Preserve warnings and limitations when responses are insufficient; do not expand the authorized scan scope just to obtain a result.

The identification option **-O uses a capital letter O**. **-sV** concerns service/version detection and uses different evidence. **-A** enables additional functions, so it is not an OS-only equivalent. [Nmap: OS Detection Options](https://nmap.org/book/man-os-detection.html)

This lesson uses a tabletop exercise and runs no scans. Before a separate practical test, confirm authorized targets, permitted probes, the testing window and stop conditions. Responsible operators should assess whether sensitive operational devices can tolerate the proposed test.

## 5 | How should you read a match percentage?

Suppose a synthetic report lists “system family A: 95%.” The tool found a close candidate under its matching method. Preserve the original label, score, tool version and limitations in the record.

In Nmap's documented IPv4 matching method, the score comes from weighted feature matches. Therefore, do not rewrite 95% as a calibrated 95% real-world probability that the machine runs A. Classification methods may also differ between IP versions.

“No exact match” can reflect insufficient features, missing reference samples or packet changes along the path. Preserve the candidates and the reasons requiring investigation. Even a system identification does not establish complete patch status or an exploitable vulnerability. [Nmap: OS Matching Algorithms](https://nmap.org/book/osdetect-guess.html)

## 6 | Are you identifying the front end or the back end?

Imagine calling a company's switchboard and attributing the operator's response habits to an engineer behind it. A similar mistake can occur on a network.

A **reverse proxy** accepts client connections on behalf of services behind it. A **load balancer** distributes work among back-end services. **Network Address Translation (NAT)** rewrites addresses and related information in packets. Their behavior differs, so assess each one's effect separately.

If a front end terminates TCP, the external TCP/IP fingerprint may describe that front end, while application text may come from a back end. Address translation alone does not mean the gateway generates every response. Firewalls may drop, modify or generate some responses, and multiple back ends can produce mixed clues at one public entry point. [Nmap: Misidentification and Network Location](https://nmap.org/book/osdetect-unidentified.html)

When stack fingerprints and service information differ, check the architecture and connection termination points before attributing each observation. Nmap reports system clues from stack fingerprinting separately from those obtained through service identification. [Nmap: Output and Proxy Examples](https://nmap.org/book/osdetect-usage.html)

## 7 | A complete synthetic example: from resemblance to confirmation

The following scenario was written for teaching. It is not a scan of a real device.

An authorized isolated environment has front end A and back end B. An external observer obtains:

- TCP 443 is open in this test; TCP 65000 is closed in this test.
- A response has TTL 61, with additional TCP option and window records.
- The fingerprinting tool proposes “system family A.”
- A web response identifies itself as “application B.”
- Architecture documentation says front end A accepts TCP connections and then connects to back end B.

A useful record can state:

“At the specified location and time, A's public entry point returned the recorded TCP features. The tool's comparison suggests system family A. Architecture documentation places external TCP termination at A, so this fingerprint is first used to investigate A. Application B's self-description is checked separately against B's running service. The complete system versions and patch status of both devices await administrator evidence.”

Next, an authorized administrator supplies system versions, running kernels and packages, update records, and the mapping between front end and back end. The evidence must refer to the same devices and relevant time. Such a record preserves observations, reasonable inferences and unresolved checks for later inventory and maintenance.

## 8 | Defense and verification: using identification in operations

The practical value of identification is finding assets that need further investigation. For example, if a segment expected to contain only workstations shows features of a network appliance, ask the administrator to confirm that device's identity and purpose.

Administrators can use these findings in four ways:

1. **Maintain inventory:** verify devices, system versions, owners and purposes, with evidence and confirmation dates.
2. **Restrict unnecessary entry points:** implement access rules based on need and compare actual results from approved and unapproved sources.
3. **Update and patch:** compare administrator evidence with vendor notices, installation records and restart status. Changing a fingerprint or concealing details does not complete patching.
4. **Observe unusual probes:** correlate firewall and device records by time, source and target. Before interpreting an absence of alerts, check logging scope and detection capabilities.

The chapter's evidence boundary still applies: a port state, an OS inference, vulnerability applicability and acquired access are separate judgments. Identifying a system family does not establish a login or successful intrusion.

## 9 | Safe exercise and short checks

Use the synthetic records in section 7 and a notebook or text editor. No target connection is needed:

1. List the packets, tool output and documentation actually obtained, preserving their sources.
2. State what the evidence supports for A and B separately.
3. Name one administrator-side evidence item for each device and explain how it helps confirm system and patch status.

The expected result is a short record separating observations, inferences and pending checks. The exercise creates no service and changes no settings, so no system cleanup is required. Save only your own answer.

Consider four questions. You can answer just the one you most want to clarify next:

1. Why does TTL 61 alone fail to identify an operating system?
2. How do analyzing authorized existing packets and sending Nmap -O probes differ in evidence collection?
3. A fingerprint suggests family A, a service announces application B, and a TCP reverse proxy is in front. How should you organize verification?
4. When the tool has no exact match or only a 95% candidate, what should the inventory record say, and what evidence is still missing?

**Takeaway: collect features → retain match results → verify network position → confirm with administrator evidence.**

## Sources and version scope

This lesson follows M03-06 “OS Fingerprinting” in the adopted route and the M03 principle that port state is an observation. Technical sources were checked on 2026-11-03. Nmap's official documentation is maintained over time; citing it does not claim that this lesson ran a particular installed version. The IPv4 and TCP references are RFC 791 (1981) and RFC 9293 (2022). No real scan, private case or completed experiment is claimed.

Reference answers will appear in native collapsed sections on the website, with a link after publication verification. Publishing answers is recorded separately from your actual responses and demonstrated understanding.
