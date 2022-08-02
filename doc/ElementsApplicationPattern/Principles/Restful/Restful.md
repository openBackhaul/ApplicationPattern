# RESTful  


### What is a web service?

As described by the World Wide Web Consortium (W3C), a web service is a software system designed to support interoperable machine-to-machine interaction over a network.  

There are two major types of web services:  
- **SOAP web services:** SOAP (Simple Object Access Protocol) is an XML-based protocol for accessing web services  
- **REST web services:** REST (Representational State Transfer) is a style of software architecture  

Differences between these web services:  

| SOAP | REST |
| ---- | ---- |
| SOAP is a protocol | REST is an architectural style |
| SOAP only permits XML | REST permits many different data formats including plain text, HTML, XML, and JSON… |
| SOAP supports both SMTP and HTTP protocols | REST requires the use of HTTP exclusively |
| SOAP requires more bandwidth and more resources (for every request, SOAP consists of an envelope, header and body in XML format) | REST requires less bandwidth and less resources (light weight) |
| SOAP defines its own security | RESTful web services inherit security measures from the underlying transport |
| More difficult to setup and harder to develop | Easier to build and setup |

For years, people have been debating which of these web services is better and why.  
REST is preferred for microservice based architectures, because it is more lightweight, flexible and simpler than SOAP.  


### What is REST?

REST is a set of architectural constraints, not a protocol or a standard.  
API developers can implement REST in a variety of ways.  

![RESTfuleService](./pictures/RestfulApi.png)  

In order for an API to be considered RESTful, it has to conform to the following criteria:  
- A client-server architecture made up of clients, servers, and resources, with requests managed through HTTP  
- Stateless client-server communication, meaning no client information is stored between get requests and each request is separate and unconnected  
- Cacheable data that streamlines client-server interactions  
- A uniform interface between components so that information is transferred in a standard form. This requires that:  
    - resources requested are identifiable and separate from the representations sent to the client  
    - resources can be manipulated by the client via the representation they receive, because the representation contains enough information to do so  
    - self-descriptive messages returned to the client have enough information to describe how the client should process it  
    - hypertext/hypermedia is available, meaning that after accessing a resource the client should be able to use hyperlinks to find all other currently available actions they can take  
 - A layered system that organizes each type of server (those responsible for security, load-balancing, etc.) involved the retrieval of requested information into hierarchies, invisible to the client  


_Further reading:_  
_To have a deep understanding, please have a look into https://www.restapitutorial.com/_
