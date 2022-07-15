# Working on test suite

## Create postman collection

**Step 1**: Under **Collections** tab, click on **New** button

![new collection](./pictures/newCollection1.PNG)

**Step 2**: A dialog box will openon which select **Collection** option

![create collection](./pictures/createCollection.PNG)

**Step 3**: A new collection will get created. Rename the collection to the corresponding application name in the below format

> ApplicationName_version.date.time+testcases.1

## Version control on collection

Version control enables a collaborative work on the test suite creation. Postman enables version control using forking concept.

Here, one could create a fork branch from the main test suite collection and start working on the forked branch. Once completed the activity, a pull request could be created to the main branch after selecting a reviewer.
The reviewer will add comments or approve and merge the request into the main branch

Reference : [postman version control using fork](https://learning.postman.com/docs/collaborating-in-postman/version-control/)

[<-- Back to Specifying Applications](../SpecifyingApplications.md)  - - -  [Ahead to Testing -->](./TestCases.md)
