# Management of Conflicts

With several persons working on copies of the same code or document in their respective local repositories, it cannot be excluded that they are altering the same line of code or sentence.  
During consolidating their respective contributions into the same remote repository, Git is rating such case a conflict.  

![MerginConcept1](./pictures/mergingConcept%2001.png)

Conflicts are no broken leg, but they have to be resolved manually.  
This document defines the process for resolving such conflicts.  

The proposed process emphasizes the concept of a guided 
* proposing, 
* reviewing and 
* accepting.  

This means:  
* The contributor is checking his contribution for conflicts
* The contributor is resolving potential conflicts
* The code owner is reviewing the contribution including the resolutions of the conflicts as they are proposed by the contributor
* The code owner is _merging_ the contribution including the conflict resolutions

The following proceeding is effective and very easy to implement:  
* Finishing all changes, which are required to complete the underlying _Issue_, and saving them into the local _feature branch_
* Making a _commit_ in the local _feature branch_ (do not forget a descriptive _commit message_)
* _Merging_ the remote _develop branch_ into the local _feature branch_ (please be aware of the direction: our underlying target is _merging_ the local _feature branch_ into the remote _develop branch_, but for solving the conflicts upfront and locally, we are merging the remote _develop branch_ into the local _feature branch_ first)
* Solving all the conflicts that get indicated during this purely local _merge_, if there are any
* Saving all the files that have been changed during conflict resolution into the local _feature branch_
* Making a _commit_ in the local _feature branch_
* _Pushing_ the local _feature branch_ to the remote repository
* Creating a _Merge Request_ for _merging_ the remote copy of the _feature branch_ into the remote  _develop branch_ (do not forget a descriptive _commit message_ that helps the reviewer to quickly understand and accept the contribution; referencing the underlying issue might save time)
* That's it :)

![MerginConcept2](./pictures/mergingConcept%2002.png)

[<- Back to Formulating Commit Messages](../FormulatingCommitMessages/FormulatingCommitMessages.md) - - - [Up to Preparing for Specifying Applications](../PreparingSpecifying.md) - - - [Ahead to Avoiding Conflicts ->](../AvoidingConflicts/AvoidingConflicts.md)