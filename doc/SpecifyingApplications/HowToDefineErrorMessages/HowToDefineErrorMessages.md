# How to define Error Messages

Error responses should be meaningful and helpful for handling the errors.
It should not only inform about a problem, but also assist in dealing with it.
Ideally, an error message provides a machine- and human-readable recommendation for the next step to be taken (e.g. as part of an automation).

How to define error responses in the OAS:
1. **List possible reasons** why the requested data cannot be provided or the requested service cannot be performed.
2. **Reasons for failure** should be **grouped into** different **expected behaviors of the client**
    - e.g., *"try again later"*, *"make sure the device is mounted first"*.
3. **Groups of failures** with the **same expected client behavior** should be **associated with a response code** 
    - according to https://developer.mozilla.org/en-US/docs/Web/HTTP/Status.
    - If an appropriate response code could not be found in this public list, check the list of internally defined response codes down below. If successfull, copy/paste the required response code without changes into the common components section of your specification.
    - If an appropriate response code could also not be found there, define a new one and add it to the list below.  
4. If not already covered by the ApplicationPattern, **add** the **new responseCode to** the **responses of the affected service**.
5. The **response definition for a specific responseCode must be homogeneous** within the scope of the application.  
    - To ensure this, the response definition at an individual service should only reference a concrete definition in the common components section (`$ref: '#/components/responses/{responseCode}`).
6. The **concrete definition in** the **common components section** is **identified by the responseCode**.
7. It must begin with a **description statement**. 
    - The description statement is addressed to the implementor of the server (application under specification). 
    - It defines the conditions for sending a response with this code. 
    - Example: *"Response to be sent whenever the number of currently executed requests reaches the maximum defined in the instance of IntegerProfile whose name contains limitOfParallelRequestsAt and the service name."*
6. Some "standard" response codes from the list above define **additional headers or parameters**.
     - Such additional headers and parameters must also be included in the response definition in the common components, even if they are not used within the scope of this application.
7. If **additional attributes** are **required to manage the client's behavior**, they shall be **included in** the **body of the definitions** in the common components.
8. **code and message attributes shall always be supported**. 
     - They shall be available for the implementers to detail the reason of failure.
9. If an **additional attribute** would be required to pass a **predefined message**, that message shall be **defined as an enumeration** with only a single value.
10. If sending a **response implies** a **specific expectation to the client's behavior**, this expectation should be explicitly expressed by an **expectation-to-the-client attribute**. 
     - This attribute should be an **enumeration** with a single value. 
     - This value should contain a statement that is understood by both an automation implementer and a human user.

## List of internally defined response codes:
```
components:
  responses:
    '429':
      description: 'Response in case too many requests need to be executed in parallel or too many requests have been received within a time period. The maximum number of parallel requests is defined in an IntegerProfile with the service name as a prefix and MaxNumberOfParallelRequests as a suffix. Some time period to elapse for throttling incomming requests is defined in an IntegerProfile with the service name as a prefix and ThrottlingPeriod as a suffix'
      content:
        application/json:
          schema:
            type: object
            required:
              - code
              - message
            properties:
              code:
                type: integer
                minimum: 429
                maximum: 429
                format: int32
              message:
                type: string
                enum:
                  - 'Too many requests'
    '460':
      description: 'Response in case the mountName provided in the request is not found in the list of connected devices'
      content:
        application/json:
          schema:
            type: object
            required:
              - code
              - message
            properties:
              code:
                type: integer
                minimum: 460
                maximum: 460
                format: int32
              message:
                type: string
                enum:
                  - 'Not connected. Requested device is currently not in connected state at the controller'
    '470':
      description: 'Response in case the resource specified in the request does not exist within the connected device'
      content:
        application/json:
          schema:
            type: object
            required:
              - code
              - message
            properties:
              code:
                type: integer
                minimum: 470
                maximum: 470
                format: int32
              message:
                type: string
                enum:
                  - 'Resource not existing. Device informs about addressed resource unknown'
    '502':
      description: 'Response in case the server is acting as a gateway or proxy and received an invalid response from the upstream server (device or application providing a consumed service)'
      content:
        application/json:
          schema:
            type: object
            required:
              - code
              - message
            properties:
              code:
                type: integer
                minimum: 502
                maximum: 502
                format: int32
              message:
                type: string
                enum:
                  - 'Bad Gateway'
    '530':
      description: 'Response in case the referenced resource exists (e.g. device connected and resource exists in internal datatree), but response data is either not available, lost during transmission, incomplete or corrupted'
      content:
        application/json:
          schema:
            type: object
            required:
              - code
              - message
            properties:
              code:
                type: integer
                minimum: 530
                maximum: 530
                format: int32
              message:
                type: string
                enum:
                  - 'Data invalid. Response data not available, incomplete or corrupted'
    '531':
      description: 'Response in case the server is acting as a gateway or proxy and was unable to authenticate at the upstream server (device or application providing a consumed service)'
      content:
        application/json:
          schema:
            type: object
            required:
              - code
              - message
            properties:
              code:
                type: integer
                minimum: 531
                maximum: 531
                format: int32
              message:
                type: string
                enum:
                  - 'Bad Gateway. Authentication at upstream server failed.'
    '532':
      description: 'Response in case the server is acting as a gateway or proxy and was unable to connect to the upstream server (device or application providing a consumed service)'
      content:
        application/json:
          schema:
            type: object
            required:
              - code
              - message
            properties:
              code:
                type: integer
                minimum: 532
                maximum: 532
                format: int32
              message:
                type: string
                enum:
                  - 'Bad Gateway. Upstream server not responding.'

```
