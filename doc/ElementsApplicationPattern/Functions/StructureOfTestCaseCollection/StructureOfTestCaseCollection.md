# Structure of Test Case Collection

The Test Case Collection is implemented in a kind of framework.  

First there is Postman. Postman supports the sending of requests to REST interfaces.  
Several methods are provided. Some are more for quick and dirty shots. Some facilitate to create sophisticated programs.  
The TCC uses Postman in an advanced form where many requests are combined and executed in a predefined sequence.  

Second there is the InterfaceValidator. The InterfaceValidator was originally designed to test implementations of the ONF TR-532.  
It basically provides  
- a set of basic requests that are always required, 
- a concept for handling variables and 
- methods for retrieving results from the test case execution.  

This results in a framework that can be flexibly adapted to the respective application.  
It can hold high numbers of test cases.  
Every test case may combine multiple Requests.  
Each Request combines Pre-Request Script, request and Test Script.  

![OuterStructure](./pictures/OuterStructure.png)  






Postman
- GUI
- Sending request
  - individually
  - or fully automated collections of sequentially executed requests
- Sandbox for code being executed before => preparation e.g. composing the URI and the body
- Sandbox for code being executed afterwards => assessing the response
- for rest of text: Request = combination of Sandbox + request + Sandbox

- Properly assessing the response requires reference values
  - could either be read from file
  - or read from the device/application under test
  - or from other devices/applications that are involved 
  anyway, several requests are involved for preparing and assessing a single Test Case
  here comes the InterfaceValidator into play
- It loads data into the environment that can be accessed and used by individual test cases 
- This reduces the total number of requests, which accellerates execution

- Schwachpunkt: Handling variables
  - world/environment/local ...
  - keine Klassen (daten schon aber keine methoden)
  - Empfehlung website von Postman zum Thema lesen

- Schwachpunkt: Re-use von code artifacts
  - die requests werden sequenziell abgearbeitet
  - Funktionen und Klassen können nicht definiert werden
  - es gibt eine möglichkeit strings zu definieren, diese Strings als Variable unter den Requests auszutauschen und bei Bedarf als Code zu interpretieren.
  - diese möglichkeit fügt sehr viel zusätzliche Komplexität ein, bringt relativ wenig Effizienzgewinne und macht den Code extrem unübersichtlich


Aufbau des Interface Validators
- Nutzer Konfiguration
- Laden von File
- Definition von Code