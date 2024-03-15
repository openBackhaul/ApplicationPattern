# How to define Error Messages

Error responses should be meaningful and helpful for handling the errors.
It should not only inform about a problem, but also assist in dealing with it.
Ideally, an error message provides a machine- and human-readable recommendation for the next step to be taken (e.g. as part of an automation).

How to define error responses in the OAS:
1. List possible reasons why the requested data cannot be provided or the requested service cannot be performed.
2. Reasons for failure should be grouped into different expected behaviors of the client (e.g., try again later, make sure the device is mounted first).
3. Groups of failures with the same expected client behavior should be associated with a response code according to https://developer.mozilla.org/en-US/docs/Web/HTTP/Status.
   If an appropriate response code could not be found, define a new one.
4. If not already covered by the ApplicationPattern, add the new responseCode to the responses of the affected service.
5. The response definition for a specific responseCode must be homogeneous at least within the scope of the application (harmonization across all applications will be done at a later stage, by consolidating individual definitions into an updated applicationPattern).
   To ensure this, the response definition at an individual service should only reference a concrete definition in the common components section ($ref: '#/components/responses/{responseCode}).
6. The concrete definition in the common components section is identified by the responseCode.
7. It must begin with a description statement. The description statement is addressed to the implementor of the server (application under specification). It defines the conditions for sending a response with this code. Example: "Response to be sent whenever the number of currently executed requests reaches the maximum defined in the instance of IntegerProfile whose name contains limitOfParallelRequestsAt and the service name.
6. Some "standard" response codes from the list above define additional headers or parameters.
   Such additional headers and parameters must also be included in the response definition in the common components, even if they are not used within the scope of this application.
7. If additional attributes are required to manage the client's behavior, they shall be included in the body of the definitions in the common components.
8. code and message attributes shall always be supported. They shall be available for the implementers to detail the reason of failure.
9. If an additional attribute would be required to pass a predefined message, that message shall be defined as an enumeration with only a single value.
10. If sending a response implies a specific expectation to the client's behavior, this expectation should be explicitly expressed by an expectation-to-the-client attribute. This attribute should be an enumeration with a single value. This value should contain a statement that is understood by both an automation implementer and a human user.

Example:
```
components:
  responses:
    429:
      description: 'Response to be send whenever the number of currently executed requests reached the maximum defined in the instance of IntegerProfile with its name containing limitOfParallelRequestsAt and the service name.'
      content:
        application/json:
          schema:
            type: object
            required:
              - code
              - message
              - expectation-to-the-client
            properties:
              code:
                type: integer
                format: int32
              message:
                type: string
                enum:
                  - 'The maximum number of requests that can be handled by this service in parallel has been reached'
              expectation-to-the-client:
                type: string
                enum:
                  - 'Please try again later'
```
