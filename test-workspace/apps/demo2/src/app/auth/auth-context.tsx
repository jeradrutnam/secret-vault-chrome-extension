/**
 * MIT License
 *
 * Copyright (c) 2022 Jerad Rutnam (www.jeradrutnam.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
**/

import { createContext, useContext, useEffect, useState } from "react";
import { until } from "../utils/async-utils";

interface AuthSate {
    username: string;
}

interface AuthContextInterface {
    checkSignIn: () => void;
    secureFetch: (endpoint: string) => Promise<any>;
    signIn: () => Promise<any>;
    signOut: () => Promise<any>;
    state: AuthSate | null;
}

const defaultState = {
    username: ""
}

/**
 * Authentication Context to hold global states in react components.
 */
const AuthContext = createContext<any | null>(null);

let secureVaultInstance: any;

const AuthProvider = (props: any) => {
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
    const secureFetch = async (endpoint: string) => {
        await until(() => windowReady);

        return new Promise(async (resolve, reject) => {
            try {
                await secureVaultInstance?.httpGet(endpoint)
                    .then((response: object) => {
                        resolve(response);
                    }, (error: object) => {
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

                    secureVaultInstance.on(window.secureVaultAPI.authHooks.SIGN_IN, (response: any) => {
                        setState(response.message);
                    });

                    secureVaultInstance.on(window.secureVaultAPI.authHooks.SIGN_OUT, (response: any) => {
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
