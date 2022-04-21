## Integrating Load file

After generating the stub , as a first step , we can integrate the load file to the code base. 

To do so , 
- Create a folder named “database” in the location where the services and controllers folders are there.
- Create a file named "load.json"
- Copy the load file to this folder.
- In the index.js , include the following lines at the end of the file , 
  ```
  global.databasePath = './database/load.json'
  
  ```


  
[<- Back to Stub Generation](StubGeneration.md)  - - - [Up to Integrating basic services](IntegratingBasicServices.md)


