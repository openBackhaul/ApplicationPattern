# Introduction to Node.js

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. 
Node.js is one of the perfect approaches to implement REST APIs.

A Node.js app runs in a single process, without creating a new thread for every request. Node.js provides a set of asynchronous I/O primitives in its standard library that prevent JavaScript code from blocking and generally, libraries in Node.js are written using non-blocking paradigms, making blocking behavior the exception rather than the norm.

When Node.js performs an I/O operation, like reading from the network, accessing a database or the filesystem, instead of blocking the thread and wasting CPU cycles waiting, Node.js will resume the operations when the response comes back.

This allows Node.js to handle thousands of concurrent connections with a single server without introducing the burden of managing thread concurrency, which could be a significant source of bugs.

### why Node.js

**Easy to write API and interaction code**
* There are a lot of ready and useful modules(Node Package Modules(NPM)) to work with pure HTTP(s), REST API, Web Services, Sockets, etc that can be used both to construct API and to implement interaction with existing applications.

**High performance**
* It operates on a single-thread, uses an event-driven and a non-blocking I/O approach. This single-thread model makes Node.js to support hundreds of thousands of concurrent request efficiently. 

**Monitoring possibilities**
* It is easy to get events on request/connection life cycle and collect metrics on API usage in Node.js.

**Authentication support**
* Authentication strategies like OAuth, OpenID, Basic and others are available through passport.js, everyauth and other modules and can be applied easily to API.

**Node.js is lightweight, fast and scalable**
* Node.js allows you to build fast, scalable API Proxy capable of handling a huge number of simultaneous requests with high throughput.  

[Up to Preparing for implementing Applications](../PreparingImplementing.md) - - - [Ahead to Introduction to NPM ->](../Introduction2Npm/Introduction2Npm.md)