# Structure of Release Numbers


### Summary 

Release Numbers shall follow the concept of Semantic Versioning.  
Given a version number MAJOR.MINOR.PATCH, increment the:  

- MAJOR version when you make incompatible API changes,
- MINOR version when you add functionality in a backwards compatible manner, and
- PATCH version when you make backwards compatible bug fixes.


### Example

- A new application gets specified.  
The specification will be identified by the release number 1.0.0  

- After publishing, the implementer communicates need for clarification.  
Comments get added and corrected in the 1.0.0 release (backwards compatible bug fixes).  
The resulting specification will be identified by the release number 1.0.1  

- After putting release 1.0.1 into operation, users are requesting for resulting temperature values to be provided in Celsius instead of Kelvin.  
The existing operations gets specified and implemented for a second time, but now providing the result in Celsius instead of Kelvin.  
For avoiding breaking the backward compatibility, the operations for Celsius are run in parallel to the ones for Kelvin (functionality added in a backwards compatible manner).  
The resulting specification will be identified by the release number 1.1.0  

- After a while, several wishes for additional functionality have been addressed.  
Further on, the existing operation providing its result in Kelvin shall be deleted, because it caused confusion (incompatible API change).  
The resulting specification will be identified by the release number 2.0.0  

- Whenever the specification gets merged into the main Branch for handing it over to the implementers, it gets tagged with "2.0.0_spec".

- In case the implementation would also be published on GitHub, it would be tagged with "2.0.0_imp".


### Specification

The following rules have been copied from the official definition of Semantic Versioning referenced down below.  
Some rules have been adapted or removed.  

1. Software using Semantic Versioning MUST declare a public API.  
This API could be declared in the code itself or exist strictly in documentation.  
However it is done, it SHOULD be precise and comprehensive.  

2. A normal version number MUST take the form X.Y.Z where X, Y, and Z are non-negative integers, and MUST NOT contain leading zeroes.  
X is the major version, Y is the minor version, and Z is the patch version.  
Each element MUST increase numerically.  
For instance: 1.9.0 -> 1.10.0 -> 1.11.0.  

3. Once a versioned package has been released, the contents of that version MUST NOT be modified.  
Any modifications MUST be released as a new version.  

4. _[official text has been replaced]_  
Major version 1.0.0 is for initial development.  

5. Version 1.0.0 defines the public API.  
The way in which the version number is incremented after this release is dependent on this public API and how it changes.  

6. Patch version Z (x.y.Z | x > 0) MUST be incremented if only backwards compatible bug fixes are introduced.  
A bug fix is defined as an internal change that fixes incorrect behavior.

7. Minor version Y (x.Y.z | x > 0) MUST be incremented if new, backwards compatible functionality is introduced to the public API.  
It MUST be incremented if any public API functionality is marked as deprecated.  
It MAY be incremented if substantial new functionality or improvements are introduced within the private code.  
It MAY include patch level changes.  
Patch version MUST be reset to 0 when minor version is incremented.

8. Major version X (X.y.z | X > 0) MUST be incremented if any backwards incompatible changes are introduced to the public API.  
It MAY also include minor and patch level changes.  
Patch and minor versions MUST be reset to 0 when major version is incremented.

9. _[official text has been removed]_  

10. _[official text has been removed]_  

11. _[official text has been removed]_  

12. _[complement to the official rules]_  
Since specification and implementation get merged into the same main Branch on GitHub at different points in time,  
\- the tag that is identifying the specification of a release shall be composed from the release number and "_spec" and  
\- the tag that is identifying the implementation of a release shall be composed from the release number and "_imp".  

.  
_Source:_  
_Semantic Versioning 2.0.0_  
_[https://semver.org/](https://semver.org/)_  
