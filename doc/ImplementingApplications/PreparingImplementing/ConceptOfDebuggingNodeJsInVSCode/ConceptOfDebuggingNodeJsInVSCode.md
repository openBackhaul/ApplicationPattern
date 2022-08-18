# Implementing Node.js application in VSCode

The Visual Studio Code editor has built-in debugging support for the Node.js runtime and can debug JavaScript, TypeScript, and many other languages that are transpiled into JavaScript. Setting up a project for Node.js debugging is straightforward with VS Code providing appropriate launch configuration defaults and snippets.

There are a few ways you can debug your Node.js programs in VS Code:

* Use auto attach to debug processes you run in VS Code's integrated terminal.
* Use the JavaScript debug terminal, similar to using the integrated terminal.
* Use a launch config to start your program, or attach to a process launched outside of VS Code.

### Breakpoints
#### Conditional Breakpoints
Conditional breakpoints are breakpoints that only pause when an expression returns a truthy value. 
#### Logpoints
Sometimes you want to just log a message or value when code hits a certain location, rather than pausing. You can do this with logpoints. Logpoints don't pause, but rather log a message to the Debug Console when hit. 
#### Hit count breakpoints
The 'hit count condition' controls how many times a breakpoint needs to be hit before it will 'break' execution. 


[Up to Preparing for implementing Applications](../PreparingImplementing.md) - - - [Ahead to Introduction to NPM ->](../Introduction2Npm/Introduction2Npm.md)