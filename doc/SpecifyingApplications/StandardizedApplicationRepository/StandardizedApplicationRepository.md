# The standardized ApplicationRepository

Every application specification and implementation process needs to be managed in an individual repository on [github.com/openBackhaul](https://github.com/openBackhaul/Overview).  

All individual repositories will be generated from a common template.  

The initial ApplicationRepository contains e.g. the following artifacts:
* Initial versions of the components of the specification as there are e.g. ServiceList, ForwardingList, OpenAPI Specification and TestCases
* _main_ and _develop branch_ (_develop branch_ being configured as default branch)
* A set of _Issues_ that guides the ApplicationOwner through the process of specifying the Application

As a matter of first individualization, ...
* ... the ApplicationRepository gets renamed towards the ApplicationName, so it can be properly referenced by local Git installations
* ... the ApplicationOwner is configured to be _Contributor_ on the individual ApplicationRepository, so he can create the branches, which are necessary for driving the specification.  

During the specification and implementation process, the individual ApplicationRepository will serve as a joint between several other repositories.

It contains a _subtree_, which is referencing the implementation of the basic components in the ApplicationPattern repository. The contained code will be forked together with the specification by the ApplicationImplementer after being assigned.  

Likewise, the ApplicationImplementer will request for _Merging_ his code into the ApplicationRepository, from where it will be _forked_ by our private GitLab installation, which is automating acceptance and integration testing in our laboratory environment.

For smooth walkthrough of the process, it is vital that ...
* ... the ApplicationOwner keeps the rules defined in the [Workflow for Contributing](../../PreparingSpecifying/WorkflowForContributing/WorkflowForContributing.md), respectively the [GitFlow](../../PreparingSpecifying/GitFlowWorkflow/GitFlowWorkflow.md)
* ... and does not change folder structure of the repository or filenames of the components of the specification.