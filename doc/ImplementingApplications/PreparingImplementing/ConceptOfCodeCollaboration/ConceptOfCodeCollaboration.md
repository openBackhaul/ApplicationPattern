## Code collaboration

In the application development process , a team develop solutions for the open API Specification provided by the application owner. This may involve teams of people, new features , and unexpected challenges. A good process that involves a review phase is required for effective code collaboration.

  ![CodeCollaborationFlow](./Images/CodeCollaborationFlow.PNG) 

* In every repository in the openbackhaul GitHub repository, the following two branches will be available to record the progress of the project, 
  *  main branch : is the main working branch created when ApplicationOwner/PlatformOwner pushed file for the first time into the repository.
  *  develop branch : is typically created by the ApplicationOwner/PlatformOwner to restrict developers to make any changes in main branch. 
* Develop branch servers as the integration branch and feature branches can be created from them.
* Developers should 
  * created feature branches to implement code changes.
  * make code changes in the feature branch
  * perform unit testing after making code changes
  * commit changes to the remote branch
* Once changes are commited to the remote branch , pull request can be created to push the code to the develop branch. Merge conflicts should be resolved incase of any.
* While creating the pull request , one or more reviewer can be added to review the code.
* If review request is not approved and requires correction , then review comments should be resolved in the same pull request or in a different pull request.


[<- Back to Development Environmental setup](DevelopmentEnvironmentalSetup.md) - - - [Up to Code Collaboration](CodeCollaboration.md) 

