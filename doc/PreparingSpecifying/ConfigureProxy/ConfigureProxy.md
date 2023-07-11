# Configure the Proxy on TEF Laptop (Windows)

This guide describes how to configure the proxy settings in Windows.

Note that due to this documentation being available to the public the TEF-proxy is not shown in plaintext, but shown as \<TEF-proxy\>. To ask for the actual value, please request [here](mailto:katharina.mohr@soprasteria.com?subject=[GitHub]%20Request%20for%20proxy).

### Windows Environment Variables  

**Set the proxy**  
Open _cmd_ from the start menu and check if the proxy variables are set:
```
set | findstr proxy
```
If the variables are already set something like the following should be shown:

```
HTTPS_PROXY=<TEF-proxy>:8080
HTTP_PROXY=<TEF-proxy>:8080
```

If nothing is returned, the proxy is missing and can be set via the following commands from the _cmd_:
```
setx HTTPS_PROXY <TEF-proxy>:8080
setx HTTP_PROXY <TEF-proxy>:8080
```

The changes will not be visible inside the currently open _cmd_, so open a new instance of the cmd and check again if the settings are now available via:

```
set | findstr proxy
```

### GitHub, VisualStudioCode and Postman Proxy Settings

For the related proxy settings please also check:
- [GitHub and Visual Studio Code](../VSCode2GitHub/VSCode2GitHub.md)
- [Postman](../InstallingPostman/InstallingPostman.md)

[Up to Preparing](../PreparingSpecifying.md)