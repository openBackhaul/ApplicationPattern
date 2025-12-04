# p1DiscardIrrelevantPmRecords

### Overview  

The p1DiscardIrrelevantPmRecords function receives a list of historical performance data records as input.  
It iterates over this list and discards all irrelevant records. The list with the remaining records is returned as output.
Records are considered irrelevant, if:
- their granularityPeriod does not match the pattern in from function parameter `historicalPmDataGranularitiesToBeKept`,
- or if their periodEndTime is not newer than the filter timestamp

**Inputs:**  
Required inputs are:
- historicalPmDataList: contains the records to be filtered
- parameters:
  - `historicalPmDataGranularitiesToBeKept`: denotes the granularities for which records may be relevant

Optional inputs are:
- *mostRecentPeriodEndTime*: if 15min records are denoted as relevant, they shall be filtered using this timestamp
- *mostRecentPeriodEndTime24*: if 24min records are denoted as relevant, they shall be filtered using this timestamp

**Processing:**  
The function iterates over all records in the historicalPmDataList and discards them, if:
- the are irrelevant according to `historicalPmDataGranularitiesToBeKept`
- or else if they are relevant in general, but are not newer than the timestamp filter (*mostPeriodEndTime/mostPeriodEndTime24*)
  - if for the respective granularity no timestamp filter is provided as input, all records for that granularity are treated as newer (i.e. not discarded)

Note that, filtering is independent from the provided interface type (e.g. AirInterfaces and EthernetContainers are treated the same), as the filtering
is only applied on the complete PM record, not on attribute level.  
Also note that the function does not receive or return a reference to the input/output data, but actual data objects.  


### Diagram  

<p align="center">
  <img src="./p1DiscardIrrelevantPmRecords.png" alt="p1DiscardIrrelevantPmRecords diagram" width="400" />
</p>


### Interface  

Please find a detailed description of the [interface](./interface.yaml).  


### NPM Module  

[mw-sdn-p1DiscardIrrelevantPmRecords](https://www.npmjs.com/package/mw-sdn-p1DiscardIrrelevantPmRecords)  


### Parameters  

The p1DiscardIrrelevantPmRecords requires the following parameters:  

- Granularities for which data records shall be kept in general
  - they may still be filtered depending on the mostRecentPeriodEndTime input attributes


historicalPmDataGranularitiesToBeKept:
- example pattern for keeping 15min and 24h records
- *callerName* is to be replaced with the service/function calling it the actual application where the function is used 

```
  - profile-name: 'StringProfile'
    uuid: 'xxx-x-x-x-string-p-???'
    capability:
      string-name: 'callerName.historicalPmDataGranularitiesToBeKept'
      purpose: 'Only keep historical PM records, where granularity period matches the pattern'
      pattern: '^[^:]+:GRANULARITY_PERIOD_TYPE_PERIOD-(?:15-MIN|24-HOURS)$'
    configuration:
      string-value: ''

```
