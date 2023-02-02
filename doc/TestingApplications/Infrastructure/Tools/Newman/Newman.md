## Newman packages and Newman reporter htmlextra package
### Newman Installation 
As prerequisites to install Nemman, check the npm and **Node.js >= v10** installed or not on servers.

### Prerequisites Installation
#### Install npm
It is recommend to check before installing, if already have npm installed and check installed version using the  "**npm -v"/"npm --version**".

If not installed, please follow below steps

* Update the index of packages on system
    
        "apt get update" for Ubuntu
        "dnf check-update" for redhat

* Install npm 

        "apt install npm" for Ubuntu
        "dnf install npm" for redhat

#### Install Node.js
It is recommend to check before installing, if already have Node.js installed and check the installed version, run "**node -v**".

If not installed, please follow the steps:
    
    "apt install nodejs" for Ubuntu
    "dnf install nodejs" for redhat

### Install newman and newman-reporter-htmlextra
It is recommend to check before installing, if already installed and check the installed version, run the "**newman -v**" which displays the current Newman version.
If not installed, please follow the steps:
    
    Newman: npm install -g newman
    Newman-reporter-htmlextra: npm install -g newman-reporter-htmlextra
                
-g flag useful when install newman globally on system which allows to run from anywhere. If you want to install it locally, Just remove -g flag.

#### Basic options and Usage

    newman -h, --help	Output usage information
    newman -v, --version	Output the version number

Based on requirement, add the options to newman and run the collections.

The newman run command allows to specify a collection to be run which can easily export as a json collection file from the Postman App and run it using Newman.

    $ newman run examples/sample-collection.json -d data.json

[<--Back to main Testing Applications](../../../TestingApplications.md)