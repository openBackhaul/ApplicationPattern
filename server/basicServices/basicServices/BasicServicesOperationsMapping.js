module.exports.basicServicesOperationsMapping =
{
    "/v1/register-yourself":
    {
        "registration-operation": {
            "api-segment": "bm",
            "sequence": "000"
        }
    },
    "/v1/embed-yourself":
    {
        "relay-server-replacement-operation": {
            "api-segment": "bm",
            "sequence": "001"
        },
        "deregistration-operation": {
            "api-segment": "bm",
            "sequence": "002"
        },
        "relay-operation-update-operation": {
            "api-segment": "bm",
            "sequence": "003"
        }
    },
    "/v1/redirect-service-request-information": {
        "service-log-operation": {
            "api-segment": "bs",
            "sequence": "000"
        }
    },
    "/v1/redirect-oam-request-information": {
        "oam-log-operation": {
            "api-segment": "bs",
            "sequence": "000"
        }
    },
    "/v1/inquire-oam-request-approvals":
    {
        "oam-approval-operation": {
            "api-segment": "bs",
            "sequence": "000"
        }
    },
    "/v1/redirect-topology-change-information": {
        "topology-operation-application-update": {
            "api-segment": "bm",
            "sequence": "000"
        },
        "topology-operation-ltp-update": {
            "api-segment": "bm",
            "sequence": "001"
        },
        "topology-operation-ltp-deletion": {
            "api-segment": "bm",
            "sequence": "002"
        },
        "topology-operation-fc-update": {
            "api-segment": "bm",
            "sequence": "003"
        },
        "topology-operation-fc-port-update": {
            "api-segment": "bm",
            "sequence": "004"
        },
        "topology-operation-fc-port-deletion": {
            "api-segment": "bm",
            "sequence": "005"
        }
    }
}