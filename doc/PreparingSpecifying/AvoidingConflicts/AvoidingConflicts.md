# Avoiding Conflicts

As described in [Managing Conflicts](../ConflictManagement/ConflictManagement.md), creating conflicts is inherent to several persons working on copies of the same code or document, but probability of conflicts can significantly be reduced.  

Examples:
* Person A and person B are working in parallel. They are organizing their work in **small** packages. Person A creates a _feature branch_, makes 5 changes on the code and _merges_ again into the common _develop_ branch. Same for person B. In this example, person B has 5 chances to get into conflict with 5 changes made by person A in meantime.
* Person A and person B are working in parallel. They are organizing their work in **big** packages. Person A creates a _feature branch_, makes 50 changes on the code and _merges_ again into the common _develop_ branch. Same for person B. In this example, person B has 50 chances to get into conflict with 50 changes made by person A in meantime.

Without doing exact calculations, it is obvious that working in parallel for long periods can rapidly increase the chances for conflicts.

It is also obvious that there are two root causes of conflicts that have to coincident:
* Own changes
* Changes, which have been made by other members of the team

In principle, it can be assumed that the number of changes, which are made by other members of the team during some time period, is a matter of coincidence.  
So the only way of keeping the number of potential source of conflicts low is keeping the time between creating a branch and _merging_ it short.  

Several persons working in parallel does not necessarily mean creating conflicts, if these persons would work on different parts of the code.  

The following proceeding is recommended and also described in the step-by-step guidelines for [Documenting an Issue](../DocumentingAnIssue/DocumentingAnIssue.md), [Processing an Issue](../ProcessingAnIssue/ProcessingAnIssue.md) and [Completing an Issue](../CreatingMergeRequest/CreatingMergeRequest.md):
* Create _Issues_ for describing fixes, but also features!  
* Assign these _Issues_ to concrete persons, and take care that different persons are working on different parts of the code or document  
* Keep the scope of the individual _Issue_ small (effort for 30 minutes up to 1 day in maximum)  
* Only work on _Issues_ that are assigned to yourself  
* Before starting to work, read the _Issue_ in deep detail and add notes about all necessary changes  
* When starting to work, update your local copy of the _develop branch_ first, and create a fresh _feature branch_ [Processing an Issue](../ProcessingAnIssue/ProcessingAnIssue.md) second  
* Focus on a single _Issue_ at a time and keep going until all necessary changes are completed  
* Double check completeness and correctness of the changes, _merge_ them into the common _develop branch_ right after [Completing an Issue](../CreatingMergeRequest/CreatingMergeRequest.md), close the _Issue_ and delete your local _feature branch_.  

Over the intention of creating small packages, it shall not been forgotten that the _develop branch_ shall always contain an executable code.  
It is not planned to _merge_ partly solved problems or half of an _Issue_.

In rare cases, it is maybe unavoidable to work on an _Issue_ for several days and create a lot of changes until an executable contribution to the _develop branch_ is ready for _merging_.  
In such case, at least the second root cause of conflicts (changes, which have been made by other members of the team) should be actively managed by _merging_ the latest status of the _develop branch_ into the local _feature branch_ on a daily base.  
It is recommended to do this before continuing working in the local _feature branch_.

[<- Back to Managing Conflicts](../ConflictManagement/ConflictManagement.md) - - - [Up to Preparing for Specifying Applications](../PreparingSpecifying.md) - - - [Ahead to own GitHub account ->](../OwnGitHubAccount/OwnGitHubAccount.md)
