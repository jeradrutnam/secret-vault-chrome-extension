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

import { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Avatar, Badge, Container, Header, Nav, Navbar, Toggle } from "rsuite";
import { HomeContent } from './pages/home';
import { AboutContent } from './pages/about';
import { ProtectedRoute } from "./auth/protected-route";
import { useAuthContext } from "@asgardeo/auth-react";
import { SessionStore } from "./utils/session-store";
import Logo from '../assets/images/logo.png';
import './app.global.less';

enum AuthenticationMethods {
    ASGARDEO = "asgardeo",
    LOCAL = "local"
};

const sessionStorage = new SessionStore();
const AuthenticationMethodsKey = "authentication_method";

export const App = ({...props}) => {

    const { state, signOut, signIn, httpRequest } = useAuthContext();

    const [ asgardeoSignedIn, setAsgardeoSignedIn ] = useState<boolean>(false);
    const [ userDetails, setUserDetails ] = useState<any | null>(null);
    const [ authenticationMethod, setAuthenticationMethod ] =
        useState<AuthenticationMethods>(AuthenticationMethods.LOCAL);
    const [ authenticationMethodToggleStatus, setAuthenticationMethodToggleStatus ] = useState(true);

    useEffect(() => {
        if (state?.username) {
            httpRequest({
                method: "GET",
                url: "https://api.asgardeo.io/t/jerad/oauth2/userinfo?schema=openid"
            }).then((response) => {
                setUserDetails(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }, [state]);

    useEffect(() => {
        signIn();
    }, []);

    useEffect(() => {
        (async () => {
            let persistedAuthenticationMethod = await sessionStorage.getData(AuthenticationMethodsKey);

            if (persistedAuthenticationMethod !== "") {
                setAuthenticationMethod(persistedAuthenticationMethod as AuthenticationMethods);

                if (persistedAuthenticationMethod === AuthenticationMethods.LOCAL) {
                    setAuthenticationMethodToggleStatus(true);
                }
                else {
                    setAuthenticationMethodToggleStatus(false);
                }
            }
        })();
    }, []);

    const handleAuthenticationMethodToggle = useCallback(async () => {
        if (authenticationMethodToggleStatus === true) {
            await sessionStorage.setData(AuthenticationMethodsKey, AuthenticationMethods.ASGARDEO).then(() => {
                setAuthenticationMethod(AuthenticationMethods.ASGARDEO);
                setAuthenticationMethodToggleStatus(false);
            });
        }
        else {
            await sessionStorage.setData(AuthenticationMethodsKey, AuthenticationMethods.LOCAL).then(() => {
                setAuthenticationMethod(AuthenticationMethods.LOCAL);
                setAuthenticationMethodToggleStatus(true);
            });
        }
    }, [authenticationMethodToggleStatus]);

    const handleAsgardeoSignOut = (): void => {
        signOut();
    }

    return (
        <Router>
            <Header>
                <Navbar {...props}>
                    <Navbar.Brand>
                        <img src={ Logo } alt="Currency Converter Logo" />
                        <Badge content="Vulnerable" />
                    </Navbar.Brand>
                    <Nav>
                        <Nav.Item as={ Link } to="/">Home</Nav.Item>
                        <Nav.Item as={ Link } to="/about">About</Nav.Item>
                    </Nav>
                    <Nav pullRight>
                        {/* <Toggle
                            size="lg"
                            checked={ authenticationMethodToggleStatus }
                            checkedChildren="Use Chrome Extension"
                            unCheckedChildren="Use Session Storage"
                            onChange={ handleAuthenticationMethodToggle } /> */}
                        { state?.username &&
                            <Nav.Menu title={
                                <>
                                    <span className="logged-in-user-name">{ state?.username }</span>
                                    { userDetails?.picture &&
                                        <Avatar
                                            circle
                                            src={ userDetails?.picture }
                                            alt="Logged in user image" />
                                    }
                                </>
                            }>
                                <Nav.Item onClick={ handleAsgardeoSignOut }>Logout</Nav.Item>
                            </Nav.Menu>
                        }
                    </Nav>
                </Navbar>
            </Header>
            <div className="layout">
                <Container className="app-content">
                    <Routes>
                        <Route path="/" element={ <ProtectedRoute authenticationMethod={ authenticationMethod } /> }>
                            <Route path="/" element={ <HomeContent /> }/>
                        </Route>
                        <Route path="/about" element={ <AboutContent /> } />
                    </Routes>
                </Container>
            </div>
        </Router>
    );
}

export default App;
