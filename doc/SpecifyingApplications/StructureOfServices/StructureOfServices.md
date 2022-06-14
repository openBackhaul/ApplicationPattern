# Structure of Services

There is no clear right or wrong for structuring services, but some general guidance that should be kept accross all applications.

**Explicit**
During later operation of the modular application layer, people will conclude from the service names on the offered functions.
A service should focus on doing a single thing and this thing should be precisly described in its naming.
Example: /v1/notify-approvals and /v1/notify-withdrawn-approvals
It would not support transparency, if services would do different, even inverting functions depending on the set of parameters send.

**Atomic**
It might happen that we need an output, which results from a process comprising several steps.
During structuring the services, it should be considered that there might be future applications that require the output of just one or several of these steps.
So, wisely substructuring might cause some additional effort in the beginning, but it supports avoiding redundancy of implementations.
Please, keep in mind that every piece of code needs to be maintained as long as it will be in use.
Need for updating will in tendency reduce to a single, relatively small place, if wisely substructured.

**Idempotent**  
There is two different ways of leading.
1) You tell what to do
2) You tell the wished target state
Example: "Clean up the yard!" vs. "Make sure the yard is clean!"
Telling the wished target state is leaving it to the implementation to decide about how to reach that state.
This usually leads to more efficient implementations and it also supports encapsulating the impact of changes.
As a side effect, the same service can be called over and over again, it always leads to the same result (which is the target state).
This supports debugging the overall system of applications.
Unfortunately, this concept cannot be applied in all cases and often it is not that explicit.
Nevertheless, it is recommended to use it as often as possible.
Example:
/v1/notify-approvals creates or updates a subscription for a combination of application name and release number.
