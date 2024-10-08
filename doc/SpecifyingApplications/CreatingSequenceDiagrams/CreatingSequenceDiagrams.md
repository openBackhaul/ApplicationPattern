# Creating Sequence Diagrams

This is a step by step cookbook for creating the _Sequence Diagrams_.  

**Please, read the background information about the [Concept of _Sequence Diagrams_](../ConceptOfSequenceDiagrams/ConceptOfSequenceDiagrams.md) before creating the the _Sequence Diagrams_.**   


### File Handling  

In your repository navigate to the _spec_ folder and if not yet available, create a new subfolder called _diagrams_.  
There are no template files for the diagrams to be placed there.  
All diagrams (both as *.plantuml* and *.png*) are to be placed here, together with a readme file, which links all the *.png* files created from the PlantUML files.  



### Preparation  

* If not yet existing, create an _Issue_ for creating the _Sequence Diagrams_.  
* Open a local feature branch for creating the _Sequence Diagrams_.  


### General  

* Check out the diagrams at other application repositories, like [AutomatedLinkAcceptanceProxy](https://github.com/openBackhaul/AutomatedLinkAcceptanceProxy/tree/develop/spec/diagrams) or [NotificationProxy](https://github.com/openBackhaul/NotificationProxy/tree/develop/spec/diagrams) for examples
* Diagrams are typically only generated for individual parts, with one diagram per forwarding in most cases

### Identify Which Diagrams to Specify  

* Typically, each individual operation server (i.e. those services listed under *operation-servers/own-oam/basic/individual* and *operation-servers/basic/individual* from your ServiceList) is a starting point for a diagram
* An operation server can also be starting point for more than just one diagram
* There might also be diagrams for *embed-yourself* and *bequeath-your-data-and-die* sequences

### Specifying a Sequence Diagram

#### Assigning a Proper Name
* Create a new file under the diagrams folder, and name it according to one of the following schemas:
  * `<number>_<short-content-description>.plantuml`: e.g. *100_ReadingLtpStructure.plantuml*
  * `<is|im><number>_<short-content-description>.plantuml`: if there are own diagrams for *im* and *is* operation servers (individual managment and individual service) add the *is* or *im* prefix; e.g. *im000_ListenToControllers.plantuml* or *is020_NotifiyingOfDeviceAlarms.plantuml*
* The chosen name should sufficiently indicate what the purpose of the diagram is
* The starting number should be identical with the sequence number of the uuid of the forwarding (later callback) that is described in the diagram (often it makes sense to reuse the sequence number of the uuid of the operation server that serves as an Input to the forwarding).
  * sometimes a diagram may serve as a blue print for multiple forwardings with the same process flow, but for different operation servers; in those cases a *x* may be used to wildcard the related part of the sequence number, e.g. in MWDI there is diagram *00x_CyclicOperationBasedDeviceListSync.plantuml*, which maps four separate forwardings

#### Sequence Diagram Content

Check how the already existing diagrams of other applications look like to get an idea for how your application's diagrams need to be created!

The sequence diagram consists of several building blocks.   
The picture shows an example from the NotificationProxy:  
![Diagram_building_blocks](./pictures/createSeqDiagram_01.png) 

**1: Diagram name = *.pgn* file name**  
* right after the opening `@startuml` the diagram name has to be provided
* this is the same string as in the filename without the *.plantuml* file ending
* when the diagram is exported to *.png*, the created picture file will be named with the string provided here

**2: Format settings**
* next comes the *skinparam* section, where format settings used during rendering of the diagram can be provided
* add the setting `skinparam responseMessageBelowArrow true`, which places the message of response arrows below the arrow
* note that for the request message arrow there is no such setting, means a related message is placed above the arrow

**3: Diagram Title = ForwardingName**
* the title is what will be shown as title in the rendered diagram
* here, the name of the forwarding (and later callback in the OAS) has to be provided
* to come up with a proper name, it is advised to read [Structure of Internal _ForwardingNames_](../../ElementsApplicationPattern/Names/StructureOfInternalForwardingNames/StructureOfInternalForwardingNames.md)

**4. Participants = diagram nodes**
* the participant block is used for easier editing of the diagram
* for each node in the diagram create a participant
  * format: `participant "<text to be displayed in the diagram>" as <alias>`
  * the `"<text>"` part contains what is shown in the rendered diagram, the `<alias>` is the reference to the node in the *.plantuml* raw view
* the participant ordering determines the order in which the nodes are displayed in the diagram
* typically, the first participant is the iniator of the request
  * some examples for the `"<text>"` are "Admin", "/v1/embed-yourself", "external", "cyclic", a specific other application's (abbreviated) name or a combination of those
  * chose the alias according to the node type, this can e.g. be a requestor or subscriber
* if a node refers to a certain service it should be provided in the following format: `<AppAbbreviation>://<operation-name>`, e.g. *"NP://v1/listen-to-controller"* or *"MWDI://v1/provide-list-of-connected-devices"*
  * including the AppAbbreviation allows to directly see to which application the operation server or operation client belongs to
  * the service from the ServiceList for which the diagram was created, typically is the operation server, whereas other operation-names included in the diagram called due to that operation server, are the operation clients (either from the same app or a 3rd app)

**5. Activation of the Forwarding**
* add a connection between the operation server and it's preceding participant
* then activate the operation server to indicate over which process steps the forwarding is active
* once the forwarding is finished, deactivate the operation server participant
* in the rendered diagram the activation is shown as a white vertical rectangle 

**6. Notes Boxes**
* sometimes additional information needs to be provided, e.g. if there are if-then-else condition or repetitions (for all ...), which cannot be properly modelled in PlantUML
* encapsulate those notes in `note over <participant>` and `end note` statements
* the notes are shown as yellow boxes

**7. Connections between Participants**
* the connections between the participants show how the communication between the participants looks like
* a sent request is modelled as `<caller participant> -> <called participant>: {input parameters}`
  * it is shown as a solid line
  * the parameters are optional, and just for visualizing, whether all the required input values are available at this point of the sequence. If there are none, leave out everything starting at the ":"
  * input information can e.g. be a linkId for which the service is called, or a list of multiple input parameters
* the resulting response is modelled as `<caller participant> --> <called participant>: {response parameters}`
  * the response is shown as a broken line 
  * again, parameters are optional
  * omit the response line, if it is not required
* note: a response may not be given directly, but only after some additional steps in the sequence have been carried out


The image shows how the rendered diagram from the above example looks like:  
![Diagram_building_blocks_rendered](./pictures/createSeqDiagram_02.png)

The following code snippet can be used as a basis to create your own diagrams:  
```
@startuml <diagramName>
skinparam responseMessageBelowArrow true

title <forwardingName>

participant "<initiator-text-goes-here>" as Requestor
participant "<the-operation-server>" as alias1
participant "<another-called-operation-client>" as alias2

Requestor -> alias1: {<if needed add parameters>}
activate alias1

alias1 -> alias2: {<optional>}
alias2 --> alias1: {<optional>}

deactivate alias1

@enduml
```

#### Export PlantUML Diagrams to Pictures in VisualStudioCode  

After all the *.plantuml* files have been finalized, a *.png* file needs to be created for each diagram.  
For that purpose right-click on the related *.plantuml* files in VSC and select *Export Workspace Diagrams*:  
![Export to png](./pictures/createSeqDiagramExport_01.png)  

If the *.plantuml* file was created according to above instructions, it will create a new *.png* with the same name as the *.plantuml* file.  
Ensure that the *.png* files are located in the same folder as the *.plantuml* files. If they are created to another folder, move them to the diagrams folder manually.

Notes:
1. It is sufficient to create the *.png* files after *.plantuml* files are finalized, as they will not get updated automatically, when the *.plantuml* files change. A preview of the diagrams can e.g. be opened by pressing `ALT+D`.  
2. If VSC does not automatically generate *.png* files when exporting the diagrams, the PlantUML plugin configuration needs to be modified accordingly (see option *Export format*). The configuration also has a option to set the export output directory (*Export Out Dir*).

#### Create the Readme

Once all the diagrams have been exported to *.png*, create the *README.md* file in the *diagram* folder.  
All of the pictures should be added to it, with the ordering of the pictures in accordance to the ordering of diagram names (i.e. by sequence numbers).

The following snippet shows how the file should look like in the editor (for an application with two diagrams):
```
# <APPLICATION-NAME> Diagrams
.
.
![<SpecificForwardingName1>](./<diagram-name1>.png)
.
.
![<SpecificForwardingName2>](./<diagram-name2>.png)
.
.
```

The pictures show an example for the MacAddressTableRecorder. 
First, the *raw* view is shown; the 2nd picture shows a snippet from the preview in the browser.    
![Readme_example_raw](./pictures/createSeqDiagramExport_02.png)
![Readme_example_preview](./pictures/createSeqDiagramExport_03.png)




