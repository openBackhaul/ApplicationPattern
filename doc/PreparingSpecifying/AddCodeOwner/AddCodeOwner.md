# Adding the CodeOwner to your repository

## Introduction

The CodeOwner has to approve every merge into its repository or subfolder.  
The ApplicationOwner shall be defined to be CodeOwner on the entire repository.

## How to define the CodeOwner

1. Find or create the `.github` folder in the root directory and change into it.  
2. Add a new file named `CODEOWNERS`.  
3. Open the CODEOWNERS file.  
4. Add your own GitHub account name like this:  
```
  @your-github-account-name

```
5. Commit the file into the _develop_ branch.
