# Installing Postman

This guideline is for supporting installation of Postman on OfficeLaptops.

After successful execution, the software is running, synchronizing with the Postman cloud and able to address devices and applications in the SDN laboratory.

### Downloading and Installing

Download the installer from the [here](https://www.postman.com/downloads/).  
Select the 64-bit Windows installer as shown in the screenshot. Do not use Postman Canary as this is not a stable release.  
![postman_01](https://user-images.githubusercontent.com/57349523/151943314-e13d0124-6058-4709-94c3-664647d9e356.jpg)

Execute the installer:  
![postman_02](https://user-images.githubusercontent.com/57349523/151823083-4b6daacc-5e45-4f83-b048-92ed85878217.jpg)

Postman can be installed without admin rights, as the installer only extracts the Postman files to AppData directories.  
After the installer has finished the Postman window opens and provides different options:  
![postman_03](https://user-images.githubusercontent.com/57349523/151944159-7999f09a-0da6-4aa8-9774-701d6bbb8cdb.jpg)

The screenshot shows the application window after pressing "Skip and go to the app". From here signing in or creating a new account is also possible.  
![postman_05](https://user-images.githubusercontent.com/57349523/151944538-a96502f8-1b50-4aa9-bb84-b252f3fd7266.jpg)

If an account is not available yet, it should be created now, as otherwise the user workspace cannot be saved. When creating a new user follow the [guideline](../OwnPostmanAccount/OwnPostmanAccount.md) to ensure proper collaboration is possible. The picture below shows the "Sign In" dialogue, which also is opened in the browser.  
![postman_06](https://user-images.githubusercontent.com/57349523/151944853-7c409f73-5745-4304-9bc1-0583d7997bb5.jpg)

To create a desktop icon open the Explorer and navigate to path *C:\Users\<username>\AppData\Local\Postman* and create the link to the Postman.exe manually:  
![postman_04](https://user-images.githubusercontent.com/57349523/151944589-328145ea-b5f4-4d04-8616-3499fa784434.jpg)

Postman is now installed but still needs to be configured properly (see next section).

### Proxy Configuration
_Note:_ As this guide is available to public, the proxy is not shown in plaintext. Ask [here](mailto:katharina.mohr@soprasteria.com?subject=[GitHub]%20Request%20for%20proxy) to obtain the actual value.

To access the lab environment and to allow for workspace synchronisation, proxy settings need to be modified.  

Therefore open the Settings dialogue:  
![postman_07](https://user-images.githubusercontent.com/57349523/151950095-c875e962-ca3d-41ca-a26d-7f0e68b45738.jpg)

Set the proxy information as in the screenshot.  
* The "Use the system proxy" checkbox needs to be set
* The Proxy Server needs to be set to the TEF-proxy with port 8080.
* The Proxy Bypass needs to contain the NAT address of the SDN lab controller (10.118.67.77).  
![image](https://user-images.githubusercontent.com/57349523/225627054-7a0cef2e-bb95-4360-880d-37c64205f04e.png)


Normally workspace synchronisation should now be possible (user needs to be logged in):  
![postman_11](https://user-images.githubusercontent.com/57349523/151950706-6d4d228a-9684-42ee-a544-0d0e9ef733f9.jpg)

If not the workspace synchronisation is not possible the system proxy may not be configured correctly. In that case setting the HTTP_PROXY and HTTPS_PROXY environment variables like described [here](../ConfigureProxy/ConfigureProxy.md) can help. 

