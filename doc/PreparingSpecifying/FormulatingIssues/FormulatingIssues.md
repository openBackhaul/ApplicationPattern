# Formulating Issues

Development of documentation, specification and code shall be driven by Issues.  
Issues shall be used not just for fixing existing problems, but also for defining next steps in the development.  
Aligning thoughts with team members or users while formulating the Issues is much cheaper and faster than correcting code or formalized specifications.  
Descriptions of Pull-requests shall [reference the respective Issue (or Issues)](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls).  

Every Issue shall exclusively deal with a single subject.  
If it would turn out that an existing Issue decomposes into multiple subjects (maybe even affecting multiple repositories), several new Issues shall be formulated and the original Issue shall be reduced to referencing all the new Issues (take care that references are made in such a way that they get automatically updated based on the status of the referenced Issue).  

Keep titles short and descriptive.  
Avoid words that could be used in every title.  
Avoid details about the location of the problem in the title.  

In first place, Issues have to be divided into the following two categories:  
1) It's your repository; you formulate the Issue; you assign it to yourself. So, the Issue serves either as a reminder or a documentation of an idea.  
2) You are not the CodeOwner and the requested change has to be processed by someone else.  

_In case of 1):_  
No matter how you formulate the Issue, it will help you to structure and plan your activities.  
It allows you to separate developing basic ideas from elaborating the concrete formulation (which is often suppressing your creativity by uncertainties about the exact syntax).  
If you are expecting the Issue not to be executed at the same day, it is recommended to include a statement that puts it into context. This might be a description of an insufficiency or a wished result.  
If you would already have an idea about how the situation could be fixed, this idea should be noted.  
Frame conditions, requirements, even doubts about the first idea should be noted as bullet points.  
You will be thankful for every note that helps you to shorten the time period for thinking yourself back into the subject again later.  

_In case of 2):_  
Check, whether your point has already been covered in one of the already existing Issues (open and closed).  
Please consider that from the CodeOwner's point of view everything is fine.  
It's you who wishes a modification.  
A clear and concise description obviously increases chances to get the wished change.  
Avoid prescribing a concrete syntax for solving a problem in the title or as the exclusive content of the text.  
Describe the currently wrong situation and/or how the situation could be better.  
After being convinced from need for change, the CodeOwner is certainly open for a concrete **proposal** about where and how to fix the code.  
Avoid speculations and opinions, but focus on problems, ideas and propose solutions.  

If you are at least Collaborator, it makes sense to address the Issue.  
Assign it to the ApplicationOwner, if changes to the specification are required.  
Assign it to the ApplicationImplementer, if changes to the implementation are required.  

If you are the CodeOwner:  
- Use labels for categorizing the kind of change required.  
- Use milestones for scheduling the required change.  

If you would be unsure about proper labels and milestones, visit one of the existing repositories (e.g. [ApplicationPattern](https://github.com/openBackhaul/ApplicationPattern/issues), [RegistryOffice](https://github.com/openBackhaul/RegistryOffice/issues) etc.) as a reference.


[<- Back to Forking Workflow](../ForkingWorkflow/ForkingWorkflow.md) - - - [Up to Preparing for Specifying Applications](../PreparingSpecifying.md) - - - [Ahead to Formulating Commit Messages ->](../FormulatingCommitMessages/FormulatingCommitMessages.md)
