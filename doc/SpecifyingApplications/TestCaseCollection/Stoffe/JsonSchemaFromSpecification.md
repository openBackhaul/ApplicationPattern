# Schema validation

The response body is validated against the OAS defined schema using the below Tiny Validator function.
> tv4.validateMultiple(data, schema, checkRecursiveFlag, banUnknownpropertiesFlag)

where,  

- *data* : actual response-body data to be validated.
- *schema* : JSON schema generated from OAS.
- *checkRecursiveFlag* : Boolean value that prevents from “too much recursion” error while validating.
- *banUnknownpropertiesFlag* : Boolean value that flags unknown properties under error list.

example: *tv4.validateMultiple(RESPONSE, schema, true, true)*

This tv4 function is by default available in postman which could be directly used without importing it from external  

## Generate JSON schema from YAML

The tiny validator validates the data against a JSON schema. Since, the schema available in OAS is present in OAS specification is in yaml format, it needs to get converted into “json” format. This can be achieved by using an npm package called **yamljs**.

### Procedure

- Install yamljs using the command

> npm install –g yamljs

- Copy the yaml schema from OAS specification and save it into a file with extension as .yml.(example : inputSchema.yml)

- After successful installation, run the following command to convert yaml schema to json schema

> yaml2json inputSchema.yml > outputSchema.json –pretty

Now, the output json schema will be written into outputSchema.json and the --pretty option enables formatting in the generated output. We can use the generated JSON schema in our testcase and use tv4 validator to validate our response.

[<- Back to Specifying Applications](../SpecifyingApplications.md)  - - -  [Ahead to concepts of testcases ->](./ConceptsOfTestCases.md)
