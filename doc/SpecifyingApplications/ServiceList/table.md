# ServiceList - OperationKeyManagement

## Server

### Operation Server Interface

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|o|b| op-s-0000 | /v1/register-yourself                                      |
|o|b| op-s-0001 | /v1/embed-yourself                                         |
|o|b| op-s-0002 | /v1/redirect-service-request-information                   |
|o|b| op-s-0003 | /v1/redirect-oam-request-information                       |
|o|b| op-s-0004 | /v1/end-subscription                                       |
|o|b| op-s-0005 | /v1/inquire-oam-request-approvals                          |
|o|b| op-s-0007 | /v1/update-client                                          |
|o|b| op-s-0008 | /v1/list-ltps-and-fcs                                      |
|o|b| op-s-0009 | /v1/redirect-topology-change-information                   |
|o|b| op-s-0010 | /v1/update-operation-key                                   |
|o|b| op-s-0011 | /v1/update-operation-client                                |
|||||
|o|i| op-s-1000 | /v1/bequeath-your-data-and-die                             |
|||||
|s|b| op-s-2001 | /v1/inform-about-application                               |
|s|b| op-s-2002 | /v1/inform-about-application-in-generic-representation     |
|s|b| op-s-2003 | /v1/inform-about-release-history                           |
|s|b| op-s-2004 | /v1/inform-about-release-history-in-generic-representation |
|||||
|s|i| op-s-3000 | /v1/start-application-in-generic-representation            |
|s|i| op-s-3001 | /v1/regard-application                                     |
|s|i| op-s-3002 | /v1/disregard-application                                  |
|s|i| op-s-3003 | /v1/list-applications                                      |
|s|i| op-s-3004 | /v1/regard-updated-link                                    |

### HTTP Server Interface

| UUID        | Application Name         | Release Number           |
| ----------- | ------------------------ | ------------------------ |
| http-s-0000 | OperationKeyManagement   | 0.0.1                    |

### TCP Server Interface

| UUID       | Own IP Address  | Own TCP Port  |
| ---------- | ----------------| ------------- |
| tcp-s-0000 | 10.118.125.157  | 1006          |

---
---
## Old Release

### Operation Client Interface

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|o|b| op-c-0000 | /v1/bequeath-your-data-and-die                             |

### HTTP Client Interface

| UUID        | Application Name         | Release Number           |
| ----------- | ------------------------ | ------------------------ |
| http-c-0000 | OldRelease               | 0.0.1                    |

### TCP Client Interface

| UUID       | IP Address      | TCP Port      |
| ---------- | ----------------| ------------- |
| tcp-c-0000 | 10.118.125.157  | 1006          |

---
---
## New Release

### Operation Client Interface

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|o|i| op-c-1010 | /v1/regard-application                                     |

### HTTP Client Interface

| UUID        | Application Name         | Release Number           |
| ----------- | ------------------------ | ------------------------ |
| http-c-0010 | NewRelease               | 0.0.2                    |

### TCP Client Interface

| UUID       | IP Address      | TCP Port      |
| ---------- | ----------------| ------------- |
| tcp-c-0010 | 10.118.125.157  | 7006          |


