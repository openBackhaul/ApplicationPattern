# Debugging Node.js application in VSCode

Node.js applications can be debugged in 3 different approaches in VSCode. JavaScript Debug terminal is one easy approach among them.

### Step-by-step guide to start application in debug mode
* Go to menu `View -> Terminal`
  
  ![ViewTerminalMenu](./Images/ViewTerminalMenu.png)
* This will open a integrated terminal. Select the `JavaScript Debug Terminal` from the terminal switcher dropdown.
  
  ![LaunchJSDebugTerminal](./Images/LaunchJSDebugTerminal.png) 

* You can debug Node.js applications directly by using the command `npm start` or `node <starting JS file-name>`

  ![DebugNodeJSApplication](./Images/DebugNodeJSApplication.png) 

### Step-by-step guide to add breakpoints
#### Breakpoints
* Double clicking in in the gutter beside a line number will include a breakpoint which will pause the execution while hitting the line.
* Alternatively , right-click in the gutter beside a line number and select " Breakpoint"

  ![BreakPoint](./Images/Breakpoint.png) 
#### Conditional Breakpoints
* Right-click in the gutter beside a line number and select "Conditional Breakpoint"

  ![ConditionalBreakPoint](./Images/ConditionalBreakPoint.png) 
* Create expression for the breakpoints that only pause when the defined expression returns a truthy value.

  ![ConditionalBreakpointExpression](./Images/ConditionalBreakpointExpression.png) 
#### Logpoints
* Right-click in the gutter beside a line number and select "Log Breakpoint"

  ![LogBreakPoint](./Images/LogBreakPoint.png) 
* Create logs that can be be printed while crossing this breakpoint.To print variable, place them inside `{variable-name}` curly braces.

  ![LogBreakpointprintStatement](./Images/LogBreakpointprintStatement.png) 

### Debug action
* After launching the application in debug mode , a debug action toolbar can be viewed in the top of the editor. 

  ![DebugActions](./Images/DebugActions.png) 

* Alternatively using the following shortcuts actions can be performed 
  * Continue / Pause `F5`
  * Step Over `F10`
  * Step Into `F11`
  * Step Out `Shift+F11`
  * Restart `Ctrl+Shift+F5`
  * Stop `Shift+F5`


[Up to Preparing for implementing Applications](../PreparingImplementing.md) - - - [Ahead to Introduction to NPM ->](../Introduction2Npm/Introduction2Npm.md)
