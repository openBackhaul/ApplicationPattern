# Up-to-date Fake Addresses  

The following fake TCP/IP addresses have to be used in public documentation and specifications to establish a homogeneous system of unique addresses that can be replaced by actual values during later automated processing.  

UPDATE on 2nd of October 2023:  
The following rules have changed:  
- As the automation script is chosing the IP address based on ApplicationName and ReleaseNumber, it is no longer necessary to have individual fake IP addresses. The local host IP address shall be used as a default instead.  
- The idea of addressing diverse applications from outside the GCP VPC has been replaced by the concept of using Proxies. It is no longer required to administrate a separate IP address for HTTPS connections.  

Both changes shall be applied on applications that did not yet reach milestone v1.0.0_spec.  

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
|  | RO | RegistryOffice | 2.0.0 | 1.1.3.8 | 3008 | 1.2.3.8 | 3208
|  | TAR | TypeApprovalRegister | 2.0.0 | 1.1.3.9 | 3009 | 1.2.3.9 | 3209
|  | EaTL | ExecutionAndTraceLog | 2.0.0 | 1.1.3.10 | 3010 | 1.2.3.10 | 3210
|  | OL | OamLog | 2.0.0 | 1.1.3.11 | 3011 | 1.2.3.11 | 3211
|  | AA | AdministratorAdministration | 2.0.0 | 1.1.3.12 | 3012 | 1.2.3.12 | 3212
|  | ALT | ApplicationLayerTopology | 2.0.0 | 1.1.3.13 | 3013 | 1.2.3.13 | 3213
|  | OKM | OperationKeyManagement | 2.0.0 | 1.1.3.14 | 3014 | 1.2.3.14 | 3214
|  | RSR | RequestSequenceRepresentation | 1.0.0 | 1.1.3.16 | 3016 | 1.2.3.16 | 3216
| DataBases |  |  |  |  |  |
|  | ES | ElasticSearch | 1.0.0 | 1.1.3.15 | 3015
| Application |  |  |  |  |  |
|  | CC | CurrentController | 1.0.0 | 127.0.0.1 | 4001 |  | 
|  | RESO | Resolver | 1.0.0 | 127.0.0.1 | 4002 |  | 
|  | A2LT | Accessport2LtpTranslator  | 1.0.0 | 127.0.0.1 | 4003 |  | 
|  | MWDI | MicroWaveDeviceInventory  | 1.0.0 | 1.1.4.4 | 4004 | 1.2.4.4 | 4204
|  | MATR | MacAddressTableRecorder | 1.0.0 | 1.1.4.5 | 4005 | 1.2.4.5 | 4205
|  | MM | MediatorManager | 1.0.0 | 127.0.0.1 | 4006 |  | 
|  | AIPS | AirInterfacePowerSaver  | 1.0.0 | 127.0.0.1 | 4007 |  | 
|  | L2LT | Linkid2LtpTranslator | 1.0.0 | 127.0.0.1 | 4008 |  | 
|  | ALAP | AutomatedLinkAcceptanceProxy | 1.0.0 | 1.1.4.9 | 4009 | 1.2.4.9 | 4209
|  | MO | MountingOrchestrator | 1.0.0 | 127.0.0.1 | 4010 |  | 
|  | NP | NotificationProxy | 1.0.0 | 1.1.4.11 | 4011 | 1.2.4.11 | 4211
|  | MB | MycomButler | 1.0.0 | 127.0.0.1 | 4012 |  | 
|  | HMWDI | HistoricalMicroWaveDeviceInventory | 1.0.0 | 127.0.0.1 | 4013 |  | 

\*) IP_1 + TCP_1 = address from **within** the GCP VPC (HTTP).  
\*\*) IP_2 + TCP_2 = address from **outside** the GCP VPC (HTTP**S**).

# Historical Fake IP Addresses  

The following fake TCP/IP addresses have no longer to be used while writing new specifications.

| Cathegory | Abbr. | Component | Release | IP | TCP |
|---|---|---|---|---|---|
| TAC |  |  |  |  |  |
|  | RO | RegistryOffice | 1.0.0 | 1.1.3.1 | 3001
|  | TAR | TypeApprovalRegister | 1.0.0 | 1.1.3.2 | 3002
|  | EaTL | ExecutionAndTraceLog | 1.0.0 | 1.1.3.3 | 3003
|  | OL | OamLog | 1.0.0 | 1.1.3.4 | 3004
|  | AA | AdministratorAdministration | 1.0.0 | 1.1.3.5 | 3005
|  | ALT | ApplicationLayerTopology | 1.0.0 | 1.1.3.6 | 3006
|  | OKM | OperationKeyManagement | 1.0.0 | 1.1.3.7 | 3007
