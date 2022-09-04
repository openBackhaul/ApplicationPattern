### Create/Add Users in Jenkins & Manage Permissions

Generally, in a large organization, there are multiple, separate teams to manage and run jobs in Jenkins. By default, Jenkins comes with very basic user creation options. You can create multiple users but can only assign global roles and privileges to them.

The Role Strategy Plugin enables us to assign different roles and privileges to different users. You will first need to install the plugin in Jenkins manager environment.

### About Role based  plugin
The Role **Strategy** plugin is meant to be used from [Jenkins](https://jenkins.io/) to add a new role-based mechanism to manage user's permissions and access level.

-   Creating global roles, such as admin, job creator, anonymous, etc., allowing to set Overall, Agent, Job, Run, View and SCM permissions on a global basis.

-   Creating project roles, allowing to set only Job and Run permissions on a project basis.
-   Creating agent roles, allowing to set node-related permissions.
-   Assigning these roles to users and user groups
-   Extending role and permissions matching via [Macro
    extensions](https://github.com/jenkinsci/role-strategy-plugin/blob/master/docs/MACROS.md)

** Steps to Enable the rolebased authorization
- Install Role Strategy Plugin in Jenkins.
- Enabling plugin in Global security section.
- Create/Add a User in Jenkins.
- Manage Users and Roles in Jenkins
- Assign Roles in Jenkins for users.
- Create Project Roles in Jenkins.

**A. Install Role strategy Plugin in Jenkins**
Installing plugin through our Jenkins dashboard anf follow the steps.

First login into Jenkins.
Then under Jenkins Dashboard we have the option
-   Goto Manage Jenkins
-   Click on Manage Plugins option
-   In the available section, screen Search for “role”.
-   Select Role**-based Authorization Strategy** plugin
-   Click on “**Install without restart**” 

![rolebased](./Images/jenkinsrolebased.png)

-   Once the plugin is installed, a “success” status will be displayed.

![success](./Images/successrolebased.png)

**Enabling plugin in Global security section**

Go to **Manage Jenkins -\>** Configure Global Security -\> Under **Authorization,** select **Role Based Strategy**. Click on **Save**.

![globalsecurity](./Images/globalrolebased.png)

**Create a User in Jenkins**

Goto **Manage Jenkins** ==\> under **security** section click on **Manage users** ==\> here click on **create user**
![adduser](./Images/adduser.png)

You will see on the dashboard that a new Jenkins created user as per the details entered.

![testuser](./Images/testuser.png)

**Manage Users and Roles in Jenkins**

You can define roles by using the *Manages Roles* screen. It is possible to define global and project/agent-specific roles.
Following are the steps on how to manage and assign roles in Jenkins:

-   Go to **Manage Jenkins**
-   Under security section Select **Manage and Assign Roles**

![manageroles](./Images/manageroles.png)

**Note:** that the **Manage and Assign Roles** option will only be visible if you’ve installed the role strategy plugin.

-   Click on **Manage Roles** to add new roles based on your
    organization.

![manageassignroles](./Images/managendassignroles.png)

To create a new role called “tester”,

-   Type “tester” under “role”.
-   Click on “Add” to create a new role.
-   Now, select the Jenkins user permissions you want to assign to the “tester” role.
-   Click Save

![testuseradd](./Images/testerassignrole.png)

**E. Assign Roles in Jenkins**

You can assign roles to users and user groups using the *Assign Roles* screen

-   User groups represent authorities provided by the Security(e.g. LDAP plugin can provide groups)
-   There are also two built-in groups: authenticated (users who logged in) and anonymous (any users, including ones who have not logged in)

Now that you have created roles, let us assign them to specific users.

-   Go to **Manage Jenkins**
-   Select Manage and Assign Roles

![assignrole](./Images/assignrolesuser.png)

We shall add the new role “tester” to user “tester”

-   Selector tester role checkbox
-   Click Save

![testerroles](./Images/testerassign%20-%20Copy.png)

We can assign any role to any user, as per your need.

**Create Project Roles in Jenkins**

We can create project specific roles under **Project Roles.**

In Jenkins Manage and Assign Roles
-   Enter a role as “tester”
-   Add a pattern to this by adding **tester.\***, so that any username
starting with “tester” will be assigned the project role you
specify.
-   Click Add
-   Select privileges
-   Click Save

![saveroles](./Images/saveroles.png)
