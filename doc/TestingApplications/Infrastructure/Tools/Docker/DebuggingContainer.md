### How to see the logs of a docker container
Mostly mentioned commands are used for creation, running and debug the containers.

For example, when the docker containers are exited due to some issue, to find out the root cause, have to check information about container and related logs.

* Initially, check whether container is running or not using **docker ps -a** and which list all running and dead containers.

* Select the container id and inspect the container using the **docker inspect < containerId/containerName>**. With this command output gives the overall status of container includes state, path, image and logpath etc.

Below is an example for one of the application:

         WebApp@WebApp:/var/lib/docker$ docker inspect registry-office-v1
        [
        {
        "Id":"3e232",
        "Created": "2022-09-04T14:55:43.652797544Z",
        "Path": "docker-entrypoint.sh",
        "Args": [
            "node",
            "index.js"
        ],
        "State": {
            "Status": "EXITED",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 2498488,
            "ExitCode": 137,
            "Error": "",
            "StartedAt": "2022-09-05T11:31:42.352471453Z",
            "FinishedAt": "2022-09-05T11:31:40.959561887Z"
        },
        "Image": 
        "ResolvConfPath": ,
        "HostnamePath": ",
        "HostsPath":,
        "LogPath": "/var/lib/docker/containers/207f3f43e0e2585bee11193f163772641cf1be48f04f734da898a5df0d43e232/207f3f43e0e2585bee11193f163772641cf1be48f04f734da898a5df0d43e232-json.log".

Based on this information, able to get the data related to images, logs path, state of container etc.

* Fetch container logs using "**docker logs <containerId/containerName>**" which gives the logs and to tail the current logs use the command "**docker logs -f <containerId/containerName>**".

        WebApp@WebApp:/var/lib/docker$ docker logs -f registry-office-v1
        Sun, 04 Sep 2022 14:55:46 GMT body-parser deprecated undefined extended: provide extended option at node_modules/oas3-tools/dist/middleware/express.app.config.js:22:33
        Mock mode: disabled
        Your server is listening on port xxxx (http://localhost:xxxx)
        Swagger-ui is available on http://localhost:XXXX/docs ..... etc

* Stats the container information using "docker stats <container_id>" it will give live stream of resource usage, then we can see how much memory used. 


[<- Back to Docker Usage](./UtilizationInSDN.md)) - - - [Back to Testing Applications](../../../TestingApplications.md)