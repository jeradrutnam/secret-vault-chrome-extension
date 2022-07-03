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

import * as CryptoJS from 'crypto-js';

const cfg = {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
};

export class AESCryptoUtils {

    /*
     * Encrypt a derived hd private key with a given pin and return it in Base64 form
     */
    public encryptAES(text, key) {
        return CryptoJS.AES.encrypt(text, key).toString();
    }

    /**
     * Decrypt an encrypted message
     * 
     * @param encryptedBase64 encrypted data in base64 format
     * @param key The secret key
     * @return The decrypted content
     */
    public decryptAES(encryptedBase64, key) {

        const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key);

        if (decrypted) {
            try {
                const str = decrypted.toString(CryptoJS.enc.Utf8);

                if (str.length > 0) {
                    return str;
                } else {
                    return 'error 1';
                }
            } catch (e) {
                return 'error 2';
            }
        }
        return 'error 3';
    };
}
