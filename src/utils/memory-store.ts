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

import { AESCryptoUtils } from "./aes-crypto-utils";
import { uniqueIDGen } from "./string-utils";

export class MemoryStore {
    private _data: Map<string, string>;
    private _cryptoUtils = new AESCryptoUtils();
    private _saltKey: string = uniqueIDGen();

    public constructor() {
        this._data = new Map();
    }

    /**
     * Set data method
     * 
     * @param key Key for the value that needs to store
     * @param value Value that needs to store
     */
    public async setData(key: string, value: string): Promise<void> {
        await this._data.set(key, this._cryptoUtils.encryptAES(value, this._saltKey));
    }

    /**
     * Get data method
     * 
     * @param key Key of the value that need to retrieve 
     * @returns returns a string value
     */
    public async getData(key: string): Promise<string> {
        if (this._data?.get(key)) {
            return this._cryptoUtils.decryptAES(this._data.get(key), this._saltKey);
        }
   
        return "{}"; 
    }

    /**
     * Remove data method
     * 
     * @param key Key of the value that need to remove 
     */
    public async removeData(key: string): Promise<void> {
        this._data.delete(key);
    }
}
