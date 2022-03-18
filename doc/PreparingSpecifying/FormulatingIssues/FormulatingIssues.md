# Formulating Issues

Development of documentation, specification and code shall be driven by issues (commits shall reference the respective issue).  
These issues shall contain meaningful information and advice for completing the task, even by a third person.  
Issues shall
* be used not just for fixing existing problems, but also for defining next steps in the development.  
* structure your thoughts, ideally together with others (**here is where the real collaboration happens!**).  
* focus on ideas, problems and solutions.

### How to write issues

* !!! **one issue per issue** !!!: try to break down complex problems into multiple issues
* **keep titles short and descriptive**
* **start titles with one of the following keywords** (followed by a ":") for consistency:
  * Add
  * Fix
  * Merge
  * Polish
  * Refactor
  * Release
  * Remove
  * Revert
  * Update
* **remain clear and concise**: keep messages short and to the point, use bullet points
* format messages: use markdown syntax help reader focus, use bold text, lists, images, etc. (only use plain markdown syntax, no embedded html etc.)
* avoid duplication: before creating a new issue check that it not already exists; if duplicates are found close one (typically the less thorough one) and add missing information from it to the remaining one. The closing comment should contain a link to the remaining issue.
* avoid speculation and opinion: E.g. for a bug describe it thorougly and include some investigation results, but do not speculate where the bug happens.
* issue as user story: if possible consider to include one in the issue, especially beneficial to feature requests. (Example format: “As a [type of user] I want [my goal] so that [my reason].”
* **use labels**: use labels to reflect the issue status or type (e.g. "bug" for bug issues, or "duplicate" to show that it is a duplicate issue.)
* **close solved issues**: close issues once they are solved.

### What to include into the message

|![issues_3](https://user-images.githubusercontent.com/57349523/155708237-833c98f0-73ad-4f61-a770-d3dfca0f5017.jpg)|
|---|

* **context**: explain the condition that led to writing the issue
* **problem or idea**: the context should lead to an idea or problem etc.
* **solution or next step**: engage others here if necessary (e.g. request feedback, assign issue to someone else, etc),must-have, as this is where you move forward
* **include all relevant information when creating the issue**: leave out all the irrelevant information
* **reproduction steps**: in case of bugs or errors provide instructions (reduce steps only the bare minimum) on how to reproduce the problem.
* **include the right people in the discussion**: apart from assigning the issue to the correct person, mention others to get feedback
* **for issues with source code**
	* *add project version*: important for context of the issue
	* *add branch* to which the issue is related (e.g. on branch-1 the issue is still there, but not on branch-2, as it has been fixed there already)
	* *code over text*: include relevant code snippet instead of explaining what it does.

[<- Back to Forking Workflow](../ForkingWorkflow/ForkingWorkflow.md) - - - [Up to Preparing for Specifying Applications](../PreparingSpecifying.md) - - - [Ahead to Formulating Commit Messages ->](../FormulatingCommitMessages/FormulatingCommitMessages.md)