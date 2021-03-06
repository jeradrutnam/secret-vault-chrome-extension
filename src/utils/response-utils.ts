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

import { HTTPErrors, HTTPFetchError } from "../models/http";

/**
 * Method to check fetched data response status
 * 
 * @param response Fetch response object
 * @returns 
 */
export const responseStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    }
    else if (response.status >= 300 && response.status < 600) {
        return Promise.reject({
            status: response.status,
            message: HTTPErrors[response.status] || ""
        });
    }
    else {
        return Promise.reject(new Error(HTTPFetchError))
    }
}

/**
 * Method to get JSON object of the response
 * 
 * @param response Fetch response
 * @returns JSON object
 */
export const json = (response) => {
    return response.json();
}

/**
 * Method to check if the response data is a valid JSON
 * 
 * @param value 
 * @returns 
 */
export const isValidResponse = (value) => {
    if (value == typeof(String)) {
        try {
            JSON.parse(value);
        } catch (e) {
            return false;
        }
    }

    return true;
};
