# Formulating Commit and Pull-Request Messages  

Development of documentation, specification and code shall be collaborative.  
This includes reviewing artifacts before consolidating them into the shared base.  
Such review is not just "additional work", but also time critical, because the shared base might change between pull-request and merge.  


### Subject line and Body of Commits  

- The subject line allows 50 characters or less: formulate meaningful, concise and comprehensive!  
- Start the subject line with a verb, e.g. with one of the following keywords, as e.g. Add, Update, Remove, Refactor, Revert, Correct ...  
- Formulate the imperative: e.g. "Add ServiceList", but not "ServiceList added" or "Adds ServiceList".  
- Do not end the subject line with a dot.  
- Be aware that the body of the commit message is usually not visible:  
  - It's better to make more often Commits and to use just the subject line.  
  - Otherwise describe all covered aspects with similarly styled statements in the body of the commit message.  

The commit message dialogues at GitHub and VSCode are slightly different.

|**GitHub**|**VSCode**|
|---|---|
|The subject line and body have own text fields.|There is only a single textfield (add linebreaks <br>like in any regular editor to separate subject line and body).|
|![commit_2](https://user-images.githubusercontent.com/57349523/155980718-cbbb2d14-89c7-4938-9e15-70253f7252e3.jpg)|![commit_1](https://user-images.githubusercontent.com/57349523/155980716-30b63626-4f73-4268-9851-cbefc6d24619.jpg)|


### Subject line and Body of Pull-Request    
- In regards to the subject line, apply the same rules as for Commits
- Separate subject from body with a blank line, if e.g. VSCode is used  
- Automate closing the underlying Issue(s) by adding "Fixes #issue-number" (e.g. "Fixes #134") to the body

Adding the _Fixes_ statement to the body of the Pull-Request is really a must, because ...
- ... the underlying Issue gets referenced in the Pull-Request; usually it's not required to add further details in the body of the Pull-Request.  
- ... the underlying Issue gets automatically closed at the moment the Pull-Request gets merged.  
- ... a reference to the Pull-Request is added to the Issue. So, you can jump back and forth.  
- ... the Issue gets marked as being covered by a Pull-Request in the list of Issues.  


### Commenting on Pull-Requests  
- Ideally, you are associating your comment with the affected line.  
- Ideally, you are explicit in what to be replaced by what.  
- Often, the same mistake occurs multiple times in the same document. If you would formulate (and test) a phrase to be searched and replaced (CTRL+h) by a correct one, commenting and correcting efforts might get massively reduced.  
- If the mistake would not be 100% obvious and clear, explain the need for change in the same way as in an Issue.  


### Reacting on Comments in Pull-Requests  
- Answer to every comment.  
- If you accepted the proposed change, then confirm this.  
- If you made modifications, but different from the proposed ones, then explain why.  
- In case of need for clarification, formulate questions.  


[<- Back to Formulating Issues](../FormulatingIssues/FormulatingIssues.md) - - - [Up to Preparing for Specifying Applications](../PreparingSpecifying.md) - - - [Ahead to Managing Conflicts ->](../ConflictManagement/ConflictManagement.md)
