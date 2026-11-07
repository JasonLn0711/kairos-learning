# CEH M03-01 | Reference answers

## answer-layer-roles | Check 1

C. IP supports addressing and forwarding. Ports in transport protocols such as TCP and UDP help the operating system deliver data to communication endpoints. Programs provide services under application rules. Connect addresses, protocol, ports, and service evidence when reading a record.

## answer-port-protocol | Check 2

A. TCP and UDP have separate port namespaces, so TCP/443 and UDP/443 require separate identification. Common examples are HTTPS over TCP and QUIC/HTTP/3 over UDP. Confirm actual use through service configuration and protocol responses.

## answer-handshake-login | Check 3

The TCP three-way handshake synchronizes initial sequence numbers and establishes transport connection state. Website login authenticates an account at the application layer. HTTPS additionally establishes a TLS secure channel according to the service flow. Examine each layer's own result.

## answer-service-evidence | Check 4

Retain source and destination IPs, source and destination ports, TCP, timestamp, observation point, and actual responses. Consult host listeners and program configuration, the asset inventory, reverse-proxy configuration, and owner-maintained records. Where authorized, corroborate protocol responses. Port 8443 supplies a service hypothesis; these sources establish its actual purpose.
