# Structure of the CONFIGfile

The structure of the CONFIGfile is harmonized across all microservices in the MW SDN application layer.  
Since it mainly involves information for describing traffic relationships, the same information model used for describing traffic relationships in the transport network is applied.  
Consequently, the REST servers composing the MW SDN application layer are exposing a management interface, which is almost 100% identical to the RESTCONF interface of the devices that are managed by them.  
That essentially makes the applications for managing applications a miniature version of those required for managing devices.  

The CONFIGfile is structured into objects according to the [ONF Core Information Model](https://github.com/openBackhaul/ApplicationPattern/blob/develop/doc/ElementsApplicationPattern/InformationModel/Overview/Overview.md).  

The objects that are created from the classes defined in the ONF CIM shall have the following ordering in the CONFIGfile. 
```
{
  "core-model-1-4:control-construct": {
    "uuid": "xx-1-0-0",
    "profile-collection": {
      "profile": [
        {
          "uuid": "xx-1-0-0-action-p-000",
          "profile-name": "action-profile-1-0:PROFILE_NAME_TYPE_ACTION_PROFILE",
          "action-profile-1-0:action-profile-pac": {
            ...
          }
        }
      ]
    },
    "logical-termination-point": [
      {
        "uuid": "xx-1-0-0-op-s-bm-000",
        "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
        "client-ltp": [
        ],
        "server-ltp": [
          "xx-1-0-0-http-s-000"
        ],
        "layer-protocol": [
          {
            "local-id": "0",
            "layer-protocol-name": "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
            "operation-server-interface-1-0:operation-server-interface-pac": {
              ...
            }
          }
        ]
      }
    ],
    "forwarding-domain": [
      {
        "uuid": "xx-1-0-0-op-fd-000",
        "forwarding-construct": [
          {
            "uuid": "xx-1-0-0-op-fc-bm-000",
            "name": [
              {
                "value-name": "ForwardingKind",
                "value": "core-model-1-4:FORWARDING_KIND_TYPE_INVARIANT_PROCESS_SNIPPET"
              },
              {
                "value-name": "ForwardingName",
                "value": "PromptForRegisteringCausesRegistrationRequest"
              }
            ],
            "fc-port": [
              {
                "local-id": "000",
                "port-direction": "core-model-1-4:PORT_DIRECTION_TYPE_MANAGEMENT",
                "logical-termination-point": "xx-1-0-0-op-s-bm-000"
              }
            ]
          }
        ]
      }
    ]
  }
}
```
The entries into the lists shall be ordered according to the respective high level specification:  
- Profiles: _ProfileInstanceList_  
- LogicalTerminationPoints: _ServiceList_  
- ForwardingConstructs: _ForwardingList_  

The ForwardingConstructPorts shall be ordered in Management, Input and Output.  
