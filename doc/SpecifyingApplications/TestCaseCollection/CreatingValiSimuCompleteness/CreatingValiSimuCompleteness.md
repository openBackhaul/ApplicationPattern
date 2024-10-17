# Creating InterfaceValidator and InterfaceSimulator for Completeness

The InterfaceValidator for Completeness is the basic test case collection for testing the implementation of a harmonized modelling.  

After the UML file has been finalized, it gets published.  
While the UML file gets published, it gets a release number, date and time (e.g. WredProfile\_1.0.0-tsi.240104.1945.zip).  
This combination of values identifies all the documents that get derived from the agreed UML (e.g. WredTemplateProfile\_1.0.0-ts.240626.1430+yang).
Same applies on all files that are required for validation purposes.  

The following step-by-step guideline shall relate to a purely hypothetical XInterface\_1.0.0-ts.250102.1200.zip UML modelling.

##### Preparing the repository
1. Create an XInterface repository on github.com/openBackhaul  
2. Create a develop branch and configure it to be the default branch  
3. Change into the develop branch  
4. Save the following files into develop branch  
    - UML (XInterface\_1.0.0-ts.250102.1200.zip)  
    - GenDocExport (XInterface\_1.0.0-ts.250102.1200+gendoc.1.docx)  
    - class diagram (XInterface\_1.0.0-ts.250102.1200-overview.1.png)  
5. Create the following folders into develop branch
    - XInterface\_1.0.0-ts.250102.1200+schema  
    - XInterface\_1.0.0-ts.250102.1200+simu  
    - XInterface\_1.0.0-ts.250102.1200+vali  
    - XInterface\_1.0.0-ts.250102.1200+yang  
6. Save the YANG file (result of UML2YANG tool translation) into the XInterface\_1.0.0-ts.250102.1200+yang folder  

##### Preparing the Simulator folder
7. Save the raw OpenAPI specification (result of YANG to Swagger translation) into the XInterface\_1.0.0-ts.250102.1200+simu folder  
8. Rename it to XInterface\_1.0.0-ts.250102.1200+yang2oas.yaml  
9. Check XInterface\_1.0.0-ts.250102.1200+yang2oas.yaml for errors. If there would be errors in some irrelevant path, just delete it, so there is a file free from errors
10. Create the following files in the XInterface\_1.0.0-ts.250102.1200+simu folder
    - .gitignore  
    - README.md  
    - XInterface\_1.0.0-ts.250102.1200+simulator.1.yaml  
    - XInterface\_1.0.0-ts.250102.1200+simulator.completeness.yaml  
11. Open an existing .gitignore file in a simu folder of another repository and copy its content to the new .gitignore file  
12. CTRL+h the old UML file name (e.g. WredProfile\_1.0.0-tsi.240104.1945) by the new one (XInterface\_1.0.0-ts.250102.1200)
13. Open an existing README.md file in a simu folder of another repository and copy its content to the new README.md file. if required, reduce its content to references to the ...+yang2oas.yaml, ...+simulator.1.yaml and ...+simulator.completeness.yaml files
14. CTRL+h the old UML file name (e.g. WredProfile\_1.0.0-tsi.240104.1945) by the new one (XInterface\_1.0.0-ts.250102.1200)

##### Generic Simulator  
15. Open an existing ...+simulator.1.yaml file of another repository and copy its content to the new ...+simulator.1.yaml file. It makes sense replicating the file of an interface, in case of an interface shall be tested. It makes sense replicating the file of a profile, in case of a profile shall be tested, etc.  
16. CTRL+h the old UML file name (e.g. AirInterface\_2.0.0-tsi.240102.1740) by the new one (XInterface\_1.0.0-ts.250102.1200)  
17. Adapt the version number in the info statement  
18. CTRL+h the old namespace and release number combination (e.g. air-interface-2-0) by x-interface-1-0 for the entire file  
19. CTRL+h the URL notation of the model name (e.g. air-interface) by x-interface for the entire file  
20. CTRL+h the UML notation of the model name (e.g. AirInterface) by XInterface for the entire file  
21. CTRL+h the enumeration notation of the model name (e.g. \_AIR\_INTERFACE\_) by \_X\_INTERFACE\_ for the entire file  
22. Adapt the URLs in the Generic Paths segment to the paths to be tested in the new implementations (if the initial file was wisely chosen, no changes are required)  
23. Delete all example statements from all paths in the Generic Paths segment  
24. Check the API descriptions in the Generic Paths segment for correctness  
    - Descriptions of resource paths shall stop with a reference into the Common Components segment below the top level that is comprising the namespace and release number  
    - Descriptions of service paths (RPCs) shall be complete  
