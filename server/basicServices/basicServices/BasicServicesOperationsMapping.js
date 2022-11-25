module.exports.basicServicesOperationsMapping =
{
    "/v1/register-yourself":
    {
        "registration-operation": {
            "forwarding-domain": "PromptForRegisteringCausesRegistrationRequest"
        }
    },
    "/v1/embed-yourself":
    {
        "relay-server-replacement-operation": {
            "forwarding-domain": "PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement"
        },
        "deregistration-operation": {
            "forwarding-domain": "PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease"
        },
        "relay-operation-update-operation": {
            "forwarding-domain": "PromptingNewReleaseForUpdatingServerCausesRequestForBroadcastingInfoAboutBackwardCompatibleUpdateOfOperation"
        }
    },
    "/v1/redirect-service-request-information": {
        "service-log-operation": {
            "forwarding-domain": "ServiceRequestCausesLoggingRequest"
        }
    },
    "/v1/redirect-oam-request-information": {
        "oam-log-operation": {
            "forwarding-domain": "OamRequestCausesLoggingRequest"
        }
    },
    "/v1/inquire-oam-request-approvals":
    {
        "oam-approval-operation": {
            "forwarding-domain": "OamRequestCausesInquiryForAuthentication"
        }
    },
    "/v1/redirect-topology-change-information": {
        "topology-operation-application-update": {
            "forwarding-domain": "PromptForRedirectingTopologyInformationCausesSendingAnInitialStateToALT"
        },
        "topology-operation-ltp-update": {
            "forwarding-domain": "ServiceRequestCausesLtpUpdateRequest"
        },
        "topology-operation-ltp-deletion": {
            "forwarding-domain": "ServiceRequestCausesLtpDeletionRequest"
        },
        "topology-operation-fc-update": {
            "forwarding-domain": "ServiceRequestCausesFcUpdateRequest"
        },
        "topology-operation-fc-port-update": {
            "forwarding-domain": "ServiceRequestCausesFcPortUpdateRequest"
        },
        "topology-operation-fc-port-deletion": {
            "forwarding-domain": "ServiceRequestCausesFcPortDeletionRequest"
        }
    }
}