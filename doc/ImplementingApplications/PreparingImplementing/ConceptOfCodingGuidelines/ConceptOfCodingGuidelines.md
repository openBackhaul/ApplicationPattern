## Coding Guidelines
Coding conventions improves code readability and makes the code maintenance easier

## 1. Code Quality 
### Naming/readability
    ☐ Pick Intention-revealing meaningful names for packages, files, classes, arguments, functions, and variables
    ☐ variable , method, package names should be in lower camel case 
    ☐ class and module names should be in upper camel case
    ☐ Constants should be declared in Upper case
### Complexity
    ☐ Follow single responsibility principle. Function or class should do one ‘thing’. 
    ☐ If a method has greater than 3 arguments, it is potentially overly complex.( More than three requires very special justification. When a function requires more arguments , consider wrapping them into a class.)
    ☐ Don’t use flag arguments unnecessarily , double check whether it is required.( Flag arguments are not recommended. Passing a boolean into a function conveys that this function does more than one thing.)
    ☐ Code should not have unreachable functionalities
    ☐ Make sure whether the code be understood easily by code reviewers
### Functionality
    ☐ Optimize the code and reuse existing functionalities. 
    ☐ Modifying an existing functionality requires an impact analysis on the negative effects of the overall system?
    ☐ Functionalities should not have security flaws.

## 2. Error Handling
    ☐ Handle errors gracefully and explicitly where necessary
    ☐ Enough context should be provided to determine the source of the rootcause

## 3. Style
    ☐ If the code isn’t clear enough to explain itself, then the code should be made simpler. Comments may be there to explain why some code exists.
    ☐ Adhere to the style guide/conventions 
    ☐ There should be no space between a control statement keyword and its opening parenthesis.

## 4. JavaScript
    ☐ Use "use strict"; to reduce errors with undeclared variables
    ☐ Follow best practices for error handling , as well as try catch finally statements
    ☐ Instead of using raw strings use constants. if a string is used across files/classes, then try to maintain a separate file for such constants
    ☐ For asynchronous methods, name the method with the suffix Async
    ☐ When declaring local variables and constants, use the let and const keywords, not var.
    ☐ If a variable will not be reassigned, prefer const.
    ☐ Always use strict equality(===) and inequality(!==)
    ☐ Use shortcuts for boolean tests  — use (isAvailable) and (!isAvailable) , not (isAvailable === true) and (isAvailable === false).
    ☐ When using for/for...of loops, make sure to define the initializer properly, with a let keyword

## 5. Application Pattern
### General
    ☐ Follow the folder structure as prescribed.
    ☐ Reuse the functionalities available in the application pattern npm packages
    ☐ Node_modules should not be a part of the PR request
    ☐ utilize the modules inside the application pattern instead of defining your own functions


[<- Back to Development Environmental setup](DevelopmentEnvironmentalSetup.md) - - - [Up to Code Collaboration](CodeCollaboration.md) 

