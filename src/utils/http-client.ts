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
import { httpRequestObjectInterface } from "../models/http";

export class httpClient {
    private static _instance: httpClient;

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
            fetch(request.url)
                .then(responseStatus)
                .then(json)
                .then((data) => {
                    if (isValidResponse(data)) {
                        resolve(data);
                    }
                    else {
                        reject("Response is not a valid JSON object or string");
                    }
                }).catch(() => {
                    reject("Cannot reach the endpoint");
                });
        });
    }
}