25. Delete obsolete schema definitions (between errorDescription and securitySchemes) from the Common Components  
26. Create and compose the new schema definitions from the schema definitions in the ...+yang2oas.yaml file  
27. When no further bugs get indicated by the editor, double check all definitions  
28. Click on the "OpenAPI: show preview using the default renderer" button at the upper right corner  
29. Process through all paths:  
    - Copy the request body (JSON) from the API preview and paste it into a JSON to YAML translator (e.g. https://jsonformatter.org/json-to-yaml)  
    - Create an example statement at the respective requestBody in the ...+simulator.1.yaml file, copy the translation result (YAML) and paste it into the example (some quotation marks might have to be deleted)  
    - String values are represented by "string". Replace them by "'string'" (incl. quotation marks)  
    - Repeat the same process for the response body  

The resulting API descriptions should have parameters and headers like applications like the MicroWaveDeviceInventory. Alternative response codes shall be included.

##### Preparing the Schema folder
30. Create the following files in the XInterface\_1.0.0-ts.250102.1200+schema folder  
    - README.md  
    - XInterface\_1.0.0-ts.250102.1200+yaml.yaml  
    - XInterface\_1.0.0-ts.250102.1200+json.json  
31. Open an existing README.md file in a schema folder of another repository and copy its content to the new README.md file.  
14. CTRL+h the old UML file name (e.g. WredProfile\_1.0.0-tsi.240104.1945) by the new one (XInterface\_1.0.0-ts.250102.1200)

##### YAML Schema
30. Open the ...+yaml.yaml file  
31. Open the ...+simulator.1.yaml file  
32. Repeat for all paths:  
    - Copy the URL (really just the URL) from the Generic Paths segment of the ...+simulator.1.yaml file into the ...+yaml.yaml file  
    - Copy the description of the response body (200) from beneath the schema statement in the ...+simulator.1.yaml file (starts with type: object ...) directly beneath the URL  
    - Headers and other response codes should not be included  
    - Example statements are to be deleted  
    - References into the Common Components need to be replaced by the concrete definition
If there would be no response body (204), nothing shall be copied beneath the URL

##### JSON Schema
33. Open the ...+json.json file  
34. Open the ...+yaml.yaml file  
35. Copy the entire content (CTRL+a) of the ...+yaml.yaml file and paste it into a YAML to JSON translator (e.g. https://jsonformatter.org/yaml-to-json)  
36. Copy the translation result (JSON) and paste it into the ...+json.json file  

##### Preparing the Validator folder
37. Create a README.md file in the XInterface\_1.0.0-ts.250102.1200+vali folder
38. Open an existing README.md file in a vali folder of another repository and copy its content to the new README.md file
39. CTRL+h the old UML file name (e.g. WredProfile\_1.0.0-tsi.240104.1945) by the new one (XInterface\_1.0.0-ts.250102.1200)
40. Create a Completeness folder in the XInterface\_1.0.0-ts.250102.1200+vali folder
41. Create the following files in the Completeness folder  
    - .gitignore  
    - XInterface\_1.0.0-ts.250102.1200+data.completeness.intern.json  
    - XInterface\_1.0.0-ts.250102.1200+data.completeness.json  
    - XInterface\_1.0.0-ts.250102.1200+diagram.completeness.plantuml  
    - XInterface\_1.0.0-ts.250102.1200+validator.completeness.json  
42. Open an existing .gitignore file in a vali folder of another repository and copy its content to the new .gitignore file  
43. CTRL+h the old UML file name (e.g. WredProfile\_1.0.0-tsi.240104.1945) by the new one (XInterface\_1.0.0-ts.250102.1200)

##### DATAfiles
44. Open the ...+data.completeness.intern.json file  
45. Open an existing ...+data.completeness.intern.json file in a vali folder of another repository and copy its content to the new ...+data.completeness.intern.json file
46. CTRL+h the old UML file name (e.g. WredProfile\_1.0.0-tsi.240104.1945) by the new one (XInterface\_1.0.0-ts.250102.1200)
47. CTRL+h the UML notation of the model name (e.g. AirInterface) by XInterface for the entire file  
48. If the XInterface modelling would not comprise any RPCs
    - remove all instances of server that do comprise "Rpc" in the value of their serverName attribute  
    - remove all instances of collection input that do comprise "Rpc" in the value of their collectionName attribute  
49. Open the ...+data.completeness.json file  
50. Copy the entire content (CTRL+a) of the ...+data.completeness.intern.json file and paste it into the ...+data.completeness.json file  
51. Make the following replacements in the ...+data.completeness.json  
    - Replace all concrete IP addresses and TCP ports by "IP\_ADRESS:PORT"  
    - Replace all concrete values of the authorizationCode attributes by "YOUR\_BASIC\_AUTH\_CODE"  

Assure the ...+data.completeness.intern.json file being represented in grey letters in VsCode. Otherwise ...+data.completeness.intern.json including the IP addresses and authorization codes will be published while pushing to the public repository. If still black letters used, double check the file names in the .gitignore file

##### Diagram
52. Open the ...+simulator.1.yaml file and develop a high level idea about how the InterfaceValidator shall proceed  
53. Search the existing diagrams in other repositories for a sequence that is at least very similar to your planning
54. Open the ...+diagram.completeness.plantuml file of a similar test case sequence, copy its content and paste it into the ...+diagram.completeness.plantuml file of the new XInterface; open Preview Current Diagram preview and pull it to the bottom of your screen (so it gets wider)
55. CTRL+h the old UML file name (e.g. AirInterface\_2.0.0-tsi.240102.1740) by the new one (XInterface\_1.0.0-ts.250102.1200)
56. CTRL+h the URL notation of the model name (e.g. air-interface) by x-interface for the entire file  
57. CTRL+h the UML notation of the model name (e.g. AirInterface) by XInterface for the entire file  
58. Check the participant section for correctly representing all the paths you want the InterfaceValidator to address
59. Add, delete or modify groups according to your needs
60. Carefully document the information that is written into the Collection and read from there  
61. Document the contents of the request and response bodies. Here you can simplify and focus on the relevant attributes
62. Outline the assertions to be made
63. Double check your diagram by going step-by-step through the preview
64. Create the Export Current Diagram as a png
65. Double check that the ...+diagram.completeness.png file has been created directly beneath the ...+diagram.completeness.plantuml file in the Completeness folder; if not represented or wrongly named, double check the file name stated in the very first line of the ...+diagram.completeness.plantuml file

##### InterfaceValidator
66. Search the existing ...+diagram.completeness.png files in other repositories for the one most similar to your new ...+diagram.completeness.png file  
67. Open the ...+validator.completeness.json file of the validator that is the most similar one in its diagram  
68. Open the ...+validator.completeness.json file of your new validator  
69. Copy the entire content (CTRL+a) of the existing and very similar ...+validator.completeness.json file
70. Paste it into the ...+validator.completeness.json file of your new validator  
71. CTRL+h the old UML file name (e.g. AirInterface\_2.0.0-tsi.240102.1740) by the new one (XInterface\_1.0.0-ts.250102.1200) for the entire file  
72. CTRL+h the old namespace and release number combination (e.g. air-interface-2-0) by x-interface-1-0 for the entire file  
73. CTRL+h the URL notation of the old model name (e.g. air-interface) by x-interface for the entire file  
74. CTRL+h the UML notation of the model name (e.g. AirInterface) by XInterface for the entire file  
75. CTRL+h the enumeration notation of the old model name (e.g. \_AIR\_INTERFACE\_) by \_X\_INTERFACE\_ for the entire file  
76. Search for potential further occurrences of the old model name by searching for artifacts like "air" or "wred" and replace them too, if required
77. Save the manipulated ...+validator.completeness.json file  
78. Open Postman application
79. Push Import button at top of the file tree
80. Push files in the middle of the import window
81. Brows through your file system until you reached the Completeness folder in your local copy of the XInterface repository
82. Select the ...+validator.completeness.json file and open it
83. Change into the XInterface folder inside the Validation folder
84. Add (preferably copy/paste), delete or modify the Requests inside the XInterface folder until it matches the diagram you created upfront
85. Open the individual Requests and adapt the Setting Local Variables and Preparing the Request segments until they create the requests and requestBodies you described in your diagram
86. Open the individual Requests and adapt the Loading Input Data and the Setting Collection Variables segments until they are all matching the diagram you created upfront  
87. Open the individual Pre-request Scripts and adapt the Processing segments until they are generating the required outputs (Local and Collection variables) from the provided inputs  
88. Open the individual Tests Scripts and adapt the Processing segments until they execute the required assertions and  generate the required outputs (Collection variables) from the response and the provided inputs  
89. Test your validator implementation against an existing interface implementation (e.g. mediator) in the laboratory  
90. Correct obvious mistakes in your validator implementation  
91. Test against further interface implementations and compare with the UML information model until you have a clear picture about the root causes of failures of your assertions
92. Correct your Processing segments (calculation of dummy values as well as assertions) until all remaining failures are certainly caused by the interface implementations differing from the UML information model

##### Completeness Simulator for Application
93. At the beginning of creating the InterfaceValidator you searched for a very similar validator, open the ...+simulator.completeness.yaml file in the same repository  
94. Open the ...+simulator.completeness.yaml file of your XInterface  
95. Copy the entire content (CTRL+a) of the existing and very similar ...+simulator.completeness.yaml file  
96. Paste it into the ...+simulator.completeness.yaml file of your XInterface  
97. CTRL+h the old UML file name (e.g. AirInterface\_2.0.0-tsi.240102.1740) by the new one (XInterface\_1.0.0-ts.250102.1200) for the entire file  
98. CTRL+h the old namespace and release number combination (e.g. air-interface-2-0) by x-interface-1-0 for the entire file  
99. CTRL+h the URL notation of the old model name (e.g. air-interface) by x-interface for the entire file  
100. CTRL+h the UML notation of the model name (e.g. AirInterface) by XInterface for the entire file  
101. Open the ...+simulator.1.yaml file of your XInterface  
102. Copy the entire Common Components segment from your ...+simulator.1.yaml file  
103. Replace the entire Common Components segment of the ...+simulator.completeness.yaml file by the one from your ...+simulator.1.yaml file  
104. Copy all paths in the Generic Paths segment of the ...+simulator.1.yaml file  
105. Replace all paths in the Generic Paths segment of the ...+simulator.completeness.yaml file by the ones copied from your  ...+simulator.1.yaml file  
106. Prefix all paths of the Generic Paths segment of the ...+simulator.completeness.yaml file by replacing "  /" by "  /generic/"  
107. Add (preferably copy/paste), delete or modify the paths in the Application part of the "XInterface\_1.0.0-ts.250102.1200+simulator.completeness in static reference mode" segment until they match the diagram you created upfront, respectively in such a way that they response to all the requests sent by your validator  
108. CTRL+h the MountName, UUIDs and LocalIds until they are matching with your diagram  
109. Execute on every individual path  
      - Check, whether the parameters are matching the ones that would be expected by applications like e.g. MWDI; add or delete UUIDs, LocalIds etc.  
      - Check, whether the operationId and summary are properly updated  
      - Check, whether the description statements beneath the response code are properly updated  
      - If the path is a specific version of a generic path, replace the entire schemas of requestBody (if applicable) and responseBody (if applicable) by the schemas of the corresponding path in the Generic Paths segment  
      - If applicable, replace the values in the example statement of the requestBody by the concrete values that will be sent by the InterfaceValidator  
      - If applicable, replace the values in the example statement of the responseBody by concrete values that could actually be expected from a device (even if stored in the MWDI, or forwarded by MWDG)  
      - Check, whether the headers matching the ones that would be sent by an application  
      - Check that there are no alternative response codes defined  
110. After updating the Application part of the "XInterface\_1.0.0-ts.250102.1200+simulator.completeness in static reference mode" segment of the ...+simulator.completeness.yaml file in such a way that it is properly responding to every request send by the InterfaceValidator, save the ...+simulator.completeness.yaml file
111. Open Mockoon
112. Push "Import Swagger v2/OpenAPI v3 (JSON or YAML)" from the "Import/Export" menu and execute the following steps  
      - Brows through your file system until you reached the ...+simu folder in your local copy of the XInterface repository  
      - Select the ...+simulator.completeness.yaml file
      - CTRL+c the file name
      - Open it
      - Brows through your file system until you reached the ...+simu folder in your local copy of the XInterface repository  
      - CTRL+v the file name
      - Delete the .yaml extension
      - Save it
113. Double check that  
      - The simulator file ...%2Bsimulator.completeness.json has been created inside the ...+simu folder
      - The ...%2Bsimulator.completeness.json file is marked in grey letters (otherwise it will be pushed to public repository); if not marked in grey letters, check file name and check file name inside the .gitignore file  
114. Activate the mock server by pushing the green triangle in Mockoon, so it changes into a red square  
115. Double check that the TCP port in the server attribute (e.g. "server": "http://localhost:3002") of the server definition with serverName "application in XInterface\_1.0.0-ts.250102.1200+simulator.completeness" being identical with the one assigned by Mockoon  
116. Change the collectionInput in the ...+data.completeness.intern.json file in such a way that the validator will address the server definition with serverName "application in XInterface\_1.0.0-ts.250102.1200+simulator.completeness"
117. Test your validator implementation against the Application definition in the ...+simulator.completeness.yaml file  
118. Correct glitches in the Simulator, respectively the InterfaceValidator until no assertion fails
119. Whenever the Simulator needs to be updated
      - Deactivate the mock server by pushing the red square in Mockoon, so it changes into a green triangle  
      - Delete the mock server definition from Mockoon  
      - Make the corrections in ...+simulator.completeness.yaml file in VsCode  
      - Repeat the steps described above for importing the Simulator into Mockoon and activating it  
120. If all assertions pass
      - Deactivate the mock server by pushing the red square in Mockoon, so it changes into a green triangle  
      - Delete the mock server definition from Mockoon  

##### Completeness Simulator for Controller
121. Open the ...+simulator.completeness.yaml file of your XInterface
122. Add (preferably copy/paste other paths from the Controller part), delete or modify the paths in the _Controller_ part of the "XInterface\_1.0.0-ts.250102.1200+simulator.completeness in static reference mode" segment until they match the diagram you created upfront, respectively in such a way that they response to all the requests sent by your validator  
123. CTRL+h the MountName, UUIDs and LocalIds until they are matching with your diagram  
124. Execute on every individual path  
      - Check, whether the parameters are matching the ones that would be expected by the controller; add or delete UUIDs, LocalIds etc.  
      - Check, whether the operationId and summary are properly updated  
      - Check, whether the description statements beneath the response code are properly updated  
      - If the path is a specific version of a generic path, replace the entire schemas of requestBody (if applicable) and responseBody (if applicable) by the schemas of the corresponding path in the Application part  
      - Check, whether there are no headers and no alternative response codes defined
125. After updating the Controller part of the "XInterface\_1.0.0-ts.250102.1200+simulator.completeness in static reference mode" segment of the ...+simulator.completeness.yaml file in such a way that it is properly responding to every request send by the InterfaceValidator, save the ...+simulator.completeness.yaml file
126. Open Mockoon
127. Execute the same steps like above for importing and activating the mock server
128. Double check that the TCP port in the server attribute (e.g. "server": "http://localhost:3002") of the server definition with serverName "_controller_ in XInterface\_1.0.0-ts.250102.1200+simulator.completeness" being identical with the one assigned by Mockoon  
129. Change the collectionInput in the ...+data.completeness.intern.json file in such a way that the validator will address the server definition with serverName "_controller_ in XInterface\_1.0.0-ts.250102.1200+simulator.completeness"
130. Test your validator implementation against the Controller definition in the ...+simulator.completeness.yaml file  
131. Proceed as described above until all glitches in the Simulator, respectively the InterfaceValidator are fixed and no assertion fails
132. If all assertions pass clean up Mockoon as described above and close it

##### Finalizing
133. Make a final check on the InterfaceValidator in Postman  
134. Replace the "XInterface\_1.0.0-ts.250102.1200+validator.completeness.json" file in the ...+vali folder while exporting the InterfaceValidator from Postman  
135. Open the top level README.md from the XInterface repository  
136. Open a top level README.md from another repository on the side  
137. Update the top level README.md from the XInterface with the same structure and links.  
138. Check all links in all README.md file  
139. Make a final check on all files  
140. Commit and publish  
141. Double check all README.md and links on GitHub

