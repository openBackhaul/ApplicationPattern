## Installation  
It is recommend to check before installing the docker whether the docker is already available or not by using "docker --version".

if the response is empty, install the docker using below commands.
    
* sudo apt install docker.io  for ubuntu
* sudo dnf install docker-ce for redhat
* docker --version - check the docker installed or not

Start docker service and check the status using below commands for ubuntu and rhel.
### Ubuntu
* "sudo systemctl start docker"
* "sudo systemctl enable docker"
* "sudo systemctl status docker"  

### Rhel
* "sudo systemctl enable --now docker"
* "systemctl is-active docker"
* "systemctl is-enabled docker"

[<- Back to Advantages](./DockerIntroduction.md) - - - [Back to Testing Applications](../../../TestingApplications.md) - - - [Ahead to Docker Useful Commands ->](./DockerUsefulCommands.md)