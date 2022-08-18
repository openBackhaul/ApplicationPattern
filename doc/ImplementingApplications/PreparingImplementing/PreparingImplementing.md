# Preparing for Implementing Applications

## Visual Studio Code(VSCode)
VSCode is a lightweight but powerful source code editor.
It comes with built-in support for JavaScript and Node.js that makes it perfect for implementing the applications of the ApplicationLayer.
VSCode is available for Linux, Windows and Mac.

**Step-by-Step Guidelines**
* [Installing VSCode](../../PreparingSpecifying/InstallingVSCode/InstallingVSCode.md)

**Documentation**
* [Getting Started](https://code.visualstudio.com/docs) 

## Git and GitHub

To build the ApplicationLayer Microservice architecture , multiple developers collaboratively works in a same or separate application implemetation. 
Git allows developers to easily manage changes to projects, track different versions of source code, and collaborate on any section of similar code without creating conflicting issues with proposed changes.  
All ApplicationImplmenters need an own GitHub account and local installations of Git and VSCode from beginning on.  
GitHub is a cloud based versioning system for sharing code in open source projects. Git is for keeping local data in synch with GitHub.  
Git is available for Linux, Windows and Mac.

**Concepts**
* [Introduction to Git and GitHub](../../PreparingSpecifying/Introduction2Git/Introduction2Git.md)
* [GitFlow Workflow](../../PreparingSpecifying/GitFlowWorkflow/GitFlowWorkflow.md)
* [Forking Workflow](../../PreparingSpecifying/ForkingWorkflow/ForkingWorkflow.md)
* [Formulating Issues](../../PreparingSpecifying/FormulatingIssues/FormulatingIssues.md)

**Step-by-Step Guidelines**
* [Creating an own GitHub account](../../PreparingSpecifying/OwnGitHubAccount/OwnGitHubAccount.md)
* [Installing Git](../../PreparingSpecifying/InstallingGit/InstallingGit.md)

## Code Collaboration

Code collaboration is the process of working on the code with a team. To build the ApplicationLayer Microservice architecture , multiple developers collaboratively works in a same or separate microservice implemetation. 
Effectively developing the ApplicationLayer requires good collaboration processes and detailed guidelines.  
VSCode has integrated source control management and includes Git support out-of-the-box. So , code collaboration can be managed through VSCode with the support of the Git extension.

**Concepts**
* [Workflow for collaborating code](./ConceptOfCodeCollaboration/ConceptOfCodeCollaboration.md)
* [Formulating Commit and Merge Request Messages](../../PreparingSpecifying/FormulatingCommitMessages/FormulatingCommitMessages.md)
* [Managing Conflicts](../../PreparingSpecifying/ConflictManagement/ConflictManagement.md)
* [Avoiding Conflicts](../../PreparingSpecifying/AvoidingConflicts/AvoidingConflicts.md)

**Step-by-Step Guidelines**
* [Connecting VS Code with a GitHub repository](../../PreparingSpecifying/VSCode2GitHub/VSCode2GitHub.md)
* [Documenting an Issue](../../PreparingSpecifying/DocumentingAnIssue/DocumentingAnIssue.md)
* [Processing an Issue](../../PreparingSpecifying/ProcessingAnIssue/ProcessingAnIssue.md)
* [Creating a Commit](../../PreparingSpecifying/CreatingCommit/CreatingCommit.md)
* [Completing an Issue](../../PreparingSpecifying/CreatingMergeRequest/CreatingMergeRequest.md)

## Node.js and npm

In the ApplicationLayer , all Microservices are implemented as REST servers that exposes APIs. 
Node.js is one of the perfect approaches to implement REST APIs. 
All ApplicationImplmenters require to install Node.js and npm in their local development environment. 
Both Node.js and npm are available for Linux, Windows and Mac.

**Concepts**
* [Introduction to Node.js](./Introduction2NodeJs/Introduction2NodeJs.md)
* [Introduction to npm](./Introduction2Npm/Introduction2Npm.md)
* [Implementing Node.js application in VSCode](./ConceptOfCodingNodeJsInVSCode/ConceptOfCodingNodeJsInVSCode.md)
* [Running Node.js Applications in VSCode](./ConceptOfRunningNodeJsInVSCode/ConceptOfRunningNodeJsInVSCode.md)
* [Debugging Node.js Applications in VSCode](./ConceptOfDebuggingNodeJsInVSCode/ConceptOfDebuggingNodeJsInVSCode.md)

**Step-by-Step Guidelines**
* [Implementing Node.js application in VSCode](./Steps2CodeNodeJs/Steps2CodeNodeJs.md)
* [Running Node.js application in VSCode](./Steps2RunNodeJs/Steps2RunNodeJs.md)
* [Debugging Node.js application in VSCode](./Steps2DebugNodeJs/Steps2DebugNodeJs.md)

**Documentation**
* [Node.js API reference documentation](https://nodejs.org/api/)
* [NPM documentation](https://docs.npmjs.com/about-npm)
* [Installation guide for **Node.js** and **NPM**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Please make sure that you are installing **Node.js version >= 14** and **npm version >=6.14.13**

## Clean code

Writing a code that is mode declarative, communicates better and makes it easy to read and understand by other team members.
Also , one of the key aspects of Microservice is high maintainability. This means that , after releasing the first version of the sofware, Corrective, preventive, perfective, and adaptive software maintenance can be done at a low cost. 
This can be achieved by doing a clean code from the starting.

**Concepts**
* [Introduction to CleanCode](./ConceptOfCleanCoding/ConceptOfCleanCoding.md)
* [coding guidelines](./ConceptOfCodingGuidelines/ConceptOfCodingGuidelines.md)

## Code Style and Formatting

Consistently using the same style throughout your code makes it easier to read. Code that is easy to read is easier to understand by you as well as by potential collaborators. Therefore, adhering to a coding style reduces the risk of mistakes and makes it easier to work together on software. 

**Step-by-Step Guidelines**
* [Automatic Code Style and Formatting](./Steps2AutomateCodeFormating/Steps2AutomateCodeFormating.md)


[<- Back to Introduction](../Introduction/Introduction.md) - - - [Up to Main](../Main.md) - - - [Ahead to Specifying ->](../SpecifyingApplications/SpecifyingApplications.md)
