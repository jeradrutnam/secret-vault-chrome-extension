# Secret Vault Chrome Extension
A project to secure access token during OpenID Connect authentication flow for Single-Page Applications that runs
completely on browsers.

This is only a Proof-of-Concept (PoC) develop to prove a research solution as a part of a study project, and not to use
for production. As this is a PoC, project scope is narrowed down for the supporting of only OpenID connect
Authorization code flow and using on Asgardeo.io configuration sample as the Identity Provider.

So, in order to test the extension you will need to have an Asgardeo account and 2 Single-Page-Applications registered.

## Run Extension in Developer Mode

1. Run command `npm start` in CLI
2. Open "Google Chrome Browser"
3. Navigate to "Extensions" settings manually or using `chrome://extensions/`
4. Click "Load unpacked" and browse for `secret-vault-chrome-extension\dist`

## Usage

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
            signInRedirectURL: "http://localhost:[port]/app", // Application Sign-In request handle URL
            signOutRedirectURL: "http://localhost:[port]/app", // Application Sign-out request handle URL
            clientID: "<client-id>", // Application register ID
            baseUrl: "https://api.asgardeo.io/t/<org-name>", // Identity Provider Account Base Path
            scope: ["openid", "profile"]
        });

        secureVaultInstance.checkSignIn();

        secureVaultInstance.on(secureVaultAPI.authHooks.SIGN_IN, (response) => { console.log(response); });
        secureVaultInstance.on(secureVaultAPI.authHooks.SIGN_OUT, (response) => {});

        login = function() { secureVaultInstance.signIn(); };
        logout = function() { secureVaultInstance.signOut(); };
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

## Run Test Applications

### Run Attacker Server

This is a simple node + express server which acts as an attacker server to show received access tokens

Run `npm run attacker-server` in CLI

### Run Sample app that use the browser extension implementation

This is a simple dummy react application that proof the extension will take care of securing the access token
against XSS attacks that will be obtain through an OpenID connect authorization flow and stored in the browser.

This sample proof an attack that simulates through a vulnerable dependency for HTML5 storages
(localStorage/sessionStorage) and network calls

1. Run `npm run demo` in CLI
2. Navigate to app from the browser `http://localhost:4200/`

### Run Sample app (vulnerable) that uses session storage storing access token

This is a simple dummy react application that simulate an XSS attack for HTML5 storages
(localStorage/sessionStorage) and network calls through a vulnerable dependency.

Obtained access token will be sent to the attacker-server

1. Run `npm run demo2` in CLI
2. Navigate to app from the browser `http://localhost:4300/`

## License

Licenses this source under the MIT ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.
