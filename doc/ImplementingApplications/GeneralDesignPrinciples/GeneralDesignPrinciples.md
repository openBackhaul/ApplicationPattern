# General Design Principles

### Idempotence
In general, executing the same request (applies on Services and OaM) with the same set of attributes again, shall just lead to the same state. There shall be no error messages, which would indicate that no change has been made. This shall apply in general. Few exceptions might occur (hypothetical example: /v1/create-additional-instance), but not contradict the general principle.

[Up to ImplementingApplications](../ImplementingApplications.md)
