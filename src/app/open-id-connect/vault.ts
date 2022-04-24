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

import { AsgardeoAuthClient, AuthenticationUtils, BasicUserInfo, DecodedIDTokenPayload } from "@asgardeo/auth-js";
import { ChromeStore } from "../../utils/chrome-store";
import { MemoryStore } from "../../utils/memory-store";
import { CryptoUtils } from "../../utils/crypto-utils";
import { httpClient } from "../../utils/http-client";
import { ConfigInterface } from "../../models/config";

const REFRESH_TOKEN_TIMER = "refreshTokenTimer";

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

    public static getInstance = () => {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new vault();

        return this._instance;
    }

    public initialize = (config: ConfigInterface) => {
        return new Promise((resolve, reject) => {
            try {
                this._storage = new MemoryStore();
                this._cryptoUtils = new CryptoUtils();
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

    public static isInitialized = () => {
		return this.getInstance()._isInitialized;
    }

    public isAuthenticated = (): Promise<boolean> => {
        return this._authClient.isAuthenticated();
    };

    private getAccessToken = (): Promise<string> => {
        return this._authClient.getAccessToken();
    };

    private getDecodedIDToken = async (): Promise<DecodedIDTokenPayload> => {
        return await this._authClient.getDecodedIDToken();
    };

    private getBasicUserInfo = async (): Promise<BasicUserInfo> => {
        return await this._authClient.getBasicUserInfo();
    };

    private refreshAccessTokenAutomatically = async (): Promise<void> => {
        const sessionData = await this._dataLayer.getSessionData();

        if (sessionData.refresh_token) {
            // Refresh 10 seconds before the expiry time
            const expiryTime = parseInt(sessionData.expires_in);
            const time = expiryTime <= 10 ? expiryTime : expiryTime - 10;

            const timer = setTimeout(async () => {
                await this._authClient.refreshAccessToken();
            }, time * 1000);

            await this._dataLayer.setTemporaryDataParameter("refreshTimer", JSON.stringify(timer));
        }
    }

    private clearRefreshTokenTimeout = async (): Promise<void> => {
        if (await this._dataLayer.getTemporaryDataParameter(REFRESH_TOKEN_TIMER)) {
            const oldTimer = JSON.parse(
                (await this._dataLayer.getTemporaryDataParameter(REFRESH_TOKEN_TIMER)) as string
            );

            clearTimeout(oldTimer);
        }
    }

    private requestAccessToken = async (config, code, session_state, state, pkce) => {
        if (pkce && config.enablePKCE) {
            let pckeCode;

            chrome.storage.sync.get([pkce], async (result) => {
                pckeCode = result[pkce];
            });

            await this._authClient.setPKCECode(pckeCode, state ?? "");
        }

        return new Promise(async (resolve, reject) => {
            this._authClient.requestAccessToken(
                    code,
                    session_state ?? "",
                    state ?? ""
                ).then((response) => {
                    resolve({
                        message: response,
                        isAuthenticated: true
                    });
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    public signIn = (requestBody) => {
        return new Promise(async (resolve, reject) => {
            const config = await this._dataLayer.getConfigData();

            const urlObject: URL = new URL(requestBody.pageUrl);
            const code: string = urlObject.searchParams.get('code') ?? "";
            const state: string = urlObject.searchParams.get('state') ?? "";
            const session_state: string = urlObject.searchParams.get('session_state') ?? "";
            const pkce: string = (state !== "") ? AuthenticationUtils.extractPKCEKeyFromStateParam(state) : "";

            if (this.isAuthenticated()) {
                await this.refreshAccessTokenAutomatically();
                await this.clearRefreshTokenTimeout();  
            }
            
            if (code !== "") {
                this.requestAccessToken(config, code, session_state, state, pkce)
                    .then((data) => {
                        resolve(data);
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
                            this._chromeStore.setData(pkceKey, pkce);
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

    public httpGet = (request) => {
        return new Promise((resolve, reject) => {
            this._http.get({
                url: request.url 
            }).then((data) => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}
