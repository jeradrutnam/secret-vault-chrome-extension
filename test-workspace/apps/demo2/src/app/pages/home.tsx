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

import { useState } from "react";
import {
    Avatar,
    Content,
    Divider,
    FlexboxGrid,
    Form,
    Input,
    InputGroup,
    Message,
    Panel,
    Stack
} from "rsuite";
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import { convertUSDToLKR } from '@test-workspace/currency-convert';
import USD from '../../assets/images/flags/usd.png';
import LKR from '../../assets/images/flags/lkr.png';

export const HomeContent = () => {
    const USDRate = 362.84;

    const [ USDValue, setUSDValue ] = useState<number>(1);
    const [ LKRValue, setLKRValue ] = useState<number>(USDRate);
    const [ errorVisible, setErrorVisible ] = useState(false);

    const errorMessage = (errorVisible) ? 'Please enter a valid amount' : null;

    const handleUSDValueChange = (e: any) => {
        if (isNaN(e)) {
            setErrorVisible(true);
            return;
        }

        setErrorVisible(false);
        setUSDValue(e);
        e ? setLKRValue(parseFloat(convertUSDToLKR(e, USDRate).toFixed(2))) : setLKRValue(0);
    };

    const errorStyles = (errorVisible: boolean) => {
        return { display: errorVisible ? 'block' : 'none', color: 'red', marginTop: 6 };
    };

    const styleInfoBox = {
        marginBottom: 35
    };

    return (
        <Content>
            <FlexboxGrid justify="center" align="middle" className="middle-panel">
                <FlexboxGrid.Item colspan={12}>
                    <Panel header={<h3>USD <ArrowRightLineIcon /> LKR</h3>} bordered>
                        <Form>
                            <Divider />
                            <h3>1 United States Dollar equals</h3>
                            <h1>{USDRate} Sri Lankan Rupee</h1>
                            <Divider />
                            <Stack spacing={6}>
                                <Avatar circle src={USD} alt="USD Flag" />
                                <Form.ControlLabel>USD</Form.ControlLabel>
                                <InputGroup inside>
                                    <InputGroup.Addon>$</InputGroup.Addon>
                                    <Input
                                        name="usd"
                                        placeholder="Enter USD Amount"
                                        defaultValue={USDValue}
                                        onChange={ handleUSDValueChange }
                                    />
                                    <div role="alert" aria-relevant="all" style={ errorStyles(errorVisible) }
                                        className="rs-form-control-message-wrapper rs-form-error-message-wrapper rs-form-error-message-placement-top-start">
                                        <span className="rs-form-error-message rs-form-error-message-show">
                                            <span className="rs-form-error-message-arrow"></span>
                                            <span className="rs-form-error-message-inner">{ errorMessage }</span>
                                        </span>
                                    </div>
                                </InputGroup>
                                <Divider vertical />
                                <Avatar circle src={LKR} alt="Sri Lanka Flag" />
                                <Form.ControlLabel>LKR</Form.ControlLabel>
                                <InputGroup inside>
                                    <InputGroup.Addon>Rs</InputGroup.Addon>
                                    <Input placeholder="LKR Amount" name="lkr" value={LKRValue} />
                                </InputGroup>
                            </Stack>
                        </Form>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid justify="center" align="middle">
                <FlexboxGrid.Item colspan={12}>
                    <Message showIcon type="warning" header="Access Token is compromised" style={styleInfoBox}>
                        This sample simulates an attack through a vulnerable dependency library and shows that the
                        access token can be steal by accessing HTML5 storages or by intercepting the network requests,
                        if attacking script can access the main thread of the application.
                    </Message>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </Content>
    );
};
