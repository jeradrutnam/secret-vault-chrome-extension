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

import { AsgardeoAuthClient, AuthenticationUtils, BasicUserInfo } from "@asgardeo/auth-js";
import { ChromeStore } from "../../utils/chrome-store";
import { MemoryStore } from "../../utils/memory-store";
import { AsgardeoCryptoUtils } from "../../utils/asgardeo-crypto-utils";
import { httpClient } from "../../utils/http-client";
import { ConfigInterface } from "../../models/config";
import { HTTPAuthorizationRequiredError, HTTPNoAuthentionSessionError } from "../../models/http";

/**
 * Vault Class
 */
export class vault {
    private static _instance: vault;
    private _authConfig: ConfigInterface;
    private _storage;
    private _cryptoUtils;
    private _http;
    private _authClient;
    private _isInitialized = false;
    private _chromeStore = new ChromeStore();
    private _dataLayer;

    private constructor() {}

    /**
     * Method the returns the singleton instance of the Vault
     *
     * @returns vaultInstance
     */
    public static getInstance = () => {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new vault();

        return this._instance;
    }

    /**
     * Vault initialization method
     *
     * @param config Vault config object that has the Identity Provider configuration
     * @returns
     */
    public initialize = (config: ConfigInterface) => {
        return new Promise((resolve, reject) => {
            try {
                this._storage = new MemoryStore();
                this._cryptoUtils = new AsgardeoCryptoUtils();
                this._http = httpClient.getInstance();
                this._authConfig = config;
                this._authClient = new AsgardeoAuthClient(this._storage, this._cryptoUtils);

                this._authClient.initialize(this._authConfig);
                this._dataLayer = this._authClient.getDataLayer();
                this._isInitialized = true;

                resolve("Vault initialized.");
            } catch (error) {
                reject("Vault initialized failed.");
            }
        });
    }

    /**
     * Method to get the vault initialization status
     *
     * @returns true or false
     */
    public static isInitialized = () => {
		return this.getInstance()._isInitialized;
    }

    /**
     * Method to get the user authenticated status
     *
     * @returns true or false
     */
    public isAuthenticated = async (): Promise<boolean> => {
        return await this._authClient.isAuthenticated();
    };

    /**
     * Method to get user's information
     *
     * @returns User's information
     */
    private getBasicUserInfo = async (): Promise<BasicUserInfo> => {
        return await this._authClient.getBasicUserInfo();
    };

    /**
     * Method to request for an Access Token
     *
     * @param config Configuration object
     * @param code Authorization Code
     * @param session_state Session state
     * @param state State value
     * @param pkce PKCE key
     * @returns Promise with the user's basic information
     */
    private requestAccessToken = async (config, code, session_state, state, pkce) => {
        if (pkce && config.enablePKCE) {
            let pckeCode = await this._chromeStore.getData(pkce);

            await this._authClient.setPKCECode(pckeCode, state ?? "");
        }

        return new Promise(async (resolve, reject) => {
            this._authClient.requestAccessToken(
                    code,
                    session_state ?? "",
                    state ?? ""
                ).then(() => {
                    resolve(this.getBasicUserInfo());
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Method to do sign in
     *
     * @param requestBody Sign In request object receives from the client
     * @returns Promise with sign in return status
     */
    public signIn = (requestBody) => {
        return new Promise(async (resolve, reject) => {
            const config = await this._dataLayer.getConfigData();

            const urlObject: URL = new URL(requestBody.pageUrl);
            const code: string = urlObject.searchParams.get("code") ?? "";
            const state: string = urlObject.searchParams.get("state") ?? "";
            const session_state: string = urlObject.searchParams.get("session_state") ?? "";
            const pkce: string = (state !== "") ? AuthenticationUtils.extractPKCEKeyFromStateParam(state) : "";

            if (code !== "") {
                this.requestAccessToken(config, code, session_state, state, pkce)
                    .then((data) => {
                        resolve({
                            message: data,
                            isAuthenticated: true
                        });
                    }).catch((error) => {
                        reject(error);
                    });
            }
            else {
                this._authClient.getAuthorizationURL()
                    .then(async (url) => {
                        const state: string = new URL(url).searchParams.get("state") ?? "";
                        const pkceKey: string = AuthenticationUtils.extractPKCEKeyFromStateParam(state);
                        const pkce: string = await this._authClient.getPKCECode(state);

                        if (pkce && config.enablePKCE) {
                            await this._chromeStore.setData(pkceKey, pkce);
                        }

                        resolve({
                            url: url,
                            isAuthenticated: false
                        });
                    }).catch((error) => {
                        reject(error);
                    });
            }
        });
    }

    /**
     * Method to do sign out
     *
     * @returns Promise with sign out return status
     */
    public signOut = async () => {
        const isUserAuthenticated = await this.isAuthenticated();

        return new Promise(async (resolve, reject) => {
            if (isUserAuthenticated) {
                this._authClient.getSignOutURL()
                    .then(async (url) => {
                        resolve({
                            url: url,
                            isAuthenticated: isUserAuthenticated
                        });
                    }).catch((error) => {
                        reject(error);
                    });
            }
            else {
                reject(HTTPNoAuthentionSessionError);
            }
        });
    }

    /**
     * HTTP get method
     *
     * @param request Request object
     * @returns HTTP response or error
     */
    public httpGet = async (request) => {
        const isUserAuthenticated = await this.isAuthenticated();
        const config = await this._dataLayer.getConfigData();
        let accessToken = (await this._dataLayer.getSessionData()).access_token;

        return new Promise(async (resolve, reject) => {
            if (isUserAuthenticated) {
                this._http.get({
                    configData: config,
                    accessToken: accessToken,
                    url: request.url
                }).then((data) => {
                    resolve(data);
                }).catch(async (error) => {
                    if (error?.response?.status === 401 || !error?.response) {
                        try {
                            await this._authClient.refreshAccessToken();

                            accessToken = (await this._dataLayer.getSessionData()).access_token;

                            this._http.get({
                                configData: config,
                                accessToken: accessToken,
                                url: request.url
                            }).then((data) => {
                                resolve(data);
                            }).catch(async (error) => {
                                reject(error);
                            });
                        } catch (refreshError: any) {
                            reject(error);
                        }
                    }
                    else {
                        reject(error);
                    }
                });
            }
            else {
                reject(HTTPAuthorizationRequiredError);
            }
        });
    }

    /**
     * HTTP post method
     *
     * @param request Request object
     * @returns HTTP response or error
     */
    public httpPost = async (request) => {
        const isUserAuthenticated = await this.isAuthenticated();
        const config = await this._dataLayer.getConfigData();
        let accessToken = (await this._dataLayer.getSessionData()).access_token;

        return new Promise((resolve, reject) => {
            if (isUserAuthenticated) {
                this._http.post({
                    url: request.url,
                    configData: config,
                    accessToken: accessToken,
                    payload: request.payload
                }).then((data) => {
                    resolve(data);
                }).catch(async (error) => {
                    if (error?.response?.status === 401 || !error?.response) {
                        try {
                            await this._authClient.refreshAccessToken();

                            accessToken = (await this._dataLayer.getSessionData()).access_token;

                            this._http.post({
                                url: request.url,
                                configData: config,
                                accessToken: accessToken,
                                payload: request.payload
                            }).then((data) => {
                                resolve(data);
                            }).catch(async (error) => {
                                reject(error);
                            });
                        } catch (refreshError: any) {
                            reject(error);
                        }
                    }
                    else {
                        reject(error);
                    }
                });
            }
            else {
                reject(HTTPAuthorizationRequiredError);
            }
        });
    }
}
