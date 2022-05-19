## Integrating application pattern generic modules 

We have a npm package "onf-core-model-ap" specifically designed to interact with the load file and execute the concepts specific to ONF CoreModel. 

This package offers functionalities, 
1.	To read and configure the resources in the load file
2.	To **instantiate/modify/delete** LTPs based on the requirement
3.	To **instantiate/modify/delete** FcPorts 
4.	To automate forwardings between applications by formulating proper REST request as per the application pattern guidelines

To integrate the application pattern package , include the following dependency to the packages.json, 

```
"dependencies" :
    {    
    "onf-core-model-ap": "0.0.9"
    }
```