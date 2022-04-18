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

import { ConfigInterface, MessageStatuses, MessageTypes } from "./models";
import { uniqueIDGen } from "../../utils/string-utils";
import { resolvePromise, rejectPromise, until } from "../../utils/promise-utils";

export class vaultClient {
    private static _instance: vaultClient;
    private _authConfig: ConfigInterface;
    private static _initializationTriggered = false;
    private static _isInitialized = false;
    private _httpCallStack = [];

    private constructor() {}

    private getHTTPCallStack = () => {
        return this._httpCallStack;
    }

    private addToHTTPCallStack = (apiRequest) => {
        return this._httpCallStack.push(apiRequest);
    }

    public static getInstance = () => {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new vaultClient();

        return this._instance;
    }

    public static initialize = (config: ConfigInterface) => {
        this._initializationTriggered = true;

		this.getInstance()._authConfig = config;

        window.postMessage({
            origin: "FROM_PAGE",
            type: MessageTypes.INIT,
            body: {
                config: this.getInstance()._authConfig
            }
        });
    }

    public static isInitialized = () => {
		return this._isInitialized;
    }

    public static signIn = async (callback?) => {

        await until(() => !this._initializationTriggered);
		// TODO: Implement operation
    }

    public static signOut = async (callback?) => {

        await until(() => !this._initializationTriggered);
		// TODO: Implement operation
    }

    public static httpRequest = async (url) => {

        await until(() => !this._initializationTriggered);

        return new Promise((resolve, reject) => {
            if (this._isInitialized) {
                const httpRequestInstanceID = uniqueIDGen();

                window.postMessage({ 
                    origin: "FROM_PAGE", 
                    type: MessageTypes.API_CALL,
                    body: {
                        url: url, 
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
                reject("Before making API requests. Secure vault need to be initialized.");
            }
        });
    }

    public static handleMessage = (message) => {
        if (message.data.origin && message.data.origin == "FROM_SERVER") {

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
                    return
                    // code block
            }
        }
    }
}
