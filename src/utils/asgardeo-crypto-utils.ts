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

import { Buffer } from "buffer";
import base64url from "base64url";
import sha256 from "fast-sha256";
import { createLocalJWKSet, jwtVerify } from "jose";
import randombytes from "randombytes";
import { CryptoUtils as AuthJSCryptoUtils, JWKInterface } from "@asgardeo/auth-js";

export class AsgardeoCryptoUtils implements AuthJSCryptoUtils<Buffer | string> {
    public base64URLEncode(value: Buffer | string): string {
        return base64url.encode(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    }

    public base64URLDecode(value: string): string {
        return base64url.decode(value).toString();
    }

    public hashSha256(data: string): string | Buffer {
        return Buffer.from(sha256(new TextEncoder().encode(data)));
    }

    public generateRandomBytes(length: number): string | Buffer {
        return randombytes(length);
    }

    public verifyJwt(
        idToken: string,
        jwk: Partial<JWKInterface>,
        algorithms: string[],
        clientID: string,
        issuer: string,
        subject: string,
        clockTolerance?: number
    ): Promise<boolean> {
        return jwtVerify(
            idToken,
            createLocalJWKSet({
                keys: [jwk]
            }),
            {
                algorithms: algorithms,
                audience: clientID,
                clockTolerance: clockTolerance,
                issuer: issuer,
                subject: subject
            }
        ).then(() => {
            return Promise.resolve(true);
        });
    }
}
