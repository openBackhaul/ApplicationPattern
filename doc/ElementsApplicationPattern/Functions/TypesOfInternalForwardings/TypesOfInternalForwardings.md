# Types of Internal Forwardings

_Forwardings_ can be distinguished by the way of reacting on _Management_.  

**InvariantProcessSnippet**
Whenever an _InvariantProcessSnippet_ receives new address information at its _Management_, it updates the existing _OperationClient_, which is referenced as _Output_.  
Example: Every application has to inform the _OamLog_ about requests that are addressing the OaM segment of its REST API.  
Of course, it would not be wished, if third parties would receive copies of this information.  
Thus, the _Forwarding_ towards the _OamLog_ is defined in such a way that just a single _OperationClient_ can be referenced as _Output_.  

**Subscription**
Whenever a _Subscription_ receives new contact information at its _Management_, it creates another stack of _Clients_ and adds another _Output_ to the _ForwardingConstruct_.  
Consequently, the _Subscription_ needs a second _Management_ for removing an _Output_ from the _ForwardingConstruct_.  
In case of the _Subscription_, all the existing _Outputs_ are reacting on an event at the _Input_.  

**ProcessSnippet**
Whenever a _ProcessSnippet_ receives new contact information at its _Management_, it updates one out of the already existing _Outputs_.  
In principle, the number of _Outputs_ is not restricted, but it is invariant after the specification of the application has been handed over to implementation.  
This restriction is due to the individual logic, which is implemented by the _ProcessSnippet_.  
The _ProcessSnippet_ is activating one or several of the _Outputs_ for reacting on an event.  
The reactions usually depend on the content of the _Input_, and it requires an internal decision to determine.  
Obviously, the _ProcessSnippet_ is at least close to, maybe even crossing the boundaries between _Forwarding_ and _Processing_.  
Up to now, the only way of describing the logic, which is implemented by the _ProcessSnippet_, is scripting _TestCases_.  
