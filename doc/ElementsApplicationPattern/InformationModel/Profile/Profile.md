# ProfileCollection and Profile


### ProfileCollection

The ProfileCollection is referenced by the ControlConstruct.

In case of the applications of the MW SDN domain, it just holds the list of instances of Profile:  
- **profile**: List of instances of Profile.


### Profile

The Profile is a location for storing information that cannot directly be associated with an individual interface.  
The generic Profile class gets augmented with attributes that are specific to the individual kind of Profile.  
Inside devices, it is often used for comprehensive parameter settings that are applied on multiple interfaces.  

In case of the applications of the MW SDN domain, the Profile is often used for managing parameters that are required for configuring internal formulas, algorithms or processes.  

The following attributes are common to all kinds of Profile:  
- **uuid**: Identifier that is unique within the entire MW SDN application layer. Details can be found in [Structure of UUIDs](../../Names/StructureOfUuids/StructureOfUuids.md).  
- **profileName**: Discriminator of kinds of Profile. The ApplicationOwner is free to define new kinds of Profile. Kinds of Profile have to have unique names. Such name would have to be defined in the ProfileList already. It has to be put into a specific format to be represented in the attribute. The already existing kinds of Profile are identified by the following names:  
  - action-profile-1-0:PROFILE_NAME_TYPE_ACTION_PROFILE
  - response-profile-1-0:PROFILE_NAME_TYPE_GENERIC_RESPONSE_PROFILE
  - file-profile-1-0:PROFILE_NAME_TYPE_FILE_PROFILE
  - integer-profile-1-0:PROFILE_NAME_TYPE_INTEGER_PROFILE
  - string-profile-1-0:PROFILE_NAME_TYPE_STRING_PROFILE

Further attributes are individual to the kind of Profile.  
The individual attributes have to be filled with the values that have already been defined in the ProfileInstanceList.  
The order of instances should be identical in CONFIGfile and ProfileInstanceList.  
Details about their individual meaning can be found in [Creating a ProfileInstanceList](../../../SpecifyingApplications/CreatingProfileInstanceList/CreatingProfileInstanceList.md).  

In case of the **ActionProfile** the following attributes get augmented:
```
"action-profile-1-0:action-profile-pac": {
  "action-profile-capability": {
    "operation-name": "/v1/start-application-in-generic-representation",
    "label": "Inform about Application",
    "input-value-list": [
    ],
    "display-in-new-browser-window": false
  },
  "action-profile-configuration": {
    "consequent-operation-reference": "/core-model-1-4:control-construct/logical-termination-point=ro-2-0-1-op-s-bs-002/layer-protocol=0/operation-server-interface-1-0:operation-server-interface-pac/operation-server-interface-capability/operation-name"
  }
}
```

In case of the **ResponseProfile** the following attributes get augmented:
```
"response-profile-1-0:response-profile-pac": {
  "response-profile-capability": {
    "operation-name": "/v1/start-application-in-generic-representation",
    "field-name": {
      "static-field-name": "applicationName"
    },
    "description": "Own application name",
    "datatype": "string"
  },
  "response-profile-configuration": {
    "value": {
      "value-reference": "/core-model-1-4:control-construct/logical-termination-point=ro-2-0-1-http-s-000/layer-protocol=0/http-server-interface-1-0:http-server-interface-pac/http-server-interface-capability/application-name"
    }
  }
}
```

In case of the **FileProfile** the following attributes get augmented:
```
"file-profile-1-0:file-profile-pac": {
  "file-profile-capability": {
    "file-identifier": "LOADfile",
    "file-description": "Application name, release number and registration time stamp"
  },
  "file-profile-configuration": {
    "file-path": "../application-data/application-data.json",
    "user-name": "RegistryOffice",
    "password": "Operations to add password",
    "operation": "file-profile-1-0:OPERATION_TYPE_READ_WRITE"
  }
}
```

In case of the **IntegerProfile** the following attributes get augmented:
```
"integer-profile-1-0:integer-profile-pac": {
  "integer-profile-capability": {
    "integer-name": "waitTimeToApprove",
    "unit": "second",
    "minimum": 600,
    "maximum": 1209600
  },
  "integer-profile-configuration": {
    "integer-value": 259200
  }
}
```

In case of the **StringProfile** the following attributes get augmented:
```
"string-profile-1-0:string-profile-pac": {
  "string-profile-capability": {
    "string-name": "operationMode",
    "enumeration": [
      "string-profile-1-0:STRING_VALUE_TYPE_REACTIVE",
      "string-profile-1-0:STRING_VALUE_TYPE_PROTECTION",
      "string-profile-1-0:STRING_VALUE_TYPE_OFF"
    ]
  },
  "string-profile-configuration": {
    "string-value": "string-profile-1-0:STRING_VALUE_TYPE_OFF"
  }
}
```
