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

import { MessageStatuses, MessageTypes, MessageOrigins } from "../../models/message";
import { ConfigInterface } from "../../models/config";
import { Hooks, HookType } from "../../models/hooks";
import { uniqueIDGen } from "../../utils/string-utils";
import { LocalStore } from "../../utils/local-store";
import { removeAuthorizationCode } from "../../utils/url-utils";
import { resolvePromise, rejectPromise, until } from "../../utils/promise-utils";
import { HTTPAuthorizationRequiredError, httpCallStackInterface, HTTPMethods } from "../../models/http";

const SIGN_IN_INIT_STORAGE_KEY = "signInInit";
const SIGN_OUT_INIT_STORAGE_KEY = "signOutInit";

/**
 * Vault Client Class
 */
export class vaultClient {
    private static _instance: vaultClient;
    private _authConfig: ConfigInterface;
    private _localStore = new LocalStore();
    private static _initializationTriggered = false;
    private static _isInitialized = false;
    private _httpCallStack = [];
    private static _onSignInCallback: (response) => void = () => null;
    private static _onSignOutCallback: (response) => void = () => null;

    private constructor() {}

    /**
     * Method the returns the singleton instance of the Vault Client
     *
     * @returns vaultClientInstance
     */
    public static getInstance = () => {

        if (this._instance) {
            return this._instance;
        }

        this._instance = new vaultClient();

        return this._instance;
    }

    /**
     * Method to get the vault initialization status
     *
     * @returns true or false
     */
    public static isInitialized = () => {

		return this._isInitialized;
    }

    /**
     * Method to get the HTTP requests calls list
     *
     * @returns httpCallStack
     */
    private getHTTPCallStack = () => {

        return this._httpCallStack;
    }

    /**
     * Method to add HTTP request reference to the stack
     *
     * @param apiRequest Object with API request reference ID and request promise resolve and reject
     * @returns httpCallStack
     */
    private addToHTTPCallStack = (apiRequest: httpCallStackInterface) => {

        return this._httpCallStack.push(apiRequest);
    }

    /**
     * Method to request the vault client to connect to an IdP with the given config object
     *
     * @param config required configuration object for IdP connection
     */
    public static connectIdentityProvider = (config: ConfigInterface) => {

        this._initializationTriggered = true;

		this.getInstance()._authConfig = config;

        window.postMessage({
            origin: MessageOrigins.PAGE,
            type: MessageTypes.INIT,
            body: {
                config: this.getInstance()._authConfig
            }
        });
    }

    /**
     * Method to check user signed in status
     */
    public static checkSignIn = async () => {

        if (this.isInitialized) {

            const signInInit = await this.getInstance()._localStore.getData(SIGN_IN_INIT_STORAGE_KEY);

            if (signInInit == "true") {
                this.signIn();
            }
        }
        else {
            console.log("Need to connect to an Identity Provider first before calling this method.");
        }
    }

    /**
     * Method to user sign in to Identity Provider
     */
    public static signIn = async () => {

        await until(() => !this._initializationTriggered);

        return new Promise((resolve, reject) => {
            if (this._isInitialized) {
                this.getInstance()._localStore.setData(SIGN_IN_INIT_STORAGE_KEY, "true");

                window.postMessage({
                    origin: MessageOrigins.PAGE,
                    type: MessageTypes.LOGIN,
                    body: {
                        pageUrl: window.location.href
                    }
                });
            }
            else {
                reject("App should be connected to an Identity Provider before trigger Sign-in request.");
            }
        });
    }

    /**
     * Method to user sign out to Identity Provider
     */
    public static signOut = async () => {

        await until(() => !this._initializationTriggered);

        return new Promise((resolve, reject) => {
            if (this._isInitialized) {
                this.getInstance()._localStore.setData(SIGN_OUT_INIT_STORAGE_KEY, "true");

                window.postMessage({
                    origin: MessageOrigins.PAGE,
                    type: MessageTypes.LOGOUT,
                    body: { }
                });
            }
            else {
                reject("App should be connected to an Identity Provider before trigger Sign-out request.");
            }
        });
    }

