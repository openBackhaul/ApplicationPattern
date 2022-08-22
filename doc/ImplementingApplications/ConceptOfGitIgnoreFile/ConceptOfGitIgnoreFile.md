# .gitignore file

* A .gitignore file is a plain text file where you can write a list of patterns for files or folders that Git must not track from your project. 
* It’s commonly used to exclude external libraries in the project.

* In the server-side stub , a node_modules/ folder is available that consists of all JavaScript dependent libraries required by the server. 
* This folder should be excluded from a remote Git repository because it has a large size.
* To exclude the node_modules/ from the remote commit and pull request , a .gitignore file with the rules defined to exclude the node_modules/ is required in the server/ folder.





