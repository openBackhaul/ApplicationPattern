# Up-to-date Fake IP Addresses  

The following fake TCP/IP addresses have to be used in public documentation and specifications to establish a homogeneous system of unique addresses that can be replaced by actual values during later automated processing.  

| Cathegory | Abbr. | Component | Release | IP_1* | TCP_1* | IP_2** | TCP_2** |
|---|---|---|---|---|---|---|---|
| Controller |  |  |  |  |  |  |  |
|  | ODL | OpenDayLight | 4.0.2 | 1.1.1.1 | 1001
| Mediator |  |  |  |  |  |
|  | xMIM | xMediatorInstanceManager | 1.0.0 | 1.1.2.1 | 2001
|  | EMIM | EricssonMediatorInstanceManager | 1.0.0 | 1.1.2.2 | 2002
|  | HMIM | HuaweiMediatorInstanceManager | 1.0.0 | 1.1.2.3 | 2003
|  | SMIM | SiaeMediatorInstanceManager | 1.0.0 | 1.1.2.4 | 2004
|  | ZMIM | ZteMediatorInstanceManager | 1.0.0 | 1.1.2.5 | 2005
| TinyApplicationController |  |  |  |  |  |
|  | RSR | RequestSequenceRepresentation | 1.0.0 | 1.1.3.16 | 3016 | 1.2.3.16 | 3216
|  | RO | RegistryOffice | 2.0.2 | 1.1.3.17 | 3017
|  | TAR | TypeApprovalRegister | 2.0.2 | 1.1.3.18 | 3018
|  | EaTL | ExecutionAndTraceLog | 2.0.2 | 1.1.3.19 | 3019
|  | OL | OamLog | 2.0.2 | 1.1.3.20 | 3020
|  | AA | AdministratorAdministration | 2.0.2 | 1.1.3.21 | 3021
|  | ALT | ApplicationLayerTopology | 2.0.2 | 1.1.3.22 | 3022
|  | OKM | OperationKeyManagement | 2.0.2 | 1.1.3.23 | 3023
| DataBases |  |  |  |  |  |
|  | ES | ElasticSearch | 1.0.0 | 1.1.3.15 | 3015
| Application |  |  |  |  |  |
|  | CC | CurrentController | 1.0.0 | 1.1.4.1 | 4001 | 1.2.4.1 | 4201
|  | RESO | Resolver | 1.0.0 | 1.1.4.2 | 4002 | 1.2.4.2 | 4202
|  | A2LT | Accessport2LtpTranslator  | 1.0.0 | 1.1.4.3 | 4003 | 1.2.4.3 | 4203
|  | MWDI | MicroWaveDeviceInventory  | 1.0.1 | 1.1.4.4 | 4004 |   |  
|  | MATR | MacAddressTableRecorder | 1.0.0 | 1.1.4.5 | 4005 | 1.2.4.5 | 4205
|  | MM | MediatorManager | 1.0.0 | 1.1.4.6 | 4006 | 1.2.4.6 | 4206
|  | AIPS | AirInterfacePowerSaver  | 0.0.5 | 1.1.4.7 | 4007 | 1.2.4.7 | 4207
|  | L2LT | Linkid2LtpTranslator | 1.0.0 | 1.1.4.8 | 4008 | 1.2.4.8 | 4208
|  | ALAP | AutomatedLinkAcceptanceProxy | 1.0.0 | 1.1.4.9 | 4009 | 1.2.4.9 | 4209
|  | MO | MountingOrchestrator | 1.0.0 | 1.1.4.10 | 4010 | 1.2.4.10 | 4210
|  | NP | NotificationProxy | 1.0.1 | 1.1.4.11 | 4011 | 1.2.4.11 | 4211
|  | MB | MycomButler | 1.0.0 | 1.1.4.12 | 4012 | 1.2.4.12 | 4212
|  | HMWDI | HistoricalMicroWaveDeviceInventory | 1.0.0 | 1.1.4.13 | 4013 | 1.2.4.13 | 4213
|  | MWDG | MicroWaveDeviceGatekeeper | 1.0.0 | 1.1.4.14 | 4014 | 1.2.4.14 | 4214

\*) IP_1 + TCP_1 = address from **within** the GCP VPC (HTTP).  
\*\*) IP_2 + TCP_2 = address from **outside** the GCP VPC (HTTP**S**).

# Historical Fake IP Addresses  

The following fake TCP/IP addresses have no longer to be used while writing new specifications.

| Cathegory | Abbr. | Component | Release | IP_1* | TCP_1* | IP_2** | TCP_2** |
|---|---|---|---|---|---|---|---|
| TAC |  |  |  |  |  |
|  | RO | RegistryOffice | 1.0.0 | 1.1.3.1 | 3001
|  | TAR | TypeApprovalRegister | 1.0.0 | 1.1.3.2 | 3002
|  | EaTL | ExecutionAndTraceLog | 1.0.0 | 1.1.3.3 | 3003
|  | OL | OamLog | 1.0.0 | 1.1.3.4 | 3004
|  | AA | AdministratorAdministration | 1.0.0 | 1.1.3.5 | 3005
|  | ALT | ApplicationLayerTopology | 1.0.0 | 1.1.3.6 | 3006
|  | OKM | OperationKeyManagement | 1.0.0 | 1.1.3.7 | 3007
|  | RO | RegistryOffice | 2.0.0 | 1.1.3.8 | 3008 | 1.2.3.8 | 3208
|  | TAR | TypeApprovalRegister | 2.0.0 | 1.1.3.9 | 3009 | 1.2.3.9 | 3209
|  | EaTL | ExecutionAndTraceLog | 2.0.0 | 1.1.3.10 | 3010 | 1.2.3.10 | 3210
|  | OL | OamLog | 2.0.0 | 1.1.3.11 | 3011 | 1.2.3.11 | 3211
|  | AA | AdministratorAdministration | 2.0.0 | 1.1.3.12 | 3012 | 1.2.3.12 | 3212
|  | ALT | ApplicationLayerTopology | 2.0.0 | 1.1.3.13 | 3013 | 1.2.3.13 | 3213
|  | OKM | OperationKeyManagement | 2.0.0 | 1.1.3.14 | 3014 | 1.2.3.14 | 3214
