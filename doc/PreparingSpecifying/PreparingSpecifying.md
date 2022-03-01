# Preparing for Specifying Applications

The following steps have to be taken to prepare for becoming an ApplicationOwner.

### GitHub

Good collaboration processes and detailed guidelines are required for efficiently commonly growing the application layer.  
All ApplicationOwners need an own GitHub account from beginning on.

* [Open own GitHub account](./OwnGitHubAccount/OwnGitHubAccount.md)
* [Formulating Issues](./FormulatingIssues/FormulatingIssues.md)
* [Workflow for contributing](./GitWorkflow/GitWorkflow.md)
* [Formulating Commit Messages](./FormulatingCommitMessages/FormulatingCommitMessages.md)
* [Formulating Pull Requests](./FormulatingPullRequests/FormulatingPullRequests.md)
* [More about collaborating by pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)

All ApplicationOwners are very much invited to propose corrections and completions on the ApplicationPattern (by creating Issues) or its guidelines (by [formulating pull requests](./FormulatingPullRequests/FormulatingPullRequests.md)).

### Git and VisualStudioCode

GitHub provides a good web interface for getting started, but a local installation of Git and VisualStudioCode is recommended for more advanced working on code and documentation.

Git is for keeping local data in synch with a common repository. It is command line based.  
VisualStudioCode is an advanced editor, which is very well integrating Git into its grafical user interface.  
Both, Git and VisualStudioCode are available for Linux, Windows and Mac.  
(VisualStudioCode is not to be mixed with VisualStudio, which is a development environment on Windows only.)

Guidance for [installing Git](./InstallingGit/InstallingGit.md), [installing VisualStudioCode](./InstallingVSCode/InstallingVSCode.md) and [connecting VisualStudioCode on OfficeLaptop with GitHub](./VSCode2GitHub/VSCode2GitHub.md).

Guidance for [adding another GitHub repository](./VSCode2GitHub/AddingARepo.md) to the workbench in VisualStudioCode.

### MarkDown

All documentation, readme and issues on GitHub are edited in MarkDown syntax.  
Mastering [basic syntax of MarkDown](https://www.markdownguide.org/basic-syntax/) is precondition for actively contributing.

### Postman

While using Postman for writing the OpenApiSpecification, it is only a few clicks to create a dummy server (mock), which is simulating the API. The mock helps verifying correctness of the specification and it is very supportive while writing the TestCases.

A properly working Postman is a precondition for describing the APIs of the applications.

The basic Postman is for free. Installing it according to [this guideline](./InstallingPostman/InstallingPostman.md) will facilitate smooth connection into the Internet and to the SDN laboratory environment.

Also Postman is providing a [vast documentation](https://learning.postman.com/docs/getting-started/introduction/). Both, [designing APIs](https://learning.postman.com/docs/designing-and-developing-your-api/the-api-workflow/) as well as [introduction into scripts](https://learning.postman.com/docs/writing-scripts/intro-to-scripts/) are providing a good base for defining and testing of the Open API specifications, which we require for our applications.

Postman is synchronizing into its own cloud. So the ApplicationOwner can seamlessly work on his APIs and TestCases on multiple devices. It is also possible to work in teams. This requires chargeable licenses, which are available to limited extend.

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
