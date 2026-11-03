# CEH M03-07 | Nmap: connect scan settings, output and evidence

**The main idea: define the question and authorized scope first, choose the minimum necessary settings, preserve complete results, and make only conclusions supported by that evidence.**

Earlier lessons introduced host discovery, scan methods, port states, service versions and OS fingerprints separately. This lesson combines them into a reproducible workflow. Given an Nmap result, you should be able to explain what was tested, what was omitted and what to verify next.

## 1 | An everyday example: the inspection sheet defines your answer

Imagine inspecting a building. If the inspection sheet covers two doors on the ground floor, you can report their condition at that time. Assessing the whole building needs other evidence. Recording the time, observation position and method lets another inspector investigate differences.

**Nmap (Network Mapper)** is a network exploration and security-auditing tool that also needs an inspection sheet. A **target** is the host or address being checked. A **scan configuration** selects protocols, ports, probe methods and additional features. Its output describes the scope observed under those settings.

The same port may appear open internally and filtered externally. Record the observation location and time together. [Nmap: port states and observation position](https://nmap.org/book/man-port-scanning-basics.html)

## 2 | Turn authorization into a checkable scope before starting

An actionable scan plan should identify at least these items:

- **Targets and exclusions:** list permitted addresses, hosts, protocols and ports; separately identify shared services, third-party devices and unauthorized areas.
- **Purpose and method:** for example, checking whether two TCP endpoints accept connections, with service identification only if separately approved. Connectivity does not establish scan authorization.
- **Time and source:** the permitted window, scanner location and a reachable administrator.
- **Stop conditions:** stop on service disruption, relevant alerts or expiry of the approved window; preserve the record and notify the responsible contact.
- **Result handling:** file location, permitted readers and retention arrangements. Raw output can contain internal addresses and software information.

These are recommended planning steps, not authorization that the tool obtains for you. Follow the organization's approved procedures as well. This lesson uses a tabletop exercise and does not operate on any third-party target.

## 3 | Four configuration questions: target, endpoints, method and extras

Read the following example; **you are not asked to execute it**. Assume you administer an isolated lab and are permitted to inspect TCP ports 8000 and 8001 on that environment's own local host:

    nmap -n -sT -p 8000,8001 --reason -oN lab-check.nmap -oX lab-check.xml 127.0.0.1

127.0.0.1 is the loopback address of the network environment running the command. Inside a container or virtual machine, it refers to that environment. Local results do not establish what an external user can reach.

Break the command into four questions:

1. **Which target?** The final 127.0.0.1 selects one target. Do not replace it with an entire network for convenience; network notation expands the target set. For a hostname, first verify that resolved addresses fall within authorization. [Nmap: target specification](https://nmap.org/book/man-target-specification.html)
2. **Which endpoints?** -p 8000,8001 explicitly lists two ports. Combined with this example's TCP method, the scope is those two TCP endpoints. Unlisted ports have no evidence from this test. -p- expands the range to ports 1–65535. -F selects fewer common ports rather than merely accelerating the same coverage. [Nmap: port selection](https://nmap.org/book/man-port-specification.html)
3. **Which method?** -sT selects a **TCP Connect Scan**, asking the operating system to establish connections. This differs from -sS SYN probing; -sU selects UDP scanning. TCP results do not substitute for UDP results. [Nmap: scan methods](https://nmap.org/book/man-port-scanning-techniques.html)
4. **Which extras?** -n disables reverse DNS name resolution; --reason displays the basis for state classification; -oN and -oX save normal-text and XML results. This example does not request version detection, OS identification or script scanning. [Nmap: name resolution](https://nmap.org/book/man-host-discovery.html); [Nmap: output options](https://nmap.org/book/man-output.html)

If actually executed in an approved lab, this command attempts connections, may create logs and writes the specified files. Reusing a filename can overwrite old output. No test service has been started here, so the lesson cannot predict which port will be open.

## 4 | Understand omissions before interpreting results

**Host discovery** is the stage that identifies which targets to examine further. -sn performs discovery without a port scan. -Pn skips the usual discovery decision and includes specified targets in subsequent scanning. Selecting -Pn does not prove that every target is alive and does not bypass a firewall. Local Ethernet operation may still require address resolution such as ARP. [Nmap: host discovery](https://nmap.org/book/man-host-discovery.html)

If a report says a host seems down, examine the discovery method and network conditions first. Do not translate it directly into “the device does not exist.” Conversely, running only -sn does not support a claim that every port was inspected.

**Service detection** commonly uses -sV, while **OS detection** uses -O with an uppercase O. These supply clues at different layers. -A combines several functions, including version detection, OS detection, default scripts and traceroute. It is not a button that merely makes the same small test more accurate, nor is it a timing setting. Before adding these features, check purpose, load and authorization. [Nmap: additional-feature scope](https://nmap.org/book/man-misc-options.html)

## 5 | Speed is also a measurement condition

Nmap waits for responses and may retransmit probes. A **timeout** occurs when the configured waiting period expires. A **retry** is another attempt when the required response was not obtained. Latency, packet loss and device response limits affect both duration and results.

Very short waits or too few retries can miss slower responses. -T0 through -T5 are timing templates; their numbers are not confidence or safety levels. Timing adjustments must suit the approved window and the environment's capacity. A finished process alone does not establish complete coverage. Record timeouts, skipped work or interruptions as limitations or unfinished scope. [Nmap: timing and performance](https://nmap.org/book/man-performance.html)

For a useful comparison, fix targets, protocols, ports and methods first, then record timing settings. Results obtained with different templates or source locations do not necessarily establish a device-configuration change.

## 6 | Preserve more than a screenshot

The example's -oN saves human-readable normal text. -oX saves **XML (Extensible Markup Language)** so software can read structured host, port and state fields. -oA produces .nmap, .xml and .gnmap files together. The grepable format is officially deprecated for new integrations; prefer XML for structured processing. [Nmap: output formats](https://nmap.org/book/man-output.html)

Alongside the raw files, preserve a short record of the full command, actual tool version, start/end times and timezone, source position, authorized scope, warnings/errors and interruptions. nmap --version displays the installed tool version. This lesson does not claim to have installed or executed a version for you.

Charts and summaries can be derived from the originals, which should be retained. If sharing requires removing internal addresses, create a separate de-identified copy so later checks retain their original basis.

## 7 | A synthetic case: two endpoints and three levels of conclusion

The following is **manually written interpretation material, not output measured in this task**:

    Target: local host in an isolated lab
    Configuration: TCP Connect, checking only 8000 and 8001
    8000/tcp  open
    8001/tcp  closed
    No version-detection or OS-identification result is supplied

You can write: “At the recorded time and source environment, TCP Connect observed port 8000 accepting connections and port 8001 in a closed state.” That is the observation supported by this record.

To identify the service on 8000, obtain approved service detection or administrator process/configuration evidence. The port number alone does not establish a software name and version. To check external reachability, separately authorize an external observation point and test. Vulnerability applicability and access require their own evidence as well.

Now suppose another report from a different source labels 8000 filtered. Compare source, time, protocol, method and path, then inspect firewall or host logs before interpreting the difference. Do not immediately announce that the service has shut down. [Nmap: the scope of state observations](https://nmap.org/book/man-port-scanning-basics.html)

## 8 | Use scan results to verify defenses

Asset inventories and firewall maintenance can use this workflow: identify which sources should reach which services, obtain results within approval, and compare them with configuration, processes and logs. Verify normal functionality for required services, and check that access controls work for endpoints that should not be available.

If an unexpected endpoint appears, establish the asset owner and business purpose before an authorized administrator acts. After a change, retest under the same conditions and verify that necessary services were not blocked accidentally. Failure to find a problem describes observations within this test's coverage; overall security still requires other operational checks and evidence.

## 9 | Safe exercise and understanding checks

Use paper or a text editor with the synthetic record in section 7. No command execution is needed:

1. Write the authorized target, protocol, two ports and method, then list what was not inspected.
2. Write one direct observation and one conclusion that still needs management evidence or another observation position.
3. List the records another person would need to reproduce the observation, and a stop condition for service disruption.

The expected result is a checkable scan worksheet. This exercise creates no service and changes no settings, so no system cleanup is required. Retain only your own analysis.

Consider four questions; you may answer just the one you most want to clarify:

1. If only TCP 8000 and 8001 were scanned and neither was open, can you conclude that the host has no externally available service? Why?
2. How do -sn and -Pn change the workflow? Which option by itself proves that a host is alive?
3. Someone proposes adding -A as “a more accurate test of the same scope.” What would you verify first?
4. If two reports label the same port open and filtered, how should you record the difference and arrange the next check?

This lesson follows M03-07, “Nmap, Scan Settings and Result Interpretation.” Official documentation was checked on 2026-11-03. It is maintained documentation; practical records still need the actual tool version. Reference answers will be in initially collapsed website sections, with a link supplied after live verification. Publishing answers is separate from learner responses and confirmed understanding.
