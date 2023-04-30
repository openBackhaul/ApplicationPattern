# Concept of the Test Case Collection

### Purposes of Test Case Collection

**Definition of the Business Logic**  
The Test Case Collection (TCC) is an important part of the specification of an application.  
While the OAS defines the interface of the application and the CONFIGfile describes its initial data, the TCC is for specifying the logic that happens inside the application.  

Example:  
Suppose the purpose of the application is to calculate the current capacity of a microwave link:  
- The OAS would define the identifier that is needed to select the microwave link and the format of the result.  
- The CONFIGfile would hold constant parameters that are needed in the equation and describe the requests that need to be made to the device to get the variable input parameters. 
- Some test case from the collection needs to implement the concrete formula for calculating the reference value in evaluating the application's response.    

**Acceptance Testing**  
Code developed on the basis of an "MS Word" specification must be tested manually by the person who wrote the specification.  
This often leads to discussions about how to interpret the words in the specification.    
After going through this process several times, a kind of iterative approach becomes established.  
Since the functional scope is not conclusively defined at the beginning, the implementation effort cannot be determined before completion.  

The MW SDN approach involves multiple vendors estimating the cost of an implementation, after which the vendor is assigned the task.  
Potential suppliers need to know the criteria that will ultimately lead to successful acceptance in order to realistically assess their efforts.  
Therefore, the acceptance tests must already be part of the specification.  
With this approach, the ApplicationOwner can expect to be supplied with code that will 100% successfully pass acceptance testing.  
The iterative process during the acceptance phase is eliminated.  

**CI/CD**
It is expected that applications will build upon each other.  
For example, application B will consume services provided by application A.  
However, it must be possible to make changes to application A in order to dynamically update and extend the functionality of the application layer in the long term.  
Of course, it must be ensured that application B still functions properly after application A has been changed.  
This means that a change to application A is accompanied by a test of application B.  

The number of applications may grow dynamically.  
The dependencies between the individual applications may not always be obvious.  
Therefore, all applications need to be retested whenever one of them is changed (integration testing).  
Of course, this is only possible with automation.  
This means that a complete Test Case Collection for each application is a prerequisite for the long-term development of the application layer.  

### Kinds of tests to be covered  

**Testing the API**  
The OAS defines paths, bodies and headers.  
Testing must ensure that  
- specified paths are actually implemented  
- ResponseBodies have the specified structure  
- RequestBodies that do not comply with the prescribed structure get objected  
- datatypes are kept and checked  
- string patterns and integer boundaries are checked
- response headers are comprising the values
- and much more
These are routine tests that are required to ensure the quality of the data within the application under test and its good behavior towards consuming applications.  
These tests do not provide any information beyond the AOS.  
Basically, they could be derived automatically from the AOS.  

**Testing the Business Logic**
Each application is expected to add some functionality to the application layer.  
This functionality could be  
- repeated execution of an activity according to a generic set of rules  
- calculate a derived value according to a certain formula or aggregate information according to a specific pattern  
- etc.  
This functionality is the purpose of the application, but it is not defined in the OAS or in the CONFIGfile.  
The test cases for validating the business logic must actually describe the business logic.  
A test case validating the repeated execution of an activity would be expected to contain a number of 'if-then-else' decisions or 'for' loops to describe the generic rule set.  
A test case for validating a formula would therefore contain exactly this formula and thus create the reference values for checking the result values of the application with it.  
A list of example input and output values would not be sufficient.  
Depending on the individual case, it must be considered whether randomly generated input values are sufficient, or whether the correct retrieval of input values from external sources (e.g. microwave devices) must also be checked in the test case.  

It is highly advisable to be as clear and precise as possible both in the description of the input values and in the description of the rules and formulas.  
If necessary, the test case code for validating the business logic could also be included in the application's self-documentation via additional fields.

**Testing the Interaction with surrounding Applications (System Testing)**  
Even in the case that both application A and application B, operated on their own, provide completely flawless and logical results, it is not guaranteed that the parallel operation of application A and application B will also provide flawless and logical results in all situations.  
The resulting mutual dependencies between the algorithms represent the greatest long-term risk to stable and error-free operation of a modular automation platform.  
Clear and complete descriptions of the functioning of each component and testing the mutual influences as completely as possible are probably the most effective means of maintaining control.  

Easy example:  
Once an application has processed a request, it should send a record to the ExecutionAndTraceLog application.  
A complete TCC must include a test case that verifies in the ExecutionAndTraceLog application that this record has not only arrived, but that it contains all the expected values correctly.  
This test comes as part of the ApplicationPattern.  

More individual example:  
Suppose an application contains a formula that includes several externally retrieved values.  
Also, suppose that obtaining one of the external values fails.  
Would the application then calculate the requested result based on the available values, or would it stop calculating and report an error?  
Obviously, one of the two variants leads to funny system behavior, which keeps any number of colleagues busy with a cheerful search for a sporadically occurring error of completely untransparent root cause.  

Formulating these test cases requires a lot of experience and is also very individual for the respective application.  

**Stability testing**
Even though the MW SDN application layer is very modular, the individual components are highly interdependent.  
This means that the failure of an application can result in a very far-reaching loss of function.  

Suppose an application contains a fraction and a variable parameter would cause the denominator to equal zero.  
Or some other internal condition would cause the application to crash.  
Instability can also be caused by interactions between applications.  
For example, an aborted upgrade process could leave other applications in an undefined state, or core applications could collapse under a flood of requests when the entire application layer is restarted.  

Formulating these test cases probably requires some creativity, since stability is usually compromised in unexpected borderline or special cases.  

**Testing compliance with rules of good conduct**
The TCC should also be used to exclude implementation variants that tend to be harmful to the system.  
For example, unnecessarily high loads on the controller or even on the devices in the transport network must be excluded.  

### Sharing the load

Test case delivery is distributed across multiple roles.  

| Kind of test case | ApplicationOwner | TestingExpert | IT Expert |
|-|-|-|-|
| Business Logic | Responsible | Consulted | |
| System | Consulted | Responsible 1) | Consulted 1) |
| Good Conduct | | Consulted | Responsible |
| Stability | | Consulted | Responsible |
| API | | | Responsible |

1\) IT Experts responsible in the beginning. TestingExpert needs to grow into responsible role.  

### InterfaceValidator

Originally, the InterfaceValidator was used to test whether the ONF TR-532 definitions were implemented as expected by hardware vendors.  
It is a kind of framework that provides not only a structure but also basic functionality for incorporating an increasing variety of test cases.  
Initially, the InterfaceValidator was written and operated in the Postman GUI.  
As part of the continuous integration of applications, it was decided to export the finished TCC from Postman and run it automatically through Jenkins in the text-based Newman.  
Writing test cases in Postman is supported by mock servers that are created from the API definitions to be tested.  
