## Newman and Packages
### Newman packages and Newman reporter htmlextra package
### Concepts
* Overview
* Installation
    - Prerequisites
    - Install NPM
    - Install Node.js
    - Install newman
    - Install newmanreporter htmlextra
* Reference

#### Overview: 
Newman is a command-line collection runner for Postman. It allows us to run and test a Postman collection directly from the command-line. It is built with extensibility in mind so that can easily integrate it with continuous integration servers and build systems.

#### Installation :
The easiest way to install Newman is using NPM and to run newman need Node.js. As a prerequisites, check the NPM and Node.js >= v10 installed or not on servers.
##### Prerequisites:
##### Install NPM:
It is recommend to check before installing, if already have npm installed and check the installed version using the  "npm -v"/"npm --version".

If not installed, please follow the steps:

    "apt get update" for Ubuntu
    "apt install npm" for Ubuntu
    "dnf install npm" for redhat

##### Install Node.js:
It is recommend to check before installing, if already have Node.js installed and check the installed version, run "node -v".

If not installed, please follow the steps:
    
    "apt install nodejs" for Ubuntu
    "dnf module list nodejs" for redhat
    "dnf module info --profile nodejs"
    "dnf install nodejs"

##### Install newman & newman-reporter-htmlextra

It is recommend to check before installing, if already installed and check the installed version, run the "newman -v" which displays the current Newman version.
If not installed, please follow the steps:
    
    npm install -g newman
    npm install -g newman-reporter-htmlextra
                
-g flag useful when install newman globally on system which allows to run from anywhere. If you want to install it locally, Just remove the -g flag.

The newman run command allows you to specify a collection to be run. we can easily export Postman Collection as a json file from the Postman App and run it using Newman.

    $ newman run examples/sample-collection.json -d data.json

##### Basic options
newman -h, --help	Output usage information

newman -v, --version	Output the version number

Based on requirement, add the options to newman and run the collections.



References:

* [NodeJsinstallation on Redhat](https://linuxconfig.org/how-to-install-node-js-on-redhat-8-linux)

* [NPM installation](https://linuxconfig.org/how-to-install-npm-on-redhat-8)

* [NodeJs installation on ubuntu](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-20-04)

* [Newman installation](https://www.npmjs.com/package/newman)

* [Newman-reporter-htmlextra](https://www.npmjs.com/package/newman-reporter-htmlextra)

    