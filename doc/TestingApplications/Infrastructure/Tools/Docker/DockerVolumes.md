## Docker Volumes
### Overview
The Docker interface is simple and users can easily create and implement applications into their containers or carry out version management, copy, share, and modify, just like managing ordinary code. 

* However, containers often need to use data beyond their container or share data/store data between containers.
* Data is deleted when the containers are crashed/stopped/restarted, then data has lost.

### Data persistance achieved with docker volumes 
To avoid mentioned problems, Docker volumes is a better solution is to work with persistent data in a container where data should be backed up and shared.

* By using volumes  we will not lose the data stored and even if we restart/crashes the containers data lost will not happen. 
* Docker volumes are dependent on Docker’s file system and are the preferred method of persisting data for Docker containers and services.
* When a container is started, Docker loads the read-only image layer, adds a read-write layer on top of the image stack, and mounts volumes onto the container filesystem.

### Docker Volume Useful Commands

|Command	|Description|
|------------|-------------------|
|docker volume create|	  Create a volume|
|docker volume inspect| 	Display detailed information on one or more volumes|
|docker volume ls	   |   List volumes|
|docker volume prune	    |Remove all unused local volumes|
|docker volume rm	     | Remove one or more volumes|



[<- Back to DockerUseFullCommands](./DockerUsefulCommands.md) - - - [Back to Testing Applications](../../../TestingApplications.md) - - - [Ahead to Docker Installation ->](./Installation.md)