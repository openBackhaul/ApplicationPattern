# Structure of Operations

In a REST server based microservice architecture, function is triggered in a way that is very similar to calling a website in the Internet.  
The 'address' of some function is composed from protocol (e.g. HTTPS), IP address, TCP port, and an individual part.  
This individual part of the 'address' is called _path_ in the language we are using for specifying applications.  

Further on, targets of such 'addresses' can be categorized into _Resources_ and _Services_.  
- A _Resource_ is like a parameter and calling its 'address' is for reading or changing the value of this parameter.  
Configuring a device usually works like this.  
- A _Service_ is like a little program, which gets executed after calling its 'address'.  
Using microservices usually works like this.  

In case of the MW SDN application layer, the REST APIs of the applications are supporting both.  
The _Services_ are representing the 'payload' interfaces in some sense. They are defining the purpose of the application.  
_Resources_ are used for configuring the application. 
So the REST APIs of the applications of MW SDN application layer are distinguishing a _ServiceLayer_ and an _OamLayer_.

The _OamLayer_ layer, which is defined in the _ApplicationPattern_, is assumed to suffice in most cases.  
So, the individual part of some specification will usually be limited to the _ServiceLayer_.  

Since the term 'Service' is used for very different things, I decided to use _Operation_ instead.
The individual part of the 'address', which is mentioned in the first paragraph, is called _OperationName_.
So, some 'address' of an _Operation_ could look like this example: 'http://192.168.0.1:80/v1/operation-name'

Input values for such an _Operation_ would be passed in the _RequestBody_.
Results would be provided in the _ResponseBody_.

Now, first step of the specification process is thinking about which _Operations_ are to be provided by the application.  
This includes structuring the function, which is expected to be supported by the application.  
Detailed definition of the input values and results will follow during describing the _OAS_.

There is no clear right or wrong for structuring into _Operations_, but some general guidance that should be kept across all applications.

**Explicit**  
During later operation of the modular application layer, people will conclude from the _OperationName_ on the offered functions.  
An _Operation_ should focus on doing a single thing and this thing should be precisely described in its naming.  
Examples: _/v1/notify-approvals_ and _/v1/notify-withdrawn-approvals_  
If _Operations_ would implement diverse functions depending on the values of the parameters, which are sent in the RequestBody, it would not support transparency.  

**Atomic**  
It might happen that we need an output, which results from a process comprising several steps.  
During structuring the _Operations_, it should be considered that there might be future applications that require the output of just a subset of these steps.  
So, wise sub-structuring might cause some additional effort in the beginning, but it supports avoiding redundancy of implementations.  
Every piece of code needs to be maintained as long as it will be in use.  
Need for updating will in tendency be reduced to a single, relatively small place, if wisely sub-structured.  

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
