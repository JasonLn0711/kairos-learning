# CEH v13 | M03-05: Service Version & Banner Grabbing
## A complete plain-language lesson: from ports to services and vulnerability assessment

Finding an open port does not identify its service. Knowing a service name does not establish the software version. Knowing a version does not establish that a vulnerability applies.

Building on M03-01 through M03-04, this lesson asks how network responses help identify a server's services and assess possible security risks. It follows the existing chapter sequence and adds Ubuntu localhost practice, Nmap commands and evidence-based interpretation. Cases and sample outputs are illustrations, not measurements of real targets. Local practice is limited to your own computer.

# First build the complete concept map

The preceding units address different questions:

| Unit | Focus | Question being answered |
|---|---|---|
| M03-01 | IP, TCP, UDP and ports | How do computers communicate? |
| M03-02 | ICMP, ARP and host discovery | Where is the target, and can a response be obtained? |
| M03-03 | TCP, SYN and UDP scanning | Which ports may be open? |
| M03-04 | Open, Closed and Filtered | How should scan results be interpreted? |
| M03-05 | Service version and banner grabbing | What service is behind an open port? |
| M03-06 | OS fingerprinting | Which operating system might the host use? |

Suppose you scan an Ubuntu server you administer and obtain this illustrative output:

```text
PORT      STATE    SERVICE
22/tcp    open     ssh
80/tcp    open     http
443/tcp   open     https
3306/tcp  filtered mysql
```

A beginner might describe four running services: SSH, HTTP, HTTPS and MySQL. The evidence does not support that conclusion yet.

- TCP 22, 80 and 443 presented open under these scan conditions.
- TCP 3306 presented filtered; that does not establish whether a service is listening.
- SERVICE may be a conventional name selected from the port number.
- The software actually running behind those endpoints remains unconfirmed.

M03-05 develops evidence about service identity beyond the initial port observation.

```text
Ubuntu server
      |
      v
1. Host discovery (M03-02): can a response be obtained?
      |
      v
2. Port scan (M03-03): 443/tcp open
      |
      v
3. Service identification (M03-05): is it actually HTTPS?
      |
      v
4. Version identification (M03-05): which product and version?
      |
      v
5. Internal cross-check: packages, proxy layers, installed fixes
      |
      v
6. Vulnerability analysis (M05): does a specific issue apply?
```

This is an investigation sequence. Each stage can leave unresolved questions rather than producing a definite answer.

# 1 | Understand the distinction through shop signs

## 1.1 Why is a port different from a service?

Imagine a shopping street where each shop has a street number.

```text
A shopping street
+----------------+   +----------------+
| Number 22      |   | Number 80      |
| Remote access  |   | Web service    |
+----------------+   +----------------+
+----------------+   +----------------+
| Number 443     |   | Number 8080    |
| Secure web     |   | Development    |
+----------------+   +----------------+
```

The numbers resemble ports. TCP 22 commonly carries SSH; TCP 80 commonly carries HTTP; TCP 443 commonly carries HTTPS; TCP 8080 often carries alternate HTTP or proxy services.

A street number does not force a shop to conduct a particular business. Similarly, an administrator can place another TCP service on 443.

```text
IP: 192.168.1.100
Port: 443
Expected: HTTPS
Possible actual service:
    HTTPS
    A custom TCP application
    Another TCP service
```

The port is an endpoint number. The service is the function provided behind it. The address above illustrates the distinction; it is not a target you are being asked to scan.

### 1.2 What does version mean?

Knowing that the shop at number 443 is a bookstore describes its activity. It does not identify the management software it uses. Network identification likewise separates four layers:

```text
Port: 443
    |
    v
Service: HTTPS
    |
    v
Product: Nginx
    |
    v
Version: 1.x.x
```

443 is the port. HTTPS describes the communication service or protocol. Nginx is a software product that can provide web services. The string 1.x.x is a version placeholder, not a confirmed full version.

Keeping these layers separate prevents an endpoint observation from becoming an unsupported product or version claim.

### 1.3 Why does this matter?

Suppose you administer a hospital server and a scanner reports:

```text
443/tcp open
```

This does not establish that the server runs a particular Nginx version. It might use Apache, Caddy, another HTTP implementation, a load balancer or a reverse proxy.

Continue gathering evidence. The port locates the endpoint; responses and internal checks are needed to identify its service, product and version.

# 2 | What is a banner, and why collect it?

