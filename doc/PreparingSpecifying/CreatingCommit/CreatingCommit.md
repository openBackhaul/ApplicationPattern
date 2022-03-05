# Creating a Commit

While changing the files in your local copy of the repositoy, you might have saved them several times.  
After completing a subtask of the issue, which is underlying the branch, you should create a commit.  
A commit captures the currently staged changes in such a way that you can return to this status again later, if necessary.  
Of course, it makes sense to properly define this status by a meaningful description (see [chapter about Formulating Commit Messages](../FormulatingCommitMessages/FormulatingCommitMessages.md)).  

To apply changes made locally switch to the source control tab (the branch icon in the menu bar to the left).  
If you would like to commit all changes, you would have to click the check mark box on the top.  

![vsc_08](https://user-images.githubusercontent.com/57349523/152162641-f13fa48e-c58a-45b5-a69f-a9a6ebbff7e3.jpg)  

Please, enter a meaningful commit message.  
Particularly, the headline is very important.  
Please, regard the rules defined in the [chapter about Formulating Commit Messages](../FormulatingCommitMessages/FormulatingCommitMessages.md).  

![vsc_09](https://user-images.githubusercontent.com/57349523/152162642-bf8d66ae-0d6e-41e2-a955-0f3d9bd54049.jpg)

After completing the commit message, press Ctrl+Enter.  

Please, keep in mind that your commit has been stored just locally.  
If you would like to benefit from backup and sharing with the project team, you would now have to upload your commit by synchronizing your local copy of the repository with GitHub.  
To upload your changes press the *"Sync Changes"* button:  

![vsc_10](https://user-images.githubusercontent.com/57349523/152162647-90b1e90b-e0b7-4656-ae25-6fe271e67fba.jpg)

If it would be your first commit to the repository, you would be asked to peform an authentication.  
The proceedure is well guided by the GitHub website; just provide the requested data.  

![vsc_11](https://user-images.githubusercontent.com/57349523/152162650-cbd2c005-fcd7-405a-8e17-c3521d3d57a6.jpg)

After authentication, VSCode will try to push the changes to the remote repository.  

It would not succeed, if you would neither be owner nor _Contributor_ to the addressed repository.  
In such case you would have to address your push to a fork (copy) of the original repository in your own GitHub account (see also [Forking Workflow](../ForkingWorkflow/ForkingWorkflow.md)).  

Even if you are _Contributor_ to the addressed repository, you need permission to push into the addressed branch.
This might not be true, in case you forgot to create a feature branch before starting to work.
In such case, you would now fail to push your commit into develop or main branch. 

![vsc_12](https://user-images.githubusercontent.com/57349523/152162653-59a0e1d1-dd16-4f9c-bd88-3ccfae0c45cd.jpg)

If you are _Contributor_ (and as the ApplicationOwner you certainly are) and properly created a feature branch before starting to make changes, this feature branch will now be published in the original repository on GitHub.  

[Up to Preparing](../PreparingSpecifying.md)
