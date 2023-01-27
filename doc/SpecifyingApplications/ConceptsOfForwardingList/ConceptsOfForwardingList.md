# Concept of the ForwardingList  

The _FordingList_ is basically a list of homogenous elements that are describing an individual _Forwarding_.  

These _Forwardings_ will result in callbacks in the OAS and logical _ForwardingConstruct_ elements in the CONFIGfile.  
These elements need not just to be formulated in syntactically correct language, but also to be harmonized across the different files and languages.  
The _ForwardingList_ allows focusing on the design of the function.  
Ideally, similarities with existing _Forwardings_ can be identified during creative work in the _FordingList_, and later translation into OAS and CONFIGfile can be simplified by copy/paste and slight adaption of existing structures.  

The template of the ForwardingList contains already a vast amount of _Forwardings_.  
These are mainly for automating the embedding of the application into the modular application layer and for handing-over configuration and application data during future upgrade processes.  

The template is prepared in such a way that comments (## TODO:) have to be replaced by changes that are individual to the application under specification.  
If this initial concept would be followed, the ForwardingList would be finalized as soon as all "## TODO:" would either be replaced or deleted.  
If someone would find it helpful to add his thoughts into the ForwardingList, he would be free to add own comments, but these comments should not start with "TODO:" after finalizing the ForwardingList.  
If someone would decide to add comments into the ForwardingList, it would be strongly recommended to properly indent the additional lines.