## 2.1 A banner resembles a shop's introduction

Imagine arriving at shop 22 and being greeted with “We provide remote administration.” Some network services likewise introduce themselves after a connection is established, providing information about their protocol or software.

Banner is a broad term for service-identifying information returned by an endpoint. Banner grabbing collects those responses as clues. It is a class of techniques, not a separate network protocol.

The information can help establish what an endpoint claims to be. It still needs corroboration.

## 2.2 Example one: an SSH banner

An SSH server you administer might return:

```text
SSH-2.0-OpenSSH_9.6p1 Ubuntu-3ubuntu13
```

This is a format example, not a measured scan.

| Component | Meaning |
|---|---|
| `SSH` | An SSH protocol identification string |
| `2.0` | Advertised SSH protocol version |
| `OpenSSH` | Advertised software product |
| `9.6p1` | Advertised OpenSSH software version |
| `Ubuntu-3ubuntu13` | Ubuntu package revision string |

SSH-2.0 and OpenSSH_9.6p1 describe different versions: the first identifies the protocol, and the second identifies software. This resembles the distinction between HTTP/1.1 and Nginx 1.24.

The line is an externally advertised identification string. It is not an independently checked inventory of installed packages.

## 2.3 Example two: an HTTP banner

A browser might request a site's home page with:

```http
GET / HTTP/1.1
Host: example.test
```

The request means “retrieve the home page for example.test.” An illustrative response is:

```http
HTTP/1.1 200 OK
Server: nginx/1.24.0
Content-Type: text/html
Content-Length: 1250
```

HTTP/1.1 200 OK indicates successful handling of this request. The Server field advertises product/version information. Content-Type identifies HTML content. Content-Length gives a body length of 1250 bytes in this example.

The identifying field is:

```http
Server: nginx/1.24.0
```

