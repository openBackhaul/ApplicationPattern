# Tools and Workflows


### Visual Studio Code(VSCode)
VSCode is a lightweight but powerful source code editor.
It comes with built-in support for JavaScript and Node.js that makes it perfect for implementing the applications of the ApplicationLayer.
VSCode is available for Linux, Windows and Mac.

**Step-by-Step Guidelines**
* [Installing Visual Studio Code](./InstallingVSCode/InstallingVSCode.md)

**Documentation**
* [Getting Started](https://code.visualstudio.com/docs) 


### Git and GitHub
All ApplicationOwners and ApplicationImplementers need an own GitHub account and local installations of Git and VSCode from beginning on.  
To build the ApplicationLayer Microservice architecture , multiple developers collaboratively works in a same or separate application implemetation. 
Git allows to easily manage changes to projects, track different versions of source code, and collaborate on any section of similar code without creating conflicting issues with proposed changes.  
GitHub is a cloud based versioning system for sharing code in open source projects.  
Git is for keeping local data in synch with GitHub.  
Git is available for Linux, Windows and Mac.

**Concepts**
* [Introduction to Git and GitHub](./Introduction2Git/Introduction2Git.md)
* [GitFlow Workflow](./GitFlowWorkflow/GitFlowWorkflow.md)
* [Forking Workflow](./ForkingWorkflow/ForkingWorkflow.md)
* [Formulating Issues](./FormulatingIssues/FormulatingIssues.md)

**Step-by-Step Guidelines**
* [Creating an own GitHub account](./OwnGitHubAccount/OwnGitHubAccount.md)
* [Installing Git](./InstallingGit/InstallingGit.md)
* [Activating YAML validation on your respository](./AddYamlLinter/Adding%20Yaml%20linter%20to%20GitHub.md)


### Code Collaboration
Code collaboration is the process of working on the code with a team.  
Good collaboration processes and detailed guidelines are required for efficiently growing the application layer.  
VSCode has integrated source control management and includes Git support out-of-the-box.  
So, code collaboration can be managed through VSCode with the support of the Git extension.  

**Concepts**
* [Workflow for contributing](./WorkflowForContributing/WorkflowForContributing.md)
* [Workflow for collaborating code](./ConceptOfCodeCollaboration/ConceptOfCodeCollaboration.md)
* [Formulating Commit and Merge Request Messages](./FormulatingCommitMessages/FormulatingCommitMessages.md)
* [Managing Conflicts](./ConflictManagement/ConflictManagement.md)
* [Avoiding Conflicts](./AvoidingConflicts/AvoidingConflicts.md)

**Step-by-Step Guidelines**
* [Connecting VS Code with a GitHub repository](./VSCode2GitHub/VSCode2GitHub.md)
* [Documenting an Issue](./DocumentingAnIssue/DocumentingAnIssue.md)
* [Processing an Issue](./ProcessingAnIssue/ProcessingAnIssue.md)
* [Creating a Commit](./CreatingCommit/CreatingCommit.md)
* [Completing an Issue](./CreatingMergeRequest/CreatingMergeRequest.md)

All ApplicationOwners and ApplicationImplementers are very much invited to propose corrections and completions on the ApplicationPattern (by creating Issues) or its guidelines by addressing pull requests.


### MarkDown

All documentation, readme and issues on GitHub are edited in MarkDown syntax. Mastering MarkDown is a precondition.

**Documentation**
* [Basic syntax of MarkDown](https://www.markdownguide.org/basic-syntax/)


### Postman

While using Postman for writing the OpenApiSpecification, it is only a few clicks to create a dummy server (mock), which is simulating the API. The mock helps verifying correctness of the specification.  
Anyway, Postman is needed for writing the TestCases.  
A Postman account is for free.  
All ApplicationOwners need an own Postman account.  

**Step-by-Step Guidelines**
* [Open own Postman account](./OwnPostmanAccount/OwnPostmanAccount.md) 
* [Installing Postman on OfficeLaptop](./InstallingPostman/InstallingPostman.md)

**Documentation**
* [Introduction](https://learning.postman.com/docs/getting-started/introduction/)
* [Designing APIs](https://learning.postman.com/docs/designing-and-developing-your-api/the-api-workflow/)
* [Introduction into test scripts](https://learning.postman.com/docs/writing-scripts/intro-to-scripts/)


### OpenAPI specification (Swagger) and YAML

Automated code generation requires syntactically well defined specifications.  
OpenAPI Specification (formerly Swagger Specification) has been choosen for describing REST APIs.  
Indent based YAML format has been choosen for formatting the OAS coding.  
Mastering OpenAPI Specification 3.0 in YAML is a precondition.  

**Documentation**
* [OpenAPI Guide](https://swagger.io/docs/specification/basic-structure/)

**Concepts**
* [Specifics of the ApplicationPattern](./OasBasedOnApplicationPattern/OasBasedOnApplicationPattern.md)


### JSON and Notepad++

LOADfiles are written in JSON. Reading through existing examples is probably the easiest way of learning the necessary structures and formats.

LOADfiles are of several thousands of lines. Notepad++ or other feature rich editors are very much preferred over the Windows standard editor. Notepad++ can be loaded from the corporate app store.


### JavaScript

TestCases are sequences of Requests in Postman. A Postman Request combines a Pre-request Script, an actual HTTP request and a Test Script. The Pre-request Script is for preparing the HTTP request. The Test Script is for assessing the response to the HTTP request. Both Pre-request and Test Script are little JavaScript programs, which are executed in the Postman JavaScript sandbox.

This sandbox relieves the ApplicationOwner from many, many tasks, which would have to be done in "real" JavaScript programming.
Reading about
* language core (e.g. variables, datatypes, operations, conditions, loops, functions, error handling)
* composed datatypes and references
should suffice for preparing.

It is necessary to read the chapter [Writing Scripts](https://learning.postman.com/docs/writing-scripts/intro-to-scripts/) at the Postman learning center to understand the specifics of the sandbox and particularly the handling of variables between the scripts.

Further on, it is recommended to new ApplicationOwners to study existing testcase collections for getting familiar with the basic structures.


### Node.js and npm

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


### Clean code

Writing a code that is mode declarative, communicates better and makes it easy to read and understand by other team members.
Also , one of the key aspects of Microservice is high maintainability. This means that , after releasing the first version of the sofware, Corrective, preventive, perfective, and adaptive software maintenance can be done at a low cost. 
This can be achieved by doing a clean code from the starting.

**Concepts**
* [Introduction to CleanCode](./ConceptOfCleanCoding/ConceptOfCleanCoding.md)
* [coding guidelines](./ConceptOfCodingGuidelines/ConceptOfCodingGuidelines.md)


### Code Style and Formatting

Consistently using the same style throughout your code makes it easier to read. Code that is easy to read is easier to understand by you as well as by potential collaborators. Therefore, adhering to a coding style reduces the risk of mistakes and makes it easier to work together on software. 

**Step-by-Step Guidelines**
* [Automatic Code Style and Formatting](./Steps2AutomateCodeFormating/Steps2AutomateCodeFormating.md)


[<- Back to Introduction](../Introduction/Introduction.md) - - - [Up to Main](../Main.md) - - - [Ahead to Specifying ->](../SpecifyingApplications/SpecifyingApplications.md)
