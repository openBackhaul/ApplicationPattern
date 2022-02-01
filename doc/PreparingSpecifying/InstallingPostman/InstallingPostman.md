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

If an account is not available yet, it should be created now, as otherwise the user workspace cannot be saved. If the "Create account" button is pressed a new browser window the the password creation dialogue opens. The picture below shows the "Sign In" dialogue, which also is opened in the browser.  
![postman_06](https://user-images.githubusercontent.com/57349523/151944853-7c409f73-5745-4304-9bc1-0583d7997bb5.jpg)

To create a desktop icon open the Explorer and navigate to path *C:\Users\<username>\AppData\Local\Postman* and create the link to the Postman.exe manually:  
![postman_04](https://user-images.githubusercontent.com/57349523/151944589-328145ea-b5f4-4d04-8616-3499fa784434.jpg)

Postman is now installed but still needs to be configured properly (see next section).

### Proxy Configuration

To access the lab environment and to allow for workspace synchronisation, proxy settings need to be modified.  
Therefore open the Settings dialogue:  
![postman_07](https://user-images.githubusercontent.com/57349523/151950095-c875e962-ca3d-41ca-a26d-7f0e68b45738.jpg)

Set the proxy information as in the screenshot.  
* The "Use the system proxy" checkbox needs to be set
* The Proxy Server needs to be set to "bc-proxy-vip.de.pri.o2.com" with port 8080.
* The Proxy Bypass needs to contain the NAT address of the SDN lab controller (10.118.67.77).  
![postman_09](https://user-images.githubusercontent.com/57349523/151949896-ca46268d-c1a2-4d46-a0e0-f076dad5c736.jpg)

Normally workspace synchronisation should now be possible (user needs to be logged in):  
![postman_11](https://user-images.githubusercontent.com/57349523/151950706-6d4d228a-9684-42ee-a544-0d0e9ef733f9.jpg)

If not the workspace synchronisation is not possible the system proxy may not be configured correctly. In that case setting the HTTP_PROXY and HTTPS_PROXY environment variables can help (make sure to set the respective checkbox "Respect HTTP_PROXY..."). These variables can be set from Windows command line. Therefore press the Windows start button and type *cmd* to open the command line (note: it is not necessary to open the cmd with admin rights). The variables can be set with the following commands (make sure to use "http://..." for the HTTPS_PROXY as using "https://..." may not work):  
```
setx HTTP_PROXY "http://bc-proxy-vip-de.pri.o2.com:8080"
setx HTTPS_PROXY "http://bc-proxy-vip-de.pri.o2.com:8080"
````

The result can be checked with command (for the changes to be visible first close the cmd and open it again):  
```
set | findstr "PROXY"
```

What it should look like (with cmd closed and reopened after the *setx* commands):  
![postman_10](https://user-images.githubusercontent.com/57349523/151951061-8dcb2152-852b-414c-bed1-4f212e28932f.jpg)


