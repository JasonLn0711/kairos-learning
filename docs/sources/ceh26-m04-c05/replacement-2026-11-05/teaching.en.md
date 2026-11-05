# CEH M04-05 | NetBIOS/RPC: what separates discovering names and endpoints from obtaining permission?

This fifth unit briefly reviews NetBIOS name tables and RPC endpoints, then distinguishes three kinds of evidence: information was returned, a connection succeeded, and a specified operation was authorized.

## 1. Put the three roles in context

- **NetBIOS** (Network Basic Input/Output System): originally an interface for local-network programs to use names and exchange data. Its operation over TCP/IP is called NBT or NetBT.
- **SMB** (Server Message Block): lets clients access files and other resources over a network. The preceding lesson distinguishes share lists, directory lists, reading, and modification permissions.
- **RPC** (Remote Procedure Call): a program passes parameters to another process, requests a specified function, and receives a result. This is not remote desktop access or possession of a command shell.

Think of a NetBIOS name as a name in a directory, an RPC endpoint as the location of a service counter, and operation permission as whether that counter will perform a particular task for this identity. This is a role analogy, **not a mandatory NetBIOS → SMB → RPC sequence**. [RFC 1001: NetBIOS over TCP/IP](https://www.rfc-editor.org/rfc/rfc1001) | [Microsoft: How RPC works](https://learn.microsoft.com/en-us/windows/win32/rpc/how-rpc-works)

## 2. NetBIOS review: names, suffixes, and types are not a permission table

Under common Windows NetBIOS naming conventions, a name has 16 bytes: the first 15 contain the name, and the final byte is a purpose suffix. Shorter names are padded with spaces. The suffix is a hexadecimal value, **not a port number**. [Microsoft: NetBIOS name representation](https://learn.microsoft.com/zh-tw/openspecs/windows_protocols/ms-brws/940f299f-669f-4a0b-8411-9ead7e2f31ec)

For example, a synthetic name table contains these three records:

- LAB-FS <00> UNIQUE: a computer-name clue used by the workstation service.
- LAB-FS <20> UNIQUE: a server-service name clue that can guide later file-sharing checks.
- LABGROUP <00> GROUP: a group-name clue; actual workgroup or domain membership still needs checking.

UNIQUE and GROUP describe NetBIOS name types. GROUP is not a user group in file access control. A name table is not a complete account list either. Seeing <20> does not establish share names, the SMB version, or permission to read a particular file. [Microsoft: Names and suffix behavior](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-nbte/6dbf0972-bb15-4f29-afeb-baaae98416ed)

Review the usual port roles together: the name service uses UDP/TCP 137, the datagram service UDP 138, and the session service TCP 139. Direct SMB over TCP uses 445 and can operate without NetBIOS. Thus, **no response on 137 does not establish that SMB on 445 is absent**. [Microsoft: NetBIOS and direct SMB transport](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/direct-hosting-of-smb-over-tcpip)

With Windows nbtstat, distinguish where the information comes from:

- nbtstat /n: the local name table.
- nbtstat /c: the local name cache, which may reflect earlier resolution results.
- nbtstat /a LAB-FS: query a remote name table by remote name.
- nbtstat /A 192.0.2.10: query a remote name table by IP address.

/a and /A are case-sensitive. The final IP is a documentation example, not a target for this lesson; no command execution is needed here. Also, /R and /RR clear/reload the cache or re-register names; they are not synonyms for merely displaying information. [Microsoft: nbtstat](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/nbtstat)

## 3. Distinguish RPC interfaces, operations, and endpoints

Three RPC terms answer different questions:

1. **Interface**: which agreed set of functions and parameter formats is offered?
2. **Operation/Procedure**: which specific function is being called this time, such as reading a particular status?
3. **Endpoint**: which communication location reaches the service? A TCP endpoint can be a port number; a named-pipe endpoint is a pipe name, not another TCP port.

Microsoft RPC interfaces are commonly identified by a UUID (Universally Unique Identifier) and an interface version. That version describes an interface compatibility contract. It is not directly a Windows or application product version, and a version number alone cannot establish CVE applicability. [Microsoft: RPC interface identification](https://learn.microsoft.com/en-us/windows/win32/api/rpcdce/ns-rpcdce-rpc_if_id) | [Endpoint types](https://learn.microsoft.com/en-us/windows/win32/rpc/finding-endpoints)

**The Endpoint Mapper is like directory assistance: it maps the desired interface to a communication location. Returning a location does not grant the caller permission to use every function.**

A common Microsoft RPC over TCP case queries the Endpoint Mapper on TCP 135, then connects to the returned service port. Modern Windows commonly uses the dynamic TCP range 49152–65535, but an actual service may use a fixed port or another configuration. This range is neither a measured result for every device nor a recommendation to expose all those ports externally. [Microsoft: Service and network port requirements](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/service-overview-and-network-port-requirements)

RPC can also use SMB named pipes, or a client may already know the endpoint, so not every RPC call must first pass through TCP 135. Samba's rpcclient is an MS-RPC client that can use named-pipe or TCP transports. **Its name does not mean that every command only queries information; inspect the specific subcommand as well.** [Samba: rpcclient](https://www.samba.org/samba/docs/current/man-html/rpcclient.1.html)

## 4. Ports 111 and 135 help locate services using different protocols

ONC RPC is common in Unix/Linux-related services. It identifies services and operations using a program number, version (service protocol version), and procedure number. rpcbind/portmapper uses TCP/UDP 111 to help locate service addresses. This is not the same query format as Microsoft RPC interface UUIDs and TCP 135. [RFC 5531: ONC RPC](https://www.rfc-editor.org/info/rfc5531/) | [RFC 1833: ONC RPC binding protocols](https://www.rfc-editor.org/rfc/rfc1833)

The common rpcinfo utility can query ONC RPC registrations. Similar naming does not make it a substitute for Microsoft RPC tools. It also has other operation options, so inspect its arguments before use. [Oracle: rpcinfo manual](https://docs.oracle.com/cd/E88353_01/html/E72487/rpcinfo-8.html)

Do not memorize “ask 111, then connect to NFS” as a rule for every version. NFSv4.1 specifies 2049 as the default service port and recommends that clients not use the RPC binding lookup process described above. **Not using rpcbind does not mean not using RPC**; the next unit explores NFS version differences. [RFC 8881 §2.9.3](https://www.rfc-editor.org/rfc/rfc8881.html#section-2.9.3)

## 5. Identify the stage at which a failure occurred

Use these questions to interpret RPC results; they are not a fixed checklist that must restart for every call:

- **Was registration information obtained?** Discovering an endpoint only obtains mapping information; it does not establish reachability from the current location.
- **Is the endpoint reachable?** The mapping service can respond while a firewall blocks the actual service port, the service stops listening, or its location changes.
- **Is the interface compatible?** Even after a TCP connection succeeds, RPC bind must establish conditions such as the interface and transfer syntax. Here, bind establishes an RPC communication agreement; it does not mean obtaining administrative permission. [Microsoft: Version and capability negotiation](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-rpce/ed7bf5ae-ec8e-407e-b6d7-663958e18701)
- **Which identity is requesting which operation?** Authentication concerns the caller's identity; authorization concerns permission to perform a specified task. One successful query does not establish permission for every operation. [Microsoft: RPC security essentials](https://learn.microsoft.com/en-us/windows/win32/rpc/rpc-security-essentials)

Thus, “no response” does not directly establish incorrect credentials, “interface unavailable” does not directly establish a firewall block, and “Access Denied” does not establish that the entire host is secure. Preserve the original error, target, transport, identity, and failure stage, then correlate administrative configuration and logs to identify the cause.

Blocking directory assistance alone may not stop calls to known endpoints. Protecting one port may not cover other transports. Defense must consider the mapping service, actual endpoints, permitted connection sources, and operation permissions together. Disable NetBIOS only after confirming there are no legacy dependencies and testing compatibility. Do not casually disable core Windows RPC services merely to eliminate port 135.

## 6. Practice a conclusion using a synthetic record

This is a tabletop case; no real host was queried. Assume testing was authorized and the record says:

- Lab-A's NetBIOS name table returned LAB-FS <20> UNIQUE.
- Lab-A's Endpoint Mapper returned a registration mapping an RPC interface version 1.0 to TCP 50020.
- A connection to TCP 50020 from the same test subnet timed out; no RPC call was made to that endpoint.
- No SMB shares were queried and no files were read.

A suitable record is: “This test obtained a server-service name clue and an RPC endpoint mapping for Lab-A. The connection from the specified test location to TCP 50020 timed out; interface calls, authentication, and operation permissions at that endpoint remain unverified. SMB shares and file access were not tested.”

This record preserves the boundary between observations and unknowns. In actual work, also retain the time, tool version, full arguments, and original response, while keeping passwords and unrelated personal information out of the report. Before continuing, confirm that the approved scope includes that endpoint and the specified read-only operation. Discovering a new port does not automatically expand testing scope.

## One small check

A colleague reads the record and says: “<20> means shared files are readable; 135 returned an interface, so we have RPC administrative permission; the timeout on 50020 proves that service does not exist.”

**Correct this conclusion in two or three sentences. Identify what was confirmed, which conclusions remain unsupported, and the evidence to check next.**

This task only interprets synthetic data. It requires no connection, tool installation, or configuration change, so there is no environment cleanup. The next unit covers Unix/Linux users and NFS.