Banner grabbing may collect this field. However, Server is optional: it can be absent, modified or produced by a reverse proxy. RFC 9110 advises against exposing unnecessary implementation detail through it. [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html#section-10.2.4)

## 2.4 Example three: a mail-server greeting

An SMTP server may greet a connection with:

```text
220 mail.example.test ESMTP
```

220 means the service is ready for further SMTP commands. mail.example.test is the advertised hostname. ESMTP advertises Extended SMTP support.

The greeting can be available before login. This illustrates why service-identification exposure matters: a visitor without an account may still obtain useful clues. Receiving the greeting does not grant access to a mailbox or establish a vulnerability.

## 2.5 Why do security teams collect banners?

Suppose you inventory 100 servers. Initially you know only the port lists:

```text
Server A: 22, 80, 443 open
Server B: 22, 443 open
Server C: 21, 22, 8080 open
```

Service identification can add hypotheses:

```text
Server A
    22  -> possibly OpenSSH
    80  -> possibly Nginx
    443 -> possibly Nginx
Server B
    22  -> possibly OpenSSH
    443 -> possibly Apache httpd
Server C
    21   -> possibly FTP
    22   -> possibly OpenSSH
    8080 -> possibly an HTTP application
```

These clues help identify expected services, forgotten services, products requiring package/patch checks, and endpoints that should not be available to general users.

A banner records what an endpoint advertises. Administrators can change the text, and intermediaries can generate it. Preserve the original response and keep the claimed identity separate from a verified identity.

# 3 | Waiting for a greeting versus sending a probe

After connecting, you can wait for the service to introduce itself or send a request that elicits a response. Both approaches can provide identifying information.

## 3.1 First approach: wait for the service to speak

A shop assistant may greet you before you ask a question. Many SSH, FTP and SMTP services similarly send identification after TCP connection establishment.

```text
Client                              Server
   | -------- SYN -------------------> |
   | <------- SYN/ACK ---------------- |
   | -------- ACK -------------------> |
   |       TCP connection established  |
   | <------- Banner ----------------- |
   |       SSH-2.0-OpenSSH_...          |
```

Connect this to M03-01 and M03-03:

```text
SYN -> SYN/ACK -> ACK
```

Those steps establish the TCP connection. The application then exchanges data through it. In this ordinary example, the SSH banner is application data after connection establishment; merely observing SYN/ACK is not evidence of having received an SSH identification line.

Port scanning emphasizes endpoint state. Banner collection examines application response content beyond that state.

## 3.2 Second approach: actively send a probe

An ordinary HTTP server usually waits for a request before sending an HTTP response.

```text
Client                              HTTP server
   | ------ establish TCP -----------> |
   |          wait for greeting        |
   |          no HTTP response yet     |
   | ------ GET / HTTP/1.1 -----------> |
   | <----- HTTP/1.1 200 OK ----------- |
   |        Server: nginx/...          |
```

A protocol-shaped request might be:

```http
GET / HTTP/1.1
Host: example.test
```

The service processes the request and returns data. An investigator interprets the response to identify service characteristics. This is the basic idea of an active probe: send a suitable question and examine the answer.

### 3.3 What is Nmap's NULL probe?

NULL does not mean no packets are sent. In TCP service identification, Nmap establishes a TCP connection, then initially sends no application probe payload while waiting for the server's response.

```text
Nmap
  +-- Establish TCP connection
  +-- Wait for server data
  +-- Banner available?
  |      +-- Yes: try identification
  |      +-- No: consider another probe
  +-- Analyze service identity
```

Even without application payload, connection establishment generates packets and can be logged. The “empty” part concerns probe data, not all network activity. [Nmap version-detection technique](https://nmap.org/book/vscan-technique.html)

## 3.4 How does active probing differ from passive observation?

| Method | Creates a new target connection? | Analogy |
|---|---|---|
| Connect and wait for a banner | Yes | Enter a shop and wait for the greeting |
| Send HTTP, SSH or other probes | Yes | Enter a shop and ask questions |
| Analyze an existing packet recording | Not necessarily; pure offline analysis does not | Review previously authorized recordings |

The first two interact with the target. Offline analysis of an already lawfully obtained capture can be passive if it creates no new connection.

Passive observation still requires appropriate authorization and data handling. Waiting for a banner and sending a probe can both identify services, but neither is a completely non-contact collection method when a new connection is made.

# 4 | Where does the SERVICE column get its evidence?

Understanding the source of a service name is essential to reading Nmap output.

## 4.1 How does Nmap know that port 22 is SSH?

Suppose you run:

```bash
nmap -p 22,80,443 127.0.0.1
```

An illustrative result is:

```text
PORT    STATE  SERVICE
22/tcp  open   ssh
80/tcp  open   http
443/tcp open   https
```

Nmap may not have confirmed those services. It can consult the conventional port-name database:

```text
nmap-services
```

Common associations include:

```text
ssh      22/tcp
http     80/tcp
https    443/tcp
```

This resembles inferring a region from a telephone area code. The code may suggest a location, but it does not identify the person answering.

Likewise:

```text
22/tcp open ssh
```

may mean only that TCP 22 is open and that 22 is commonly associated with SSH. It does not necessarily show that Nmap exchanged identification with an SSH service. [Nmap service/version detection](https://nmap.org/book/man-version-detection.html)

## 4.2 How can Nmap investigate the service further?

Enable service and version identification:

```bash
nmap -sV -p 8080 127.0.0.1
```

127.0.0.1 is your own computer, suitable for isolated practice.

| Argument | Meaning |
|---|---|
| `nmap` | Run Nmap |
| `-sV` | Enable service/version identification |
| `-p 8080` | Check only port 8080 |
| `127.0.0.1` | Target localhost |

The option is:

```text
-sV
```

This is an option fragment, not a standalone shell command. It asks Nmap to investigate software identity beyond the conventional port name.

Consider this synthetic result:

```text
PORT     STATE SERVICE VERSION
8080/tcp open  http    ExampleWeb 1.2
```

Separate the layers:

```text
8080/tcp -> endpoint: TCP port 8080
open -> state observed under these conditions
http -> identified service type
ExampleWeb 1.2 -> product/version clue reported by the tool
```

This supplies more information than the port alone. It still does not guarantee a precise or independently verified version.

## 4.3 What happens inside Nmap?

Think of -sV as an investigator who studies answers instead of identifying a shop solely by its address.

```text
Nmap -sV
    |
    v
Select a port for identification
    |
    v
For TCP, attempt a connection
    |
    v
Wait for service data
    +-- Banner received --> compare signatures
    +-- Insufficient data --> send suitable probe
                                  |
                                  v
                             analyze response
    |                             |
    +-------------+---------------+
                  v
        Attempt service/version identification
                  |
          +-------+--------+
          |                |
     Enough evidence    Insufficient evidence
          |                |
      Report match     Retain uncertainty
```

The probe database is:

```text
nmap-service-probes
```

It contains probes and response signatures. Nmap might send an HTTP-shaped request and receive:

```http
HTTP/1.1 200 OK
Server: ExampleWeb/1.2
```

It then compares response features to identify a service or version. Port associations, probe suitability and earlier matches influence subsequent probes. The diagram describes the TCP path; UDP service probing does not establish a TCP connection. [Nmap technique](https://nmap.org/book/vscan-technique.html)

### 4.4 What is softmatch?

Imagine calling an organization and hearing “Customer support.” You have a clue about the function, but not the exact organization or system.

Nmap can similarly obtain a preliminary service-type match, such as HTTP or SSH, without a precise product/version match. It can then limit later probes to those associated with that service type.

softmatch is a preliminary match, not a percentage confidence score. It cannot be translated into “90% likely” without a separate justified model.

## 4.5 How do -sV, -O and -A differ?

| Option | Function | Main question |
|---|---|---|
| `-sV` | Service/version detection | What service, product and version are behind a port? |
| `-O` | OS detection | Which operating system might the host use? |
| `-A` | Enables several advanced identification features | What additional host and service information can be obtained? |

For example:

```bash
nmap -sV -p 8080 127.0.0.1
```

focuses on service/version identification at 8080. By contrast, -O examines network-stack response characteristics to infer an operating system.

-A is not an alternative spelling of -sV: it also enables features such as OS detection, default NSE scripts and traceroute. This lesson does not need that broader option.

Nmap also excludes certain version probes by default to avoid unintended behavior. TCP 9100 on some printers is a notable example: probe data can be treated as a print job. Keep default exclusions for this practice and consider the device's function and tolerance before authorized testing. [Nmap version-detection options](https://nmap.org/book/man-version-detection.html)

A port-name lookup and active service identification support different levels of evidence. Record which produced the result.

# 5 | Why does a version not immediately prove a vulnerability?

A software-version clue does not demonstrate an exploitable defect. Suppose a synthetic scan reports:

```text
PORT    STATE SERVICE VERSION
80/tcp  open  http    ExampleWeb 1.2
```

A synthetic vulnerability entry says:

```text
CVE-20XX-12345
Product: ExampleWeb
Affected versions: certain 1.x releases
Issue: possible remote code execution
```

Neither ExampleWeb nor this CVE entry is a claim about a real vulnerability. Concluding that the target is exploitable skips several checks:

1. Does the banner describe the actual backend software?
2. Is the installed package in the affected range?
3. Has the vendor backported the fix?
4. Are the required features and configuration present?

The next two subsections explain common reasons why version-only judgments fail.

# 5-A | You may be observing the reverse proxy

## 5-A.1 What is a reverse proxy?

Imagine a hospital reception desk. A patient asks for cardiology; reception routes the request to the department rather than sending the patient into an arbitrary office.

A reverse proxy similarly accepts client requests and forwards them to an appropriate backend.

```text
Internet user
      |
      | HTTPS request
      v
+-----------------------+
| Reverse proxy: Nginx  |
| Receives requests     |
+-----------------------+
      |
      | Forward request
      v
+-----------------------+
| Backend server        |
| Python / Node.js app  |
+-----------------------+
      |
      v
   Database
```

The client initiates the request. The reverse proxy is the front-end service that receives and routes it. The backend executes application business logic.

## 5-A.2 How can a banner mislead us?

Suppose the backend uses:

```text
Python FastAPI
```

and an Nginx reverse proxy sits in front of it. The external response contains:

```http
Server: nginx
```

You can record that this response contains nginx identification. You cannot conclude that the entire application is Nginx or that no backend exists.

Nginx may receive the request while FastAPI handles login, queries and database access. A reverse proxy can remove, overwrite or forward Server headers.

```text
Externally observed Server banner
                  !=
Complete backend application identity
```

Determine where the response field was generated before treating it as an asset-inventory fact.

### 5-A.3 How does this relate to Cloudflare?

Websites, subdomains and Cloudflare deployments provide an example of layered observation. This is a hypothetical architecture, not a statement about a particular deployed site.

```text
Browser
   |
   | HTTPS
   v
+-------------------+
| Cloudflare edge   |
| DNS / CDN / WAF   |
+-------------------+
   |
   | Cloudflare Tunnel
   v
+-------------------+
| Ubuntu server     |
| Nginx             |
+-------------------+
   |
   v
+-------------------+
| Web application   |
| Node.js / Python  |
+-------------------+
```

An outside client may connect first to the Cloudflare edge. Externally visible TLS, HTTP behavior and headers may therefore describe a different layer from the Ubuntu host or application.

Asset inventory needs the internal deployment architecture as well as external observations. A proxy can provide access controls or traffic management, but requires correct configuration and does not replace backend patching.

# 5-B | An older version number may include a backported fix

Backporting matters when maintaining Ubuntu, Debian, Red Hat and other distributions.

## 5-B.1 What is a backport?

A backport moves a particular fix from newer software into an older maintained release.

Suppose an upstream project releases:

```text
ExampleApp 1.0
ExampleApp 1.1
ExampleApp 1.2
ExampleApp 2.0
```

Later, a defect is discovered:

```text
ExampleApp 1.2
contains a security vulnerability
```

The upstream team fixes it in 2.0. Some organizations cannot immediately upgrade because configuration formats changed, APIs are incompatible, or existing applications would stop working.

A distribution maintainer can instead apply the relevant security change to the older line:

```text
Upstream project
ExampleApp 1.2 -> vulnerability found
        |
        v
ExampleApp 2.0 -> contains fix
        |
        v
Extract the relevant security change
        |
        | Backport
        v
Distribution-maintained package
ExampleApp 1.2-vendor3
        |
        v
Contains the security fix
```

The upstream version component may remain 1.2 even though the maintained package includes the fix. An old-looking version does not prove that the same vulnerability remains. Vendor advisories and CVE status provide the appropriate cross-check. [Red Hat security backporting](https://access.redhat.com/security/updates/backporting)

## 5-B.2 Why does backporting affect scan interpretation?

Suppose an Ubuntu endpoint advertises:

```text
Server: ExampleWeb/1.2
```

and an advisory says:

```text
ExampleWeb 1.2 has a security vulnerability.
```

The installed package might instead be:

```text
ExampleWeb 1.2-ubuntu5.3
```

ubuntu5.3 is a synthetic distribution revision here. If a maintainer backported the relevant fix, the external string:

```text
ExampleWeb/1.2
```

does not prove the package remains affected.

Use this evidence sequence:

```text
External banner
      |
      v
Full installed package version
      |
      v
Vendor security advisory
      |
      v
Was the relevant fix installed?
      |
      v
Does the running service use the updated code?
      |
      v
Does the vulnerability still apply?
```

## 5-B.3 How do you inspect package versions on Ubuntu?

For OpenSSH on your own Ubuntu system:

```bash
dpkg-query -W openssh-server
```

This queries installed package version information. To inspect available versions and repository priorities:

```bash
apt policy openssh-server
```

A format example is:

```text
Installed: 1:9.6p1-3ubuntu13.x
Candidate: 1:9.6p1-3ubuntu13.y
```

This is not a claim about the current latest version. Installed is the installed package version. Candidate is the version selected under the current APT sources and policy.

Different Installed and Candidate versions do not by themselves prove a vulnerability. Matching versions do not prove that every issue is fixed. Check the distribution's security advisory and applicability conditions, and verify that the relevant security-update sources are configured.

For Ubuntu, prioritize Ubuntu security notices over a simple string comparison between the upstream banner and a CVE range.

## 5-B.4 Does installing an update finish the job?

Not necessarily. Files on disk can be updated while a running process still has older code loaded. Follow the package and service update requirements: reloading configuration may not replace executable code, so a service restart may be needed. Verify the actual running version.

```text
Check the security advisory
      |
      v
Install the fixed package
      |
      v
Perform required service reload/restart
      |
      v
Verify the running version
      |
      v
Check normal application functions
      |
      v
Verify that the relevant vulnerability no longer applies
```

Restarting may interrupt connections and must follow production maintenance procedures. A banner is not patch evidence. Full package identity, backport records, vendor guidance and running state belong in the assessment.

# 6 | A complete synthetic case: make the record traceable

Combine the preceding ideas in an authorized inventory example.

## 6.1 Suppose you are inventorying an internal application

The hypothetical target is:

```text
IP: 192.0.2.10
Port: TCP 8080
```

192.0.2.10 is a documentation address, not a real test target. In the hypothetical authorized environment, the scan reports:

```text
8080/tcp open http
```

Evidence one: TCP 8080 appeared open from the stated position and conditions. Next, an HTTP response contains:

```http
HTTP/1.1 200 OK
Server: ExampleWeb/1.2
```

Evidence two: this response advertises ExampleWeb/1.2. Architecture documentation then shows:

```text
External user
      |
      v
Reverse proxy
ExampleWeb/1.2
      |
      v
Backend
example-app 4.0
```

That is evidence three. An administrator's package query reports:

```text
example-app 4.0-vendor3
```

That is evidence four. The vendor advisory and actual running version remain unverified. How should the report represent these layers?

## 6.2 An unsupported report

```text
Finding:
The target uses ExampleWeb 1.2.
That version has a vulnerability.
Classified as a high-risk vulnerability.
```

This conflates different claims. The response advertised ExampleWeb/1.2; the backend runs another application; no adequate evidence has established that a specific vulnerability applies.

Such mistakes can send an organization toward unnecessary remediation. They can also hide a genuine backend problem when assessment stops at the proxy. State what was observed before assigning product identity or risk.

## 6.3 A supported report

Use three explicit fields.

### First: Observation

```text
In the authorized test environment:
TCP 8080 appeared open.
HTTP response included:
Server: ExampleWeb/1.2
Architecture documentation shows a reverse proxy.
Administrator package record:
example-app 4.0-vendor3
```

This field records obtained responses and documents without adding unsupported conclusions.

### Second: Inference

```text
The HTTP response contains ExampleWeb identification.
A reverse proxy is documented in front of the application.
The string may describe the front-end service.
The banner alone cannot confirm the backend's exact version.
Evidence is not yet sufficient to establish CVE applicability.
```

This field explains what the observations support. Each inference should have an identifiable basis.

### Third: Pending verification

```text
1. Identify the actual running backend process.
2. Confirm the full package version and source.
3. Read the vendor security advisory.
4. Check whether a backported fix is included.
5. Check the configuration required for the vulnerability.
6. Confirm the running service uses the fixed version.
```

This produces a record that can be followed, checked and accepted by another engineer.

## 6.4 How does this connect to CEH M05?

```text
M03 Network Scanning
    Find candidate open endpoints
    Identify service/version clues
        |
        v
M04 Enumeration
    Obtain further authorized service/system information
        |
        v
M05 Vulnerability Analysis
    Check product, version, configuration and applicability
        |
        v
Establish affected scope and risk
        |
        v
Plan remediation and verification
```

This is a conceptual learning relationship, not a mandatory order for every assessment. M03-05 establishes identity and version clues; M05 examines whether specific vulnerabilities affect those assets.

# 7 | How should administrators protect services and retain acceptance evidence?

Now switch from observation to administration. A hospital, business or research organization needs to reduce unnecessary exposure while checking actual security controls.

## 7.1 First layer: inventory necessary services

Suppose an Ubuntu server exposes these TCP ports:

```text
22/tcp
80/tcp
443/tcp
3306/tcp
```

Ask what each is for. Is 22 for remote administration? Should 80 only redirect HTTP? Does 443 provide the public site? Should 3306 be available only to internal application hosts?

A database may not need Internet-wide access. Still, do not identify it as MySQL solely because of port 3306; check the configuration.

On Ubuntu:

```bash
sudo ss -ltnp
```

ss displays socket information. -l selects listeners; -t selects TCP; -n keeps addresses and ports numeric; -p requests process details.

This helps identify the process listening locally. Local socket state does not prove remote reachability: firewall policy, routing, NAT and other access controls remain relevant.

## 7.2 Second layer: reduce unnecessary banner detail

Suppose the response includes:

```http
Server: nginx/1.24.0
```

Where appropriate, reduce unnecessary version disclosure. An Nginx configuration example is:

```nginx
http {
    server_tokens off;
}
```

This generally suppresses detailed version information in relevant Nginx-generated responses. It does not guarantee removal of every product identifier or identical headers through all modules and proxy layers.

Check the configuration first:

```bash
sudo nginx -t
```

If validation succeeds, reload according to the environment's change procedure, for example:

```bash
sudo systemctl reload nginx
```

Check service dependencies and deployment-specific requirements before changing a production service.

### Why is hiding the banner insufficient?

Changing:

```http
Server: nginx/1.24.0
```

to:

```http
Server: nginx
```

reduces the version information available in that field. It does not repair a software defect. Other fingerprints may remain, and some attacks do not require the attacker to know the precise version.

```text
Hide detailed banner -> reduce information disclosure
Patch vulnerability -> correct a security defect
```

These actions need separate acceptance evidence.

## 7.3 Third layer: restrict management access

A research server's SSH endpoint may be needed only by designated administrators. Firewalls, VPNs, authentication and other access controls can limit its exposure.

```text
Internet
    |
    v
Firewall
    +-- Unauthorized source --> deny access
    +-- Authorized source --> allow connection --> SSH server
```

This connects to M03-04. If a probe cannot obtain sufficient responses through the controls, Nmap may report:

```text
22/tcp filtered ssh
```

Filtered is an observation under particular scan conditions. It is not proof that the entire protection configuration is free of weaknesses.

## 7.4 Fourth layer: retain acceptance evidence

A statement that a problem is fixed needs evidence showing what changed and how it was checked.

| Work | What to confirm | Acceptance evidence |
|---|---|---|
| Service inventory | Which services run | Sockets, processes and asset inventory |
| Banner management | Unnecessary information was reduced | Before/after HTTP or SSH responses |
| Access control | Unauthorized sources are restricted | Firewall rules and test records |
| Patching | Relevant fixes are installed | Package versions, advisories and update records |
| Running state | The service uses updated code | Process/service state and necessary verification |
| Monitoring | Unexpected probes can be detected | Service, proxy and firewall logs |

Record time, source location, target and configuration conditions. Otherwise, different scan outputs may reflect different test environments rather than a security change.

Effective administration connects verified identity, patch state and protection behavior. Reducing information disclosure is one part of that work.

# 8 | Safe practice and understanding checks

The original synthetic exercise needs no network traffic: use the case to write three lines labeled observation, inference and pending verification. The optional Ubuntu exercise below demonstrates banner collection locally.

## 8.1 Exercise objective

On your own Ubuntu computer, start an HTTP service, inspect its listening port, obtain its HTTP banner and identify it with Nmap. The entire exercise uses:

```text
127.0.0.1
```

This is your own computer; no external network scan is needed.

## 8.2 Step one: start the HTTP service

In the first terminal, enter a practice directory you created that contains no sensitive files. Check that 8080 is unused. If another service occupies it, choose an unused port and change every command in this exercise consistently.

Run:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

python3 runs Python. -m http.server starts its built-in HTTP server module. 8080 selects the port. --bind 127.0.0.1 restricts binding to loopback.

The server should report that it is listening. It serves files from the current directory, which is why the practice directory must not contain sensitive documents.

## 8.3 Step two: confirm the listener on 8080

In a second terminal:

```bash
ss -ltnp | grep ':8080'
```

An illustrative result is:

```text
LISTEN 0 5 127.0.0.1:8080 ...
```

LISTEN indicates a TCP socket waiting for connections. 127.0.0.1:8080 identifies its local binding. This is host-side evidence, not an external Nmap scan result.

## 8.4 Step three: inspect the HTTP banner with curl

Run:

```bash
curl -I http://127.0.0.1:8080
```

-I requests response headers; for HTTP, curl uses HEAD. An illustrative response is:

```http
HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.12.x
Date: ...
Content-type: text/html; charset=utf-8
```

Exact output varies with Python and the environment. Focus on:

```http
Server: SimpleHTTP/0.6 Python/3.12.x
```

You have observed a successful HTTP response, a SimpleHTTP identifier and a Python-version clue. SimpleHTTP/0.6 is the server identification string, not a complete OS version or proof of any specific vulnerability. Collecting this response is banner grabbing.

## 8.5 Step four: compare Nmap with and without -sV

First run:

```bash
nmap -p 8080 127.0.0.1
```

You might obtain:

```text
PORT     STATE SERVICE
8080/tcp open  http-proxy
```

Without service confirmation, Nmap can display the conventional port name http-proxy. Now run:

```bash
nmap -sV -p 8080 127.0.0.1
```

Nmap will attempt service identification. It may report HTTP and Python HTTP-server information. The exact result depends on Nmap, its probe database and the server response; it need not match an example literally.

### Compare the two scans

| Observation | Ordinary port scan | With -sV |
|---|---|---|
| Whether the port is open | Can observe it | Can observe it |
| Conventional service name | May display it | May display it |
| Actual service identification | Not necessarily | Actively attempts it |
| Software-version information | Usually absent | May obtain it |
| Confirmation of a vulnerability | No | Still no |

The difference is the additional service-response evidence, not automatic vulnerability confirmation.

## 8.6 Step five: inspect server logs

Return to the first terminal. You may see:

```text
127.0.0.1 - - [...] "HEAD / HTTP/1.1" 200 -
```

This shows that the HTTP service received a request. After -sV, other probes or error responses may appear. Active service identification can leave server-side records, connecting this exercise to IDS, traffic monitoring and anomaly analysis.

Stop your server in the first terminal:

```text
Ctrl + C
```

Use ss -ltnp again to confirm that the listener you started on 127.0.0.1:8080 has disappeared; check the corresponding port if you changed it. Keep the three-line observation/inference/pending record. Successfully reading a banner does not prove a vulnerability.

# 9 | Place M03-05 in the wider security knowledge map

| Technique | Main purpose | Relationship to banner grabbing |
|---|---|---|
| Port scanning | Find endpoints and states | Supplies candidates for identification |
| Banner grabbing | Collect service-identification data | Supplies identity clues |
| Service detection | Identify service types | May use banners among other methods |
| Version detection | Attempt product/version identification | May combine banners and other probes |
| OS fingerprinting | Infer an operating system | Distinct from application-version detection |
| Vulnerability analysis | Assess applicability | Uses identification as part of its evidence |
| Asset management | Manage organizational assets | Cross-checks observations with internal records |
| Detection engineering | Develop detection rules and mechanisms | Uses probe-related logs and traffic features |

Different evidence layers progressively reduce uncertainty:

```text
Observe TCP 443 open
       |
       v
Hypothesize HTTPS
       |
       v
Confirm an HTTP response
       |
       v
Collect Server identification
       |
       v
Recognize a possible reverse proxy
       |
       v
Check actual backend packages
       |
       v
Check CVE conditions and vendor advisories
       |
       v
Establish applicability
       |
       v
Remediate, verify and retain evidence
```

The lesson develops more than familiarity with an Nmap option: it teaches how to keep tool output separate from independently established facts.

# 10 | Sources and further reading

The lesson follows M03-05 and uses official Nmap, IETF and vendor references.

| Source | Further study |
|---|---|
| [CS Kairos M03-05](https://learn.cs-kairos.com/en/courses/ceh/v13/m03/concepts/m03-05/) | Complete lesson and cases |
| [Nmap: Service and Version Detection](https://nmap.org/book/man-version-detection.html) | -sV and service identification |
| [Nmap: Version Detection Techniques](https://nmap.org/book/vscan-technique.html) | Probes, NULL probe and softmatch |
| [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) | Server headers and HTTP semantics |
| [Red Hat: Security Backporting](https://access.redhat.com/security/updates/backporting) | Distribution security maintenance and backports |

The core questions follow. Four reference answers are initially collapsed at the end. Publishing them does not establish that the reader attempted or passed an assessment.

# 11 | Understanding checks

Try to reason through each question before opening its reference answer.

### Question one: port and service

Nmap reports:

```text
443/tcp open https
```

Does this establish that the server uses Nginx? Explain why or why not.

### Question two: NULL probe

Nmap's version-identification process establishes TCP, then waits for the server's banner. Is this completely non-contact passive collection? Explain using the TCP three-way handshake.

### Question three: reverse proxy and backport

A website returns:

```text
Server: ExampleWeb/1.2
```

You find a CVE affecting some ExampleWeb 1.x versions. The site uses a reverse proxy, and its backend runs on Ubuntu.

What additional evidence is needed to determine whether that CVE actually affects the site?

### Question four: banner management and patching

An administrator sees detailed Nginx identification in an HTTP response and configures:

```nginx
server_tokens off;
```

After reloading Nginx, the field no longer exposes the full version. The administrator announces that the Nginx security vulnerability has been fixed.

Is that conclusion supported? How would you separately accept reduced information disclosure and vulnerability remediation?

## The five concepts to retain

First, a port is not a service. An open-port result describes the endpoint under particular test conditions.

Second, a banner is a clue, not proof of identity. Advertised product/version information may be incomplete or inaccurate.

Third, nmap -sV attempts service/version identification. It may wait for a banner or send probe data.

Fourth, reverse proxies and backports complicate interpretation. The observed endpoint may not be the backend, and an older upstream version may already contain a fix.

Fifth, vulnerability assessment needs linked evidence: actual running packages, vendor advisories, configuration and patch status.

For practice, compare nmap -p 8080, nmap -sV -p 8080 and curl -I in section 8 on your own Ubuntu computer. Use the results to distinguish port state, service identification and version evidence; completing commands alone does not establish understanding.
