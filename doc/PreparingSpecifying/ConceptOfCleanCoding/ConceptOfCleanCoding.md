# Clean Coding

Anyone can write code that can be understandable by computers, but only a good programmer can write code that can be understandable by humans.

### Cost of Owning a Mess 

If you have been a programmer for longer than two or three years, you have probably been slowed down by messy code. The degree of the slowdown can be significant. Over the span of a year or two , teams that were moving very fast at the beginning of a project can find themselves moving at a snail's pace. Every change they make to the code breaks two or three other parts of the code. 

Every addition or modification to the system requires that the tangles, twists, and knots be "understood" so that more tangles, twists, and knots can be added. Over time the mess becomes so big and so big and so deep and so tall, they cannot clean it up. There is no way at all.

### What is CleanCode ?

CleanCode can be read, and enhanced by a developer other than its original author. 
The logics should be straightforward to make 
 - it hard for bugs to hide, 
 - the dependencies minimal to ease maintenance 
 - error handling complete according to an articulated strategy
 - performance close to optimal so as not to tempt people to make the code messy with unprincipled optimization

### CleanCode in Practice

Reduce complexity as much as possible. The simpler the code, the better. And always look for the cause and not the symptom of a problem.

#### Names
Use descriptive, unambiguous, meaningful, pronounceable, and searchable names. 
Replace magic numbers with named constants and avoid encodings.

#### Functions
Keep functions small by doing just one thing. 
Use descriptive names and use as few arguments as possible. Avoid side effects.

#### Comprehensibility
Be consistent and implement similar things in the same way. Use explanatory variables. Prefer dedicated value objects over primitive types. Avoid logical dependencies, for example, do not write functions that work correctly depending on something else in the same class. Avoid negative conditions.

#### Comment
Try to let the code speak for itself. Do not comment out your code. If you comment, then to declare the intention or as an indication of possible side effects.

#### Structure of the source code
Declare variables near their use. Dependent and similar functions should be close to each other. 
Place functions in the downward direction, avoid horizontal alignment. 
Keep lines of code short, use white spaces to associate or dissociate aspects, and pay attention to indentations.


**Reference :** From the book "Clean Code A Handbook of Agile Software Craftsmanship" by Robert C.Martin Series



