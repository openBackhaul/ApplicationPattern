# Schema validation

The response body is validated against the OAS defined schema using the below Tiny Validator function.
> tv4.validateMultiple(data, schema, checkRecursiveFlag, banUnknownpropertiesFlag)

where,
    *data* : actual response-body data to be validated
    *schema* : JSON schema generated from OAS
    *checkRecursiveFlag* : Boolean value that prevents from “too much recursion” error while validating
    *banUnknownpropertiesFlag* : Boolean value that flags unknown properties under error list
    This tv4 function is by default available in postman which could be directly used without importing it from external

## Generate JSON schema from YAML

The tiny validator validated the data against a JSON schema. But, the schema available in OAS is present in yaml format which needs to get converted into “json” format. This can be achieved by using a npm package called **yamljs**.

### Procedure

**step 1**: Save the yaml schema into a file with extension as .yml.(example : inputSchema.yml)

**step 2**: Install yamljs using the command
> npm install –g yamljs

**step 3**: After successful installation, run the following command to convert yaml schema to json schema
> yaml2json inputSchema.yml > outputSchema.json –pretty

Here, the output json schema will be written into outputSchema.json and the --pretty option enables formatting in the generated output. We can now use the generated JSON schema in our tv4 validator to validate our response.

[<-- Back to Specifying Testcases](./Testcases.md)
