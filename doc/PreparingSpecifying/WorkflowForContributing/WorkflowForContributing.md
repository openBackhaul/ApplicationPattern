# Workflow for Contributing

Development of the application specifications shall be collaborative.  
Efficiently doing so requires the definition of a process, which all involved persons must adhere to.

### Requirements to the workflow

* _master branch_ on GitHub: every commit is representing an official version, which is initiating further actions in neighboring domains (e.g. implementation or procurement)
* _develop branch_ (instead of tsi, tsp and so on) on GitHub: common base for all persons, who are involved into the specification process
* Short living _feature, hotfix and release branches_: separate places for advancing the specification before sharing results in the _develop branch_
* _public_ repository: allowing virtually everybody to contribute either by formulation _issues_ or addressing _pull-requests_, which are proposing concrete changes to the specification
* _branch protection_: all changes to the common base (_develop branch_) must be reviewed and approved by either ApplicationOwner or PlatformOwner, which both are able to directly alter the proposed contributions before merging

### Choice of workflow

Many different workflows can be implemented based on Git and GitHub.  
The proposed workflows are a bit more complex to apply in the beginning, but they are both comperably transparent and ease to debug (in case of "Kuddelmuddel").  
* ApplicationOwner (and PlatformOwner): 
  * will be assigned to be _Collaborator_, which allows to create branches in the _origin_ repository
  * will apply the [_Gitflow Workflow_](../GitFlowWorkflow/GitFlowWorkflow.md)
* Everybody else:
  * will apply the [_Forking Workflow_](../ForkingWorkflow/ForkingWorkflow.md), which can be applied in most open source projects