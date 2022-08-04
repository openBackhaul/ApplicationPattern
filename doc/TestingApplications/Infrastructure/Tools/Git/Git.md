# Git, Github and Plug-ins

**Concepts**

TODO: Please, describe the general targets, concepts, principles and rules for applying Git, Github and Plug-ins in the Microwave SDN Laboratory.
Please, regard and (if possible and reasonable) reference existing documentation from the [Preparation](https://github.com/openBackhaul/ApplicationPattern/blob/develop/doc/PreparingSpecifying/PreparingSpecifying.md) sections.
Please, be frugal with picture and graphics that might out-date soon.


### Git,GitHub and plugins

### Table of contents
* Overview
* More about git,github 
* Usefull Command line commands

#### Overview
Git is a free and open source distributed version control system and easy to learn. Github is used more efficiently to manage git repositories on centralized server. 
Git makes it easy to use by users:
    
- Keep track of code history
- Collaborate on code as a team
- See who made which changes
- Deploy code to staging or production
          

#### More about git,github 

 [ Please refer this more details about installation process, configuration,work flow in SDN and other indetail explanation](./../../../../PreparingSpecifying/Introduction2Git/Introduction2Git.md)

#### Command line git commands:

|Commands &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| description|
|---------|-------------|
|git clone <RepositoryURL> | copy a remote repository into local machine|
|git pull | get the changes made in remote repository by the team members|
|git status | shows the status of changes as untracked, modified, or staged.|
git add <filenames> |staged/add the changes |
|git stash | to remove the local changes made in local clone|
|git checkout -b&nbsp; <localbranch> <remotebranch> | to take local branch from remote branch|
|git branch -r &nbsp; | list the branches|
|git commit | to commit the chnages in local repository/branch|
|git push | push the changes into remote repository|
|git branch -D <branch name> | to remove any branch from local|
|git revert | revert the commits very smoothly |
|git reset | discard the commits which are no need|
|git log | get the details about commits that made on branch/repository|


Reference link:

*[Refer this link to know more about commands](https://docs.github.com/en/get-started/using-git/about-git )