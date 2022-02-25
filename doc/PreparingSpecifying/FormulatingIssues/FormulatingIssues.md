# Formulating Issues

Development of documentation, specification and code shall be driven by issues (commits shall reference the respective issue).  
These issues shall contain meaningful information and advice for completing the task, even by a third person.  
Issues shall be used not just for bug tracking, but also for feature definition (means: not just fixing existing problems, but also defining next steps in the development).

### What is an issue?
* **Issue queues should mirror your thought process**: structure your ideas, with others or alone
* **Issues should focus on ideas, problems and solutions: they are not activity trackers**! Do not include comments on every activity here
* **The issue queue is where the real collaboration is done**: involve all relevant people here

### How to write issues
Follow the recommendations and standards below for sufficient issue creation and handling.  

|![issues_3](https://user-images.githubusercontent.com/57349523/155708237-833c98f0-73ad-4f61-a770-d3dfca0f5017.jpg)|
|---|

**What to include**
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

***

**And how**
* **remain clear and concise**: keep messages short and to the point, use bullet points
* **keep titles short and descriptive**
* **issue as user story**: if possible consider to include one in the issue, especially beneficial to feature requests. (Example format: “As a [type of user] I want [my goal] so that [my reason].”
* **one issue per issue**: try to break down complex problems into multiple issues if possible
* **use labels**: use labels to reflect the issue status or type (e.g. "bug" for bug issues, or "duplicate" to show that it is a duplicate issue.)
* **use templates**: use the templates and follow the issue structure outlined there.
* **format messages**: use markdown syntax help reader focus, use bold text, lists, images, etc. (only use plain markdown syntax, no embedded html etc.)
* **avoid duplication**: before creating a new issue check that it not already exists (use the search function); if duplicates are found close one (typically the less thorough one) and add missing information from it to the remaining one. The closing comment should contain a link to the remaining issue.
* **objectivity**: avoid speculation and opinion. (E.g. for a bug describe it thorougly and include some investigation results, but do not assume to know where the bug happens.). Describe the feature or change instead of prescribing a solution. Avoid hypotheticals.
* **close solved issues**: close issues once they are solved. Note that while there is also a special syntax to auto-close issues from pull request descriptions and commit messages, issues need to be closed manually, as auto-close will only work if changes are pushed/merged to the *main* branch (we are using branch *tsi*). 

***

**Examples**  
|**Category**|**Example**|
|---|---|
|**context**|*”Since we’ve moved to the latest version of Express.js, we’ve experienced a few performance issues (#14 and #15) on production.”*|
|**problem or idea**|*“We’ve had no way of easily seeing the performance impact before releasing our changes to production.”*|
|**solution or next step**|*“@bobby see with @johnny if he has a tool that could provide us insights on the performances in the development environment. We should include something similar in our development and deployment processes for future projects.”*|
|**short and descriptive titles**|Do: *“Plugins structure refactoring”* <br>Don’t: *“Refactoring the plugins structure to take into account changes in the Express.js library”*|
|**objectivity**|Do: *“The user doesn’t understand that deletion is irreversible.”* <br>Don’t: *“Make the button red.”*|

***

**Issue templates**  
When create new issues in GitHub from the "Issues" tab and pressing button "New issue" a list with available issue templates to choose from appears. Select the one which matches the issue type.  
|![issues_5](https://user-images.githubusercontent.com/57349523/155741109-abc7bdb2-8b4e-4d2a-8e0c-634b92621638.jpg)|
|---|

After pressing the "Get started" button for one of the templates a new page with the template content is displayed. To create the issue sufficiently follow the outlined structure and add content as described in the template.  
|![issues_6](https://user-images.githubusercontent.com/57349523/155742004-a976732b-d92b-4c85-a173-e00892fa97eb.jpg)|
|---|
