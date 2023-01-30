## Docker Usage in Microwave SDN Laboratory 

To create and deploy the containers in a docker engine ,we are following the procedure as below.

Please find the example flow below

![SDNApplications](Images/NewDockertynyapplicationpattern.PNG)

#### Context :
We are creating containers for the applications which are having database in the form of json file. This file will be modified based on certain actions. And this data needs to be persisted. So, to persist the data/get backed up, we are creating persistent volume for every application in the docker environment. 
	
#### To create docker volumes below steps to be used steps 
* Create a docker volume and then use this volume while running the container.

        docker volume create <volumeName>
        ex: docker volume create registry-office

* After creating volumes , to make sure whether it is created or not by using, 
       
        docker volume inspect <volumeName>
        ex: docker volume inspect registry-office

* Default path in the servers are **/var/lib/docker/volumes**

        Example : WebApp@WebApp:/var/lib/docker/volumes$ pwd
        /var/lib/docker/volumes
        WebApp@WebApp:/var/lib/docker/volumes$ ls
        administrator-administration-v1 metadata.db  oam-log-v1  registry-office-v1     type-approval-registry-v1
        application-layer-topology-v1  

#### Build image and deploy the containers :
Once created the volumes, attach these to the containers and storage will be mounted as database/filesystem to current created container from the docker application build image. 

While running the applications as container, the created volumes will be maintain the all application configured data.
* To build image,
        
        sudo docker build -t <image-name>
        ex: sudo docker build -t registry-office-v1
* To run container and attach/map the volume,
        
        sudo docker run -d -p <port>:<port> --name <imagename> -v <volumename>:<pathtomount><localmountedpath>
        ex : sudo docker run -d -p <1234>:<1234> --name registry-office-v1 -v registry-office-v1:/home/openbackhaul/registryOffice/database /home/registry-office
* Check whether the container is running or not using below command
        
        docker ps 
        example: WebApp@WebApp:/var/lib/docker$ docker ps
        207f3f43e0e2   cicd_user/registry-office-v1               "docker-entrypoint.s…"   23 hours ago   Up 2 hours         0.0.0.0:xxxx->xxxx/tcp, :::xxxx->xxxx/tcp  
        
#### Example pictorial representation of application, its deployment
Using above procedure, created all applications as container on app server and below is the example for one application.

![SDN dockerize Application Pattern overview](Images/exmpleROdockerimage.PNG)

[<- Back to Installation](./Installation.md) - - - [Back to Testing Applications](../../../TestingApplications.md) - - - [Ahead to Debugging ->](./DebuggingContainer.md)