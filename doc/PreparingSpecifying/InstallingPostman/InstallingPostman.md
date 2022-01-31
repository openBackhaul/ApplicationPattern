# Installing Postman

This guideline is for supporting installation of Postman on OfficeLaptops.

After successful execution, the software is running, synchronizing with the Postman cloud and able to address devices and applications in the SDN laboratory.

### Downloading and Installing
Download the installer from the [here](https://www.postman.com/downloads/).  
Select the 64-bit Windows installer as shown in the screenshot. Do not use Postman Canary as this is not a stable release.
![postman_01](https://user-images.githubusercontent.com/57349523/151823079-4cf72a55-bf00-4740-a5d2-708bf25ed1d1.jpg)

Execute the installer:
![postman_02](https://user-images.githubusercontent.com/57349523/151823083-4b6daacc-5e45-4f83-b048-92ed85878217.jpg)

Postman can be installed without admin rights, as the installer only extracts the Postman files to AppData directories.
After the installer has finished the Postman window opens and provides different options:
![postman_03](https://user-images.githubusercontent.com/57349523/151823085-76e4feac-0596-4365-a563-2cf79b897102.jpg)

The screenshot shows the application window after pressing "Skip and go to the app". From here signing in or creating a new account is also possible. 
![postman_05](https://user-images.githubusercontent.com/57349523/151825241-f1f0eca1-6330-4906-8b6c-554ebeb68674.jpg)

If an account is not available yet, it should be created now, as otherwise the user workspace cannot be saved. If the "Create account" button is pressed a new browser window the the password creation dialogue opens. The picture below shows the "Sign In" dialogue, which also is opened in the browser.
![postman_06](https://user-images.githubusercontent.com/57349523/151823096-0c03503f-4173-4cb3-8df4-a72d83262bf8.jpg)

In case no desktop icon has been created open the Explorer and navigate to path *C:\Users\<username>\AppData\Local\Postman* and create the link to the Postman.exe manually:
![postman_04](https://user-images.githubusercontent.com/57349523/151823087-950a32bc-8bef-4a95-aa7e-871bb22c22f0.jpg)  

Postman is now installed but still needs to be configured properly (see next section).

### Proxy Configuration!

To access the lab environment and to allow for workspace synchronisation, proxy settings need to be modified. There are two possible options:
* global proxy configuration: only applies to requests, overrides the system proxy option
* use system proxy: needs to be used to allow for workspace synchronisation

Therefore open the Settings dialogue:
![postman_07](https://user-images.githubusercontent.com/57349523/151823113-01e61367-96b7-4b5f-aa09-472eb5beb881.jpg)  

Set the proxy information as in the screenshot. (The proxy bypass needs to be set to the NAT address of the SDN controller.)
![postman_postman_08](https://user-images.githubusercontent.com/57349523/151823111-b569eb04-8a36-4206-8c5f-aad3ead828cd.jpg)

***TODO: check if the nbc-proxy... or bc-proxy needs to be used ***

The Windows variables HTTP_PROXY and HTTPS_PROXY need to be set from Windows command line with the following commands:
```
setx http_proxy "<proxy-info>"
setx https_proxy "<proxy-info>"
````

with <proxy-info> being: http://bc-proxy-vip-de.pri.o2.com:8080 
