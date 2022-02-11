# Servers at OperationKeyManagement

### Operation Servers

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|o|b| op-s-0000 | /v1/register-yourself
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
|||||
|s|i| op-s-3001 | /v1/regard-application                                     |
|s|i| op-s-3002 | /v1/disregard-application                                  |
|s|i| op-s-3003 | /v1/list-applications                                      |
|s|i| op-s-3004 | /v1/regard-updated-link                                    |

### HTTP Server

| UUID        | Application Name         | Release Number                    |
| ----------- | ------------------------ | --------------------------------- |
| http-s-0000 | OperationKeyManagement   | 0.0.1                             |

### TCP Server

| UUID       | Own IP Address  | Own TCP Port                                |
| ---------- | ----------------| ------------------------------------------- |
| tcp-s-0000 | 10.118.125.157  | 1006                                        |



# Clients at OperationKeyManagement

## OldRelease

### Operation Clients

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|o|b| op-c-0000 | /v1/bequeath-your-data-and-die                             |

### HTTP Client

| UUID        | Application Name         | Release Number                    |
| ----------- | ------------------------ | --------------------------------- |
| http-c-0000 | OldRelease               | 0.0.1                             |

### TCP Client

| UUID       | IP Address      | TCP Port                                    |
| ---------- | ----------------| ------------------------------------------- |
| tcp-c-0000 | 10.118.125.157  | 1006                                        |


## NewRelease

### Operation Clients

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|o|i| op-c-1010 | /v1/regard-application                                     |

### HTTP Client

| UUID        | Application Name         | Release Number                    |
| ----------- | ------------------------ | --------------------------------- |
| http-c-0010 | NewRelease               | 0.0.2                             |

### TCP Client

| UUID       | IP Address      | TCP Port                                    |
| ---------- | ----------------| ------------------------------------------- |
| tcp-c-0010 | 10.118.125.157  | 7006                                        |


## RegistryOffice

### Operation Clients

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|o|b| op-c-0020 | /v1/register-application                                   |
|o|b| op-c-0021 | /v1/relay-server-replacement                               |
|o|b| op-c-0022 | /v1/deregister-application                                 |
|o|b| op-c-0023 | /v1/relay-operation-update                                 |
|||||
|s|b| op-c-2020 | /v1/update-operation-key                                   |
|||||
|s|i| op-c-3020 | /v1/notify-approvals                                       |
|s|i| op-c-3021 | /v1/notify-withdrawn-approvals                             |
|s|i| op-c-3022 | /v1/end-subscription                                       |

### HTTP Client

| UUID        | Application Name         | Release Number                    |
| ----------- | ------------------------ | --------------------------------- |
| http-c-0020 | RegistryOffice           | 0.0.1                             |

### TCP Client

| UUID       | IP Address      | TCP Port                                    |
| ---------- | ----------------| ------------------------------------------- |
| tcp-c-0020 | 10.118.125.157  | 1000                                        |


## TypeApprovalRegister

### Operation Clients

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|s|b| op-c-2030 | /v1/update-operation-key                                   |

### HTTP Client

| UUID        | Application Name         | Release Number                    |
| ----------- | ------------------------ | --------------------------------- |
| http-c-2030 | TypeApprovalRegister     | 0.0.1                             |

### TCP Client

| UUID       | IP Address      | TCP Port                                    |
| ---------- | ----------------| ------------------------------------------- |
| tcp-c-2030 | 10.118.125.157  | 1001                                        |


## ExecutionAndTraceLog

### Operation Clients

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|o|b| op-c-0040 | /v1/record-service-request                                 |
|||||
|s|b| op-c-2040 | /v1/update-operation-key                                   |

### HTTP Client

| UUID        | Application Name         | Release Number                    |
| ----------- | ------------------------ | --------------------------------- |
| http-c-0040 | ExecutionAndTraceLog     | 0.0.1                             |

### TCP Client

| UUID       | IP Address      | TCP Port                                    |
| ---------- | ----------------| ------------------------------------------- |
| tcp-c-0040 | 10.118.125.157  | 1002                                        |


