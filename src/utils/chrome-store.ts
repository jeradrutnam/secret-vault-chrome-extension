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

export class ChromeStore {

    public constructor() { }

    public async setData(key: string, value: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.set({[key]: value}, () => {
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    public async getData(key: string): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.get(key, (value) => {
                    resolve(value[key]);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    public async removeData(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.remove(key, () => {
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
