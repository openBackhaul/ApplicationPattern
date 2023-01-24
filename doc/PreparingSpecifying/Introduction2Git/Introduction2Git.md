# Introduction to Git and GitHub

### What is Git?

Git is a decentralized version control program. In software projects, Git helps to remember changes made by different developers. Later you can trace who made which changes and when (and who was responsible for the catastrophic security bug discovered two years later...).
In principle, you can use Git for any type of project in which only you or a whole team is constantly changing, adding or deleting various files.  

Git works particularly well when a project consists of many relatively small text files. Although Git can also handle binary files, changes in such files are difficult to trace. As such, Git is not ideal for tracking changes in Office documents, in audio and video files, or in virtual machine images.  

In principle, you could use Terminal or PowerShell for controlling Git by the *git* command. The numerous options of this command allow you to download Git projects from external repositories like GitHub, save changed files in a *commit* and re-upload them, switch between different branches of a software project (e.g. master and develop), undo changes etc. (The repository is the collection of all files in a project, which includes not only the current version, but also all previous versions and all development branches.)  

However, you can also use at least a subset of the Git functions via convenient interfaces. Almost all common development environments (Visual Studio, Xcode, IntelliJ, Android Studio, etc.) as well as most major editors (Atom, Sublime, VSCode, etc.) provide menu commands with which you can easily perform elementary Git operations. This also applies analogously to Web interfaces such as GitHub or GitLab. This not only allows you to manage Git projects and, for example, track the changes made to a file, but also use various additional functions (issue/bug management, automated tests, etc.).  
  
Despite all the charm that emanates from comfortable user interfaces, you must be aware that if you do not understand Git, you will sooner or later end up in a dead end (rather sooner) when using even the nicest tools.


### Git versus GitHub versus GitLab

Basically, Git is a decentralized tool that does not rely on central repositories. In practice, however, external Git repositories such as GitHub or GitLab are ubiquitous. They simplify data exchange between the members of a development team considerably, serve as an additional backup and provide various additional functions (documentation, bug tracker, quality assurance, etc.). In the case of public projects, they also serve as information and download sites for anyone interested in the project.  

Modern web interfaces make it easier to get started and to administrate projects. GitHub, a company bought by Microsoft in 2018, currently has the largest market share among Git hosting providers. Open source projects could always be set up there free of charge.
There are a lot of alternatives to GitHub. The best known is the company GitLab, which offers very similar functions - also in this case free of charge or commercially, depending on the requirements. The real specialty of GitLab is that the source code of the program is freely available. This makes it possible to set up GitLab on your own server.
Other providers for Git hosting or for the corresponding software are Azure Repos, Bitbucket as well as Gitea and Gitolite (both to run on their own server).  

Git hosters are not an alternative to Git, but a complement!  
Providers such as GitHub or GitLab do not replace the Git concepts or the git command! Rather, these companies build on the ideas provided by Git. They offer additional functions that have proven to be extremely useful in practice and they lower the barrier to entry.  

Translated from source:
_Git - Projektverwaltung für Entwickler und DevOps-Teams_  
Bernd Öggl und Michael Kofler  
Rheinwerk Verlag

[Up to Preparing for Specifying Applications](../PreparingSpecifying.md) - - - [Ahead to Workflow for contributing ->](../WorkflowForContributing/WorkflowForContributing.md)
