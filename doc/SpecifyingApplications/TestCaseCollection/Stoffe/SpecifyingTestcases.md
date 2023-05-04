# Specifying test cases

Specifying testcases becomes an important part in testing for maintainance and furture references. Specifying involves writing a detailed description for each testing scenario for every API in it's [documentation](https://learning.postman.com/docs/publishing-your-api/documenting-your-api/) section. The description can be written in either markdown(.md) format or normal text using postman's beta editor.

The documentation mainly consists of the following sections.

- The main heading contains the actual purpose of the testcase.

- Preparation
  - For testing the actual service (target API), some dependent data should be collected. This section may contain information like the list of APIs to be called from which the dependent data can be collected and also an overview of how to filter the collected data as per requirement. This section might also contains some pre-configurations that can be made to the server for testing the API.

- Testing
  - This section contain detailed steps and explanation like how the API service should be tested in actual.

- Clearing
  - This section contains steps to revert the changes made during preparation phase so that the server configuration comes back to initial state.

- Clearance check
  - This section contains steps to be executed to makes sure that the server-side data is reverted back to the initial state.

The document can be formatted as follows.

- The main heading is formatted in \<h2> (## in markdown).
- Other headings like Preparation, Testing, Clearing, Clearance check are formatted in \<h4> (#### in markdown).
- The inner contents can be written in normal format either as distinct points or a paragraph.
