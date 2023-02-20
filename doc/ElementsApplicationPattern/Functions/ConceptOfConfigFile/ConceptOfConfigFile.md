# Concept of the CONFIGfile

Functions are distributed across many individual applications in a modular application layer.  
Applications are consuming functions provided by other applications, which results in numerous communication relationships between them.  
These communication relationships are directed, meaning that a client is sending requests to a server.  
The client must correctly address these requests for actually reaching the server.  

However, the server's address may change.  
For example, a non-backward compatible modification to a function (e.g., a bug fix) would require changing the version number in the URI for calling this function.  
If address information were hardcoded into the client, the client's program code would require an update in such cases.  
Consequently, a change to an application would require changes to other applications.  
Such propagating need for adaptation would make simple adjustments very cumbersome; and the architecture would be rigid against further development.  
Therefore, address information needs to be configurable in some way and it needs to be saved independently from the program code.  
This is the main purpose of the CONFIGfile.  

The CONFIGfile does not just store address information, but also all kinds of parameter values.  
Parameters might be required for pre-configuring e.g., formulas, algorithms, or processes that are executed inside the application.  
Such parameters are usually of primitive data types like Integer or String.  

Some applications build their own data during runtime.  
For example, the ExecutionAndTraceLog is creating a record for every request executed in the application layer.  
Such data would be called ApplicationData.  
The CONFIGfile shall not contain ApplicationData, but it might contain information that is required for connecting to a separate file or database that is holding the ApplicationData.  

Immediately after launching, the application is reading the CONFIGfile.  
Consequently, the values that are defined in the CONFIGfile represent the initial state of the application.  

The CONFIGfile could be manually altered if required but operating the updated configuration would require restarting the application.  
The applications, which are based on the MW SDN ApplicationPattern, are supporting changing their configuration via the REST API during runtime.  
These changes are then automatically written into the CONFIGfile.  

The CONFIGfile is stored separately from the code of the application.  
So, in case of failure, a new instance of an application could be started with the exact latest configuration of a broken instance.  

For completeness, it should be noted that an application of the MW SDN application layer is always stateful due to its configurability.  
This means that they have a state that changes over the course of their operation, and this state must be kept consistent.  
This characteristic makes integration with Kubernetes a bit more complex.  
