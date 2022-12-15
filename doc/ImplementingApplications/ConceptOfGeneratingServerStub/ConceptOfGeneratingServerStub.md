# Generating Server stub

With Swagger Codegen , server stub (an API implementation stub) for Node.js can be generated easily from an Open API Specification. 
The server stub is a good starting point for implementing APIs. The generated server stub can be run and can be tested locally.

Note that the generated code contains only stub methods that do not contain any real programming logic. The business logic needs to be implemented further to handle the requirement for every API. Once the implementation is ready , the server can be further tested and deployed.

The generated server-side stub will have the following folders and files. 
Details of each component is as follow,

```

├── api (folder contains openapi.yaml (generated from the one provided by the ApplicationOwner))
│   ├── openapi.yaml (This file will be utilized by the express framework to validate the incoming request and outgoing response.)
├── controllers (modules responsible for interacting with the WEB part , further control will be passed to service layer)
├── service (modules that shall be complemented to implement business logic to handle the requirement for every API)
├── utils (contains common utilities)
│   ├── writer.js (Implementation that writes json object to the response payload.)
├── index.js (Starting point of the application that contains implementation of the httpserver, router definitions.)
├── package.json (Contains details about the application and the dependent npm packages)
└── .swagger (version file that provides the swagger jar version used for the code generator)

```