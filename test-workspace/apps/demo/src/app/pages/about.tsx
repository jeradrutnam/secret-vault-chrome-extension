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

import { Content, FlexboxGrid, Panel } from "rsuite";

export const AboutContent = () => {
    return (
        <Content>
            <FlexboxGrid justify="center" align="middle" className="middle-panel">
                <FlexboxGrid.Item colspan={12}>
                    <Panel header={<h3>About the project</h3>} bordered>
                        This project is created as a part of a MSc project to test an XSS attack simulated through
                        a web application. This is created only for an education person and not for production.
                        <br /><br/>
                        Project is created under MIT license and check the
                        <a href="https://github.com/jeradrutnam/secret-vault-chrome-extension/blob/main/LICENSE" target="_blank"> LICENSE.md </a>
                        file for further details.
                        <br /><br />
                        Thank you,<br />
                        Author: Jerad Rutnam
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </Content>
    );
};
