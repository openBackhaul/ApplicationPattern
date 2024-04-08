# Management of Milestones

There are two types of milestones:
- specification: *_spec*
- implementation *_impl*

The version numbers of the spec and impl milestones correspond. I.e. issues from e.g. 1.1.1_spec should be implemented with 1.1.1_impl, to ensure status transparency.  
Solved milestones can be closed.  

If a critical bug is found after a release has been approved of and rolled out in production, a hotfix might be required.
  - This will also get its own milestone.
  - also see [Structure of Release Numbers](./StructureOfReleaseNumbers.md) 

If a current release version (e.g. 1.1.1_impl) is under test and an issue is found there are two possibilites:
1. it is a bug in the implementation: the related milestone for the issue is 1.1.1_impl
2. it is an issue with the specification: clarify with the vendor if solving this issue is covered by the current project order.  
   - if not: add the issue to the subsequent specification milestone, 1.1.2_spec.  
   It will not be solved with the current delivery, which remains 1.1.1_impl.
   - if yes: also add the issue to milestone 1.1.2_spec  
   and move all already existing issues in this milestone to 1.1.3_spec (or the next higher spec version), which are not also covered by the current PO.  
   The now expected release becomes 1.1.2_impl (instead of 1.1.1_impl.)  
   Send an email about this to inform all relevant stakeholders.


