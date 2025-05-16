
# Validator Orchestrator

This Validator Orchestrator shall be included as a module to our application that can,
 - Manages multiple validation programs (functions that check condition about input data).
 - Allows you to register any number of these validation programs.
 - Lets you run all validators, or a specific sequence of them, on a given data input.
 - Returns a structured summary result showing which validations passed or failed, and why. (You can also customize your own summary)

Following are the steps to implement this concept. Also a sample implementation shall be find in the example folder.

## 1. Project Setup (Setup Phase)

You shall have a following folder structure,
 - A folder for the orchestrator
 - A folder for individual validator programs
 - An entry point (index.js or from a validation module) to test and run validation

**Key Files:** (Example)
 - /orchestrator/validatorOrchestrator.js
 - /validators/validate*.js
 - /index.js
	
## 2. Define & Register Validators

- create separate validator functions, each focused on what should be checked.
- functions shall be asyn, as in some cases we have to interact with DB or application like MWDI.
- register each validator with the orchestrator using a unique name.(this unique name will help in executing the test in a desired sequence)

## 3. call the Orchestrator
Prepare the input data. 
Either using option 1 or option 2 the orchestrator shall be run.

**Option#1 :**
call orchestrator.run(data)
orchestrator:
 - Looks up all registered validators.
 - Executes them in registration order.
	
**Option#2 :**
call orchestrator.run(data, ['password', 'email'])
orchestrator:
 - Uses only the named validators.
 - Executes them in your specified sequence.

## Side note :
Further , we can also enhance this concept to 
 - "Stop execution on first failure"
 - "Create named sets like "mediatorCreation","MediatorDeletion" "
 - Dynamic validator loading(I hope it will not be required in our case, just asking)
	
