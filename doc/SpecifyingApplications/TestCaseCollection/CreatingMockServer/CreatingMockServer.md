# Creating a Mock Server from the OAS

After AOS has been defined in VSCode.  

Open your local Postman installation.  
Change to workspace "MW_SDN_Applications".  
Click the _APIs_ folder at the very left of the Postman window.  
Click the "+" for creating a new API.  
Enter the official application name as a Name of the API definition.  
Enter a low version number like e.g. 0.0.1 (you will be able to adapt the version number at any time).  
Define Schema type to be "OpenAPI 3.0" and Schema format to be "YAML" and create the API.  
After the API has been created, click on the just created version.  
Click on "Definition".  
Click into the Postman editor, CTRL+a, delete all default content.  
Open your OAS in the VSCode editor, click into the editor, CTRL+a, CTRL+c.  
Change into the Postman editor, CTRL+v, CTRL+s.  

Click "Generate Collection".  
Name your collection according to your application's name.  
Click "API Mocking".  
Leave the rest of parameters as they are.  
Click "Generate Collection & Continue".  
Name your mock server according to your application's name.  
Leave the rest of parameters as they are.  

Click "Copy Mock URL".  
Open some editor and CTRL+v the Mock URL for later use.  
