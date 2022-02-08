# Formulating Pull Requests

A lot of big Open-Source projects do have a public GitHub repository. Via git clone code can easily be downloaded and compiled or executed. However, changing the code, committing it and then uploading it with a git push will not work as only members of the development team are allowed to apply changes. Thus, git push will fail with an error message.  
As it cannot be ensured that all commits/pushes are of sufficient quality, the number of development team members normally will be kept rather small.  

Hence, GitHub has established another approach, which also most other Git plattforms also use in a similar fashion:

**First Fork, ...**

* To contribute to a foreign project, navigate to its GitHub webpage and there press the *Fork* button.
* By forking you will create a copy of the foreign repository inside your own GitHub account.
* Next you can create a local repository on your laptop from the copy via git clone.
* There you can apply the desired changes, test the code and commit it
* If your changes are completed, they can be sychronised to your own GitHub fork (i.e. your copy of the original repository) by using git push. 

**... then Pull Request**

* Inside your local fork on the GitHub web gui there is a tab called "Pull requests". It contains the button *New pull request*. With it you will be redirected to the page of the original project.  
    ![NewPullRequestButton](./pictures/NewPullRequestButton.png)

* The GitHub gui first shows a summary of the applied changes.
* In the next step you will send a message to the developers of the external repository, normally with information about what has been changed and why. By pressing *Create pull request* the operation is finished.  
    ![CreatePullRequestButton](./pictures/CreatePullRequestButton.png)

* The foreign repositories owners are in charge of accepting your changes (*Merge pull request*), declining them or suggesting improvals and asking you for further changes (*Comment*).

Pull requests are the only way to participate in GitHub projects without being a member of the actual development team.  
Often they are using internally inside a project, to prevent uncoordinated changes to the repository. (Further details on pull requests are also found in below listed source.)  

Note that forks and pull requests are not Git techniques. Therefore, no git sub-commands exist. You rather have to conduct these operations inside the web gui of your Git plattform (or if Visual Studio Code is used, a special plugin can be used for operations - see [here](../VSCode2GitHub/VSCode2GitHub.md) for instructions). The nomenclature can be different across various plattforms. E.g. with GitLab they are called "Merge requests".  

Source: 
_Git - Projektverwaltung für Entwickler und DevOps-Teams_  
Bernd Öggl und Michael Kofler  
Rheinwerk Verlag

[Up to Preparing](../PreparingSpecifying.md)
