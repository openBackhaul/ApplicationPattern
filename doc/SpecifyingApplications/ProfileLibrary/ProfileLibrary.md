# Library of already existing Profile definitions

The following Profiles have already been used inside existing applications.

**IntegerProfile**
The IntegerProfile is for storing a single Integer value.  
It has been used for several times in multiple applications.  
E.g. it is holding the configuration of the number of records to be stored in the ExecutionAndTraceLog application.  
Definition:
```YAML
- profile-name: string
  uuid: string
  integer-name: string
  unit: string
  minimum: integer
  maximum: integer
  configured-value: integer
```
Example:
```YAML
- profile-name: IntegerProfile
  uuid: eatl-1-0-0-integer-p-1000
  integer-name: maximumNumberOfEntries
  unit: records
  minimum: 0
  maximum: 9999
  configured-value: 8
```

**StringProfile**
The StringProfile is for storing a single String value.  
It has been used in multiple applications.  
E.g. it is holding the operational mode of the OperationKeyManagement application.  
Definition:
```YAML
- profile-name: string
  uuid: string
  string-name: string
  configured-value: string
```
Example:
```YAML
- profile-name: StringProfile
  uuid: okm-1-0-0-string-p-1000
  string-name: operationMode
  configured-value: sanitation
```

**ActionProfile**  
The ActionProfile is the by far most often used Profile.  
It is describing the label of a button that shall be shown in a generic presentation and the request, which is to be sent, in case the button has been pushed.  
It has been used for several times in all existing applications.  
Definition:
```YAML
  - profile-name: string
    uuid: string
    operation-name: string
    label: string
    request: string
    display-in-new-browser-window: Boolean
```
Example:
```YAML
  - profile-name: ActionProfile
    uuid: ap-1-0-0-action-p-1000
    operation-name: /v1/start-application-in-generic-representation
    label: Inform about Application
    request: https://[/core-model-1-4:control-construct/logical-termination-point=*-0-0-1-tcp-s-0000/layer-protocol=0/tcp-server-interface-1-0:tcp-server-interface-pac/tcp-server-interface-configuration/local-address/ipv-4-address]:[/core-model-1-4:control-construct/logical-termination-point=*-0-0-1-tcp-s-0000/layer-protocol=0/tcp-server-interface-1-0:tcp-server-interface-pac/tcp-server-interface-configuration/local-port][/core-model-1-4:control-construct/logical-termination-point=*-0-0-1-op-s-2002/layer-protocol=0/operation-server-interface-1-0:operation-server-interface-pac/operation-server-interface-capability/operation-name]
    display-in-new-browser-window: false
```
