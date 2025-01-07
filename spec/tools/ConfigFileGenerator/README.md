
The script will generate configuration file from the high-level services, forwardings, profiles files.

# For complete automation :
To completely automate the process , its good to complement the services file as mentioned below

## services.yaml :
### http-server :
To include the following attribtues to the configuration file, the same shall be included in the high level services file,
```
    application-purpose
    owner-name
    owner-email-address
    release-list
```
Example :
```
  http-server:
    own-application-name: MediatorManager
    own-release-number: 1.0.0
    uuid: mm-1-0-0-http-s-000
    application-purpose: Preparing the connection between device and mediator/controller
    owner-name: Andreas Haack
    owner-email-address: Andreas.Haack@telefonica.com
    release-list:
      - release-number: 1.0.0
        release-date: 12.12.2024
        changes: Initial version
```

### operation-server :
Incase if the operation-key is not the default operation-key , include an optional attribute called "operation-key"
Example :
```
  - operation-name: /v1/inform-about-release-history
    uuid: mm-1-0-0-op-s-bs-003
    operation-key: n.a.
```

### operation-client :
For EATL application's operation-client , to automate the detailed-logging-is-on attribute, include an optional attribute called "detailed-logging-is-on"
Example :
```
  - operation-name: /v1/record-service-request
    uuid: mm-1-0-0-op-c-bs-eatl-2-0-1-000
    detailed-logging-is-on: false
```
## profileInstances.yaml :
In the profiles, need to include the following to the 'ActionProfile' capability
      input-value-list: []
Example :
```
capability:
      operation-name: '/v1/start-application-in-generic-representation'
      label: 'Inform about Application'
      display-in-new-browser-window: false
      input-value-list: []
```


# How to Run

1. Include services, forwardings, profileInstances to the corresponding named .yaml files in the folder named "input"
2. Modify the base uuid of the application in the index.js 
```
let applicationUuid = "mm-1-0-0";
```
3. npm install
4. node .\index.js
5. configuration file will be generated in the output folder.

