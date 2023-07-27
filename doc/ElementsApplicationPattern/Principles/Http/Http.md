# Introduction to HTTP Requests

The microservices of the MW SDN domain are using HTTP requests to communicate with each other.  

HTTP (Hypertext Transfer Protocol) is a protocol that was originally used for transmitting data over the internet. An HTTP request is a message that is sent by a client (such as a web browser) to a server requesting information. This request usually consists of four main components:  

- Request method: This indicates the type of request being made, such as GET, POST, PUT, DELETE, etc. Each method has a specific purpose and defines the type of interaction between the client and server. The applications of the MW SDN domain are using POST for communicating with each other. GET and PUT are used by the administrators for managing the individual applications.  

- URL: This is the address of the resource being requested. The URL specifies the location of the resource on the server and can include parameters and queries that help the server understand the context of the request. The applications of the MW SDN domain are implementing two different styles of URL. In the service layer of the API, applications are communicating with each other by calling services. Some URL could look like e.g. /v1/provide-current-link-capacity. In the OaM layer of the API, humans are addressing concrete resources in a data tree of the application according to the ONF information model. Some URL could look like e.g. /core-model-1-4:control-construct/logical-termination-point=89/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/release-number.  

- Headers: These contain additional information about the request, such as the type of data the client can accept or the authentication credentials of the user. Headers are used to communicate metadata about the request and can be used to control caching, set cookies, and provide security information. In case of MW SDN services, headers are used for enabling management functions like logging, tracing and security inside the application layer. The application pattern defines a set of standard headers that have to be applied in all individual cases.  

- Body: This is optional and contains data to be sent to the server, such as form data or a JSON payload. The body is often used to send data to the server to create or update a resource. In case of the MW SDN service layer, the input data that is required for executing a service has to be put into the body of the request. In the OaM layer, the body holds the new configuration values. Anyway, content and structure of the request body is very individual.  

 When a client sends an HTTP request to a server, the server processes the request and sends an HTTP response back to the client with the requested data. The response typically includes three main components:  

- Status code: This indicates the status of the request, such as success, failure, or an error. HTTP status codes are three-digit numbers that are divided into five classes: informational (1xx), success (2xx), redirection (3xx), client errors (4xx), and server errors (5xx). The application pattern of the MW SDN domain defines a set of status codes that must be applied in all individual cases.  

- Headers: These contain additional information about the response, such as the content type, caching information, or cookies. The application pattern defines a set of standard headers that have to be applied in all individual cases.  

- Body: This contains the requested data, such as the HTML, JSON, or XML content. In case of the MW SDN service layer, the output data of a service is to be provided inside the response body. In the OaM layer, the response body holds the current configuration values. Anyway, content and structure of the response body is very individual.  

HTTP status codes are an important aspect of the HTTP protocol, as they provide information about the status of the request and help the client understand how to handle the response.  


Each HTTP request is treated as a new and independent request, and the server only responds to the specific request it receives, without any knowledge of previous requests from the same client.  

This approach has several advantages. First, it simplifies server implementation because the server does not need to keep track of any client-specific information. Second, it makes the system more scalable, because the server does not need to store any state information about individual clients.  

However, there are also some limitations to stateless architectures. For example, if a client needs to maintain session-specific information, such as user authentication or shopping cart data, it must be sent with each request. This can result in larger requests and slower response times.  

In case of the MW SDN application layer, this means for example that the client cannot establish some sort of a long lasting connection with a server, but needs to send the correct operationKey with every individual request.  