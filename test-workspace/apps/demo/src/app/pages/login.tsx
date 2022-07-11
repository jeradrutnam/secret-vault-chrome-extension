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

import { Button, Content, FlexboxGrid, Panel } from "rsuite";
import HomeImage from "../../assets/images/home-image.png";
import { useAuthContext } from "../auth/auth-context";

const styles = {
    titleStyle: {
        marginBottom: 10,
        align: "center"
    },
    subTitleStyle: {
        display: "block",
        marginBottom: 50,
        TextAlign: "center"
    },
    imageStyles: {
        width: 350,
        marginBottom: 20
    }
}

export const LoginContent = () => {

    const { signIn } = useAuthContext();

    return (
        <Content className="text-center">
            <FlexboxGrid justify="center" align="middle" className="middle-panel">
                <FlexboxGrid.Item colspan={12}>
                    <h3 style={styles.titleStyle}>Welcome to Currency Converter !</h3>
                    <span style={styles.subTitleStyle}>Please login to use the app</span>
                    <Panel>
                        <img src={HomeImage} alt="Home page image" style={styles.imageStyles} />
                        <br /><br />
                        <Button appearance="primary" onClick={ signIn }>Login with Asgardeo</Button>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </Content>
    );
};