    /**
     * Method to do http get requests after a successful sign in
     *
     * @param url API Endpoint URL
     * @returns Promise with the response
     */
    public static httpGet = async (url) => {

        await until(() => !this._initializationTriggered);

        return new Promise((resolve, reject) => {
            if (this._isInitialized) {
                const httpRequestInstanceID = uniqueIDGen();

                window.postMessage({
                    origin: MessageOrigins.PAGE,
                    type: MessageTypes.API_CALL,
                    body: {
                        url: url,
                        type: HTTPMethods.GET,
                        httpRequestInstanceID: httpRequestInstanceID
                    }
                });

                this.getInstance().addToHTTPCallStack({
                    ["httpRequestInstanceID"]: httpRequestInstanceID,
                    ["resolve"]: resolve,
                    ["reject"]: reject
                });
            }
            else {
                reject("Authorization is required before making secure API requests. " +
                    "Make sure secure vault is initialized.");
            }
        });
    }

    /**
     * Method to do http post requests after a successful sign in
     *
     * @param url API Endpoint URL
     * @returns Promise with the response
     */
    public static httpPost = async (url, payload) => {

        await until(() => !this._initializationTriggered);

        return new Promise((resolve, reject) => {
            if (this._isInitialized) {
                const httpRequestInstanceID = uniqueIDGen();

                window.postMessage({
                    origin: MessageOrigins.PAGE,
                    type: MessageTypes.API_CALL,
                    body: {
                        url: url,
                        type: HTTPMethods.POST,
                        payload: payload,
                        httpRequestInstanceID: httpRequestInstanceID
                    }
                });

                this.getInstance().addToHTTPCallStack({
                    ["httpRequestInstanceID"]: httpRequestInstanceID,
                    ["resolve"]: resolve,
                    ["reject"]: reject
                });
            }
            else {
                reject(HTTPAuthorizationRequiredError + ". Make sure secure vault is initialized.");
            }
        });
    }

    /**
     * Method to handle responses from the background script of the extension
     *
     * @param message Message response from the extension background script
     */
    public static handleResponseMessage = (message) => {

        if (message.data.origin && message.data.origin == MessageOrigins.BACKGROUND) {

            switch(message.data.response.originalRequest.type) {
                case MessageTypes.INIT:
                    if (message.data.response.status === MessageStatuses.SUCCESS) {
                        this._isInitialized = true;
                    }
                    else {
                        console.error("Secure Vault Initialize failed!");
                    }

                    this._initializationTriggered = false;

                    break;
                case MessageTypes.LOGIN:
                    if (message.data.response.status === MessageStatuses.SUCCESS) {

                        if (!message.data.response.message.isAuthenticated) {
                            window.location.href = message.data.response.message.url;
                        }
                        else {
                            this._onSignInCallback(message.data.response.message);
                        }
                    }
                    else {
                        console.error(message.data.response.message);
                    }

                    removeAuthorizationCode();

                    break;
                case MessageTypes.LOGOUT:
                    if (message.data.response.status === MessageStatuses.SUCCESS) {
                        this.getInstance()._localStore.removeData(SIGN_IN_INIT_STORAGE_KEY);
                        this.getInstance()._localStore.removeData(SIGN_OUT_INIT_STORAGE_KEY);

                        window.location.href = message.data.response.message.url;

                        this._onSignOutCallback("Logout successfully!");
                    }
                    else {
                        location.reload();
                    }

                    break;
                case MessageTypes.API_CALL:
                    const httpRequests = this.getInstance().getHTTPCallStack().filter(httpRequest =>
                        httpRequest.httpRequestInstanceID ===
                            message.data.response.originalRequest.body.httpRequestInstanceID);

                    if (httpRequests.length > 0) {
                        httpRequests.forEach((httpRequest) => {
                            if (message.data.response.status === MessageStatuses.SUCCESS) {
                                resolvePromise(httpRequest.resolve, message.data.response.message);
                            }
                            else {
                                rejectPromise(httpRequest.reject, message.data.response.message);
                            }

                            this.getInstance().getHTTPCallStack().splice(this.getInstance().getHTTPCallStack()
                                .findIndex(({ httpRequestInstanceID }) =>
                                    httpRequestInstanceID == httpRequest.httpRequestInstanceID), 1);
                        });
                    }

                    break;
                default:
                    return;
            }
        }
    }

    /**
     * Method to handle callbacks on a successful sign in or sign out
     *
     * @param hook When to trigger the call back
     * @param callback Function to trigger upon the hook triggered
     */
    public static on = async (hook: HookType, callback?: () => {}) => {

        await until(() => !this._initializationTriggered);

        if (callback && typeof callback === "function") {
            switch (hook) {
                case Hooks.SIGN_IN:
                    this._onSignInCallback = callback;
                    break;
                case Hooks.SIGN_OUT:
                    this._onSignOutCallback = callback;
                    break;
                default:
                    console.error("Not a valid hook");
            }
        } else {
            console.error("Error on hook!")
        }
    }
}
