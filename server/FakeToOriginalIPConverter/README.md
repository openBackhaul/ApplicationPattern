
This script needs to be executed , 
   - before generating a docker image for any application in the SDN ApplicationLayer
   - with proper information in the mapping file as per the test and prod environment

It updates the TcpClient/TcpServer address and port details based on the information provided in the input mapping file.

### STEP 1 : PREPARE MAPPING FILE

1. Refer the file https://github.com/openBackhaul/ApplicationPattern/blob/develop/doc/TestingApplications/Infrastructure/SdnLaboratory/FakeAddresses/IpAddresses.md
2. Create a .json file and update the details of application in the following format , 
```
{
    "fake-to-original-iP-mapping": [{
            "category": "TinyApplicationController",
            "abbreviation" : "RO",
            "component": "RegistryOffice",
            "release": "0.0.1",
            "fake-tcp-ip": "1.1.3.1",
            "fake-tcp-port": 3001,
            "original-tcp-ip": "127.0.0.1",
            "original-tcp-port": 3001
        },
        {
            "category": "TinyApplicationController",
            "abbreviation" : "TAR",
            "component": "TypeApprovalRegister",
            "release": "0.0.1",
            "fake-tcp-ip": "1.1.3.2",
            "fake-tcp-port": 3002,
            "original-tcp-ip": "127.0.0.1",
            "original-tcp-port": 3002
        }
]

```
3. Update the original-tcp-ip , original-tcp-port as per the environment planning

### STEP 2 : CONFIGURE CONFIGURATION FILE
1. Open the file input/config.json
2. Update the value of the attribute "target-oam-config-file-path" with the complete path of the server/database/load.json file
3. Update the value of the attribute "fake-to-original-iP-mapping-file-path" with the complete path of the input mapping file

### Step 3 : Run the application
#### Prerequisite : Please install nodejs and verify its successful installation.
```
sudo apt update
sudo apt install nodejs npm
nodejs --version
npm --version
```
1. Run the following command , 
`npm start`



