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

import { MessageOrigins } from "../models/message";

/**
 * Method to inject client scripts to the web application
 * 
 * @param file_path Path of the injected script file
 * @param tag HTML tag where the script should be injected
 */
const injectScript = (file_path, tag) => {
    const node = document.getElementsByTagName(tag)[0];
    const script = document.createElement("script");

    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", file_path);

    node.appendChild(script);
};

injectScript(chrome.runtime.getURL("js/inject.js"), "head"); 

/**
 * Window event listener to catch client messages and pass those to extension background for process
 * and post the background response to the client
 */
window.addEventListener("message", (e) => {
    if (e.data.origin && e.data.origin == MessageOrigins.PAGE) {
        chrome.runtime.sendMessage({ type: e.data.type, body: e.data.body }, (response) => {
            window.postMessage({ origin: MessageOrigins.BACKGROUND, response });
        });
    }
}, true);

export {};
