## Integrating Basic Services Package

The ApplicationLayer consists of 15 BasicServices which are generic across all the Microservices in the layer. 
This library provides implementation for all the 15 BasicServices.

To integrate the BasicServices package,

1.	Include the dependency to the package.json, 
```
"dependencies": {    
   "onf-core-model-ap-bs": "1.0.0"
  }
```
2.	After including this dependency , run `npm install` 
3. `npm install` will download the "onf-core-model-ap-bs" package from the npm repository
4. The downloaded packages will be available in the "node_modules/onf-core-model-ap-bs/`

 
[<- Back to Integrating load file](IntegratingLoadFile.md)   - - - [Up to How to model an Individual service](HowToModelAnIndividualService.md)
