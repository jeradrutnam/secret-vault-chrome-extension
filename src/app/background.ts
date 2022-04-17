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

import { MessageStatuses, MessageTypes } from "../utils/open-id-connect/models";

const getCurrentTab = async () => {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);

    return tab;
};

let tab = await getCurrentTab();

const responseStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

const json = (response) => {
    return response.json()
}

const isValidResponse = (value) => {
    if (value == typeof(String)) {
        try {
            JSON.parse(value);
        } catch (e) {
            return false;
        }
    }

    return true;
};

chrome.tabs.onActivated.addListener(() => {
    if (/^http:\/\/localhost:3000/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: [ "./js/content.js" ]
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.type) {
        case MessageTypes.INIT:
            sendResponse({
                status: MessageStatuses.FAILED,
                message: "Need to implement",
                originalRequest: request
            });

            break;
        case MessageTypes.API_CALL:
            fetch(request.body.url)
                .then(responseStatus)
                .then(json)
                .then((data) => {
                    if (isValidResponse(data)) {
                        sendResponse({
                            status: MessageStatuses.SUCCESS,
                            message: data,
                            originalRequest: request
                        });
                    }
                    else {
                        sendResponse({
                            status: MessageStatuses.FAILED,
                            message: "Response is not a valid JSON object or string",
                            originalRequest: request
                        });
                    }
                }).catch(() => {
                    sendResponse({
                        status: MessageStatuses.FAILED,
                        message: "Cannot reach the endpoint",
                        originalRequest: request
                    });
                });

            break;
        default:
            sendResponse({
                status: MessageStatuses.FAILED,
                message: "invalid request type",
                originalRequest: request
            });
    }

    return true;
});

export {};