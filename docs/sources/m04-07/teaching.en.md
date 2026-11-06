# CEH M04-07 | SNMP enumeration: why does retrieving device data not mean seeing everything?

The central idea of this lesson is:

SNMP lets a computer ask network devices for management information. The data you retrieve shows what this identity, operation, and authorization scope allowed you to see on this occasion. It does not establish that the device contains only those data.

We will use one organization's network equipment throughout the lesson.

## 1. What is SNMP, and why do we need it?

Imagine working as an IT engineer at a hospital with 100 switches, 20 routers, and many servers.

Your supervisor asks:

“Have any switches failed? Which network interfaces are down? How long have the devices been running?”

You cannot visit every switch, connect a keyboard or management cable, and check each one every day.

Engineers therefore need a central monitoring system that can ask devices remotely.

That is the purpose of SNMP (Simple Network Management Protocol).

Simplified diagram: one Manager can query several kinds of network equipment. Whether a device answers, and which fields it returns, still depends on configuration and permissions.

For example, the monitoring system can periodically ask:

“Switch A, what is your name?”

“Switch B, is your third network interface up?”

“Router C, what traffic counter value do you currently report?”

The device can return the corresponding information through SNMP.

SNMP is not a remote desktop or a general SSH login. It primarily uses standardized management objects to read status and, where supported and authorized, change certain settings.

## 2. What are Manager, Agent, MIB, and OID?

These four terms are easy to confuse. Continue with the hospital analogy.

| Term | Plain meaning | Hospital analogy |
| --- | --- | --- |
| Manager | System sending management requests | Central management office |
| Agent | Program on a device that handles requests | Equipment attendant in each building |
| MIB | Definitions of management objects, their types, and meanings | Specification for management-data fields |
| OID | Numeric identifier for a management object | Identifier for each field |

The Agent here is a management-protocol program on the device, not an AI Agent.

### 1. MIB: the field specification

Suppose the hospital management office defines this form:

| Field | Meaning | Example |
| --- | --- | --- |
| sysName | Device name | lab-switch-01 |
| sysLocation | Configured device location | training-room |
| sysUpTime | Time since the network-management portion was reinitialized | 60000 TimeTicks |

The MIB is like the specification for this form.

It describes what sysName means, its data type, and how it can be accessed.

A MIB is not a complete copy of the device's current data.

Having a specification for hospital personnel fields does not mean possessing every employee's personal records.

### 2. OID: identify exactly which field you want

How does the computer know that you want sysName rather than sysLocation?

It uses an OID (Object Identifier).

For example:

`1.3.6.1.2.1.1.5.0`

This numeric identifier identifies `sysName.0`.

Three common SNMP object instances:

sysUpTime.0

1.3.6.1.2.1.1.3.0

How long has the management portion been running?

sysName.0

1.3.6.1.2.1.1.5.0

What is the device called?

sysLocation.0

1.3.6.1.2.1.1.6.0

Where is the device configured to be located?

The numbers are almost identical; only their later components differ.

OIDs form a hierarchical tree, rather like folder paths.

For these three scalar objects, the final `.0` selects the instance. A network-interface table may instead use an interface index such as `.1` or `.2`.

Do not assume that every OID needs `.0` appended.

## 3. GET, GETNEXT, WALK, and SET: four different ideas

After identifying the OID, decide how to query it.

GET

Request a particular field.

Like asking a service desk: “Please tell me device A's name.”

If access is permitted and the data exists, you receive its value.

GETNEXT

Request the next accessible field.

Like asking: “In identifier order, what is the next item I can access?”

It does not simply add one to a number; inaccessible objects may be skipped.

WALK

Repeatedly query along an OID range.

Like asking the desk to provide the accessible records for a category in order.

WALK describes a tool performing multiple queries. It is not a separate SNMP message type.

SET

Request a data change.

Like saying: “Please change device A's location to another room.”

Whether this succeeds depends on the object's implementation and the current authorization. A successful GET does not establish that SET is permitted.

Net-SNMP's `snmpwalk` uses GETNEXT; `snmpbulkwalk` uses GETBULK to retrieve values in batches. Both tools retrieve a series of values within an OID range.

The practical distinction is:

