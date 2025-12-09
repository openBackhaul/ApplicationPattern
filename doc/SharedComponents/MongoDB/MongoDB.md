
# Purpose
Our current SDN ApplicationLayer architecture uses Elasticsearch to store and query JSON objects. While Elasticsearch provides powerful capabilities for search and analytics, it is not well-suited for use cases involving frequent updates to JSON documents, especially when those updates involve nested fields (like the one in the new NMDA datastore concepts).

In Elasticsearch, any update, even to a single nested field results in the entire document being reindexed. This leads to:

- High I/O overhead, as documents must be deleted and reinserted  
- Segment bloat, where frequent updates generate many small segments that degrade performance  
- Increased heap usage and garbage collection pressure, especially under write-heavy workloads  
- Reduced indexing throughput and query responsiveness over time

These characteristics make Elasticsearch inefficient for workloads where data updation is critical.

To overcome these challenges, we are introducing **MongoDB** as an alternate. MongoDB is a document-oriented database for JSON objects that offers native support for partial updates, allowing us to efficiently modify specific fields within nested JSON structures without rewriting the entire document. 

This change aligns well with our evolving requirements for applications (like **LILW**, **DDM**) with **NMDA datastore** concepts where the information models have nested JSON objects that undergo frequent updates (e.g., adding an entry to the `ControlConstruct` array inside the `NetworkControllerDomain`), where JSON objects are modified frequently and consistency of structure must be maintained.

MongoDB will thus serve as a **highly performant, update-friendly datastore** for NMDA based datastores , while Elasticsearch can continue to serve its strengths in **search and analytics**.

![your-UML-diagram-name](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/openBackhaul/ApplicationPattern/refs/heads/PrathibaJee/MongoDB/doc/SharedComponents/MongoDB/diagram/MongoDBDesign.iuml)

---

# MongoDB Configuration
## Enable authentication and RBAC
```yaml
security:
  authorization: enabled
```
Define user roles with limited access as per microservice requirements.
RBAC should be enabled.

## Bind IP Configuration
```yaml
net:
  bindIp: 127.0.0.1,<app_server_private_ip>
```

Ensure the MongoDB instance is **not publicly exposed**.

## TTL (Time-To-Live) Index Policy

- No TTL indexes are defined in any collections.
- Our use case requires **long-term data persistence**.
- Automatic deletion is not desired; **retention policies (if any) will be handled via manual archival strategies**.
  
---
# Other Recommendations
## Naming Standards

- **Database names**: Use lowercase, underscore-separated names  
  _Example_: `app_logs`, `user_profiles`

- **Collection names**: Use plural nouns describing the data  
  _Example_: `users`, `transactions`, `audit_logs`

- Avoid spaces, special characters, and uppercase letters for compatibility and clarity.

## Node.js Application Connectivity (High-Level)

- Applications use a MongoDB client (e.g., **Mongoose** or **native driver**) to connect via a connection URI.
- The URI contains credentials, host, port, database and collection name.
- Each microservice will have credentials mapped to a limited **RBAC** role allowing only necessary CRUD operations.

## MongoDB Compass

- Ensure MongoDB is bound to an accessible IP and listening on the appropriate port (default: `27017`).
- Connection string for Compass should use:

  ```
  mongodb://<username>:<password>@<host>:27017/<dbname>?authSource=admin
  ```

- User connecting via Compass must have `readWrite` or higher access to relevant collections.

# Configuration of MongoDB in applications

## MongoDB client
```yaml
{
        "uuid": "xx-1-0-0-mdb-c-mdb-1-0-0-000",
        "ltp-direction": "core-model-1-4:TERMINATION_DIRECTION_SINK",
        "client-ltp": [
        ],
        "server-ltp": [
          "xx-1-0-0-http-c-mdb-1-0-0-000"
        ],
        "layer-protocol": [
          {
            "local-id": "0",
            "layer-protocol-name": "mongodb-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_MONGODB_LAYER",
            "mongodb-client-interface-1-0:mongodb-client-interface-pac": {
              "mongodb-client-interface-configuration": {
                "auth": {
                    "auth-source":   " >>> source database of the user credentials <<< ",
                    "user-name":   " >>> user name <<< ",
                    "password":   " >>> password <<< " 
                  }, 
                "database-name": " >>> Application specific database name <<< ", 
                "collection-list": [
                  {
                  "local-id" :" >>> unique local identifier <<< ",
                  "collection-name" : " >>> datastore name <<< ",
                  "purpose" : " >>> purpose of the datastore <<< "
                  }
                ]
              },
              "mongodb-client-interface-status": {
                "operational-state": "mongodb-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
                "life-cycle-state": "mongodb-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
              }
          }
       }
   ]
}
```
Further the http and tcp client will be required.
