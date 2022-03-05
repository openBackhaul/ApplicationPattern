# Completing an Issue and creating a Merge Request

**Under Construction!!!**

**Text just copied from some other chapter**

### Creating a Pull Request

After changing files different actions are possible:
* Commit: a commit captures the currently staged changes (locally if done in VSCode)
* Revert: a forward-moving undo operation that offers a safe method of undoing changes
* Push: pushes the committed changes from the local to the remote repository (requires special permissions!)
* Pull: downloads the recent changes on the remote repository to the local repository and is also used for merging changes from one branch to another. (Before changing anything it is recommended to issue a pull to ensure that your local repository is up to date.)


**Creating pull requests in the browser**

Open the GitHub repository in the browser. The recent changes should be shown along with the option to create a pull request. Continue by pressing the create button:  
![vsc_15](https://user-images.githubusercontent.com/57349523/152191162-c92af012-f450-4827-a7ec-c7993e06d7bc.jpg)

In the dialogue ensure that the target branch is set to *tsi* and add a meaningful message. Then create the pull request and wait for it to be approved of:  
![vsc_16](https://user-images.githubusercontent.com/57349523/152191181-e2fbf0c5-7e24-43d0-9c56-4ebdb36f7f0c.jpg)

**Creating pull requests from VSCode**

For creating pull requests directly from VSCode an additional VSCode extension will be used.

**_Installation of VSCode extension_**

Ensure that the VSCode extension *"GitHub Pull Request and Issues"* is installed. Display the extensions tab:  
![pull_01](https://user-images.githubusercontent.com/57349523/152354603-9a6c09d2-9001-48a5-9701-bedb7f63724a.jpg)

If it is not listed under the installed extensions execute the installation now:  
![pull_02](https://user-images.githubusercontent.com/57349523/152344762-ebdd0a19-9042-4b22-965d-944357753477.jpg)
![pull_03](https://user-images.githubusercontent.com/57349523/152344763-6aeb9d76-7588-4b32-8b90-1c5fcd3963b3.jpg)

A new viewlet will apear on the activity bar. Click on the new button and sign in to GitHub:  
![pull_04](https://user-images.githubusercontent.com/57349523/152354638-2b7d89cc-496b-41c4-bc6e-ee41abdc57c9.jpg)

After successful login the new viewlet will show a list of pull requests and issues:  
![pull_05](https://user-images.githubusercontent.com/57349523/152344766-72416398-cdc6-4ba0-a006-64109cc87ebd.jpg)

**_Creation of pull requests_**

New pull requests can be created from the source control tab by pressing the new pull request icon:  
![pull_06](https://user-images.githubusercontent.com/57349523/152344768-12c76921-c38e-4701-a1bd-3b76e8b90d64.jpg)

Set the correct branches (do not select *main* as target branch, but *tsi*!) for the pull and add a proper title:   
![pull_08](https://user-images.githubusercontent.com/57349523/152344773-b52e3942-3e90-45bd-9949-45f46e701dfd.jpg)

After creation the pull request will be visible in the viewlet:  
![pull_10](https://user-images.githubusercontent.com/57349523/152344776-4c486b0a-af65-4e26-ae62-df86a7a2eeee.jpg)

Note: *as this is a pull and not a push request the changes will not be visible in the target branch until a user with push permission approves of the changes and merges them in to the target branch.*

### Troubleshooting

**_Conflicts in pull requests_**:  
The pull request will show that there are conflicts that need to be removed before a merge can be done. As a pull request is issued *because* changes were made, this should always be the case. Before the changes can be merged into the target branch these conflicts need to be resolved. For the *tsi* branch this needs to be done by the users with push permission.
