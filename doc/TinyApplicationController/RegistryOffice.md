
# Sample Implementation of the Registry office

Registry office application is the entry point for all applications to get provisioned in the SDN application layer microservice architecture. This application provides functionality to register and deregister an application from the MS environment. Its main purpose it to create accurate records of the registered applications and forward it to appropriate tiny application controllers for further formalities.

## Individual Services

### [/v1/bequeath-your-data-and-die](./BequeathYourDataAndDie.md)

### [/v1/register-application](./RegisterApplication.md)

### [/v1/deregister-application](./DeregisterApplication.md)

### [/v1/regard-updated-approval-status](./RegardUpdatedApprovalStatus.md)

### [/v1/inquire-application-type-approvals](./InquireApplicationTypeApprovals.md)

### [/v1/notify-deregistrations](./NotifyDeregistrations.md)

### [/v1/notify-approvals](./NotifyApprovals.md)

### [/v1/notify-withdrawn-approvals](./NotifyWithdrawnApprovals.md)

### [/v1/relay-server-replacement](./RelayServerReplacement.md)

### [/v1/relay-operation-update](./RelayOperationUpdate.md)

### /v1/list-applications

### /v1/list-applications-in-generic-representation

### /v1/start-application-in-generic-representation