## OamLog

### Operation Clients

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|o|b| op-c-0050 | /v1/record-oam-request                                     |
|||||
|s|b| op-c-2050 | /v1/update-operation-key                                   |

### HTTP Client

| UUID        | Application Name         | Release Number                    |
| ----------- | ------------------------ | --------------------------------- |
| http-c-0050 | OamLog                   | 0.0.1                             |

### TCP Client

| UUID       | IP Address      | TCP Port                                    |
| ---------- | ----------------| ------------------------------------------- |
| tcp-c-0050 | 10.118.125.157  | 1003                                        |


## AdministratorAdministration

### Operation Clients

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|o|b| op-c-0060 | /v1/approve-oam-request                                    |
|||||
|s|b| op-c-2060 | /v1/update-operation-key                                   |

### HTTP Client

| UUID        | Application Name         | Release Number                    |
| ----------- | ------------------------ | --------------------------------- |
| http-c-0060 | AdministratorAdministration | 0.0.1                          |

### TCP Client

| UUID       | IP Address      | TCP Port                                    |
| ---------- | ----------------| ------------------------------------------- |
| tcp-c-0060 | 10.118.125.157  | 1004                                        |


## ApplicationLayerTopology

### Operation Clients

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|o|b| op-c-0070 | /v1/update-all-ltps-and-fcs                                |
|o|b| op-c-0071 | /v1/update-ltp                                             |
|o|b| op-c-0072 | /v1/delete-ltp-and-dependents                              |
|o|b| op-c-0073 | /v1/update-fc                                              |
|o|b| op-c-0074 | /v1/update-fc-port                                         |
|o|b| op-c-0075 | /v1/delete-fc-port                                         |
|||||
|s|b| op-c-2070 | /v1/update-operation-key                                   |
|||||
|s|i| op-c-3070 | /v1/notify-link-updates                                    |
|s|i| op-c-3071 | /v1/end-subscription                                       |
|s|i| op-c-3072 | /v1/list-link-uuids                                        |
|s|i| op-c-3073 | /v1/list-end-points-of-link                                |
|s|i| op-c-3074 | /v1/provide-current-operation-key                          |

### HTTP Client

| UUID        | Application Name         | Release Number                    |
| ----------- | ------------------------ | --------------------------------- |
| http-c-0070 | ApplicationLayerTopology | 0.0.1                             |

### TCP Client

| UUID       | IP Address      | TCP Port                                    |
| ---------- | ----------------| ------------------------------------------- |
| tcp-c-0070 | 10.118.125.157  | 1005                                        |


## OperationKeyManagement

### Operation Clients

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|s|b| op-c-2080 | /v1/update-operation-key                                   |

### HTTP Client

| UUID        | Application Name         | Release Number                    |
| ----------- | ------------------------ | --------------------------------- |
| http-c-2080 | OperationKeyManagement   | 0.0.1                             |

### TCP Client

| UUID       | IP Address      | TCP Port                                    |
| ---------- | ----------------| ------------------------------------------- |
| tcp-c-2080 | 10.118.125.157  | 1006                                        |


## CurrentController

### Operation Clients

| | | UUID      | Operation Server Name                                      |
|-|-| --------- | ---------------------------------------------------------- |
|s|b| op-c-2300 | /v1/update-operation-key                                   |

### HTTP Client

| UUID        | Application Name         | Release Number                    |
| ----------- | ------------------------ | --------------------------------- |
| http-c-2300 | CurrentController        | 0.0.6                             |

### TCP Client

| UUID       | IP Address      | TCP Port                                    |
| ---------- | ----------------| ------------------------------------------- |
| tcp-c-2300 | 10.118.125.157  | 2000                                        |



# Profiles

### StringProfile

| UUID       | Attribute Name      | Values                                    |
| ---------- | ----------------| ------------------------------------------- |
| string-p-0000 | operationMode | Reactive, Sanitation, Protection, Off                                        |


