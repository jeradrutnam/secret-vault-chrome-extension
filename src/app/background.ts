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

import { HTTPMethods } from "../models/http";
import { MessageStatuses, MessageTypes } from "../models/message";
import { vault } from "./open-id-connect/vault";

/**
 * Method to get current chrome tab
 *
 * @returns Tab Details
 */
const getCurrentTab = async () => {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);

    return tab;
};

let tab = await getCurrentTab();

/**
 * Event listener for on tab is activated
 */
chrome.tabs.onActivated.addListener(() => {
    if (/^http:\/\/localhost:4200/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: [ "./js/content.js" ]
        });
    }
});

/**
 * Background event listener to catch the content messages and process those through the vault
 * and post the results back to the content side
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const vaultInstance = vault.getInstance();

    switch(request.type) {
        case MessageTypes.INIT:
            vaultInstance.initialize(request.body.config)
                .then((data) => {
                    sendResponse({
                        status: MessageStatuses.SUCCESS,
                        message: data,
                        originalRequest: request
                    });
                }).catch((error) => {
                    sendResponse({
                        status: MessageStatuses.FAILED,
                        message: error,
                        originalRequest: request
                    });
                });

            break;
        case MessageTypes.CHECK_AUTHENTICATION:
            vaultInstance.isAuthenticated()
                .then((data) => {
                    sendResponse({
                        status: MessageStatuses.SUCCESS,
                        message: data,
                        originalRequest: request
                    });
                }).catch((error) => {
                    sendResponse({
                        status: MessageStatuses.FAILED,
                        message: error,
                        originalRequest: request
                    });
                });

            break;
        case MessageTypes.LOGIN:
            vaultInstance.signIn(request.body)
                .then((data) => {
                    sendResponse({
                        status: MessageStatuses.SUCCESS,
                        message: data,
                        originalRequest: request
                    });
                }).catch((error) => {
                    sendResponse({
                        status: MessageStatuses.FAILED,
                        message: error,
                        originalRequest: request
                    });
                });

            break;
        case MessageTypes.LOGOUT:
            vaultInstance.signOut()
                .then((data) => {
                    sendResponse({
                        status: MessageStatuses.SUCCESS,
                        message: data,
                        originalRequest: request
                    });
                }).catch((error) => {
                    sendResponse({
                        status: MessageStatuses.FAILED,
                        message: error,
                        originalRequest: request
                    });
                });

            break;
        case MessageTypes.API_CALL:
            if (request.body.type === HTTPMethods.GET) {
                vaultInstance.httpGet({
                    url: request.body.url
                }).then((data) => {
                        sendResponse({
                            status: MessageStatuses.SUCCESS,
                            message: data,
                            originalRequest: request
                        });
                    }).catch((error) => {
                        sendResponse({
                            status: MessageStatuses.FAILED,
                            message: error,
                            originalRequest: request
                        });
                    });
            }
            else if (request.body.type === HTTPMethods.POST) {
                vaultInstance.httpPost({
                    url: request.body.url,
                    payload: request.body.payload
                }).then((data) => {
                        sendResponse({
                            status: MessageStatuses.SUCCESS,
                            message: data,
                            originalRequest: request
                        });
                    }).catch((error) => {
                        sendResponse({
                            status: MessageStatuses.FAILED,
                            message: error,
                            originalRequest: request
                        });
                    });
            }
            else {
                sendResponse({
                    status: MessageStatuses.FAILED,
                    message: "Unsupported request method",
                    originalRequest: request
                });
            }

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
