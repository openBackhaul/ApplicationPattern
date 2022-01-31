# Installing and Configuring Git

### Installation on Windows

At first, it is recommended to check, whether Git isn't already installed by pressing return after entering "git --version" into the CMD.

If actually not yet installed, download the [standalone installer for windows](https://git-scm.com/download/win) and execute it.

Many configuration dialogs will ask for input. The proposed configuration is fine, but for the following exception:
* Editor: Vim should be replaced by Notepad++ or VisualStudioCode.  
(This choice is just relevant, if Git itself wants to open an editor. It does not restrict the tools consuming the support of Git.)

### Installation on Linux

At first, it is recommended to check, whether Git isn't already installed by pressing return after entering "git --version" into the terminal.

If actually not yet installed, type 
* "apt install git" for Debian, Raspbian or Ubuntu
* "yum install git" for RHEN respectively CentOS
* "dnf install git" for Fedora
* "zypper install git" for SUSE respectively openSUSE

### Configuration on Windows and Linux

After completing the installation, connecting with GitHub needs to be prepared.
* open CMD, respectively terminal
* enter "git config --global user.name _userName_" with _userName_ being identical with your user name at GitHub.
* enter "git config --global user.email _emailAddress_" with _emailAddress_ being identical with the email address you used during registering at GitHub.

(The configurations made with "git config --global" will be used as a default for all repositories on your PC. They will be saved in a file called .gitconfig, which is located in your home folder.)

[Up to Preparing](../PreparingSpecifying.md)
