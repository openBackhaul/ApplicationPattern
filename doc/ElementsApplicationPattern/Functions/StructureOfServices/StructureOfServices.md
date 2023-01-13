# Structure of Operations

There is no clear right or wrong for structuring _Operations_, but some general guidance that should be kept across all applications.

**Explicit**  
During later operation of the modular application layer, people will conclude from the _OperationName_ on the offered functions.  
An _Operation_ should focus on doing a single thing and this thing should be precisely described in its naming.  
Examples: _/v1/notify-approvals_ and _/v1/notify-withdrawn-approvals_  
If _Operations_ would implement diverse functions depending on the values of the parameters, which are sent in the RequestBody, it would not support transparency.  

**Atomic**  
It might happen that we need an output, which results from a process comprising several steps.  
During structuring the _Operations_, it should be considered that there might be future applications that require the output of just a subset of these steps.  
So, wise substructuring might cause some additional effort in the beginning, but it supports avoiding redundancy of implementations.  
Every piece of code needs to be maintained as long as it will be in use.  
Need for updating will in tendency be reduced to a single, relatively small place, if wisely substructured.  

**Idempotent**  
In general, executing the same request (applies on _Operations_ and _OaM_) with the same set of attributes again, shall just lead to the same state. There shall be no error messages, which would indicate that no change has been made. This shall apply in general. Few exceptions might occur (hypothetical example: /v1/create-additional-instance), but not contradict the general principle.  

There are two different ways of leading.  
1) You tell what to do  
2) You tell the desired target state   

Example: "Clean up the yard!" vs. "Make sure the yard is clean!"  
Telling the desired target state leaves it to the implementation to decide about how to reach that state.  
This usually leads to more efficient implementations and it also supports encapsulating the impact of changes.  
As a side effect, the same _Operation_ can be called over and over again, because successful execution always leads to the same condition (which is the target state).  
This supports debugging the overall system of applications.  
Unfortunately, this concept cannot be applied in all cases and often it is not that explicit.  
Nevertheless, it is recommended to apply it as often as possible.  
Example: _/v1/notify-approvals_ creates or updates a subscription for a specific combination of _ApplicationName_ and _ReleaseNumber_.  
(It does not create another subscription, if there is already one for the same combination of _ApplicationName_ and _ReleaseNumber_.  
There is no _/v1/update subscription_ _Operation_ required.  
Using the subscription _Operation_ again with the same combination of _ApplicationName_ and _ReleaseNumber_, but different values of IP address and port, will define a different target state.)
