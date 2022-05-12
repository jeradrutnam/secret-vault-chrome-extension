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

// import { generateKeyPairSync, privateDecrypt, privateEncrypt } from "crypto";

export class MemoryStore {
    private _data: Map<string, string>;
    // private _keys() {
    //     return generateKeyPairSync("rsa", {
    //         modulusLength: 520,
    //         publicKeyEncoding: {
    //             type: "spki",
    //             format: "pem"
    //         },
    //         privateKeyEncoding: {
    //             type: "pkcs8",
    //             format: "pem",
    //             cipher: "aes-256-cbc",
    //             passphrase: ""
    //         }
    //     });
    // };

    // private _encryptData(data: string) {
    //     const encrypted = privateEncrypt(
    //         this._keys().privateKey, Buffer.from(data));
    
    //     return encrypted.toString("base64");
    // }

    // private _decryptData(data: string) {
    //     const decrypted = privateDecrypt(
    //         {
    //             key: this._keys().privateKey,
    //             passphrase: "",
    //         },
    //         Buffer.from(data, "base64"));
    
    //     return decrypted.toString();
    // }

    public constructor() {
        this._data = new Map();
    }

    public async setData(key: string, value: string): Promise<void> {
        this._data.set(key, value);
        // console.log(this._encryptData(value), value);
    }

    public async getData(key: string): Promise<string> {
        // console.log(this._decryptData(this._data?.get(key) ?? "{}"), this._data?.get(key) ?? "{}");
        return this._data?.get(key) ?? "{}";
    }

    public async removeData(key: string): Promise<void> {
        this._data.delete(key);
    }
}
