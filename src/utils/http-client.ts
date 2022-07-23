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

const FetchCredentialTypes = {
    Include: "include",
    SameOrigin: "same-origin",
    Omit: "omit"
}

/**
 * HTTP Client class
 */
export class httpClient {
    private static _instance: httpClient;
    private _headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000"
    };

    private constructor() {}

    /**
     * Method the returns the singleton instance of the HTTP Client
     *
     * @returns HTTP Client instance
     */
    public static getInstance = () => {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new httpClient();

        return this._instance;
    }

    /**
     * HTTP GET method
     *
     * @param request Request object
     * @returns Promise object with result or error
     */
    public get = (request: httpRequestObjectInterface) => {
        return new Promise((resolve, reject) => {

            const requestHeaderWithAccessToken = {
                ...this._headers,
                "Authorization": `Bearer ${ request.accessToken }`
            };

            const requestHeaders = new Headers(requestHeaderWithAccessToken);

            const init = {
                credentials: request.configData.sendCookiesInRequests
                    ? FetchCredentialTypes.Include as RequestCredentials
                    : FetchCredentialTypes.SameOrigin as RequestCredentials,
                headers: requestHeaders,
                method: HTTPMethods.GET
            };

            const fetchRequest = new Request(request.url, init);

            fetch(fetchRequest)
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

    /**
     * HTTP POST method
     *
     * @param request Request object
     * @returns Promise object with result or error
     */
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
