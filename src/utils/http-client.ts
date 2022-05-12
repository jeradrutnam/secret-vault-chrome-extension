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

import { responseStatus, json, isValidResponse } from "../utils/response-utils";
import { httpRequestObjectInterface, HTTPMethods, HTTPFetchError } from "../models/http";

const getTokenRequestHeaders = (): HeadersInit => {
    return {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    };
}


const FetchCredentialTypes = {
    Include: "include",
    SameOrigin: "same-origin",
    Omit: "omit"
}

export class httpClient {
    private static _instance: httpClient;
    private _headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000"
    };

    private constructor() {}

    public static getInstance = () => {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new httpClient();

        return this._instance;
    }

    public get = (request: httpRequestObjectInterface) => {
        return new Promise((resolve, reject) => {

            const body: string[] = [];

            body.push(`client_id=${ request.configData.clientID }`);
            body.push(`token=${ request.accessToken }`);
            body.push("token_type_hint=access_token");

            // this._headers.append("Authorization", `Bearer ${ request.accessToken }`);

            const requestHeaderWithAccessToken = {
                ...this._headers,
                "Authorization": `Bearer ${ request.accessToken }`
            };

            const requestHeaders = new Headers(requestHeaderWithAccessToken);

            const init = {
                body: body.join("&"),
                credentials: request.configData.sendCookiesInRequests
                    ? FetchCredentialTypes.Include as RequestCredentials
                    : FetchCredentialTypes.SameOrigin as RequestCredentials,
                headers: requestHeaders,
                method: HTTPMethods.GET,
                // mode: "cors" as RequestMode,
                // cache: "default" as RequestCache
            };

            // const requestURL = new Request(request.url, init);

            debugger;

            fetch(request.url, init)
                .then(responseStatus)
                .then(json)
                .then((data) => {
                    if (isValidResponse(data)) {
                        resolve(data);
                    }
                    else {
                        reject("Response is not a valid JSON object or string");
                    }
                }).catch((error) => {
                    (error.status) ? reject(error) : reject(HTTPFetchError);
                });
        });
    }

    public post = (request: httpRequestObjectInterface) => {
        return new Promise((resolve, reject) => {
            const init = {
                method: HTTPMethods.POST,
                headers: this._headers,
                mode: "cors" as RequestMode,
                cache: "default" as RequestCache,
                body: request.payload
            };

            const requestURL = new Request(request.url, init);

            fetch(requestURL)
                .then(responseStatus)
                .then(json)
                .then((data) => {
                    if (isValidResponse(data)) {
                        resolve(data);
                    }
                    else {
                        reject("Response is not a valid JSON object or string");
                    }
                }).catch((error) => {
                    (error.status) ? reject(error) : reject(HTTPFetchError);
                });
        });
    }
}
