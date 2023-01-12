# Avoiding Conflicts

As described in [Managing Conflicts](../ConflictManagement/ConflictManagement.md), creating conflicts is inherent to several persons working on copies of the same code or document, but probability of conflicts can significantly be reduced.  

Without doing exact calculations, it is obvious that working in parallel for long periods is increasing chances for conflicts.  
So one method for keeping the number of conflicts low is minimizing the time period between creating a _feature branch_ and _merging_ it back into _develop_.  

Several persons working in parallel does not necessarily mean creating conflicts, if these persons would work on different parts of the code.  
Unfortunately, Git doesn't indicate the code segments, which are currently under change in separate branches.  

The following proceeding is recommended and also described in the step-by-step guidelines for [Documenting an Issue](../DocumentingAnIssue/DocumentingAnIssue.md), [Processing an Issue](../ProcessingAnIssue/ProcessingAnIssue.md) and [Completing an Issue](../CreatingMergeRequest/CreatingMergeRequest.md):
* Create _Issues_ for describing fixes, but also features!  
* Assign every _Issue_ to exactly one person and take care that persons are working on separate parts of the code.  
* Keep the scope of the individual _Issue_ small (effort for 30 minutes up to 1 day in maximum).  
* Exclusively work on _Issues_ that are assigned to yourself (if necessary change the assignment, but coordinate this step with the former assignee).  
* Before starting to work, read the _Issue_ in deep detail and add notes about all necessary changes.  
* When starting to work, update your local _develop branch_ first, and create a fresh _feature branch_ for [Processing an Issue](../ProcessingAnIssue/ProcessingAnIssue.md) from your updated local _develop branch_ second.  
* Focus on a single _Issue_ at a time and keep going until all necessary changes have been completed.  
* Double check completeness and correctness of the changes.  
* Replicate your local _feature branch_ to Github.  
* Create a _Pull-Request_ from the remote _feature branch_ into the remote _develop branch_ right after [Completing an Issue](../CreatingMergeRequest/CreatingMergeRequest.md).  
* Define a team member to be _Reviewer_. If you wouldn't be _CodeOwner_, the _CodeOwner_ should be automatically listed as _Reviewer_.  
* Assign the _Pull-Request_ to the person, who shall consolidate potential feedback and execute the _Merge_.  
* Deal with the feedback as soon as some has been provided.  
* If a second review would be required, don't forget to push the circular arrows.  
* As soon as all comments have been resolved, merge the remote _feature branch_ into the remote _develop branch_.  
* Delete the remote _feature branch_.  
* Make sure the underlaying _Issue_ has been closed.  
* Delete the local _feature branch_.  

Additional hints:
* Github produces a lot of emails. Your _Reviewer_ might overlook the request for review. Potentially, it make sense sending a separate email with a little bit of useful information and a direct link into the _Pull-Request_.  
* Be frugal with appointing _Reviewers_. Reviewing is work. If you would appoint several _Reviewers_, you wouldn't know, who is actually active. In worst case, you would do the _Merge_ while some _Reviewers_ are still in the process.  
* If you would have been appointed to be _Reviewer_, conclude the review as soon as possible. Chances of conflicts are constantly increasing until the _Merge_. Often, the CodeOwner would like to start working on the next _Issue_, but can't until the current one has been _merged_.  

Over the intention of creating small packages, it shall not been forgotten that the _develop branch_ shall always contain an executable code.  
It is not planned to _merge_ partly solved problems or half of an _Issue_.

In rare cases, it is maybe unavoidable to work on an _Issue_ for several days and create a lot of changes until an executable contribution to the _develop branch_ is ready for _merging_.  
In such case, at least the second root cause of conflicts (changes, which have been made by other members of the team) should be actively managed by _merging_ the latest status of the _develop branch_ into the local _feature branch_ on a daily base.  
It is recommended to do this before continuing working in the local _feature branch_.

[<- Back to Managing Conflicts](../ConflictManagement/ConflictManagement.md) - - - [Up to Preparing for Specifying Applications](../PreparingSpecifying.md) - - - [Ahead to own GitHub account ->](../OwnGitHubAccount/OwnGitHubAccount.md)
