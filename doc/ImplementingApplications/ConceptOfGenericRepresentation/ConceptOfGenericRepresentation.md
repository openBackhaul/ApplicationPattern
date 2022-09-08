## Generic Representation Services

* If an API consists of the prefix `-generic-representation` , then along with the response of the request , it provides a list of consequent actions that can be performed after this request.
* These services are designed to be used by a GUI app called Generic representation GUI through which all applications and their informative services can be accessed. 
* The response for such generic-representation consists of two objects , 
  * **response-value-list** : provides response for the current request. Each object in this list consists of the following fields , 
    * field-name : holds an attribute
    * value : holds value of the attribute in “field-name”
    * datatype : holds the datatype of the value
  * **consequent-action-list** : Provides a list of consequent action. Each object in this list consists of the following fields , 
    * label : Label provides the text that needs to be print in the button 
    * request : Request that shall be called, when button gets pressed. This consists of a complete url of the next request.
    * display-in-new-browser-window : True in case Request shall be represented in a new browser window


