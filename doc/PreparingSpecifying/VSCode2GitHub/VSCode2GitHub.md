# Connecting VisualStudioCode on OfficeLaptop with GitHub

This guides describes how VisualStudioCode (VSCode) can be integrated with GitHub.  
Prerequisites are that [VSCode](../InstallingVSCode/InstallingVSCode.md) and [Git](../InstallingGit/InstallingGit.md) were already installed.

### Configure proxy settings

Open the GitBash (this can be done from the Windows Explorer via right-click and selecting "Git Bash Here"):  
![vsc_05](https://user-images.githubusercontent.com/57349523/152162633-c738b33a-f4ae-4ffe-a05d-c435bd132e1e.jpg)

Check if proxies are already set - if yes, unset them:  
```
git config --list 
git config --global --unset http.proxy
git config --global --unset https.proxy
```
As the https proxy is not needed, only the http proxy has to be set:  
```
git config --global http.proxy http://bc-proxy-vip-prod.de.pri.o2.com:8080
```

As a result the git config file, typically found under path *"C:\Users\<username>\.gitconfig"*, should look similar to the following example:  
```
[filter "lfs"]
	required = true
	clean = git-lfs clean -- %f
	smudge = git-lfs smudge -- %f
	process = git-lfs filter-process
[user]
	name = <your github user name>
	email = <your email address used for github>
[http]
	proxy = http://bc-proxy-vip-prod.de.pri.o2.com:8080
```

To allow for uploading (push) local changes to the remote repository the proxy also needs to be set in VSCode.  
Therefore go to *File* -> *Preferences* -> *Settings* and type proxy into the appearing window. There enter the proxy:    
![vsc_14](https://user-images.githubusercontent.com/57349523/152184549-29eed2d0-cf8f-4b38-b343-3ca0762889d9.jpg)

### Clone the GitHub repository to VSCode

Navigate to the [openBackhaul git repository](https://github.com/openBackhaul/ApplicationPattern/tree/tsi) in the browser to obtain the repository URL. Pressing the green “Code” button expands a clone menu from which the URL can be copied:  
![vsc_02](https://user-images.githubusercontent.com/57349523/152162626-7b471cb2-7957-45f4-a295-630fb64799b8.jpg)

With the URL now being available in the clipboard open VSCode and select the *“Clone Git Repository…”* option and insert the URL:  
![vsc_01](https://user-images.githubusercontent.com/57349523/152162617-38539c42-909b-4a64-9440-83338ac9ad80.jpg)

Press *“Clone from URL”* and select a location to which the files from the repository will be downloaded (note that this already creates the ApplicationPattern folder).  
![vsc_03](https://user-images.githubusercontent.com/57349523/152162630-03b0bdbb-c44e-43a8-b954-72b9fba97f84.jpg)

Change to the *tsi* branch by pressing the branch button in the bottom left corner and select the *tsi* branch in the then appearing selection menu. The sources from the selected branch will then be downloaded to the local directory and are shown in VSCode.  
![vsc_06](https://user-images.githubusercontent.com/57349523/152162636-3587d64c-21d0-4d54-8869-700b293bc995.jpg)

The *tsi* branch sources will be shown in the explorer:  
![vsc_07](https://user-images.githubusercontent.com/57349523/152162638-ec039755-eb12-4119-bc8e-40d4b9df8139.jpg)

If asked whether the repository should be fetched regularly select “yes”.  

### Commit / Push / Pull

After changing files different actions are possible:
* Commit: a commit captures the currently staged changes (locally if done in VSCode)
* Revert: a forward-moving undo operation that offers a safe method of undoing changes
* Push: pushes the committed changes from the local to the remote repository (requires special permissions!)
* Pull: downloads the recent changes on the remote repository to the local repository and is also used for merging changes from one branch to another. (Before changing anything it is recommended to issue a pull to ensure that your local repository is up to date.)

To apply changes made locally switch to the source control tab (the branch icon in the menu bar to the left). The changes can be committed via the check mark box on the top. For commit/push/pull operations always enter meaningful comments.    
![vsc_08](https://user-images.githubusercontent.com/57349523/152162641-f13fa48e-c58a-45b5-a69f-a9a6ebbff7e3.jpg)
![vsc_09](https://user-images.githubusercontent.com/57349523/152162642-bf8d66ae-0d6e-41e2-a955-0f3d9bd54049.jpg)

To upload your changes press the *"Sync Changes"* button:  
![vsc_10](https://user-images.githubusercontent.com/57349523/152162647-90b1e90b-e0b7-4656-ae25-6fe271e67fba.jpg)

If necessary peform the required authentication:  
![vsc_11](https://user-images.githubusercontent.com/57349523/152162650-cbd2c005-fcd7-405a-8e17-c3521d3d57a6.jpg)

VSCode will try to push the changes to the remote repository, but will only succeed for users which have the permission to push content to the *tsi* branch:  
![vsc_12](https://user-images.githubusercontent.com/57349523/152162653-59a0e1d1-dd16-4f9c-bd88-3ccfae0c45cd.jpg)

Selecting the *"Create Fork"* will push the changes to a new fork/branch. To merge the changes into the *tsi* branch a pull request has to be created. Users with push permission then can approve this pull request to merge the changes into the *tsi* branch.
The pull request can be created either via the browser or from VSCode. The latter requires an additional plugin to be installed.

### Creating a Pull Request

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

**_Proxy issue_**:  
In case the following error message appears when trying to clone the repository from the URL, then most likely something went wrong during the git proxy configuration as git is not able to connect to the Internet. In that case go over the configuration steps again to ensure everything was configured correctly.  
![vsc_04_errormsg](https://user-images.githubusercontent.com/57349523/152162632-f35d84e1-8337-4949-8a59-8a2b4b78c863.jpg)

**_Conflicts in pull requests_**:  
The pull request will show that there are conflicts that need to be removed before a merge can be done. As a pull request is issued *because* changes were made, this should always be the case. Before the changes can be merged into the target branch these conflicts need to be resolved. For the *tsi* branch this needs to be done by the users with push permission.

[Up to Preparing](../PreparingSpecifying.md)
