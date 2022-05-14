import React, { createContext, useContext, useEffect, useState } from "react";
import { until } from "./Helpers";

/**
 * Authentication Context to hold global states in react components.
 */
const AuthContext = createContext(null);

let secureVaultInstance;

const AuthProvider = (props) => {
    const [ state, setState ] = useState(null);
    const [ windowReady, setWindowReady ] = useState(false);

    const { children, config } = props;

    const signIn = async () => { 
        await until(() => windowReady);

        await secureVaultInstance.signIn();
    };
    const signOut = async () => {
        await until(() => windowReady);

        await secureVaultInstance.signOut();
    };
    const checkSignIn = async () => {
        await until(() => windowReady);
        
        await secureVaultInstance.checkSignIn();
    };
    const secureFetch = async (endpoint) => {
        await until(() => windowReady);

        return new Promise(async (resolve, reject) => {
            try {
                await secureVaultInstance?.httpGet(endpoint)
                    .then((response) => {
                        resolve(response);
                    }, (error) => {
                        reject(error);
                    });
            } catch (error) {
                reject(error);
            }
        });
    };

    useEffect(() => {
        (async () => {
            let checkReady = await setInterval(() => {
                if (document.readyState === "complete" && window.secureVaultAPI) {
                    clearInterval(checkReady);

                    secureVaultInstance = window.secureVaultAPI.getInstance();

                    setWindowReady(true);

                    secureVaultInstance.connectIdentityProvider(config);
        
                    secureVaultInstance.checkSignIn();

                    secureVaultInstance.on(window.secureVaultAPI.authHooks.SIGN_IN, (response) => {
                        setState(response.message);
                    });
                    
                    secureVaultInstance.on(window.secureVaultAPI.authHooks.SIGN_OUT, (response) => {
                        console.log("Logout");
                    });
                }
            });
        })();
    }, [ config ]);

    /**
     * Render state and special case actions
     */
    return (
        <AuthContext.Provider
            value={ {
                checkSignIn,
                secureFetch,
                signIn,
                signOut,
                state
            } }
        >
            { children }
        </AuthContext.Provider>
    );
};

const useAuthContext = () => {
    return useContext(AuthContext);
};

export { AuthProvider, useAuthContext };
