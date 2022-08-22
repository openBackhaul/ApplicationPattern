## Integrate Authorization

The following modifications needs to be done in the `index.js` file , 

* import the AppCommons from onf-core-model-ap/applicationPattern/commons/ module , 
  ```
  var appCommons = require('onf-core-model-ap/applicationPattern/commons/AppCommons');
  ```
* In the swaggerRouter configuration , include a openApiValidator in the options that points to the `appCommons.openApiValidatorOptions` , 
  ```
  var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
    openApiValidator: appCommons.openApiValidatorOptions
    };
  ```
