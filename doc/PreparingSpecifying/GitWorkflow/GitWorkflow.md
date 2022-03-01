# Git Workflow

Development of the application specifications shall be collaborative.
Efficiently doing so requires definition of a process, which is kept by all involved persons.

**Requirements to the workflow:**
* having a master branch on GitHub, and every commit on it representing an official version initiating further actions in neighboring domains (e.g. implementation or procurement)
* having a development (instead of tsi, tsp and so on) branch on GitHub, which is common base for all persons, who are involved into the specification process
* using short living issue, hot fix and release branches for driving the specification
* allowing virtually everybody to contribute either by formulation issues or proposing concrete changes to the specification
* all changes to the specification being reviewed and approved by either ApplicationOwner or PlatformOwner
* ApplicationOwner and PlatformOwner being able to directly alter the proposed contributions before merging

**Forking Workflow:**  
Many different workflows can be implemented based on Git and GitHub.  
The proposed Forking Workflow is a bit more complex to apply in the beginning, but it is comperably transparent, comperably ease to debug (in case of Kuddelmuddel) and it can be applied in almost all configurations of the repository (so you can also use it for contributing to other open source projects).

Two step-by-step guidelines, one for ApplicationOwner/PlatformOwner and one for all other contributors are planned to be added here.  
Until these have been elaborated, an [introduction into the Forking Workflow can be found here](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow).