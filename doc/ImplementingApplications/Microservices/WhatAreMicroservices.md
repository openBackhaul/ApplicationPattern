## What are Microservices ?
Microservices architecture is a software development technique that structures an application as a set of loosely coupled, modular and collaborating services.
Using the ideology of microservices, large complex applications can be split up into smaller building blocks of executables, that when recomposed offer all of the functionality of a large scale, highly complex application. 
 ![Microservice](./pictures/Microservice.PNG)  
Each service has its own database in order to be decoupled from other services. Services communicate using either synchronous protocols such as HTTP/REST or asynchronous protocols such as AMQP(ex. RabbitMQ). 

## Why Microservices?
The microservice structure continues to gain popularity as businesses continue to be agile, minimizing hassles and improving application delivery times.
In the past, companies have developed specialized enterprise monolithic applications with three main components:
- A Graphical User interface, usually HTML pages or desktop applications running on a user’s machine
- A database, typically many tables in a relational database management system
- A server-side application that handled all requests such as data retrieval, HTTP requests, and populating HTML browsers.

For the user, everything seemed to run through a single point of contact. However, they were quite costly to develop, any changes required a full system redesign, rebuild and redeployment. 

With microservices, the entire application does not need to be redeployed, just the services that need it. If you want to enhance or deprecate something, it can easily be removed, added, scaled up and edited to suit changing needs quickly and efficiently without having to shut down the entire application.

## Characteristics of Microservices:
- Loosely-coupled - enables a team to work independently the majority of time on their service(s) without being impacted by changes to other services and without affecting other services
- Independently deployable components - enables a team to deploy their service without having to coordinate with other teams
- Automated deployment – enables continuous integration and deployment
- Decentralized data and language control - enables an application not to limit its capabilities within the solutions provided by a single programming language or database.
- Highly-maintainable and testable - each service is relatively small and so is easier to understand and change. Corrective, preventive, perfective, and adaptive software maintenance can be done better in Microservices than monolithic.
- Organized around the needs and capabilities of a business or organization

## Challenges:
Developers must deal with the additional complexity of creating a distributed system,
- Developers must implement the inter-service communication mechanism and deal with partial failure
- Testing the interactions between services is more difficult
- Implementing requests that span multiple services requires careful coordination between the teams
- In production, there is also the operational complexity of deploying and managing a system comprised of many different services.

### Further reading :
To have a deep look into microservices , please refer https://microservices.io/patterns/microservices.html
