## SDN Laboratory Overview

Currently, the application pattern is building an application layer on SDN controller using the microservice architecture where all the complex applications are spilt into small pieces and make them run independently. 

To deploy and test these applications, required two servers and one public repository as main requirement.

![NorthSouthController](./Images/sdncomponents.PNG)

* External GITHub
         
    *  The github repository which contains all the source code and automated testsuites related to all applications.  

* Appserver
    
    * Appserver will be used to clone and build the images from source code using docker framework.
    * Deploy the applications as containers with port, Once images are build on same server.
    * HA script also available on appserver which continuously monitor the applications.

* Test Server

     * Test server is used for testing the applications
     * Test server has all the complete automation set up with required tools includes jenkins as CI tool, newman, newman-reporter for running the test suites and reports generation.

To set up the complete laboratory for deployment and testing, we required [tools](../../../TestingApplications.md#tools) set up, changing IP's to actual server Ip using concept of [Fake Addresses](../../../TestingApplications.md#fake-addresses) as prerequisite.

**Note**: The laboratory components setup same for both testbed and GCP/Production environment.

[<- Back to Testing Applications](../../../TestingApplications.md)
