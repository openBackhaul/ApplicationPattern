# Structure of Services

There is no clear right or wrong for structuring services, but some general guidance that should be kept across all applications.

**Explicit**  
During later operation of the modular application layer, people will conclude from the service names on the offered functions.
A service should focus on doing a single thing and this thing should be precisely described in its naming.  
Examples: _/v1/notify-approvals_ and _/v1/notify-withdrawn-approvals_  
If services would implement diverse functions depending on the values of the parameters, which are sent in the request body, it would not support transparency.

**Atomic**  
It might happen that we need an output, which results from a process comprising several steps.  
During structuring the services, it should be considered that there might be future applications that require the output of just one or several of these steps.  
So, wise substructuring might cause some additional effort in the beginning, but it supports avoiding redundancy of implementations.  
Every piece of code needs to be maintained as long as it will be in use.  
Need for updating will in tendency be reduced to a single, relatively small place, if wisely substructured.

**Idempotent**  
There are two different ways of leading.
1) You tell what to do
2) You tell the desired target state  

Example: "Clean up the yard!" vs. "Make sure the yard is clean!"  
Telling the desired target state leaves it to the implementation to decide about how to reach that state.  
This usually leads to more efficient implementations and it also supports encapsulating the impact of changes.  
As a side effect, the same service can be called over and over again, successful execution always leads to the same result (which is the target state).  
This supports debugging the overall system of applications.  
Unfortunately, this concept cannot be applied in all cases and often it is not that explicit.  
Nevertheless, it is recommended to use it as often as possible.  
Example: _/v1/notify-approvals_ creates or updates a subscription for a specific combination of application name and release number. (It does not create another subscription, if there is already one for the same combination of application name and release number. There is no _update subscription_ service required, because using by the _subscription_ service again with the same combination of application name and release number, but different IP address and post, the target state will just be redefined.)
