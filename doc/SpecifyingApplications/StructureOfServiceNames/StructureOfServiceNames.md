# Structure of Operation Names

The name of an operation shall be formulated like orders (e.g. calculate-mw-capacity); means they shall start with a verb, followed by an object; further details might follow.

It shall be comprised from two to five meaningful words.  

Chose meaningful verbs and objects, so the service is already explained by its naming and it’s possible to conclude on the purpose of the application from reading the service names.

The operation name must be unique, at least within scope of the individual application.
It is recommended to read operation names at several existing applications, preferably with similar purpose, for becoming sensitive for choosing names, which allow to distinguish from existing services at other applications.

Since only POST method shall be used in the service section of the OpenApiSpecification
* operations, which could be implemented by GET method, might start with "provide..."
* operations, which could be implemented by PUT method, might start with "create" (repeatedly calling the same operation results in several separate  elements)
* operations, which could be implemented by PATCH method, might start with "update" (repeatedly calling the same operation results in changing the values of the same element)
If an alternative verb would describe the effect of the operation more precisely, the alternative verb shall be applied.


Service names shall start with a version identifier (e.g. v1)

Start and separate version identifier from service name with slash

Use hyphens to separate words in the service name; e.g. /v1/service-name

Please, take already existing definitions in the ServiceList template as a reference