A successful GET establishes read access. A WALK list establishes what was visible this time. SET is a separate operation requiring additional permission.

SNMP query endpoints commonly use UDP 161. Trap/Inform notification receivers commonly use UDP 162. These are conventions, not the only possible configurations.

## 4. SNMPv1, v2c, and v3: why does the version affect security?

Imagine being the hospital's network administrator.

You query switches over the network every day. Two separate questions arise:

First: “How does the device determine that you are entitled to ask?”

Second: “Can someone else see the information exchanged?”

These questions lead to SNMP versions and security mechanisms.

### SNMPv1/v2c: asking the desk with a shared passphrase

Earlier SNMP versions commonly use a string called a `community string`.

Examples include `public`, `private`, or an administrator-defined string.

The device uses the string and related settings to decide how to handle the request.

Traditional SNMPv1/v2c does not itself encrypt these strings or the management content.

Someone with an appropriate network observation position may therefore see this information in packets.

The names do not assign permissions: `public` does not necessarily allow everyone to read, and `private` does not necessarily grant write access. Configuration determines actual permissions.

### SNMPv3: separate authentication from content protection

The common USM security model for SNMPv3 provides three security levels.

noAuthNoPriv

No authentication and no encryption.

authNoPriv

Authentication without encryption.

authPriv

Authentication and encryption.

The authentication mechanism in authNoPriv also checks protected-message integrity. authPriv adds confidentiality protection. None of these levels alone tells you which management objects may be read or written.

Think of sending a letter:

noAuthNoPriv resembles a letter without reliable sender authentication or a sealed envelope.

authNoPriv lets the recipient authenticate the sender and check for modification, while others may still read the contents.

authPriv additionally puts the contents inside an encrypted envelope.

Therefore:

SNMPv3 does not always mean encryption. Check the actual security level, such as authPriv, and the algorithms and settings used.

Even authPriv does not establish access to all device data. Transport/message protection and object access permissions answer different questions.

## 5. MIB view: why do two people querying the same device get different results?

This is the central access-control question in M04-07.

Suppose a hospital switch contains three values:

- Device name: `lab-switch-01`
- Device location: `training-room`
- Management elapsed time: `60000 TimeTicks`

Two staff members have authorized identities.

Same switch: lab-switch-01

monitor-a

Routine monitoring identity

Device name

Management elapsed time

Device location

admin-b

Additionally authorized to read location

Device name

Management elapsed time

Device location

The illustration compares read permissions only. It grants no write permission to admin-b.

Suppose monitor-a asks:

“Where is this device located?”

The device does not provide that object.

admin-b asks exactly the same question and receives `training-room`.

Can you conclude that the first user failed because the device had no configured location?

No.

The data exists, but the first user is not allowed to read it.

That is the purpose of a MIB view: a scope of accessible management objects.

It controls which management objects a given identity's operation can reach; it does not define the appearance of a screen.

### What is VACM?

VACM (View-based Access Control Model) is one mechanism for making these access decisions.

It can select permissions using the security identity, group, security model, security level, context (the management-data collection being queried), and operation.

Three important scopes are:

| Permission scope | Plain meaning |
| --- | --- |
| Read view | Objects that may be read |
| Write view | Objects that may be changed |
| Notify view | Objects that may be included in outgoing notifications |

These three scopes are separate.

If the MIB defines sysName as `read-write`, the specification permits that class of object to support reading and writing. It does not grant monitor-a permission to modify it.

A hospital personnel form may be designed to allow phone-number edits, but everyone who can open it does not automatically have editing permission.

## 6. How do noSuchObject, noSuchInstance, endOfMibView, and timeout differ?

In CEH enumeration, record what the device actually returned rather than only whether something was found.

| Result | Plain meaning | Does it prove the device lacks these data? |
| --- | --- | --- |
| `noSuchObject` | No matching object in the accessible scope of this request | No |
| `noSuchInstance` | A corresponding object type exists, but the specified instance is absent | It does not establish that the whole object type is absent |
| `endOfMibView` | No next accessible item remains in OID order | No |
| `timeout` | No reply arrived within the expected time | No; the cause is still unknown |

