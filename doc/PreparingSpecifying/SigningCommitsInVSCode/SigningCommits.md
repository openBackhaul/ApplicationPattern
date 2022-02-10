# Verifying Git Commits in VS Code

When you work locally on your computer, Git allows you to set the author of your changes and the identity of the committer (so potentially anyone could impersonate someone else). This, potentially, makes it difficult for other people to be confident that commits and tags you create were actually created by you. To help solve this problem you can sign your commits and tags.<sup>1</sup>

A signed commit can be recognized by the green `Verified` bagde behind a commit:
![Verified Commmit](./pictures/VerifiedCommit.PNG)

This ensures the integrity of the commit, that means:

1. The author is really the person whose name is on the commit
2. The code change you see is really what the author wrote (i.e. it’s not been tampered with)

The following steps show how to set up verified commits for VS Code on Windows:

## Set up GPG

GPG is a system for en- and decryption but also for signing and verifying messages.

### Install GPG

First you have to install GPG (can be found in the Corporate AppStore -> `GPG4Win`).

You can check if it is installed correctly by opening Power Shell and enter

```console
gpg --version
```

If the output is something like

```console
gpg (GnuPG) <version>
libgcrypt <version>
```

you successfully installed GPG!

### Create key pair

If you already created a key pair in the past, you can skip this part.

There are two ways of creating a key pair: Kleoptra and CLI.

#### Kleopatra

1. Open Kleopatra
2. Click `Ctrl` + `N` to create a new key pair
3. Choose `Generate OpenGPG key pair` (`Persönliches OpenGPG-Schlüsselpaar erstellen`)
   ![Start generating key pair](./pictures/Kleopatra/3_CreateKey.PNG)
4. Enter your name and email.
    ![Personal information](./pictures/Kleopatra/4_EnterName.PNG)
   _Note that your email also has to be added and verified to your GitHub account, for more information click [here](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-user-account/managing-email-preferences/adding-an-email-address-to-your-github-account)._ Press `Continue`.
5. Check one more time if you input the right information and press `Create`.
   ![Confirmation](./pictures/Kleopatra/5_Confirm.PNG) _This now may take a while._
6. Enter a passphrase in the popup (and don't forget it).
   ![Enter Passphrase](./pictures/Kleopatra/7_Password.PNG)
7. After a while there should pop up an confirmation message. Press `Confirm`.

Congratulations, you just created your first key pair!

#### CLI

Open cmd/powershell and execute

```console
gpg --full-generate-key
```

Now there are a few configuration steps which have to be completed:

1. At the prompt, specify the kind of key you want, or press Enter to accept the default.
2. At the prompt, specify the key size you want, or press Enter to accept the default. Your key must be at least 4096 bits.
3. Enter the length of time the key should be valid. Press Enter to specify the default selection, indicating that the key doesn't expire.
4. Verify that your selections are correct and confirm your choices with _F_.
5. Enter your user ID information.\
   _Note that your email also has to be added and verified to your GitHub account, for more information click [here](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-user-account/managing-email-preferences/adding-an-email-address-to-your-github-account)._
6. Enter a secure passphrase (**DONT FORGET THIS PASSPHRASE!**).

## Set up Git

1. Run

    ```console
    gpg --list-secret-keys --keyid-format=long
    ```

    to get a list of your secret keys.

    This should now look similiar to this:

    ![Get signing key](./pictures/Git/signingKey.PNG)

2. Run the command below, but replace \<your signing key> with your actual key (the string marked in the picture above).

    ```console
    git config --global user.signingkey <your signing key>
    ```

3. Tell Git to always sign commits:

    ```console
    git config --global commit.gpgsign true
    ```

4. Tell Git the path to your gpg.exe:

    The executable path can be found by running

    ```console
    where gpg.exe
    ````

    in your cmd/Powershell prompt.
    Copy the output and run the command below, but replace `GPG.EXE PATH` with your actual path.

    ```console
    git config --global gpg.program "GPG.EXE PATH"
    ```

## Set up GitHub

Now you have to add your public key to GitHub.

1. To receive your public key, run

    ```console
    gpg --armor --export
    ```

2. Copy the public key (including `-----BEGIN PGP PUBLIC KEY BLOCK-----` and `-----END PGP PUBLIC KEY BLOCK-----`).
   ![public key block](./pictures/Git/PublicKeyBlock.PNG)
3. Log into your GitHub account, then go to `Settings`>`SSH and GPG keys` and click `New GPG key`.
4. Paste the key you copied before and save.

### Set up VS Code

1. Open VS Code
2. Open Settings
3. Search for `gpg`
4. Check the box named `Enables commit signing with GPG`

//TODO: GitHub email verification

1)<https://docs.github.com/en/authentication/managing-commit-signature-verification/displaying-verification-statuses-for-all-of-your-commits>
