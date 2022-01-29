# Preparing for Specifying Applications

The following steps have to be taken to prepare for becoming an ApplicationOwner.

### GitHub

Good collaboration and detailed documentation are required for efficiently developing the application layer.

Documentation and templates of the ApplicationPattern can be found in the [TSI branch of the ApplicationPattern repository on GitHub.com/openBackhaul](https://github.com/openBackhaul/ApplicationPattern/tree/tsi). Also need for change or completion of the ApplicationPattern has to be addressed in the [Issues](https://github.com/openBackhaul/ApplicationPattern/issues) of the same repository.

**All ApplicationOwners are very much invited to propose corrections and completions on the ApplicationPattern (by creating Issues) or its guidelines (by formulating pull requests).**

[Creating an own GitHub account](./OwnGitHubAccount/OwnGitHubAccount.md) is required for contributing.

GitHub is providing a [vast documentation](https://docs.github.com/en), for e.g. on [getting started](https://docs.github.com/en/get-started/onboarding/getting-started-with-your-github-account) or [collaborating by pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests) is of special importance.

### Git and VisualStudioCode

GitHub provides a good web interface for getting started, but a local installation of Git and VisualStudioCode is recommended for more advanced working on code and documentation.

[Guidance for installing Git](./InstallingGit/InstallingGit.md) and [connecting VisualStudioCode on OfficeLaptop with GitHub](./VisualStudio2GitHub/VisualStudio2GitHub.md).

### MarkDown

All documentation, readme and issues on GitHub are edited in MarkDown syntax. [Basic syntax of MarkDown](https://www.markdownguide.org/basic-syntax/).

### Postman

While using Postman for writing the OpenApiSpecification, it is only a few clicks to create a dummy server (mock), which is simulating the API. The mock helps verifying correctness of the specification and it is very supportive while writing the TestCases.

The basic Postman is for free. Installing it according to [this guideline](./InstallingPostman/InstallingPostman.md) will facilitate smooth connection to the SDN laboratory environment.

Also Postman is providing a [vast documentation](https://learning.postman.com/docs/getting-started/introduction/). The section about [designing APIs](https://learning.postman.com/docs/designing-and-developing-your-api/the-api-workflow/) is complementing the specific guidance given in [elaborating the OpenApiSpecification](../SpecifyingApplications/OpenApiSpecification/OpenApiSpecification.md).

Postman is synchronizing into its own cloud. So the ApplicationOwner can seamlessly work on his APIs and TestCases on multiple devices. It is also possible to work in teams, but this requires chargeable licenses, which are available to limited extend.

### Open API specification (Swagger) and YAML

Automated code generation requires syntactically well defined specifications.

OpenAPI Specification (formerly Swagger Specification) has been choosen for describing REST APIs. [Very good documentation](https://swagger.io/docs/specification/basic-structure/).

YAML format has been choosen for writing the OpenApiSpecifications. It is based on indents and is easy to learn from the examples in the Swagger Specifications.

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
