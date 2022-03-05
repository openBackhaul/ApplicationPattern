# Preparing for Specifying Applications

### GitHub, Git and Visual Studio Code

Good collaboration processes and detailed guidelines are required for efficiently growing the application layer.  
All ApplicationOwners need an own GitHub account and local installations of Git and VSCode from beginning on.  
GitHub is a cloud based versioning system for sharing code in open source projects.  
Git is for keeping local data in synch with GitHub.  
Visual Studio Code is an advanced editor, which is very well integrating Git into its grafical user interface.  
Both, Git and VisualStudioCode are available for Linux, Windows and Mac.

**Concepts**
* [Introduction to Git and GitHub](./Introduction2Git/Introduction2Git.md)
* [Workflow for contributing](./WorkflowForContributing/WorkflowForContributing.md)
* [GitFlow Workflow](./GitFlowWorkflow/GitFlowWorkflow.md)
* [Forking Workflow](./ForkingWorkflow/ForkingWorkflow.md)
* [Formulating Issues](./FormulatingIssues/FormulatingIssues.md)
* [Formulating Commit and Merge Request Messages](./FormulatingCommitMessages/FormulatingCommitMessages.md)

**Step-by-Step Guidelines**
* [Creating an own GitHub account](./OwnGitHubAccount/OwnGitHubAccount.md)
* [Installing Git](./InstallingGit/InstallingGit.md)
* [Installing Visual Studio Code](./InstallingVSCode/InstallingVSCode.md)
* [Connecting VS Code with a GitHub repository](./VSCode2GitHub/VSCode2GitHub.md)
* [Connecting another GitHub repository](./VSCode2GitHub/AddingARepo.md)
* [Documenting an Issue](./DocumentingAnIssue/DocumentingAnIssue.md)
* [Processing an Issue](./ProcessingAnIssue/ProcessingAnIssue.md)
* [Creating an Commit](./CreatingCommit/CreatingCommit.md)
* [Completing an Issue](./CreatingMergeRequest/CreatingMergeRequest.md)

All ApplicationOwners are very much invited to propose corrections and completions on the ApplicationPattern (by creating Issues) or its guidelines by addressing pull requests.

### MarkDown

All documentation, readme and issues on GitHub are edited in MarkDown syntax.  
Mastering [basic syntax of MarkDown](https://www.markdownguide.org/basic-syntax/) is precondition for actively contributing.

### Postman

While using Postman for writing the OpenApiSpecification, it is only a few clicks to create a dummy server (mock), which is simulating the API. The mock helps verifying correctness of the specification and it is very supportive while writing the TestCases. A Postman account is for free. All ApplicationOwners need an own Postman account.

* [Open own Postman account](./OwnPostmanAccount/OwnPostmanAccount.md) 
* [Installing Postman on OfficeLaptop](./InstallingPostman/InstallingPostman.md)
* [Introduction](https://learning.postman.com/docs/getting-started/introduction/)
* [Designing APIs](https://learning.postman.com/docs/designing-and-developing-your-api/the-api-workflow/)
* [Introduction into test scripts](https://learning.postman.com/docs/writing-scripts/intro-to-scripts/)

### Open API specification (Swagger) and YAML

Automated code generation requires syntactically well defined specifications.  
OpenAPI Specification (formerly Swagger Specification) has been choosen for describing REST APIs.
Indent based YAML format has been choosen for formatting the OAS coding.

Mastering OpenAPI Specification 3.0 expressed in YAML is a precondition for describing the APIs of the applications.  
Very good documentation with tons of code snippets can be found on the [Swagger website](https://swagger.io/docs/specification/basic-structure/).

The general documentation of language and coding is complemented by a set rules for assuring resulting applications to follow the ApplicationPattern and to fit into the operation and maintenance structure. [Specifics of the OpenApiSpecification](../SpecifyingApplications/OpenApiSpecification/OpenApiSpecification.md).

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


[<- Back to Introduction](../Introduction/Introduction.md) - - - [Up to Main](../Main.md) - - - [Ahead to Specifying ->](../SpecifyingApplications/SpecifyingApplications.md)
