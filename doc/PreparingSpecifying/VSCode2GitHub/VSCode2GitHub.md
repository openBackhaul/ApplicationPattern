# Connecting VisualStudioCode on OfficeLaptop with GitHub

This guideline describes how Visual Studio Code (VSCode) can be integrated with GitHub.  
VSCode and Git must be installed already.

### Configure proxy settings

Open the GitBash (this can be done from the Windows Explorer via right-click and selecting "Git Bash Here"):  
|![vsc_05](https://user-images.githubusercontent.com/57349523/152162633-c738b33a-f4ae-4ffe-a05d-c435bd132e1e.jpg)|
|---|

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
|![vsc_14](https://user-images.githubusercontent.com/57349523/152184549-29eed2d0-cf8f-4b38-b343-3ca0762889d9.jpg)|
|---|

### Clone the GitHub repository to VSCode

Navigate to the [repository, which you would like to work with,](https://github.com/openBackhaul?tab=repositories) in the browser to obtain the repository URL. Pressing the green “Code” button expands a clone menu from which the URL can be copied:  
|![vsc_02](https://user-images.githubusercontent.com/57349523/152162626-7b471cb2-7957-45f4-a295-630fb64799b8.jpg)|
|---|

With the URL now being available in the clipboard open VSCode and select the *“Clone Git Repository…”* option and insert the URL:  
|![vsc_01](https://user-images.githubusercontent.com/57349523/152162617-38539c42-909b-4a64-9440-83338ac9ad80.jpg)|
|---|

Press *“Clone from URL”* and select a location to which the repository will be downloaded (note that a folder of the repository's name will automatically be created).  
|![vsc_03](https://user-images.githubusercontent.com/57349523/152162630-03b0bdbb-c44e-43a8-b954-72b9fba97f84.jpg)|
|---|

Change into the local folder to which the repository has been downloaded.  
Change into the .git subfolder and open the config file.  
Take care that an *"longpaths = true"* statement is added in the core section.  
```
[core]
	repositoryformatversion = 0
	filemode = false
	bare = false
	logallrefupdates = true
	symlinks = false
	ignorecase = true
	longpaths = true
[remote "origin"]
	url = https://github.com/openBackhaul/Resolver.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "develop"]
	remote = origin
	merge = refs/heads/develop
[branch "main"]
	remote = origin
	merge = refs/heads/main
```
Save and close the config file.  

Change to the **develop** branch by pressing the branch button in the bottom left corner and select the *develop* branch in the then appearing selection menu.  
The resources of the selected branch will then be downloaded to the local directory and are shown in VSCode.  
|![vsc_06](https://user-images.githubusercontent.com/57349523/152162636-3587d64c-21d0-4d54-8869-700b293bc995.jpg)|
|---|

The **develop** branch resources will be shown in the explorer:  
|![vsc_07](https://user-images.githubusercontent.com/57349523/152162638-ec039755-eb12-4119-bc8e-40d4b9df8139.jpg)|
|---|

If asked whether the repository should be fetched regularly select “yes”.  

### Troubleshooting

**_Proxy issue_**:  
In case the following error message appears when trying to clone the repository from the URL, then most likely something went wrong during the Git proxy configuration as Git is not able to connect to the Internet.  
In that case go over the configuration steps again to ensure everything was configured correctly.  
|![vsc_04_errormsg](https://user-images.githubusercontent.com/57349523/152162632-f35d84e1-8337-4949-8a59-8a2b4b78c863.jpg)|
|---|

[<- Back to Installing VSCode](../InstallingVSCode/InstallingVSCode.md) - - - [Up to Preparing for Specifying Applications](../PreparingSpecifying.md) - - - [Ahead to Documenting an Issuee ->](../DocumentingAnIssue/DocumentingAnIssue.md)
