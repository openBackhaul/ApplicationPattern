# Structure of _ReleaseNumbers_


### Summary 

_ReleaseNumbers_ shall follow the concept of Semantic Versioning (with some deviations that are described below).  
Given a version number MAJOR.MINOR.PATCH, increment the ...:  

- ... MAJOR version when you make incompatible API changes,
- ... MINOR version when you add functionality in a backwards compatible manner, and
- ... PATCH version when you make backward compatible bug fixes.

## Tag Selection and Management

1. *Final version of the software delivery*
  - i.e. the delivery, which has been payed for and which has been approved for rollout in production
  - shall have the the same version number as the specification release number it was implemented for, e.g. if the spec milestone is 1.1.0_spec, the implementation tag shall be 1.1.0_impl
  - once the final software delivery has been approved of, the final tag with the milestone shall be set and all old pre-release tags for that version shall be deleted.

2. *Pre-release test deliveries*
  - vendors may deliver pre-release software versions for testing purposes
  - these shall be marked accordingly with a pre-release identifier consisting of a single letter, which is increased for each testing version (e.g. a, b, c)
  - the version number shall be selected in the same way as described under (1.)

3. *Bugfix releases*
  - if critical bugs are identified during operation of an application in production after the final acceptance, a hotfix shall be provided
  - When major, minor, and patch are equal, a hotfix version has higher precedence than a normal version, e.g. 1.0.0 < 1.0.0-hotfix.1
  - a hotfix milestone shall be created and assigned to the raised bug

Tags must match the following description:
```
 a) final release: 
    - <versionNumber>_impl = MAJOR.MINOR.PATCH_impl
    - example: 1.1.0_impl
 b) pre-release test version: 
    - <versionNumber>.<preReleaseId>_impl = MAJOR.MINOR.PATCH.PRERELEASEID_impl
    - example: 1.1.0.a_impl
 c) bugfix version: 
    - <versionNumber>-hotfix.<HOTFIX> = MAJOR.MINOR.PATCH-hotfix.HOTFIX_impl
    - example: 1.1.0-hotfix.1_impl
```

### Version Number Example

- Situation 1: A new application gets specified.  
The specification will be identified by the _ReleaseNumber_ 1.0.0  

- Situation 2: After publishing, the implementer requests for clarification.  
Comments get added and corrected in the existing 1.0.0 release (backward compatible bug fixes).  
The resulting specification will be identified by the _ReleaseNumber_ 1.0.1  

- Situation 3: The implementer releases a pre-release testing version.  
The implementation will be identified by the _ReleaseNumber_ 1.0.1.a

- Situation 4: The release 1.0.1.a is approved for production.  
The code is merged into the _main branch_. Tag "1.0.1_impl" is assigned to the _main branch_.
The tag 1.0.1.a_impl will be deleted.  

- Situation 5: After putting release 1.0.1 into operation a critical bug is identified.  
A hotfix is provided by the implementer. It is merged into the _main branch_ with tag "1.0.1-hotfix.1_impl", 
as the implementation is identified by the _ReleaseNumber_ 1.0.1-hotfix.1.  
The specification will still be identified by the _ReleaseNumber_ 1.0.1

- Situation 6: After putting release 1.0.1-hotfix.1 into operation, users are requesting for resulting temperature values to be provided in Celsius instead of Kelvin.  
The existing _Operation_ gets specified and implemented for a second time, but now providing its result in Celsius instead of Kelvin.  
The new _Operation_ for Celsius is added (backward compatible) and runs in parallel to the one for Kelvin, which just gets marked as deprecated (also backward compatible).  
The resulting specification will be identified by the _ReleaseNumber_ 1.1.0  

- Situation 7: After a while, several wishes for additional functionality have been addressed.  
Further on, the existing _Operation_ providing its result in Kelvin shall be discontinued, because it permanently confuses users (incompatible API change).  
The resulting specification will be identified by the _ReleaseNumber_ 2.0.0  

- Situation 8: The specification 2.0.0 has been finished and _develop branch_ got merged into _main branch_ for publishing it to potential implementers.
The new content of the _main branch_ gets tagged with "2.0.0_spec" by the PlatformOwner (exclusively the _main branch_ gets tagged).

- Situation 9: The specification 2.0.0 has been implemented and the implementer merged his code into the _main branch_.
The new content of the _main branch_ gets tagged with "2.0.0_impl" by the PlatformOwner (exclusively the _main branch_ gets tagged).


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

6. Patch version Z (x.y.Z | x > 0) MUST be incremented if only backward compatible bug fixes are introduced.  
A bug fix is defined as an internal change that fixes incorrect behavior.

7. Minor version Y (x.Y.z | x > 0) MUST be incremented if new, backward compatible functionality is introduced to the public API.  
It MUST be incremented if any public API functionality is marked as deprecated.  
It MAY be incremented if substantial new functionality or improvements are introduced within the private code.  
It MAY include patch level changes.  
Patch version MUST be reset to 0 when minor version is incremented.

8. Major version X (X.y.z | X > 0) MUST be incremented if any backward incompatible changes are introduced to the public API.  
It MAY also include minor and patch level changes.  
Patch and minor versions MUST be reset to 0 when major version is incremented.

9. _[official text has been removed]_  

10. _[official text has been removed]_  

11. _[official text has been removed]_  

12. _[complement to the official rules]_  
Since specification and implementation get merged into the same _main branch_ on GitHub at different points in time,  
\- the tag that is identifying the specification of a release shall be composed from the _ReleaseNumber_ and "_spec" and  
\- the tag that is identifying the implementation of a release shall be composed from the _ReleaseNumber_ and "_impl".  

.  
_Source:_  
_Semantic Versioning 2.0.0_  
_[https://semver.org/](https://semver.org/)_  
