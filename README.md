# Secret Vault Chrome Extension
A project to secure access token during OpenID Connect authentication flow for Single-Page Applications that runs completely on browsers.

# Run Extension in Developer Mode

1. Run command `npm start` in CLI
2. Open "Google Chrome Browser"
3. Navigate to "Extensions" settings manually or using `chrome://extensions/`
4. Click "Load unpacked" and browse for `secret-vault-chrome-extension\dist`

# Usage

```js
var secureVaultInstance;
var login;
var logout;
var doAPIGet;

var checkReady = setInterval(() => {
    if (document.readyState === "complete") {
        clearInterval(checkReady);

        secureVaultInstance = secureVaultAPI.getInstance();

        secureVaultInstance.connectIdentityProvider({
            signInRedirectURL: "http://localhost:4200/app", // Application Sign-In request handle URL
            signOutRedirectURL: "http://localhost:4200/app", // Application Sign-out request handle URL
            clientID: "<client-id>", // Application register ID
            baseUrl: "https://api.asgardeo.io/t/<org-name>", // Identity Provider Account Base Path
            scope: ["openid", "profile"]
        });

        secureVaultInstance.checkSignIn();

        login = function() {
            secureVaultInstance.signIn();
        };

        logout = function() {
            secureVaultInstance.signOut();
        };

        secureVaultInstance.on(secureVaultAPI.authHooks.SIGN_IN, (response) => {
            console.log(response);
        });

        secureVaultInstance.on(secureVaultAPI.authHooks.SIGN_OUT, (response) => {});

        doAPIGet = function() {
            secureVaultInstance.httpGet("https://api.asgardeo.io/t/<org-name>/oauth2/userinfo?schema=openid")
                .then((response) => {
                    console.log(response);
                }, (error) => {
                    console.error(error);
                });
        }
    }
});
```

# Run Test Applications

## Run Attacker Server

`cd test-workspace\apps\attacker-server` and run `npm start` in CLI

## Run Sample app that use the browser extension implementation

1. `cd test-workspace` and run `npx nx run demo:serve:development` in CLI
2. Navigate to app from the browser `http://localhost:4200/`

## Run Sample app (vulnerable) that uses session storage for access token

1. `cd test-workspace` and run `npx nx run demo2:serve:development` in CLI
2. Navigate to app from the browser `http://localhost:4300/`

# License

Licenses this source under the MIT ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.
