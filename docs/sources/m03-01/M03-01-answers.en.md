# M03-01 reference answers

## answer-layer-roles | Why is an IP address insufficient?

IP helps locate a network interface; one address can support multiple services. The transport protocol and destination port distinguish the intended communication endpoint. TCP/22, TCP/80 and TCP/443 commonly carry SSH, HTTP and HTTPS, but configuration or service responses must establish the actual service.

## answer-handshake-login | Does the TCP handshake establish login?

The handshake establishes TCP transport state. HTTPS also needs TLS; application authentication and authorization determine account access and operation permissions. Establishing a communication channel does not itself grant access to an account or its data.

## answer-realtime-loss | Should voice playback wait after loss?

Decide from playback deadlines and application requirements. Audio that has missed its deadline may not be worth waiting for. Jitter buffering, loss concealment or selective retransmission can support continued playback. UDP has no automatic retransmission of its own, but higher layers can add reliability; protocol names alone do not establish performance.