The first three are protocol exceptions encountered in SNMPv2c/v3 operations. A timeout is the absence of a timely response, not the same kind of protocol reply.

Use a library analogy:

`noSuchObject` resembles: “No such catalog entry exists within the catalog you can search.”

`noSuchInstance` resembles recognizing the entry type but finding no item with that specific identifier.

`endOfMibView` resembles reaching the point where no further accessible catalog entry can be provided.

`timeout` resembles calling the library and getting no answer. You do not know whether the line failed, the library is closed, or the call was declined.

### Why does the distinction matter?

Security staff need to distinguish three evidence states:

Not observed, not authorized to observe, and confirmed absent are different conclusions.

This also applies to SMB, NFS, and later LDAP/Active Directory enumeration.

## 7. Interpret the complete synthetic case

Put the following four query records together.

Simulated SNMP query records

Tabletop case

Identity: monitor-a | SNMPv3 authNoPriv

GET sysName.0

lab-switch-01

GET sysUpTime.0

60000 TimeTicks

GET sysLocation.0

noSuchObject

Another identity authorized to read location

GET sysLocation.0

training-room

How should we reason about these observations?

First, monitor-a retrieved the name and time. This establishes access to those two management values under the conditions of these requests.

Second, failure to retrieve location initially has several possible explanations. The administrator checks the access configuration and finds that location is excluded from monitor-a's read view. Retrieval by another authorized identity then provides evidence that the data exists and is unavailable to monitor-a.

Third, monitor-a has no write view, and neither identity performed SET. These records do not establish anyone's ability to change the name, location, or other values.

Fourth, authNoPriv provides message authentication and integrity protection without content encryption.

### Why does 60000 TimeTicks not directly establish a device reboot?

A TimeTick is one hundredth of a second.

60000 ÷ 100 = 600 seconds = 10 minutes

sysUpTime measures time since the device's network-management portion was last reinitialized.

That may coincide with a device reboot, or it may reflect management reinitialization. This value alone cannot establish that the entire device rebooted ten minutes ago. RFC 3418 formally defines this object.

## 8. The CEH perspective: what are we enumerating?

In CEH M04 Enumeration, SNMP is another service that can provide system information.

Explicitly authorized inventories or security tests can use it to understand device names, management interfaces, some version information, and network status.

Retrieving information does not establish control or an exploitable vulnerability.

For example, a firmware version is a lead for vulnerability checking. Compare the product model, affected versions, patch status, and actual configuration before concluding that a vulnerability applies.

### How should a hospital security lead protect it?

Start by identifying monitoring needs, then restrict management sources and permissions.

Where SNMP is needed, evaluate appropriately configured SNMPv3 authPriv and restrict who can connect, which OIDs can be read, and which can be written. Routine monitoring identities generally do not need write access.

Within the authorized scope, verify that intended queries succeed, restricted objects are not disclosed, and the security level meets requirements. Retain evidence without publishing community strings, authentication passwords, or keys.

The access-control principle is:

Give each person the information needed for the job.

## 9. A four-layer framework for the lesson

Assess SNMP security in four separate layers:

01

Can it be reached?

Network path, service, UDP ports, and related configuration.

02

Is the communication protected?

SNMP version, authentication, integrity, and encryption.

03

Which data may be read?

Identity, context, read view, and implementation.

04

May data be modified?

Object writability, write view, and actual authorization.

Assess each layer separately. Evidence for one layer does not establish all subsequent layers.

## 10. Understanding check: your turn as the security engineer

Scenario 1: A device uses SNMPv3 authNoPriv. Its administrator says, “We use v3, so management data must be encrypted.” Do you agree? Why?

Consider the distinction between version and security level.

Scenario 2: Identity A cannot retrieve device location, while identity B can. Which settings should you check to establish the reason?

Consider identity, context, and read view.

Scenario 3: The MIB marks sysName as read-write, and identity A can GET sysName. Does that establish permission to change it with SET?

Consider specification capability and actual write authorization.

Prepare your three answers for a teaching discussion and ask your teacher to review them. This page does not transmit or store responses.

Carry forward the ability to distinguish observed results, restrictions caused by permissions, and inferences that still lack evidence. It also prepares you for LDAP/Active Directory enumeration.
