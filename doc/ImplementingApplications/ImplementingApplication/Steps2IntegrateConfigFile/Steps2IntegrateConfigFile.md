## Integrating Load file

After generating the server-side stub , as a first step , we should integrate the CONFIGFile to the code base. 

To do so , 
- Create a directory named `database\` in the location where the services and controllers folders are there.
- Create a file named `load.json`
- From the CONFIGFile , Copy the content of `"core-model-1-4:control-construct"'
- In the `load.json` , 
  - include a flower bracket `{}`
  - paste the copied content of `"core-model-1-4:control-construct"` 
- In the index.js , include the following lines at the end of the file , 
  ```
  global.databasePath = './database/load.json'
  
  ```


  
[<- Back to Stub Generation](StubGeneration.md)  - - - [Up to Integrating basic services](IntegratingBasicServices.md)


