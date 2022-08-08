# Publishing a Specification

After the specification of an application has been completed, an implementer has to be assigned. The following process has to happen:  
- Freezing the specification
- Publishing the specification
- Potential implementers estimating their efforts
- Appointing the implementer

Because the implementer will only be rewarded according to his estimated efforts, the specification has to be frozen before requesting for offers.  

Statuses of the application, which shall trigger activities in subsequent units, shall be represented in the main branch.

This means that at the end of the specification activities:
- all issues, which are relating to the forthcoming release of the application, shall be closed
- all feature branches, which were created from the develop branch, shall be merged into the develop branch and should be deleted
- all files, which are expressing the specification, shall be merged into the main branch
- the content of the main branch shall be consolidated into a Github Release

Creating the Github Release shall follow this [guideline for managing releases in a repository](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#deleting-a-release).  

The tag of the Release shall be composed from two identifiers:
- first shall identify the release in the sequence of releases (release number)
- second shall identify the type of delivery in regard of the referred release

The release number shall follow the concept of semantic versioning. It is required to use v1.0.0 for initiating the first implementation of the application.  

The type of delivery shall distinguish specification (_spec) and implementation (_impl) of the referred release.  

So, e.g. a first specification shall be tagged with "v1.0.0_spec"; the consequent implementation of this specification would then be published with the tag "v1.0.0_impl".  

If a bug fix, which is not adding additional function to the application, would have to be published during the implementation period, it would be tagged with "v1.0.1_spec".  

If a specification of a backward compatible release, which is adding additional function to the original release of the application without outdating existing function, would be published during or after the implementation period of the v.1.0.0, it would be tagged with "v1.1.0_spec".  

It is of course important that the implementer is referencing the correct release number in its tag particularly if several specifications have been published.  

The [ApplicationPattern v1.0.0](https://github.com/openBackhaul/ApplicationPattern/releases/tag/v1.0.0_spec) shows an example of a specification, which has been published for the first time.  

[Up to Specifying Applications](../SpecifyingApplications.md)
